import { z } from "zod";

// ==========================================
// AUTH VALIDATIONS
// ==========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[\d\s-]{10,}$/.test(val),
        "Invalid phone number"
      ),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const twoFactorSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

// ==========================================
// PROFILE VALIDATIONS
// ==========================================

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s-]{10,}$/.test(val),
      "Invalid phone number"
    ),
  avatar: z.string().url().optional().or(z.literal("")),
});

// ==========================================
// ADDRESS VALIDATIONS
// ==========================================

export const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z
    .string()
    .min(1, "Recipient name is required")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number"),
  line1: z
    .string()
    .min(1, "Address line 1 is required")
    .max(200, "Address is too long"),
  line2: z.string().max(200, "Address is too long").optional(),
  city: z.string().min(1, "City is required").max(100, "City name is too long"),
  state: z.string().max(100, "State name is too long").optional(),
  country: z.string().min(1, "Country is required"),
  zip: z.string().max(20, "Zip code is too long").optional(),
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
});

// ==========================================
// PRODUCT VALIDATIONS
// ==========================================

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  shortDescription: z.string().max(500, "Short description is too long").optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  baseCost: z.number().min(0, "Price must be positive"),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0).optional(),
    width: z.number().min(0).optional(),
    height: z.number().min(0).optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  seoTitle: z.string().max(70, "SEO title should be under 70 characters").optional(),
  seoDesc: z.string().max(160, "SEO description should be under 160 characters").optional(),
  seoKeyword: z.string().optional(),
});

export const productVariantSchema = z.object({
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU is too long"),
  attributes: z.record(z.string()),
  stockQty: z.number().int().min(0, "Stock quantity must be positive"),
  weight: z.number().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
});

export const vendorProductSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  sellingPrice: z.number().min(0, "Selling price must be positive"),
  compareAtPrice: z.number().min(0).optional(),
  stockQty: z.number().int().min(0, "Stock quantity must be positive"),
  vendorNote: z.string().max(500, "Note is too long").optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// CATEGORY VALIDATIONS
// ==========================================

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  parentId: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().url().optional(),
  description: z.string().max(500, "Description is too long").optional(),
  seoTitle: z.string().max(70, "SEO title should be under 70 characters").optional(),
  seoDesc: z.string().max(160, "SEO description should be under 160 characters").optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// VENDOR VALIDATIONS
// ==========================================

export const vendorOnboardingStep1Schema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(200, "Business name is too long"),
  businessType: z.enum(["sole", "company", "partnership"], {
    required_error: "Please select a business type",
  }),
  businessReg: z.string().optional(),
  taxNumber: z.string().optional(),
});

export const vendorOnboardingStep2Schema = z.object({
  documents: z.object({
    businessReg: z.string().url("Please upload business registration document").optional(),
    nationalId: z.string().url("Please upload national ID").optional(),
    utilityBill: z.string().url("Please upload utility bill").optional(),
  }),
});

export const vendorOnboardingStep3Schema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .max(100, "Store name is too long"),
  storeDescription: z.string().max(1000, "Description is too long").optional(),
  returnPolicy: z.string().max(2000, "Return policy is too long").optional(),
  shippingPolicy: z.string().max(2000, "Shipping policy is too long").optional(),
});

export const vendorOnboardingStep4Schema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  bankAccountTitle: z.string().min(1, "Account title is required"),
  bankAccountNo: z
    .string()
    .min(1, "Account number is required")
    .regex(/^\d+$/, "Account number must contain only digits"),
  bankIBAN: z.string().optional(),
});

export const vendorSettingsSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .max(100, "Store name is too long"),
  storeDescription: z.string().max(1000, "Description is too long").optional(),
  storeLogo: z.string().url().optional().or(z.literal("")),
  storeBanner: z.string().url().optional().or(z.literal("")),
  returnPolicy: z.string().max(2000, "Return policy is too long").optional(),
  shippingPolicy: z.string().max(2000, "Shipping policy is too long").optional(),
});

// ==========================================
// ORDER VALIDATIONS
// ==========================================

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "PARTIALLY_SHIPPED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  reason: z.string().optional(),
});

export const orderItemFulfillmentSchema = z.object({
  fulfillmentStatus: z.enum([
    "PENDING",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "RETURNED",
  ]),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

// ==========================================
// CHECKOUT VALIDATIONS
// ==========================================

export const checkoutAddressSchema = addressSchema;

export const checkoutShippingSchema = z.object({
  zoneId: z.string().min(1, "Please select a shipping method"),
  method: z.string().min(1, "Please select a shipping method"),
});

export const checkoutPaymentSchema = z.object({
  paymentMethod: z.enum([
    "stripe",
    "jazzcash",
    "easypaisa",
    "paypal",
    "cod",
    "bank_transfer",
    "wallet",
  ]),
});

export const checkoutCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

// ==========================================
// REVIEW VALIDATIONS
// ==========================================

export const reviewSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  rating: z.number().int().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
  title: z.string().max(100, "Title is too long").optional(),
  comment: z.string().max(1000, "Comment is too long").optional(),
  images: z.array(z.string().url()).max(5, "Maximum 5 images allowed").optional(),
});

export const reviewReplySchema = z.object({
  reply: z.string().min(1, "Reply is required").max(500, "Reply is too long"),
});

// ==========================================
// REFUND VALIDATIONS
// ==========================================

export const refundRequestSchema = z.object({
  orderId: z.string().min(1, "Order is required"),
  orderItemId: z.string().optional(),
  reason: z.string().min(1, "Reason is required").max(500, "Reason is too long"),
  reasonCategory: z.enum([
    "defective",
    "wrong_item",
    "not_as_described",
    "changed_mind",
    "other",
  ]),
  evidence: z.array(z.string().url()).optional(),
});

export const refundResponseSchema = z.object({
  response: z.string().min(1, "Response is required").max(500, "Response is too long"),
  evidence: z.array(z.string().url()).optional(),
});

export const refundProcessSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  refundType: z.enum(["ORIGINAL_PAYMENT", "WALLET_CREDIT", "EXCHANGE"]).optional(),
  refundAmount: z.number().min(0).optional(),
  resolution: z.string().max(500, "Resolution is too long").optional(),
});

// ==========================================
// COUPON VALIDATIONS
// ==========================================

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(20, "Code is too long")
    .regex(/^[A-Z0-9]+$/, "Code can only contain uppercase letters and numbers"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  value: z.number().min(0, "Value must be positive"),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimitTotal: z.number().int().min(1).optional(),
  usageLimitPerUser: z.number().int().min(1).optional(),
  expiresAt: z.date().optional(),
  applicableTo: z.enum(["ALL", "CATEGORIES", "PRODUCTS", "VENDORS"]).optional(),
  applicableIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// ==========================================
// BANNER VALIDATIONS
// ==========================================

export const bannerSchema = z.object({
  title: z.string().max(100, "Title is too long").optional(),
  subtitle: z.string().max(200, "Subtitle is too long").optional(),
  imageDesktop: z.string().url("Please upload a desktop image"),
  imageMobile: z.string().url().optional(),
  link: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isActive: z.boolean().optional(),
  targetBlank: z.boolean().optional(),
  altText: z.string().max(200, "Alt text is too long").optional(),
});

// ==========================================
// CHAT VALIDATIONS
// ==========================================

export const chatMessageSchema = z.object({
  content: z.string().min(1, "Message is required").max(2000, "Message is too long"),
  attachments: z.array(z.string().url()).max(5, "Maximum 5 attachments allowed").optional(),
});

// ==========================================
// SETTINGS VALIDATIONS
// ==========================================

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100),
  siteTagline: z.string().max(200).optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  address: z.string().max(300).optional(),
});

export const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  fontFamily: z.string(),
  borderRadius: z.string(),
  buttonStyle: z.enum(["filled", "outlined", "soft"]),
  darkMode: z.enum(["system", "light", "dark"]),
  logoPosition: z.enum(["left", "center"]),
  customCSS: z.string().max(10000).optional(),
  homepageLayout: z.string(),
});

// ==========================================
// SEARCH & FILTER VALIDATIONS
// ==========================================

export const productFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  vendor: z.string().optional(),
  inStock: z.boolean().optional(),
  onSale: z.boolean().optional(),
  search: z.string().optional(),
  sort: z.enum(["relevance", "price_asc", "price_desc", "newest", "bestseller", "rating"]).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// ==========================================
// FULL CHECKOUT SCHEMA (for API)
// ==========================================

export const checkoutSchema = z.object({
  items: z.array(z.object({
    vendorProductId: z.string().min(1),
    quantity: z.number().int().min(1),
    variantAttributes: z.record(z.string()).optional(),
  })).min(1, "Cart is empty"),
  shippingAddress: z.object({
    fullName: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  billingAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }).optional(),
  paymentMethod: z.enum(["STRIPE", "PAYPAL", "JAZZCASH", "EASYPAISA", "COD"]),
  couponCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ==========================================
// TYPE EXPORTS
// ==========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type TwoFactorInput = z.infer<typeof twoFactorSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type VendorSettingsInput = z.infer<typeof vendorSettingsSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type RefundRequestInput = z.infer<typeof refundRequestSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type ThemeSettingsInput = z.infer<typeof themeSettingsSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
