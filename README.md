# Vynate Market - Multi-Vendor Dropshipping Platform

A production-ready, enterprise-grade multi-vendor e-commerce platform built with Next.js 15, featuring a modern tech stack and comprehensive functionality.

## 🚀 Features

### Customer Features
- **Product Browsing**: Search, filter, and browse products by category, brand, price
- **Shopping Cart**: Persistent cart with multi-vendor support
- **Secure Checkout**: Multi-step checkout with address management
- **Order Tracking**: Real-time order status updates
- **Wishlist**: Save products for later
- **Reviews & Q&A**: Product reviews and questions
- **Loyalty Points**: Earn and redeem rewards
- **Wallet**: Store credit and refunds

### Vendor Features
- **Seller Dashboard**: Sales analytics and performance metrics
- **Product Management**: Add, edit, bulk import products
- **Order Management**: Process and fulfill orders
- **Inventory Tracking**: Stock management and alerts
- **Promotions**: Create coupons and flash sales
- **Earnings & Payouts**: Track earnings, request payouts
- **Store Customization**: Customize vendor storefront

### Admin Features
- **Dashboard**: Platform-wide analytics
- **Vendor Management**: Approve vendors, manage commissions
- **Product Moderation**: Review and approve products
- **Order Oversight**: Monitor all platform orders
- **Customer Management**: User accounts and support
- **Marketing Tools**: Banners, email campaigns, coupons
- **Settings**: Payments, shipping, taxes, appearance

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (JWT)
- **State**: Zustand + TanStack Query
- **Payments**: Stripe, PayPal, JazzCash, Easypaisa, COD
- **Real-time**: Pusher
- **File Storage**: Cloudinary
- **Email**: Resend
- **Rate Limiting**: Upstash Redis

## 📁 Project Structure

```
├── app/
│   ├── (storefront)/      # Public storefront pages
│   ├── (auth)/            # Authentication pages
│   ├── account/           # Customer account pages
│   ├── admin/             # Admin dashboard
│   ├── vendor/            # Vendor dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── shared/            # Shared components
│   ├── layout/            # Layout components
│   └── storefront/        # Storefront components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── store/                 # Zustand stores
├── prisma/                # Database schema and migrations
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (or use Neon.tech)
- Redis (optional, for rate limiting)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Fill in all required environment variables.

3. **Set up the database**:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

### Test Accounts

After seeding, you can use these accounts:

| Role     | Email               | Password       |
|----------|---------------------|----------------|
| Admin    | admin@vynate.com    | Admin@123456   |
| Vendor   | vendor@vynate.com   | Vendor@123456  |
| Customer | customer@vynate.com | Customer@123456|

## 🌐 Deployment (Cloudways)

1. **Create Node.js 20 application** on Cloudways

2. **Configure build settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: 3000

3. **Set environment variables** in Cloudways dashboard

4. **Database setup**:
   - Use Neon.tech PostgreSQL (recommended)
   - Or set up PostgreSQL on Cloudways

5. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 📝 Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for JWT
- `NEXTAUTH_URL`: Your domain URL
- `STRIPE_SECRET_KEY`: Stripe API key
- `CLOUDINARY_*`: Cloudinary credentials
- `PUSHER_*`: Pusher credentials
- `RESEND_API_KEY`: Resend email API key

## 🔧 Key Features Implementation

### Session Keep-Alive
Prevents Chrome from auto-logging out users with a background ping every 4 minutes.

### Multi-Vendor Cart
Cart supports items from multiple vendors with vendor-wise grouping at checkout.

### Real-time Notifications
Pusher integration for instant order updates, chat messages, and system notifications.

### Secure Payments
- Bank details encrypted with AES-256
- PCI-compliant Stripe integration
- Local payment gateways (JazzCash, Easypaisa)

### Rate Limiting
API endpoints protected with Upstash Redis rate limiting.

## 📄 License

This project is proprietary software developed for Vynate.

## 🤝 Support

For support, contact: support@vynate.com
