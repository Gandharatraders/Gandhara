# Gandhara Traders Company - Premium Watch E-Commerce Platform

A production-ready luxury watch e-commerce platform built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Features Implemented

### Customer Storefront
- ✅ Cinematic logo intro animation (plays on initial load and page refresh, skips on internal navigation)
- ✅ Responsive header with centered logo and navigation
- ✅ Homepage with hero section and featured products
- ✅ Product collection pages (Men's, Women's, Premium)
- ✅ Product detail pages with gallery and specifications
- ✅ Functional shopping cart with localStorage persistence
- ✅ Collection filters (price range, availability) and sorting
- ✅ Product search functionality
- ✅ Wishlist with localStorage persistence
- ✅ Checkout flow with cash on delivery
- ✅ Order confirmation page with tracking
- ✅ Watch Laboratory submission form (frontend)

### Admin Dashboard
- ✅ Admin login page (demo credentials: admin@crownix.com / admin123)
- ✅ Admin layout with sidebar navigation
- ✅ Dashboard overview with stats
- ✅ Product management page
- ✅ Order management page with status tracking
- ✅ Placeholder pages for Customers, Laboratory, and Settings

### Design System
- ✅ Brand colors: Matte black (#050505), Chrome silver (#C7CBD0), White (#F5F5F5), Red accents (#E50920)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Custom typography with Geist font
- ✅ Smooth animations with Framer Motion
- ✅ Consistent component styling

## 📁 Project Structure

```
crownix-collection/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── admin/               # Admin dashboard
│   │   ├── cart/                # Shopping cart page
│   │   ├── checkout/            # Checkout page
│   │   ├── collections/         # Collection pages
│   │   ├── order-confirmation/  # Order confirmation
│   │   ├── products/            # Product detail pages
│   │   ├── search/              # Search page
│   │   ├── watch-laboratory/    # Watch Laboratory
│   │   ├── wishlist/            # Wishlist page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── admin/               # Admin components
│   │   ├── cart/                # Cart components
│   │   ├── checkout/            # Checkout components
│   │   ├── contact/             # Contact form
│   │   ├── laboratory/          # Watch Laboratory form
│   │   ├── layout/              # Layout components (Header, Footer, Hero)
│   │   ├── product/             # Product components
│   │   └── ui/                  # UI components (Button, Input, Card)
│   ├── lib/
│   │   ├── cart-context.tsx     # Cart state management
│   │   ├── wishlist-context.tsx # Wishlist state management
│   │   ├── data.ts              # Demo product data
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── public/
│   ├── images/                  # Product images
│   ├── videos/                  # Product videos
│   ├── logo.png                 # Crownix logo
│   ├── sitemap.xml              # SEO sitemap
│   └── robots.txt               # SEO robots file
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (when implementing backend)
DATABASE_URL="postgresql://user:password@localhost:5432/crownix"

# NextAuth (when implementing authentication)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateway (when implementing payments)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# File Upload (when implementing Watch Laboratory uploads)
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760  # 10MB
```

## 📝 Required Assets

### Product Images
Current product images are placeholder files (12 bytes each). Real product images need to be added to:
- `public/images/products/` - Main product images and gallery images

### Product Videos
Current product videos are placeholder files. Real product videos need to be added to:
- `public/videos/products/` - Product video files

### Hero Video
The homepage hero video is a placeholder. Add a cinematic watch video to:
- `public/hero-video.mp4` - Main hero video
- `public/hero-video.webm` - WebM format for browser compatibility
- `public/hero-poster.jpg` - Poster image for video fallback

## 🔐 Admin Access

**How to Access Admin Dashboard:**

1. Navigate to: `http://localhost:3000/admin/login`
2. Enter credentials:
   - Email: `admin@crownix.com`
   - Password: `admin123`
3. Click "Sign In"

**Admin Features:**
- Dashboard overview with product stats
- Product management (view and search products)
- Order management (view demo orders with status tracking)
- Placeholder pages for Customers, Laboratory, and Settings

**Note:** The admin login uses localStorage for session management. In production, this should be replaced with secure authentication (NextAuth.js).

## 🚧 Outstanding Work

### High Priority
1. **Add Real Product Images** - Replace placeholder files with actual watch images
2. **Add Product Videos** - Upload real product videos for each watch
3. **Add Hero Video** - Create a cinematic hero video for the homepage

### Backend Integration
4. **Database Setup** - Install Prisma and PostgreSQL for persistent data
5. **API Routes** - Create server-side API endpoints for products, orders, auth
6. **Authentication** - Implement NextAuth.js for customer and admin authentication
7. **File Uploads** - Implement server-side file upload for Watch Laboratory

### Customer Features
8. **Customer Accounts** - Allow users to register, login, and view order history
9. **Order Tracking** - Implement real order status updates and tracking
10. **Email Notifications** - Send order confirmation and status update emails

### Admin Features
11. **Product CRUD** - Full create, read, update, delete for products
12. **Product Image Upload** - Allow admins to upload product images and videos
13. **Order Management** - Update order status, view order details
14. **Inventory Management** - Track stock levels and low-stock alerts
15. **Analytics Dashboard** - Sales reports, popular products, customer insights

### Watch Laboratory
16. **AI Integration** - Connect to AI vision provider for authentication analysis
17. **Case Management** - Admin interface to review and manage authentication cases
18. **Assessment Reports** - Generate detailed authenticity reports

### SEO & Performance
19. **Structured Data** - Add Product, Organization, BreadcrumbList schema
20. **Image Optimization** - Use Next.js Image optimization with WebP/AVIF
21. **Performance Optimization** - Implement code splitting, lazy loading
22. **Accessibility Audit** - Ensure WCAG 2.1 AA compliance

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway

## 📄 License

This project is proprietary software for Gandhara Traders Company.

## 🤝 Support

For support, contact the development team.
