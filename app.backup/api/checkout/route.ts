import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = checkoutSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { items, shippingAddress, paymentMethod, couponCode } = validatedData.data;

    // Get customer
    const customer = await db.customer.findUnique({
      where: { userId: session.user.id },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const commissionRate = 0.10; // Platform takes 10%
    
    const validatedItems: {
      vendorProduct: any;
      quantity: number;
      unitPrice: number;
      vendorPayout: number;
      commissionAmount: number;
    }[] = [];

    for (const item of items) {
      const vendorProduct = await db.vendorProduct.findUnique({
        where: { id: item.vendorProductId },
        include: {
          product: true,
          vendor: true,
        },
      });

      if (!vendorProduct) {
        return NextResponse.json(
          { error: `Product not found: ${item.vendorProductId}` },
          { status: 400 }
        );
      }

      if (vendorProduct.stockQty < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${vendorProduct.product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = vendorProduct.sellingPrice * item.quantity;
      const commission = itemTotal * commissionRate;
      const payout = itemTotal - commission;
      subtotal += itemTotal;

      validatedItems.push({
        vendorProduct,
        quantity: item.quantity,
        unitPrice: vendorProduct.sellingPrice,
        vendorPayout: payout,
        commissionAmount: commission,
      });
    }

    // Apply coupon if provided
    let discountTotal = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await db.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } },
          ],
        },
      });

      if (coupon) {
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          return NextResponse.json(
            { error: `Minimum order value of $${coupon.minOrderAmount} required for this coupon` },
            { status: 400 }
          );
        }

        if (coupon.type === "PERCENTAGE") {
          discountTotal = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscountAmount) {
            discountTotal = Math.min(discountTotal, coupon.maxDiscountAmount);
          }
        } else {
          discountTotal = coupon.value;
        }
      }
    }

    // Calculate shipping (free over $50)
    const shippingTotal = subtotal > 50 ? 0 : 9.99;

    // Calculate tax (8%)
    const taxRate = 0.08;
    const taxTotal = (subtotal - discountTotal) * taxRate;

    const total = subtotal - discountTotal + shippingTotal + taxTotal;

    // Create order with transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: customer.id,
          userId: session.user.id,
          customerEmail: session.user.email || undefined,
          customerName: session.user.name || undefined,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod,
          subtotal,
          shippingTotal,
          taxTotal,
          discountTotal,
          total,
          couponId: coupon?.id,
          shippingAddressSnapshot: shippingAddress as any,
        },
      });

      // Create order items and update stock
      for (const item of validatedItems) {
        const images = item.vendorProduct.product.images as string[] || [];
        
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            vendorProductId: item.vendorProduct.id,
            vendorId: item.vendorProduct.vendorId,
            productName: item.vendorProduct.product.name,
            productImage: images[0] || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vendorPayout: item.vendorPayout,
            commissionAmount: item.commissionAmount,
            fulfillmentStatus: "PENDING",
          },
        });

        // Decrease stock
        await tx.vendorProduct.update({
          where: { id: item.vendorProduct.id },
          data: {
            stockQty: { decrement: item.quantity },
          },
        });
      }

      // Update coupon usage
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: "Order Placed Successfully",
        body: `Your order ${order.orderNumber} has been placed. We'll notify you when it ships.`,
        type: "ORDER",
        link: `/account/orders/${order.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
