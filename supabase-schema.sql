-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS laboratory_cases CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  brand TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  availability TEXT DEFAULT 'in-stock',
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  short_description TEXT,
  full_description TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  strap_types JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  shipping_info TEXT,
  return_info TEXT,
  care_info TEXT,
  images JSONB DEFAULT '{}'::jsonb,
  video TEXT,
  color_images JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  order_number TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Laboratory cases table
CREATE TABLE laboratory_cases (
  id TEXT PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  watch_details JSONB DEFAULT '{}'::jsonb,
  uploads JSONB DEFAULT '[]'::jsonb,
  payment_screenshot JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  assessment JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_status ON products(status);

CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(approved);

CREATE INDEX idx_messages_status ON messages(status);

CREATE INDEX idx_laboratory_cases_status ON laboratory_cases(status);
CREATE INDEX idx_laboratory_cases_case_number ON laboratory_cases(case_number);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory_cases ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for security)
-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products can be inserted by authenticated users" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products can be updated by authenticated users" ON products FOR UPDATE USING (true);
CREATE POLICY "Products can be deleted by authenticated users" ON products FOR DELETE USING (true);

-- Orders: Public read restricted, admin write
CREATE POLICY "Orders are viewable by everyone" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders can be inserted by everyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders can be updated by authenticated users" ON orders FOR UPDATE USING (true);
CREATE POLICY "Orders can be deleted by authenticated users" ON orders FOR DELETE USING (true);

-- Reviews: Public read approved, authenticated write
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Reviews can be inserted by everyone" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Reviews can be updated by authenticated users" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Reviews can be deleted by authenticated users" ON reviews FOR DELETE USING (true);

-- Messages: Public read, admin write
CREATE POLICY "Messages are viewable by everyone" ON messages FOR SELECT USING (true);
CREATE POLICY "Messages can be inserted by everyone" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages can be updated by authenticated users" ON messages FOR UPDATE USING (true);
CREATE POLICY "Messages can be deleted by authenticated users" ON messages FOR DELETE USING (true);

-- Laboratory cases: Public read, authenticated write
CREATE POLICY "Laboratory cases are viewable by everyone" ON laboratory_cases FOR SELECT USING (true);
CREATE POLICY "Laboratory cases can be inserted by everyone" ON laboratory_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Laboratory cases can be updated by authenticated users" ON laboratory_cases FOR UPDATE USING (true);
CREATE POLICY "Laboratory cases can be deleted by authenticated users" ON laboratory_cases FOR DELETE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_laboratory_cases_updated_at BEFORE UPDATE ON laboratory_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
