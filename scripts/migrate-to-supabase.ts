import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to read JSON file
async function readJsonFile(filename: string) {
  const filePath = path.join(process.cwd(), 'data', filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Helper to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      newObj[snakeKey] = toSnakeCase(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Migrate products
async function migrateProducts() {
  console.log('Migrating products...');
  const products = await readJsonFile('products.json');
  const productsSnake = products.map((p: any) => ({
    ...toSnakeCase(p),
    id: p.id,
    created_at: p.createdAt || new Date().toISOString(),
    updated_at: p.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('products').insert(productsSnake);
  if (error) {
    console.error('Error migrating products:', error);
  } else {
    console.log(`✓ Migrated ${products.length} products`);
  }
}

// Migrate orders
async function migrateOrders() {
  console.log('Migrating orders...');
  const orders = await readJsonFile('orders.json');
  const ordersSnake = orders.map((o: any) => ({
    ...toSnakeCase(o),
    id: o.id,
    created_at: o.createdAt || new Date().toISOString(),
    updated_at: o.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('orders').insert(ordersSnake);
  if (error) {
    console.error('Error migrating orders:', error);
  } else {
    console.log(`✓ Migrated ${orders.length} orders`);
  }
}

// Migrate reviews
async function migrateReviews() {
  console.log('Migrating reviews...');
  const reviews = await readJsonFile('reviews.json');
  const reviewsSnake = reviews.map((r: any) => ({
    ...toSnakeCase(r),
    id: r.id,
    created_at: r.createdAt || new Date().toISOString(),
    updated_at: r.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('reviews').insert(reviewsSnake);
  if (error) {
    console.error('Error migrating reviews:', error);
  } else {
    console.log(`✓ Migrated ${reviews.length} reviews`);
  }
}

// Migrate messages
async function migrateMessages() {
  console.log('Migrating messages...');
  const messages = await readJsonFile('messages.json');
  const messagesSnake = messages.map((m: any) => ({
    ...toSnakeCase(m),
    id: m.id,
    created_at: m.createdAt || new Date().toISOString(),
    updated_at: m.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('messages').insert(messagesSnake);
  if (error) {
    console.error('Error migrating messages:', error);
  } else {
    console.log(`✓ Migrated ${messages.length} messages`);
  }
}

// Migrate laboratory cases
async function migrateLaboratoryCases() {
  console.log('Migrating laboratory cases...');
  const cases = await readJsonFile('laboratory-cases.json');
  const casesSnake = cases.map((c: any) => ({
    ...toSnakeCase(c),
    id: c.id,
    case_number: c.caseNumber,
    created_at: c.createdAt || new Date().toISOString(),
    updated_at: c.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('laboratory_cases').insert(casesSnake);
  if (error) {
    console.error('Error migrating laboratory cases:', error);
  } else {
    console.log(`✓ Migrated ${cases.length} laboratory cases`);
  }
}

// Run all migrations
async function migrateAll() {
  console.log('Starting migration to Supabase...\n');

  try {
    await migrateProducts();
    await migrateOrders();
    await migrateReviews();
    await migrateMessages();
    await migrateLaboratoryCases();

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

migrateAll();
