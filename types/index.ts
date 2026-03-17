import type {
  User,
  Vendor,
  Customer,
  Product,
  ProductVariant,
  VendorProduct,
  Category,
  Brand,
  Order,
  OrderItem,
  Review,
  Address,
  Coupon,
  Banner,
  FlashSale,
  Role,
  VendorStatus,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  RefundStatus,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Vendor,
  Customer,
  Product,
  ProductVariant,
  VendorProduct,
  Category,
  Brand,
  Order,
  OrderItem,
  Review,
  Address,
  Coupon,
  Banner,
  FlashSale,
  Role,
  VendorStatus,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  RefundStatus,
};

// Extended types with relations
export type ProductWithRelations = Product & {
  category: Category | null;
  brand: Brand | null;
  variants: ProductVariant[];
  reviews: Review[];
  vendorProducts: (VendorProduct & {
    vendor: Vendor;
  })[];
};

export type VendorProductWithRelations = VendorProduct & {
  product: Product & {
    category: Category | null;
    brand: Brand | null;
    variants: ProductVariant[];
  };
  vendor: Vendor;
};

export type OrderWithRelations = Order & {
  items: (OrderItem & {
    vendor: Vendor;
    vendorProduct: VendorProduct | null;
  })[];
  coupon: Coupon | null;
  shippingAddress: Address | null;
};

export type VendorWithRelations = Vendor & {
  user: User;
  vendorProducts: VendorProduct[];
};

export type CategoryWithChildren = Category & {
  children: Category[];
  parent: Category | null;
};

// Cart types
export interface CartItem {
  id: string;
  vendorProductId: string;
  vendorId: string;
  vendorName: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  variantId?: string;
  variantAttributes?: Record<string, string>;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
  stockQty: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

export interface CartStore extends CartState {
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemsByVendor: () => Record<string, CartItem[]>;
}

// Checkout types
export interface CheckoutAddress {
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  country: string;
  zip?: string;
}

export interface CheckoutShipping {
  zoneId: string;
  method: string;
  cost: number;
  estimatedDays: number;
}

export interface CheckoutTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  walletDeduction: number;
  loyaltyPointsDiscount: number;
  total: number;
}

export type PaymentMethod =
  | "stripe"
  | "jazzcash"
  | "easypaisa"
  | "paypal"
  | "cod"
  | "bank_transfer"
  | "wallet";

export interface CheckoutState {
  step: "cart" | "address" | "shipping" | "payment" | "review";
  shippingAddress: CheckoutAddress | null;
  billingAddress: CheckoutAddress | null;
  sameAsBilling: boolean;
  shipping: CheckoutShipping | null;
  paymentMethod: PaymentMethod | null;
  couponCode: string | null;
  couponDiscount: number;
  useWallet: boolean;
  walletAmount: number;
  useLoyaltyPoints: boolean;
  loyaltyPoints: number;
  notes: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Filter types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  vendor?: string;
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest" | "bestseller" | "rating";
  page?: number;
  limit?: number;
}

// Dashboard stats types
export interface AdminDashboardStats {
  todayRevenue: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  pendingVendorApprovals: number;
  activeProducts: number;
  registeredCustomers: number;
  pendingRefunds: number;
}

export interface VendorDashboardStats {
  todaySales: number;
  pendingOrders: number;
  totalEarnings: number;
  pendingPayout: number;
  totalProducts: number;
  avgRating: number;
}

// Notification types
export interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  type: "ORDER" | "PAYMENT" | "REFUND" | "REVIEW" | "SYSTEM" | "CHAT" | "VENDOR" | "MARKETING";
  link?: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderType: "ADMIN" | "VENDOR" | "CUSTOMER" | "SYSTEM";
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachments: string[];
  readBy: string[];
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  type: "ADMIN_VENDOR" | "ADMIN_CUSTOMER" | "VENDOR_CUSTOMER" | "SUPPORT";
  participants: {
    userId: string;
    name: string;
    avatar?: string;
    role: Role;
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

// Theme types
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: "filled" | "outlined" | "soft";
  darkMode: "system" | "light" | "dark";
  logoPosition: "left" | "center";
  customCSS?: string;
  homepageLayout: string;
}

// Site settings types
export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  defaultCurrency: {
    code: string;
    symbol: string;
  };
  logoUrl?: string;
  faviconUrl?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface VendorOnboardingData {
  businessName: string;
  businessType: string;
  businessReg?: string;
  taxNumber?: string;
  storeName: string;
  storeDescription?: string;
  returnPolicy?: string;
  shippingPolicy?: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNo: string;
  bankIBAN?: string;
  documents: {
    businessReg?: File;
    nationalId?: File;
    utilityBill?: File;
  };
}

// Search types
export interface SearchResult {
  products: ProductWithRelations[];
  categories: Category[];
  vendors: Vendor[];
  totalProducts: number;
}

// Analytics types
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

export interface TopVendor {
  id: string;
  storeName: string;
  logo?: string;
  totalSales: number;
  ordersCount: number;
}

// Utility types
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ActionState<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};
