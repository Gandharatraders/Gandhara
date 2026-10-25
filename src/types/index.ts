// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: 'mens' | 'womens' | 'antique' | 'gemstone';
  shortDescription: string;
  fullDescription: string;
  price: number; // PKR
  salePrice?: number;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockQuantity: number;
  colors: string[];
  strapTypes?: string[];
  colorImages?: { [key: string]: string[] }; // Color-specific images
  specifications?: ProductSpecifications;
  shippingInfo?: string;
  returnInfo?: string;
  careInfo?: string;
  images: ProductImages;
  video?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImages {
  main: string;
  gallery1: string; // Front dial
  gallery2: string; // Side profile
  gallery3: string; // Case back
  gallery4: string; // Strap detail
  gallery5: string; // Lifestyle/wrist shot
}

export interface ProductSpecifications {
  caseMaterial?: string;
  caseDiameter?: string;
  caseThickness?: string;
  strapMaterial?: string;
  strapWidth?: string;
  movement?: string;
  waterResistance?: string;
  crystal?: string;
  warranty?: string;
  // Gemstone specifications
  gemstone?: string;
  gemstones?: string;
  carat?: string;
  totalCarat?: string;
  clarity?: string;
  color?: string;
  cut?: string;
  metal?: string;
  certification?: string;
  origin?: string;
  diamondAccents?: string;
  chainLength?: string;
  length?: string;
  clasp?: string;
  pieces?: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStrap?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedColor?: string;
  selectedStrap?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  country: string;
  instructions?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

// Watch Laboratory Types
export interface AuthenticationCase {
  id: string;
  caseNumber: string;
  userId?: string;
  watchDetails: WatchDetails;
  uploads: EvidenceUpload[];
  status: 'submitted' | 'awaiting-info' | 'under-review' | 'expert-review' | 'completed';
  assessment?: AssessmentResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchDetails {
  brand: string;
  model: string;
  referenceNumber?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchaseLocation?: string;
  country: string;
  city: string;
  hasProofOfPurchase: boolean;
  observations?: string;
}

export interface EvidenceUpload {
  id: string;
  type: 'dial' | 'case-back' | 'serial' | 'side-profile' | 'strap' | 'clasp' | 'packaging' | 'other';
  fileName: string;
  filePath: string;
  uploadedAt: Date;
}

export interface AssessmentResult {
  status: 'more-info-required' | 'inconclusive' | 'inconsistencies-detected' | 'no-obvious-inconsistencies';
  findings: string;
  missingEvidence: string[];
  confidence?: number;
  limitations: string;
  assessedAt?: Date;
}

// Collection Types
export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  productIds: string[];
  seoTitle?: string;
  seoDescription?: string;
}

// Admin Types
export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  pendingCases: number;
  recentOrders: Order[];
  recentCases: AuthenticationCase[];
}
