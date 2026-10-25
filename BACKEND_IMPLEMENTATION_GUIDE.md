# Backend Implementation Guide for Crownix Collection

This guide provides step-by-step instructions to implement the full backend functionality for the Crownix Collection e-commerce platform.

## Prerequisites

1. Stable internet connection
2. Node.js and npm installed
3. PostgreSQL database (or use SQLite for local development)
4. File permissions to install npm packages

## Step 1: Install Dependencies

```bash
cd crownix-collection
npm install prisma @prisma/client next-auth bcryptjs
npm install better-sqlite3 @types/bcryptjs
```

If npm install fails, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Step 2: Initialize Prisma

```bash
npx prisma init
```

This creates a `prisma` folder with `schema.prisma` file.

## Step 3: Configure Database Schema

Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // Change to "postgresql" for production
  url      = "file:./dev.db"
}

model Product {
  id                String   @id @default(cuid())
  name              String
  sku               String   @unique
  category          String
  price             Float
  salePrice         Float?
  stockQuantity     Int
  availability      String
  shortDescription  String
  description       String
  images            String   // JSON array of image URLs
  video             String?  // Video URL
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Order {
  id          String   @id @default(cuid())
  customerName String
  customerEmail String
  customerPhone String
  items        String   // JSON array of order items
  totalAmount  Float
  status      String   @default("pending")
  address     String
  city        String
  country     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model LaboratoryCase {
  id                String   @id @default(cuid())
  brand             String
  model             String
  referenceNumber   String?
  serialNumber      String?
  purchaseDate      String?
  purchaseLocation  String?
  country           String
  city              String
  hasProofOfPurchase Boolean
  observations      String
  files             String   // JSON array of file URLs
  paymentStatus     Boolean  @default(false)
  paymentScreenshot String?
  status            String   @default("pending")
  caseNumber        String   @unique
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  name          String?
  role          String   @default("customer")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Step 4: Create Database

```bash
npx prisma db push
```

## Step 5: Create Prisma Client Instance

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Step 6: Create API Routes

### Products API

Create `src/app/api/products/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: body
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
```

Create `src/app/api/products/[id]/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
```

### Orders API

Create `src/app/api/orders/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await prisma.order.create({
      data: body
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
```

### Laboratory Cases API

Create `src/app/api/laboratory/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCaseNumber } from '@/lib/utils';

export async function GET() {
  try {
    const cases = await prisma.laboratoryCase.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(cases);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const caseNumber = generateCaseNumber();
    const laboratoryCase = await prisma.laboratoryCase.create({
      data: {
        ...body,
        caseNumber
      }
    });
    return NextResponse.json(laboratoryCase, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
```

## Step 7: File Upload System

Create `src/app/api/upload/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', type);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const url = `/uploads/${type}/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
```

## Step 8: Update Frontend to Use API

### Update Product Management Pages

Replace static data imports with API calls in:
- `src/app/admin/products/page.tsx`
- `src/app/admin/products/new/page.tsx`
- `src/app/admin/products/[id]/edit/page.tsx`

Example API call:
```typescript
const response = await fetch('/api/products');
const products = await response.json();
```

### Update Laboratory Form

Replace form submission with API call:
```typescript
const response = await fetch('/api/laboratory', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

## Step 9: Add Environment Variables

Create `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 10: Test the Backend

1. Start the development server:
```bash
npm run dev
```

2. Test API endpoints:
   - GET/POST `/api/products`
   - GET/PUT/DELETE `/api/products/[id]`
   - GET/POST `/api/orders`
   - GET/POST `/api/laboratory`
   - POST `/api/upload`

3. Test admin functionality:
   - Add new product (should save to database)
   - Edit product (should update in database)
   - Delete product (should remove from database)
   - Upload images/videos (should save to public/uploads)

## Production Considerations

1. **Database**: Switch from SQLite to PostgreSQL for production
2. **File Storage**: Use cloud storage (AWS S3, Cloudinary) instead of local filesystem
3. **Authentication**: Implement full NextAuth.js with proper user management
4. **Security**: Add rate limiting, input validation, and error handling
5. **Performance**: Add caching, database indexing, and CDN for static assets

## Troubleshooting

**npm install fails:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json
- Try again with stable internet connection

**Prisma issues:**
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync database
- Check DATABASE_URL in .env file

**File upload issues:**
- Ensure public/uploads directory exists
- Check file permissions
- Verify file size limits in Next.js config
