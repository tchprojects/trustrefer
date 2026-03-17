# TrustRefer — Project Context

> AI assistant context file. Load this at the start of every session to get full project context.

---

## What is TrustRefer?

TrustRefer is a **referral link directory** — a curated, community-driven hub where users discover, share, and validate referral/affiliate links across categories like Energy, Broadband, EV, Investing, Cashback, and more.

Think of it as a **Linktree-style page** combined with **Reddit-style moderation** and a future **membership + advertising platform**.

Target domain: `trustrefer.co.uk`

---

## Brand & Design System

| Property | Value |
|---|---|
| Visual reference | Stark Industries — black dominant, minimal, clean |
| Primary background | `#000000` |
| Surface / card | `#0a0a0a` / `#111111` |
| Border | `#1f1f1f` (default), `white/10–15` (accent borders) |
| Text primary | `#ffffff` |
| Text muted | `#888888` |
| Accent | White — subtle `white/10–40` opacities for borders/hovers |
| Font | `Inter` (via `next/font`) |
| Icons | `lucide-react` |
| No gradients | Flat, stark. No rainbow colours |
| Max border radius | `rounded-md` |
| Upvote colour | `green-400 / green-700` |
| Downvote colour | `red-600 / red-900` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 — theme vars in `globals.css` via `@theme inline {}` |
| UI Primitives | Radix UI (Accordion, Dialog, DropdownMenu) |
| Database | PostgreSQL via **Supabase** (pooler) |
| ORM | **Prisma v5.22.0** (NOT v7 — v7 broke constructor API) |
| Auth | NextAuth.js v5 beta — JWT strategy, split config pattern |
| Passwords | bcryptjs |
| Validation | Zod |
| Search | Fuse.js (client-side fuzzy) |
| Payments | Stripe (phase 2) |
| Deployment | Vercel |
| Package manager | npm |

---

## Project Structure (current)

```
trustrefer/
├── prisma/
│   ├── schema.prisma          # Full DB schema
│   └── seed.ts                # Seed with real categories + links
│
├── src/
│   ├── app/
│   │   ├── page.tsx               # HOME — server component, fetches categories
│   │   ├── layout.tsx             # Root layout (Inter font, Toaster provider)
│   │   ├── globals.css            # CSS vars, base reset, animations
│   │   ├── loading.tsx            # Home page skeleton (shimmer)
│   │   │
│   │   ├── (public)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── submit/page.tsx    # Members only (middleware guarded)
│   │   │
│   │   ├── (admin)/admin/
│   │   │   ├── layout.tsx             # Admin shell with sidebar
│   │   │   ├── page.tsx               # Overview stats
│   │   │   ├── loading.tsx            # Admin overview skeleton
│   │   │   ├── links/page.tsx         # Pending submissions review
│   │   │   ├── links/loading.tsx
│   │   │   ├── users/page.tsx         # User management
│   │   │   ├── users/loading.tsx
│   │   │   ├── reports/page.tsx       # Reports queue
│   │   │   └── reports/loading.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── auth/register/route.ts
│   │       ├── categories/route.ts
│   │       ├── links/route.ts
│   │       ├── links/[id]/route.ts
│   │       ├── links/[id]/click/route.ts     # POST — increments clickCount
│   │       ├── votes/route.ts                # POST — UP/DOWN, toggle-off support
│   │       ├── reports/route.ts
│   │       ├── admin/submissions/[id]/approve/route.ts
│   │       ├── admin/submissions/[id]/reject/route.ts
│   │       ├── admin/reports/[id]/resolve/route.ts
│   │       └── admin/reports/[id]/dismiss/route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx          # focus:border-white/40 accent
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Skeleton.tsx       # Shimmer skeleton (before: pseudo-element)
│   │   │   ├── Toaster.tsx        # Context-based toast (success/error/info), useToast()
│   │   │   └── Tooltip.tsx        # CSS-only tooltip, supports top/bottom/left/right
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Logo + share icon (copies URL, shows Check icon)
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── HomeSearch.tsx         # Client wrapper: SearchBar + accordion/results
│   │   │   ├── SearchBar.tsx          # Fuse.js fuzzy search input
│   │   │   ├── CategoryAccordion.tsx  # Radix accordion, shows vote aggregates in header
│   │   │   ├── BrandCard.tsx          # Link row — upvote/downvote/report/open inline
│   │   │   ├── ThreeDotMenu.tsx       # Legacy — kept but not used in BrandCard anymore
│   │   │   ├── ReportModal.tsx        # Report dialog with reason + note
│   │   │   └── UserBenefitPanel.tsx   # "Join community" CTA — mobile stacked layout
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx          # Email validation, inline errors, toast on success
│   │   │   └── RegisterForm.tsx       # Per-field validation, password strength hint
│   │   │
│   │   └── admin/
│   │       ├── AdminSidebar.tsx       # Active state with white left border
│   │       ├── LinkReviewTable.tsx    # Approve/reject with toasts + tooltips
│   │       ├── UserTable.tsx
│   │       └── ReportTable.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma v5 singleton
│   │   ├── auth.ts            # Full NextAuth config (Prisma adapter, bcrypt)
│   │   ├── auth.config.ts     # Edge-safe auth config (no Prisma — used in middleware)
│   │   └── utils.ts           # cn(), formatUrl(), slugify()
│   │
│   ├── hooks/
│   │   ├── useSearch.ts       # Fuse.js search hook
│   │   └── useVote.ts         # Vote hook (may be superseded by inline BrandCard logic)
│   │
│   ├── types/
│   │   └── index.ts           # LinkWithRelations, CategoryWithLinks, ApiResponse
│   │
│   └── middleware.ts          # Edge-safe: guards /submit (auth) and /admin (role)
│
├── CONTEXT.md                 # THIS FILE
├── .env                       # DATABASE_URL (session mode port 5432) for Prisma CLI
├── .env.local                 # DATABASE_URL (transaction mode port 6543) for app runtime
└── package.json
```

---

## Critical Technical Notes

### Prisma Version
- Using **Prisma v5.22.0** — do NOT upgrade to v7. v7 removed `url` from schema and requires driver adapters.
- Schema uses `url = env("DATABASE_URL")` in datasource block.
- No `prisma.config.ts` — that was a v7-only concept, deleted.

### NextAuth Split Config (Edge Runtime Fix)
- `src/lib/auth.config.ts` — edge-safe, no Prisma/bcrypt imports. Used by middleware.
- `src/lib/auth.ts` — full config with PrismaAdapter + Credentials provider. Used by API routes and server components.
- Middleware does `NextAuth(authConfig)` — never imports from `auth.ts`.

### Supabase Connection URLs
- `.env` → `DATABASE_URL` uses **port 5432** (session mode) — for `prisma migrate` CLI
- `.env.local` → `DATABASE_URL` uses **port 6543** with `?pgbouncer=true` (transaction mode) — for app runtime
- Pooler host format: `aws-1-ap-southeast-2.pooler.supabase.com` (no `db.` prefix)

### Tailwind v4
- Theme variables defined in `globals.css` via `@theme inline {}` block
- No `tailwind.config.ts` theme extensions — all in CSS
- Use `white/10`, `white/15` opacity syntax for borders

---

## Database Schema Summary

| Model | Purpose |
|---|---|
| `User` | Roles: USER, ADMIN, SUPER_ADMIN. Tiers: FREE, BASIC, PREMIUM |
| `Category` | Energy, Broadband, EV, etc. — slug + order |
| `Link` | Referral link — `isApproved` flag for public visibility, `voteScore`, `clickCount` |
| `LinkSubmission` | User-submitted link pending admin review (PENDING/APPROVED/REJECTED) |
| `Vote` | UP/DOWN per user per link — unique `userId_linkId` constraint. Toggle-off supported. |
| `Report` | User report: BROKEN_URL, SPAM, INAPPROPRIATE, WRONG_CATEGORY, OTHER |
| `Comment` | Short note from user to admin |
| `AdSlot` | Phase 2 advertising (position, dates, impressions, clicks) |

---

## Seed Data

Pre-loaded via `npm run db:seed`:

| Category | Brand | Headline |
|---|---|---|
| Energy | Octopus Energy | £50 Joining Bonus |
| Broadband | Starlink | 1 Month Free |
| EV / Car | Tesla | £500 or 650 Supercharger Miles |
| Investing Apps | Interactive Investor | 1 Year Free Subscription |
| Solar / Battery | Octopus Energy (Solar) | £100 Visa Card |
| Cashback | TopCashback | £10 Sign Up Bonus |
| Miscellaneous | Hostinger UK | 20% Discount |
| Miscellaneous | Rotimatic | £74 Discount |

Empty (coming soon): Mobile, Banking, Food Delivery, Meal Kits, Insurance, Travel, Home Services

---

## Features Built (Phase 1 Complete)

### Home Page
- [x] Sticky header with logo + share-URL icon (copies link, shows Check icon feedback)
- [x] Hero title + link count subtitle
- [x] Fuse.js search — filters across brand names + categories, shows result count
- [x] Radix accordion — `type="multiple"`, first category auto-expanded
- [x] Accordion header shows: category name, link count badge, aggregate upvote/downvote counts
- [x] White accent borders on accordion (`border-white/15`)
- [x] BrandCard: brand initial avatar, name, headline badge, domain, click count
- [x] BrandCard: inline upvote (green, filled icon) + downvote (red, filled icon) + report + open link
- [x] Voting: optimistic updates, toggle-off support, 401 → toast "Sign in to vote"
- [x] Vote animations: `vote-pop` bounce on click, `+1`/`-1` float-up feedback
- [x] Report modal: reason dropdown + note textarea, success state with CheckCircle
- [x] UserBenefitPanel: "Join community" CTA — stacked on mobile (full-width button), row on desktop
- [x] Home page shimmer skeleton (`loading.tsx`)

### Auth
- [x] Login: email format validation, inline errors, toast on success
- [x] Register: name/email/password validation, live password strength hint, toast on success
- [x] NextAuth v5 JWT strategy — role + membershipTier in token/session

### Submit
- [x] Category dropdown, brand name, URL (https required), optional note
- [x] URL validation, character counters (100/500), toast on success

### Admin Dashboard
- [x] Sidebar with active state (white left border indicator)
- [x] Overview: total links, pending submissions, reports, users stats
- [x] Links page: pending submissions with approve/reject (icon buttons with tooltips + toasts)
- [x] Users page: list with role/tier badges
- [x] Reports page: report queue with resolve/dismiss
- [x] All admin tabs have shimmer `loading.tsx` skeletons (no blank flash on tab switch)

### Infrastructure
- [x] Middleware: `/submit` requires auth, `/admin/*` requires ADMIN/SUPER_ADMIN role
- [x] Unauthenticated admin access → redirects to `/login` (not `/`)
- [x] Global toast system (`Toaster` context + `useToast()` hook)
- [x] CSS-only tooltip component
- [x] Shimmer skeleton component
- [x] Custom CSS animations: accordion-down/up, shimmer, vote-pop, float-up

---

## CSS Animations (globals.css)

| Class | Effect | Duration |
|---|---|---|
| `animate-accordion-down` | Height + opacity expand | 0.2s |
| `animate-accordion-up` | Height + opacity collapse | 0.2s |
| `animate-vote-pop` | Scale bounce (1 → 1.45 → 0.88 → 1) | 0.4s |
| `animate-float-up` | Fade + translateY upward | 0.7s |
| Skeleton shimmer | `before:animate-[shimmer_1.8s_infinite]` via Tailwind arbitrary | 1.8s loop |

---

## Key Conventions

- `cn()` from `@/lib/utils` for conditional classes
- API returns `{ data?, error?, message? }` shape
- Server Components by default; `"use client"` only for interactivity
- Zod for all API request body validation
- No gradients, no light mode, Inter font, max `rounded-md`
- Toast for all user feedback (success/error/info)

---

## Environment Setup

```bash
cp .env.local.example .env.local   # fill DATABASE_URL (port 6543) + NEXTAUTH_SECRET
# .env needs DATABASE_URL port 5432 for migrations
npm run db:migrate
npm run db:seed
npm run dev
```

---

## Phase 2 Roadmap (Not Started)

| Feature | Notes |
|---|---|
| Stripe payments | BASIC/PREMIUM membership tiers |
| Google/GitHub OAuth | Add to NextAuth providers |
| Algolia search | Replace Fuse.js at scale |
| Email notifications | Resend/SendGrid — submission approved/rejected |
| Rate limiting | Upstash Redis |
| Public user profiles | Member-submitted links page |
| Advertising | AdSlot model is in schema, UI not built |
| Analytics | Vercel Analytics + custom click tracking |
