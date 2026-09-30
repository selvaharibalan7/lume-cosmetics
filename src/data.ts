// ─── Types ────────────────────────────────────────────────────────────────────

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'rich';
export type Undertone = 'warm' | 'cool' | 'neutral';

export interface SkinProfile {
  skinType: SkinType;
  concerns: string[];
  tone: SkinTone;
  undertone: Undertone;
  avoidIngredients: string[];
  preferredIngredients: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  shade?: string;
  hexColor?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Ingredient {
  id: string;
  name: string;
  purpose: string;
  safe: boolean;
  flagged?: boolean;
  description: string;
  commonlyAvoided?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  skinType: SkinType;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  benefits: string[];
  ingredients: Ingredient[];
  variants?: ProductVariant[];
  tags: string[];
  matchScore?: number;
  matchDetails?: string[];
  inStock: boolean;
  vendor: string;
  isWishlisted?: boolean;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  items: CartItem[];
  total: number;
  address: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  skinProfile?: SkinProfile;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Luminous Glow Serum',
    brand: 'Aurelia',
    category: 'Serums',
    price: 68,
    originalPrice: 85,
    rating: 4.7,
    reviewCount: 342,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop&auto=format',
    ],
    description: 'A lightweight brightening serum that delivers an instant glow and visibly reduces dark spots over time. Formulated with 15% Vitamin C and Niacinamide for powerful antioxidant protection.',
    benefits: ['Brightens complexion', 'Reduces dark spots', 'Antioxidant protection', 'Hydrating'],
    ingredients: [
      { id: 'i1', name: 'Ascorbic Acid (Vitamin C)', purpose: 'Brightening', safe: true, description: 'Potent antioxidant that brightens and evens skin tone' },
      { id: 'i2', name: 'Niacinamide', purpose: 'Pore minimizing', safe: true, description: 'Reduces pores, controls oil, and evens skin tone' },
      { id: 'i3', name: 'Hyaluronic Acid', purpose: 'Hydration', safe: true, description: 'Draws moisture into the skin' },
      { id: 'i4', name: 'Ferulic Acid', purpose: 'Antioxidant booster', safe: true, description: 'Stabilizes Vitamin C and enhances its efficacy' },
    ],
    tags: ['brightening', 'vitamin-c', 'anti-aging', 'fragrance-free'],
    matchScore: 92,
    matchDetails: ['Combination Skin', 'Warm Undertone', 'Fragrance-free'],
    inStock: true,
    vendor: 'Aurelia Beauty Co.',
    isWishlisted: false,
  },
  {
    id: 'p2',
    name: 'Velvet Matte Foundation',
    brand: 'Lumiere',
    category: 'Foundation',
    price: 48,
    rating: 4.5,
    reviewCount: 891,
    images: [
      'https://images.unsplash.com/photo-1631214524020-3c69606a9d5a?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&h=600&fit=crop&auto=format',
    ],
    description: 'Full-coverage matte foundation with 16-hour wear. Lightweight formula that controls oil and minimizes pores for a flawless, airbrushed finish.',
    benefits: ['Full coverage', '16-hour wear', 'Oil control', 'SPF 20'],
    ingredients: [
      { id: 'i5', name: 'Dimethicone', purpose: 'Silky texture', safe: true, description: 'Provides smooth application and skin feel' },
      { id: 'i6', name: 'Titanium Dioxide', purpose: 'Coverage & SPF', safe: true, description: 'Provides pigmentation and sun protection' },
      { id: 'i7', name: 'Fragrance', purpose: 'Scent', safe: false, flagged: true, commonlyAvoided: true, description: 'May cause irritation in sensitive skin' },
    ],
    variants: [
      { id: 'v1', name: 'N10 - Porcelain', shade: 'Porcelain', hexColor: '#F8E6D0', price: 48, stock: 12, sku: 'LUM-F-N10' },
      { id: 'v2', name: 'N20 - Ivory', shade: 'Ivory', hexColor: '#F2D5B5', price: 48, stock: 34, sku: 'LUM-F-N20' },
      { id: 'v3', name: 'W30 - Sand', shade: 'Sand', hexColor: '#DFBF98', price: 48, stock: 8, sku: 'LUM-F-W30' },
      { id: 'v4', name: 'W40 - Caramel', shade: 'Caramel', hexColor: '#C49060', price: 48, stock: 0, sku: 'LUM-F-W40' },
      { id: 'v5', name: 'C50 - Mocha', shade: 'Mocha', hexColor: '#8B5E3C', price: 48, stock: 21, sku: 'LUM-F-C50' },
      { id: 'v6', name: 'D60 - Espresso', shade: 'Espresso', hexColor: '#4A2F1A', price: 48, stock: 15, sku: 'LUM-F-D60' },
    ],
    tags: ['matte', 'full-coverage', 'oil-control', 'long-wear'],
    matchScore: 78,
    matchDetails: ['Combination Skin', 'Contains Fragrance'],
    inStock: true,
    vendor: 'Lumiere Cosmetics',
    isWishlisted: true,
  },
  {
    id: 'p3',
    name: 'Soothing Barrier Cream',
    brand: 'Gentle Earth',
    category: 'Moisturizers',
    price: 42,
    rating: 4.9,
    reviewCount: 1204,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&h=600&fit=crop&auto=format',
    ],
    description: 'Clinically formulated for sensitive and reactive skin. Strengthens the skin barrier, reduces redness, and provides 72-hour moisture retention.',
    benefits: ['Barrier repair', 'Reduces redness', '72hr hydration', 'Hypoallergenic'],
    ingredients: [
      { id: 'i8', name: 'Ceramide NP', purpose: 'Barrier repair', safe: true, description: 'Restores and strengthens the skin barrier' },
      { id: 'i9', name: 'Centella Asiatica', purpose: 'Soothing', safe: true, description: 'Calms inflammation and promotes healing' },
      { id: 'i10', name: 'Glycerin', purpose: 'Humectant', safe: true, description: 'Attracts and retains moisture in the skin' },
      { id: 'i11', name: 'Panthenol', purpose: 'Conditioning', safe: true, description: 'Soothes and softens skin' },
    ],
    tags: ['sensitive-skin', 'fragrance-free', 'hypoallergenic', 'barrier-repair', 'dermatologist-tested'],
    matchScore: 98,
    matchDetails: ['Sensitive Skin', 'Fragrance-free', 'No Parabens', 'Dermatologist Tested'],
    inStock: true,
    vendor: 'Gentle Earth Lab',
    isWishlisted: false,
  },
  {
    id: 'p4',
    name: 'Rose Petal Lip Balm',
    brand: 'Petale',
    category: 'Lip Care',
    price: 18,
    rating: 4.6,
    reviewCount: 567,
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&auto=format',
    ],
    description: 'Deeply nourishing lip balm infused with real rose petal extract and shea butter. Provides 8-hour moisture and a natural tinted finish.',
    benefits: ['Deep moisture', 'Natural tint', 'Rose extract', 'SPF 15'],
    ingredients: [
      { id: 'i12', name: 'Shea Butter', purpose: 'Nourishing', safe: true, description: 'Rich emollient that deeply moisturizes' },
      { id: 'i13', name: 'Rosa Damascena', purpose: 'Soothing', safe: true, description: 'Rose extract with calming properties' },
      { id: 'i14', name: 'Beeswax', purpose: 'Structure', safe: true, description: 'Creates protective barrier on lips' },
    ],
    variants: [
      { id: 'v7', name: 'Clear', shade: 'Clear', hexColor: '#F5E6D8', price: 18, stock: 45, sku: 'PET-L-CLR' },
      { id: 'v8', name: 'Petal Pink', shade: 'Petal Pink', hexColor: '#F0B8C0', price: 18, stock: 28, sku: 'PET-L-PPK' },
      { id: 'v9', name: 'Berry Rose', shade: 'Berry Rose', hexColor: '#C87890', price: 18, stock: 0, sku: 'PET-L-BRY' },
    ],
    tags: ['lip-care', 'natural', 'tinted', 'spf'],
    matchScore: 95,
    matchDetails: ['All Skin Types', 'Natural Formula', 'Cruelty-free'],
    inStock: true,
    vendor: 'Petale Natural',
    isWishlisted: false,
  },
  {
    id: 'p5',
    name: 'Midnight Recovery Eye Cream',
    brand: 'Nocturne',
    category: 'Eye Care',
    price: 72,
    originalPrice: 90,
    rating: 4.4,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&h=600&fit=crop&auto=format',
    ],
    description: 'Intensive overnight eye treatment that targets dark circles, puffiness, and fine lines. Wake up to visibly brighter, firmer eyes.',
    benefits: ['Reduces dark circles', 'De-puffs', 'Firms skin', 'Anti-aging'],
    ingredients: [
      { id: 'i15', name: 'Retinol', purpose: 'Anti-aging', safe: true, description: 'Accelerates cell turnover and reduces wrinkles' },
      { id: 'i16', name: 'Caffeine', purpose: 'Depuffing', safe: true, description: 'Constricts blood vessels to reduce puffiness' },
      { id: 'i17', name: 'Peptides', purpose: 'Firming', safe: true, description: 'Signal skin to produce more collagen' },
    ],
    tags: ['eye-cream', 'anti-aging', 'dark-circles', 'overnight'],
    matchScore: 84,
    matchDetails: ['Combination Skin', 'Anti-aging'],
    inStock: true,
    vendor: 'Nocturne Beauty',
    isWishlisted: false,
  },
  {
    id: 'p6',
    name: 'Cloud Nine Setting Powder',
    brand: 'Aurelia',
    category: 'Setting',
    price: 36,
    rating: 4.8,
    reviewCount: 768,
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&auto=format',
    ],
    description: 'Ultra-fine translucent setting powder that blurs imperfections and locks makeup in place for 12+ hours without looking cakey or heavy.',
    benefits: ['Sets makeup', 'Blurs pores', '12hr wear', 'Lightweight'],
    ingredients: [
      { id: 'i18', name: 'Silica', purpose: 'Oil absorption', safe: true, description: 'Absorbs excess oil and blurs imperfections' },
      { id: 'i19', name: 'Mica', purpose: 'Luminosity', safe: true, description: 'Provides subtle luminosity' },
    ],
    tags: ['setting', 'translucent', 'oil-control', 'longwear'],
    matchScore: 89,
    matchDetails: ['Combination Skin', 'Oil Control', 'Fragrance-free'],
    inStock: true,
    vendor: 'Aurelia Beauty Co.',
    isWishlisted: true,
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Priya M.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    date: '2024-11-15',
    title: "Best serum I've ever used",
    body: "I've been using this for 3 months and the results are incredible. My dark spots have faded significantly and my skin looks so much brighter. The texture is lightweight and absorbs quickly. Worth every penny.",
    skinType: 'combination',
    verified: true,
    helpful: 142,
  },
  {
    id: 'r2',
    author: 'Sarah K.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    rating: 4,
    date: '2024-10-28',
    title: 'Great results but takes time',
    body: 'Took about 6 weeks to see real results but they are definitely there. My skin tone looks more even. The only downside is it stings a little when I first apply it.',
    skinType: 'sensitive',
    verified: true,
    helpful: 89,
  },
  {
    id: 'r3',
    author: 'Alex T.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    date: '2024-10-10',
    title: 'Game changer for combination skin',
    body: "Finally a serum that works for my combination skin without making my T-zone oilier or my cheeks drier. The fragrance-free formula is a huge plus for me.",
    skinType: 'combination',
    verified: true,
    helpful: 67,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-8842',
    date: '2024-11-20',
    status: 'delivered',
    items: [{ product: MOCK_PRODUCTS[0], quantity: 1 }, { product: MOCK_PRODUCTS[2], quantity: 2 }],
    total: 152,
    address: { id: 'a1', name: 'Maya Chen', line1: '42 Blossom Lane', city: 'San Francisco', state: 'CA', zip: '94105', phone: '+1 (415) 555-0192', isDefault: true },
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: '2024-11-24',
    paymentMethod: 'Visa **** 4242',
  },
  {
    id: 'ORD-2024-7731',
    date: '2024-11-05',
    status: 'shipped',
    items: [{ product: MOCK_PRODUCTS[1], variant: MOCK_PRODUCTS[1].variants?.[1], quantity: 1 }],
    total: 48,
    address: { id: 'a1', name: 'Maya Chen', line1: '42 Blossom Lane', city: 'San Francisco', state: 'CA', zip: '94105', phone: '+1 (415) 555-0192', isDefault: true },
    trackingNumber: '1Z999AA10123456785',
    estimatedDelivery: '2024-11-12',
    paymentMethod: 'Visa **** 4242',
  },
  {
    id: 'ORD-2024-6620',
    date: '2024-10-18',
    status: 'delivered',
    items: [{ product: MOCK_PRODUCTS[3], variant: MOCK_PRODUCTS[3].variants?.[0], quantity: 2 }, { product: MOCK_PRODUCTS[5], quantity: 1 }],
    total: 72,
    address: { id: 'a1', name: 'Maya Chen', line1: '42 Blossom Lane', city: 'San Francisco', state: 'CA', zip: '94105', phone: '+1 (415) 555-0192', isDefault: true },
    paymentMethod: 'Visa **** 4242',
  },
];

export const CATEGORIES = [
  { id: 'c1', name: 'Skincare', icon: 'leaf' },
  { id: 'c2', name: 'Foundation', icon: 'foundation' },
  { id: 'c3', name: 'Serums', icon: 'sparkle' },
  { id: 'c4', name: 'Moisturizers', icon: 'droplet' },
  { id: 'c5', name: 'Eye Care', icon: 'eye' },
  { id: 'c6', name: 'Lip Care', icon: 'lipstick' },
  { id: 'c7', name: 'Setting', icon: 'star' },
  { id: 'c8', name: 'Cleansers', icon: 'shield' },
];

export const SKIN_CONCERNS = [
  'Acne & Breakouts', 'Dark Spots', 'Dryness', 'Dullness',
  'Fine Lines & Wrinkles', 'Large Pores', 'Redness & Sensitivity',
  'Uneven Skin Tone', 'Dark Circles', 'Oiliness', 'Hyperpigmentation',
  'Loss of Firmness',
];

export const AVOIDED_INGREDIENTS = [
  'Fragrance', 'Parabens', 'Sulfates', 'Silicones', 'Alcohol',
  'Mineral Oil', 'Phthalates', 'Formaldehyde', 'Oxybenzone',
  'Retinol (Pregnancy)', 'Salicylic Acid (Sensitive)',
];
