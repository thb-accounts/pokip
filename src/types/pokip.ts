import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'merchant' | 'admin';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name?: string | null;
  role: UserRole;
  member_id?: string;
  tokens: number;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at: string;
}

export type ItemStatus = 'draft' | 'published' | 'archived';

export interface PokipItem {
  id: string;
  merchant_id: string;
  merchant_owner_uid: string;
  merchant_name: string;
  title: string;
  description: string;
  image_url?: string;
  token_price: number;
  cash_price?: number | null;
  currency?: string | null;
  stock_quantity?: number;
  unlimited_stock: boolean;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface MerchantProfile {
  id: string;
  owner_uid: string;
  business_name: string;
  contact_name: string;
  business_email: string;
  phone_number?: string;
  category: string;
  description: string;
  logo_url?: string;
  location?: string;
  online_only: boolean;
  currency: string;
  slug: string;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface ShopPurchase {
  id: string;
  user_id: string;
  customer_display_name?: string;
  customer_member_id?: string;
  item_id: string;
  merchant_id: string;
  merchant_owner_uid: string;
  merchant_name: string;
  item_title: string;
  item_image_url?: string;
  purchase_code: string;
  tokens_spent: number;
  redeemed: boolean;
  redeemed_at?: string;
  redeemed_by_uid?: string;
  redeemed_by_merchant_id?: string;
  purchased_at: string;
}

export interface PointsAward {
  id: string;
  customer_uid: string;
  customer_member_id: string;
  merchant_id: string;
  merchant_owner_uid: string;
  merchant_name: string;
  points: number;
  reference?: string;
  note?: string;
  created_at: string;
}