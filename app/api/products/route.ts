import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
      product: {
        isActive: true,
      },
      sellingPrice: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    if (search) {
      where.product = {
        ...where.product,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (category) {
      where.product = {
        ...where.product,
        category: {
          slug: category,
        },
      };
    }

    if (brand) {
      where.product = {
        ...where.product,
        brand: {
          slug: brand,
        },
      };
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      db.vendorProduct.findMany({
        where,
        include: {
          product: {
            include: {
              category: true,
              brand: true,
            },
          },
          vendor: {
            select: {
              id: true,
              storeName: true,
              storeSlug: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      db.vendorProduct.count({ where }),
    ]);

    // Transform data
    const transformedProducts = products.map((vp) => {
      // images is a Json field (array of strings)
      const images = vp.product.images as string[] || [];
      
      return {
        id: vp.id,
        productId: vp.product.id,
        name: vp.product.name,
        slug: vp.product.slug,
        description: vp.product.shortDescription,
        price: vp.sellingPrice,
        compareAtPrice: vp.compareAtPrice,
        stockQty: vp.stockQty,
        image: images[0] || null,
        category: vp.product.category?.name || null,
        brand: vp.product.brand?.name || null,
        vendor: {
          id: vp.vendor.id,
          name: vp.vendor.storeName,
          slug: vp.vendor.storeSlug,
        },
        rating: 4.5,
        reviewCount: 0,
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
