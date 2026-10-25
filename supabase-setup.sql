-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mens', 'womens', 'antique', 'gemstone')),
  brand TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  availability TEXT NOT NULL DEFAULT 'in-stock' CHECK (availability IN ('in-stock', 'low-stock', 'out-of-stock')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  featured BOOLEAN DEFAULT false,
  short_description TEXT,
  full_description TEXT,
  colors TEXT[],
  strap_types TEXT[],
  specifications JSONB,
  shipping_info TEXT,
  return_info TEXT,
  care_info TEXT,
  images JSONB NOT NULL DEFAULT '{}'::jsonb,
  video TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Laboratory cases table
CREATE TABLE IF NOT EXISTS laboratory_cases (
  id TEXT PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('watch', 'gemstone')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  brand TEXT,
  model TEXT,
  reference_number TEXT,
  serial_number TEXT,
  description TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  video TEXT,
  proof_of_purchase TEXT,
  payment_receipt TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'completed', 'rejected')),
  assessment JSONB,
  certificate_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_laboratory_cases_status ON laboratory_cases(status);
CREATE INDEX IF NOT EXISTS idx_laboratory_cases_case_number ON laboratory_cases(case_number);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;

DROP POLICY IF EXISTS "Public can insert orders" ON orders;
DROP POLICY IF EXISTS "Admin can view orders" ON orders;
DROP POLICY IF EXISTS "Admin can update orders" ON orders;
DROP POLICY IF EXISTS "Admin can delete orders" ON orders;

DROP POLICY IF EXISTS "Public can insert laboratory cases" ON laboratory_cases;
DROP POLICY IF EXISTS "Public can view own laboratory cases" ON laboratory_cases;
DROP POLICY IF EXISTS "Admin can view all laboratory cases" ON laboratory_cases;
DROP POLICY IF EXISTS "Admin can update laboratory cases" ON laboratory_cases;
DROP POLICY IF EXISTS "Admin can delete laboratory cases" ON laboratory_cases;

DROP POLICY IF EXISTS "Public can insert messages" ON messages;
DROP POLICY IF EXISTS "Admin can view messages" ON messages;
DROP POLICY IF EXISTS "Admin can update messages" ON messages;
DROP POLICY IF EXISTS "Admin can delete messages" ON messages;

-- Create RLS policies
-- Products: Allow public read, admin write
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Admin can delete products" ON products FOR DELETE USING (true);

-- Orders: Allow public insert, admin read/write
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Admin can delete orders" ON orders FOR DELETE USING (true);

-- Laboratory cases: Allow public insert, admin read/write
CREATE POLICY "Public can insert laboratory cases" ON laboratory_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view own laboratory cases" ON laboratory_cases FOR SELECT USING (customer_email = auth.email());
CREATE POLICY "Admin can view all laboratory cases" ON laboratory_cases FOR SELECT USING (true);
CREATE POLICY "Admin can update laboratory cases" ON laboratory_cases FOR UPDATE USING (true);
CREATE POLICY "Admin can delete laboratory cases" ON laboratory_cases FOR DELETE USING (true);

-- Messages: Allow public insert, admin read/write
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Admin can update messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Admin can delete messages" ON messages FOR DELETE USING (true);
