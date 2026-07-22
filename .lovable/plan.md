## POKIP Multi-Merchant Loyalty Platform

This is a large, multi-phase build on top of the existing Firebase-backed POKIP app. Below is the scoped plan.

### Current state (verified from codebase)
- Auth: **Firebase Auth** (`src/lib/firebase.ts`, `useFirebaseAuth`)
- Database: **Firestore** (`profiles`, `item_stock`, `user_purchases`)
- Shop: hardcoded item array in `src/pages/Index.tsx`
- No merchant, role, category, redemption-record, or notification concepts exist
- A stray `src/integrations/supabase/client.ts` exists but is unused

### Key decision needed before I start

The spec requires: server-enforced permissions, atomic redemptions, secure merchant point awards, admin controls, roles, audit logs. **Firestore + client-only code cannot safely deliver this.** I see two realistic paths:

**Option A — Stay on Firebase, add Cloud Functions**
- Keep existing auth/users/points intact
- Add Firebase Cloud Functions for: award points, redeem item, merchant CRUD, admin actions
- Firestore security rules for role enforcement
- ⚠️ Lovable's sandbox cannot deploy Firebase Functions — you'd need to deploy them yourself via Firebase CLI
- Existing user data preserved as-is

**Option B — Migrate to Lovable Cloud (Supabase)**
- Full server enforcement via Edge Functions + RLS, deployable from Lovable
- Roles table, atomic transactions, audit logs all native
- ⚠️ Existing Firebase users/points would need a one-time migration (I'd write the script; you'd run it)
- Long-term much simpler to maintain

**I recommend Option B** — the security requirements in your spec (server-authoritative points, atomic redemptions, admin refunds, audit logs, role-based access) are exactly what Lovable Cloud is designed for, and I can actually deploy and verify it end-to-end here.

### Build phases (after you pick A or B)

**Phase 1 — Foundation**
- Backend choice wired up; roles (`customer`, `merchant`, `admin`) in a separate roles table
- Design system rebuilt from POKIP logo (colors, type, radii, shadows, tokens in `index.css` + `tailwind.config.ts`)
- Reusable UI: buttons, cards, badges, empty/loading states, mobile nav
- Public nav + landing + How It Works

**Phase 2 — Accounts & profiles**
- Registration flow: choose Customer or Merchant
- Customer profile: Member ID, digital card, balance, activity, redemption history, settings
- Merchant profile: business fields per spec, server-generated Merchant ID, logo/cover upload
- Existing customers can add a Merchant Profile to the same login

**Phase 3 — POKIP Shop (customer side)**
- Replace hardcoded items with DB-backed merchant items
- Categories, search, filters (merchant, points price, availability)
- Item detail page, merchant storefront pages
- Featured / new / popular / limited-time surfaces

**Phase 4 — Merchant dashboard**
- Overview stats (real values), Customer Lookup (minimum info only), Award Points form
- Shop Items CRUD (own items only, server-enforced), Add Item with images
- Redemptions list with fulfilment status updates
- Transactions, Analytics, Business Profile, Settings

**Phase 5 — Secure redemption + point award**
- Server functions for award-points and redeem-item
- Atomic: auth → validate → deduct → decrement stock → create redemption → voucher/code → notify
- Idempotency keys to block double-clicks and retries
- All prices, balances, ownership loaded server-side — never trusted from browser

**Phase 6 — Admin console**
- Manage customers, merchants (suspend/reactivate), items, categories, featured flags
- Redemptions view, refunds/reversals, audit logs, platform analytics

**Phase 7 — Notifications + polish**
- In-app notifications for awards and redemptions
- Confirmation dialogs, toasts, empty states, mobile nav across all surfaces
- Final review report per your 10-point checklist

### Two questions before I start

1. **Backend: Option A (Firebase + Functions) or Option B (migrate to Lovable Cloud)?**
2. **Do you have the POKIP logo file?** Please upload it — I'll extract the exact palette and shapes for the design system. If not, describe the logo (colors, mark, wordmark) and I'll match.

Once you answer, I'll start with Phase 1 and check in after each phase.
