import type { Timestamp } from "firebase/firestore";
export type UserRole = "customer" | "merchant" | "admin";
export type AccountStatus = "active" | "suspended";
export type ListingType = "product" | "service" | "discount" | "reward";
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  communicationPreferences?: { marketing: boolean };
  onboardingCompleted: boolean;
  status: AccountStatus;
  membershipCode?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface MerchantProfile {
  id: string;
  ownerUid: string;
  businessName: string;
  slug: string;
  description: string;
  categoryId: string;
  logoURL?: string;
  coverImageURL?: string;
  phoneNumber?: string;
  publicEmail?: string;
  website?: string;
  socialUrl?: string;
  location?: string;
  onlineOnly: boolean;
  currency: string;
  status: AccountStatus;
  pointsRule?: { pointsPerCurrencyUnit: number; minimumSpend?: number };
  redemptionTerms?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface ShopListing {
  id: string;
  merchantId: string;
  merchantSlug: string;
  merchantName?: string;
  title: string;
  description: string;
  type: ListingType;
  categoryId?: string;
  imageURLs: string[];
  status: "draft" | "published" | "archived";
  fulfillmentType: "physical" | "digital" | "in_store" | "online";
  cashPrice?: number;
  pointsPrice?: number;
  currency?: string;
  stockQuantity?: number;
  unlimitedStock: boolean;
  redemptionLimitPerCustomer?: number;
  terms?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
