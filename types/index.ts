import { ProductVariant } from './store';

export interface Product {
  id: string;
  name: string;
  category: 'resin' | 'candle' | 'pouch' | 'totebag' | 'bouquet' | 'hampers';
  categoryLabel: string;
  shortDesc: string;
  description: string;
  image: string;
  images?: string[];
  variants?: ProductVariant[];
  badge?: string;
  originalPrice?: number | null;
  priceMin: number;
  priceMax: number;
  minOrder: number;
  leadTime: string;
  material: string;
  size: string;
  options: {
    label: string;
    choices: string[];
  }[];
  shopeeUrl: string;
  rating: number;
  soldCount: number;
  includedItems: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  event: string;
  city: string;
  quote: string;
  productOrdered: string;
  rating: number;
  date: string;
  verifiedBuyer: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'order' | 'shipping' | 'custom' | 'payment';
}

export interface PackagingOption {
  id: string;
  name: string;
  additionalCost: number;
  description: string;
}

export interface GreetingCardOption {
  id: string;
  name: string;
  cost: number;
  description: string;
}
