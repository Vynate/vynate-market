import { PrismaClient, Role, VendorStatus, AttributeType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data in development
  if (process.env.NODE_ENV !== "production") {
    console.log("🧹 Cleaning existing data...");
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.chatRoomUser.deleteMany();
    await prisma.chatRoom.deleteMany();
    await prisma.loyaltyTransaction.deleteMany();
    await prisma.walletTransaction.deleteMany();
    await prisma.payout.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.qandA.deleteMany();
    await prisma.backInStockAlert.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.vendorFollower.deleteMany();
    await prisma.flashSaleProduct.deleteMany();
    await prisma.flashSale.deleteMany();
    await prisma.vendorProduct.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.attributeValue.deleteMany();
    await prisma.attribute.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.vendorDocument.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.adminProfile.deleteMany();
    await prisma.address.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.pOSSale.deleteMany();
    await prisma.user.deleteMany();
    await prisma.themeSettings.deleteMany();
    await prisma.siteSettings.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.paymentGateway.deleteMany();
    await prisma.shippingZone.deleteMany();
    await prisma.taxRule.deleteMany();
    await prisma.emailTemplate.deleteMany();
  }

  // Create Admin User
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("Admin@123456", 12);
  
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@vynate.com",
      hashedPassword,
      name: "Super Admin",
      role: Role.ADMIN,
      emailVerified: new Date(),
      isActive: true,
      referralCode: "ADMIN2024",
      adminProfile: {
        create: {
          permissions: {
            dashboard: true,
            vendors: { view: true, approve: true, suspend: true },
            products: { view: true, create: true, edit: true, delete: true, import: true },
            orders: { view: true, update: true, cancel: true },
            pos: true,
            refunds: { view: true, process: true },
            finance: { view: true, payouts: true },
            chat: true,
            marketing: { coupons: true, banners: true, flashSales: true, email: true },
            customers: { view: true, edit: true, suspend: true },
            settings: true,
            auditLogs: true,
            roles: true,
          },
        },
      },
    },
  });

  // Create Sample Vendor User
  console.log("🏪 Creating sample vendor...");
  const vendorPassword = await bcrypt.hash("Vendor@123456", 12);
  
  const vendorUser = await prisma.user.create({
    data: {
      email: "vendor@vynate.com",
      hashedPassword: vendorPassword,
      name: "Tech Store Vendor",
      phone: "+12025551234",
      role: Role.VENDOR,
      emailVerified: new Date(),
      isActive: true,
      referralCode: "VENDOR2024",
      vendor: {
        create: {
          businessName: "Tech Solutions Inc",
          businessType: "company",
          businessReg: "BR-12345678",
          taxNumber: "TX-87654321",
          storeSlug: "tech-solutions",
          storeName: "Tech Solutions Store",
          storeDescription: "Your one-stop shop for all tech gadgets and accessories.",
          storeLogo: "https://res.cloudinary.com/demo/image/upload/v1/samples/logo.png",
          storeBanner: "https://res.cloudinary.com/demo/image/upload/v1/samples/banner.jpg",
          returnPolicy: "30-day return policy on all unused items.",
          shippingPolicy: "Free shipping on orders above $100.",
          bankName: "Chase Bank",
          bankAccountTitle: "Tech Solutions Inc",
          status: VendorStatus.APPROVED,
          commissionRate: 10,
          avgRating: 4.5,
          totalSales: 15000,
          approvedAt: new Date(),
          approvedByAdminId: adminUser.id,
        },
      },
    },
  });

  // Create Sample Customer User
  console.log("🛒 Creating sample customer...");
  const customerPassword = await bcrypt.hash("Customer@123456", 12);
  
  const customerUser = await prisma.user.create({
    data: {
      email: "customer@vynate.com",
      hashedPassword: customerPassword,
      name: "John Doe",
      phone: "+12025559876",
      role: Role.CUSTOMER,
      emailVerified: new Date(),
      isActive: true,
      referralCode: "CUST2024",
      customer: {
        create: {
          walletBalance: 50,
          loyaltyPoints: 1000,
          totalOrderValue: 2500,
        },
      },
      addresses: {
        create: [
          {
            label: "Home",
            recipientName: "John Doe",
            phone: "+12025559876",
            line1: "123 Main Street",
            line2: "Apt 4B",
            city: "San Francisco",
            state: "California",
            country: "United States",
            zip: "94102",
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  // Create Categories
  console.log("📁 Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        icon: "Smartphone",
        description: "Latest electronic gadgets and devices",
        seoTitle: "Electronics - Shop Latest Gadgets",
        seoDesc: "Shop the latest electronic gadgets and devices at best prices.",
        level: 0,
        order: 1,
        children: {
          create: [
            {
              name: "Mobile Phones",
              slug: "mobile-phones",
              icon: "Phone",
              level: 1,
              order: 1,
            },
            {
              name: "Laptops",
              slug: "laptops",
              icon: "Laptop",
              level: 1,
              order: 2,
            },
            {
              name: "Tablets",
              slug: "tablets",
              icon: "Tablet",
              level: 1,
              order: 3,
            },
            {
              name: "Accessories",
              slug: "electronics-accessories",
              icon: "Cable",
              level: 1,
              order: 4,
            },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: "Fashion",
        slug: "fashion",
        icon: "Shirt",
        description: "Trendy fashion and apparel",
        seoTitle: "Fashion - Latest Trends",
        seoDesc: "Discover the latest fashion trends and styles.",
        level: 0,
        order: 2,
        children: {
          create: [
            {
              name: "Men's Clothing",
              slug: "mens-clothing",
              icon: "Shirt",
              level: 1,
              order: 1,
            },
            {
              name: "Women's Clothing",
              slug: "womens-clothing",
              icon: "Shirt",
              level: 1,
              order: 2,
            },
            {
              name: "Footwear",
              slug: "footwear",
              icon: "Footprints",
              level: 1,
              order: 3,
            },
          ],
        },
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Living",
        slug: "home-living",
        icon: "Home",
        description: "Everything for your home",
        seoTitle: "Home & Living - Decor & Essentials",
        seoDesc: "Transform your home with our home & living collection.",
        level: 0,
        order: 3,
      },
    }),
  ]);

  // Create Brands
  console.log("🏷️ Creating brands...");
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "Samsung",
        slug: "samsung",
        country: "South Korea",
        description: "Leading electronics manufacturer",
        website: "https://samsung.com",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Apple",
        slug: "apple",
        country: "United States",
        description: "Innovation in technology",
        website: "https://apple.com",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Xiaomi",
        slug: "xiaomi",
        country: "China",
        description: "Smart devices for everyone",
        website: "https://mi.com",
      },
    }),
  ]);

  // Create Attributes
  console.log("🎨 Creating attributes...");
  const colorAttribute = await prisma.attribute.create({
    data: {
      name: "Color",
      type: AttributeType.COLOR,
      values: {
        create: [
          { value: "Black", colorHex: "#000000" },
          { value: "White", colorHex: "#FFFFFF" },
          { value: "Blue", colorHex: "#2563eb" },
          { value: "Red", colorHex: "#dc2626" },
          { value: "Gold", colorHex: "#eab308" },
        ],
      },
    },
  });

  const sizeAttribute = await prisma.attribute.create({
    data: {
      name: "Size",
      type: AttributeType.TEXT,
      values: {
        create: [
          { value: "XS" },
          { value: "S" },
          { value: "M" },
          { value: "L" },
          { value: "XL" },
          { value: "XXL" },
        ],
      },
    },
  });

  const storageAttribute = await prisma.attribute.create({
    data: {
      name: "Storage",
      type: AttributeType.TEXT,
      values: {
        create: [
          { value: "64GB" },
          { value: "128GB" },
          { value: "256GB" },
          { value: "512GB" },
          { value: "1TB" },
        ],
      },
    },
  });

  // Get vendor for products
  const vendor = await prisma.vendor.findFirst({ where: { userId: vendorUser.id } });
  const mobileCategory = await prisma.category.findFirst({ where: { slug: "mobile-phones" } });

  // Create Sample Products
  console.log("📦 Creating sample products...");
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        description: "<p>The Samsung Galaxy S24 Ultra represents the pinnacle of smartphone technology. With its stunning 6.8-inch Dynamic AMOLED display, powerful Snapdragon 8 Gen 3 processor, and revolutionary AI features, this device sets new standards for mobile excellence.</p><h3>Key Features:</h3><ul><li>200MP Main Camera with AI Enhancement</li><li>5000mAh Battery with 45W Fast Charging</li><li>Built-in S Pen with Air Commands</li><li>Titanium Frame with Gorilla Armor Glass</li></ul>",
        shortDescription: "Flagship smartphone with AI capabilities and S Pen",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        ]),
        categoryId: mobileCategory?.id,
        brandId: brands[0]?.id,
        baseCost: 1199,
        weight: 0.233,
        dimensions: JSON.stringify({ length: 16.2, width: 7.9, height: 0.86 }),
        tags: ["samsung", "galaxy", "flagship", "5g", "ai"],
        isFeatured: true,
        seoTitle: "Samsung Galaxy S24 Ultra - Buy Online",
        seoDesc: "Shop Samsung Galaxy S24 Ultra with AI features, 200MP camera, and S Pen. Free shipping available.",
        seoKeyword: "Samsung Galaxy S24 Ultra",
        createdByAdminId: adminUser.id,
        approvedAt: new Date(),
        variants: {
          create: [
            {
              sku: "SGS24U-256-BLK",
              attributes: JSON.stringify({ color: "Black", storage: "256GB" }),
              stockQty: 50,
            },
            {
              sku: "SGS24U-256-WHT",
              attributes: JSON.stringify({ color: "White", storage: "256GB" }),
              stockQty: 30,
            },
            {
              sku: "SGS24U-512-BLK",
              attributes: JSON.stringify({ color: "Black", storage: "512GB" }),
              stockQty: 25,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Apple iPhone 15 Pro Max",
        slug: "apple-iphone-15-pro-max",
        description: "<p>Experience the future of smartphones with iPhone 15 Pro Max. Featuring the powerful A17 Pro chip, a groundbreaking 48MP camera system, and the beautiful titanium design.</p>",
        shortDescription: "Apple's most powerful iPhone ever",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        ]),
        categoryId: mobileCategory?.id,
        brandId: brands[1]?.id,
        baseCost: 1199,
        weight: 0.221,
        tags: ["apple", "iphone", "flagship", "5g", "titanium"],
        isFeatured: true,
        seoTitle: "Apple iPhone 15 Pro Max - Buy Online",
        seoDesc: "Shop iPhone 15 Pro Max with A17 Pro chip and titanium design.",
        createdByAdminId: adminUser.id,
        approvedAt: new Date(),
        variants: {
          create: [
            {
              sku: "IP15PM-256-NAT",
              attributes: JSON.stringify({ color: "Natural Titanium", storage: "256GB" }),
              stockQty: 40,
            },
            {
              sku: "IP15PM-256-BLU",
              attributes: JSON.stringify({ color: "Blue Titanium", storage: "256GB" }),
              stockQty: 35,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Xiaomi 14 Ultra",
        slug: "xiaomi-14-ultra",
        description: "<p>Xiaomi 14 Ultra brings professional photography to your pocket with Leica optics and advanced AI processing.</p>",
        shortDescription: "Professional photography smartphone with Leica",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
        ]),
        categoryId: mobileCategory?.id,
        brandId: brands[2]?.id,
        baseCost: 899,
        weight: 0.219,
        tags: ["xiaomi", "leica", "photography", "5g"],
        isFeatured: false,
        createdByAdminId: adminUser.id,
        approvedAt: new Date(),
        variants: {
          create: [
            {
              sku: "XI14U-256-BLK",
              attributes: JSON.stringify({ color: "Black", storage: "256GB" }),
              stockQty: 60,
            },
          ],
        },
      },
    }),
  ]);

  // Create Vendor Products
  console.log("🏪 Creating vendor products...");
  if (vendor) {
    for (const product of products) {
      await prisma.vendorProduct.create({
        data: {
          vendorId: vendor.id,
          productId: product.id,
          sellingPrice: product.baseCost * 1.15, // 15% markup
          compareAtPrice: product.baseCost * 1.25,
          stockQty: 100,
        },
      });
    }
  }

  // Create Theme Settings
  console.log("🎨 Creating theme settings...");
  await prisma.themeSettings.create({
    data: {
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      accentColor: "#f59e0b",
      fontFamily: "Geist",
      borderRadius: "0.5rem",
      buttonStyle: "filled",
      darkMode: "system",
      logoPosition: "left",
      homepageLayout: "default",
    },
  });

  // Create Site Settings
  console.log("⚙️ Creating site settings...");
  const siteSettings = [
    { key: "site_name", value: { text: "Vynate Market" }, group: "general" },
    { key: "site_tagline", value: { text: "Global Multi-Vendor Marketplace" }, group: "general" },
    { key: "contact_email", value: { text: "support@vynate.com" }, group: "general" },
    { key: "contact_phone", value: { text: "+1 234 567 8900" }, group: "general" },
    { key: "whatsapp_number", value: { text: "+12345678900" }, group: "general" },
    { key: "address", value: { text: "123 Tech Avenue, San Francisco, CA 94102" }, group: "general" },
    { key: "default_currency", value: { code: "USD", symbol: "$" }, group: "localization" },
    { key: "loyalty_points_per_currency", value: { points: 1, amount: 1 }, group: "loyalty" },
    { key: "loyalty_redemption_rate", value: { points: 100, discount: 1 }, group: "loyalty" },
    { key: "min_payout_amount", value: { amount: 50 }, group: "finance" },
    { key: "default_commission_rate", value: { rate: 10 }, group: "finance" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSettings.create({ data: setting });
  }

  // Create Payment Gateways
  console.log("💳 Creating payment gateways...");
  const paymentGateways = [
    { name: "stripe", isEnabled: true, displayOrder: 1, displayLabel: "Credit/Debit Card" },
    { name: "jazzcash", isEnabled: true, displayOrder: 2, displayLabel: "JazzCash" },
    { name: "easypaisa", isEnabled: true, displayOrder: 3, displayLabel: "Easypaisa" },
    { name: "paypal", isEnabled: false, displayOrder: 4, displayLabel: "PayPal" },
    { name: "cod", isEnabled: true, displayOrder: 5, displayLabel: "Cash on Delivery" },
    { name: "bank_transfer", isEnabled: true, displayOrder: 6, displayLabel: "Bank Transfer" },
  ];

  for (const gateway of paymentGateways) {
    await prisma.paymentGateway.create({ data: gateway });
  }

  // Create Shipping Zones
  console.log("🚚 Creating shipping zones...");
  await prisma.shippingZone.create({
    data: {
      name: "United States",
      countries: JSON.stringify(["US"]),
      rates: JSON.stringify([
        { type: "flat", amount: 9.99, minOrder: 0 },
        { type: "free", minOrder: 100 },
      ]),
      estimatedDays: 5,
    },
  });

  await prisma.shippingZone.create({
    data: {
      name: "International",
      countries: JSON.stringify(["CA", "GB", "AU", "DE", "FR"]),
      rates: JSON.stringify([
        { type: "flat", amount: 19.99, minOrder: 0 },
        { type: "free", minOrder: 200 },
      ]),
      estimatedDays: 10,
    },
  });

  // Create Tax Rules
  console.log("📊 Creating tax rules...");
  await prisma.taxRule.create({
    data: {
      name: "US Sales Tax",
      country: "US",
      rate: 8.5,
      isInclusive: false,
    },
  });

  // Create Sample Banner
  console.log("🖼️ Creating banners...");
  await prisma.banner.create({
    data: {
      title: "Welcome to DropShip Pro",
      subtitle: "Shop the latest products from verified vendors",
      imageDesktop: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920",
      imageMobile: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      link: "/products",
      order: 1,
      isActive: true,
      altText: "Welcome Banner",
    },
  });

  // Create Sample Coupon
  console.log("🎟️ Creating coupons...");
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 1000,
      maxDiscountAmount: 500,
      usageLimitTotal: 1000,
      usageLimitPerUser: 1,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📋 Test Accounts:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:    admin@vynate.com / Admin@123456");
  console.log("Vendor:   vendor@vynate.com / Vendor@123456");
  console.log("Customer: customer@vynate.com / Customer@123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
