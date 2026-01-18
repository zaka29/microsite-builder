# Microsite Builder - AI Coding Agent Instructions

## Architecture Overview

This is a **pnpm + Turborepo monorepo** for building Shopify-powered microsites. Three main components work together:

1. **`packages/cms`** - Sanity Studio for content management and data storage
2. **`apps/dashboard`** - **Shopify embedded app** that runs inside Shopify Admin for campaign management
3. **`apps/microsite-template`** - Next.js template for rendering published microsites

**Data Flow**: Merchant creates campaign in Shopify Admin (dashboard) → Fetches products from Shopify Storefront API → Saves to Sanity CMS → Template renders microsites from Sanity data

## Microsite Campaign Workflow

**Goal**: Build a Shopify embedded app (`apps/dashboard`) that lives inside the Shopify Admin, allowing store owners to create and manage microsite campaigns.

### Dashboard = Shopify Embedded App

- **Runs inside Shopify Admin UI** using Shopify App Bridge and Shopify Polaris UI library
- **Authenticates via Shopify OAuth** (not standalone auth)
- **Installed via Shopify App Store** - appears in merchant's Shopify Admin sidebar
- Hosted within the Turborepo at `apps/dashboard`

### Campaign Creation Flow

1. **Store owner/marketer** opens the dashboard from within Shopify Admin
2. **Dashboard fetches products** from Shopify via Storefront API (not synced from Sanity)
3. **User creates campaign**, selecting products and configuring content
4. **Dashboard saves** campaign data to Sanity CMS via `micrositeCampaign` document type
5. **Preview/publish** the microsite via `apps/microsite-template`

### Campaign Structure (`micrositeCampaign`)

The document type at `packages/cms/schemaTypes/documents/micrositeCampaign.ts` stores:

- Slug-based routing for each microsite
- Shopify product IDs with optional title overrides
- Hero image, description, and publish status
- Products array: `{shopifyProductId: {id, title}, title?: string}`

**Note**: While Sanity Studio can view/edit campaigns, the primary creation interface is the Shopify embedded dashboard.

## Package Structure & Path Aliases

The monorepo uses TypeScript path aliases configured in `tsconfig.base.json`:

```typescript
import {getCampaignBySlug} from 'api/cms'
import {getProductsByIds} from 'api/shopify'
```

**Key packages:**

- `api/*` - Shared data fetching (`api/cms.ts`, `api/shopify.ts`)
- `cms/*` - Sanity schema types and plugins
- `shopify/*` - Shopify cart utilities (`cart.ts` with `createCheckoutUrl()`)
- `ui/*` - Shared UI components

**Important**: The dashboard's `next.config.ts` sets `turbopack.root` to monorepo root for proper path resolution.

## Development Workflow

```bash
# Start all apps simultaneously (dashboard + cms + microsite-template)
pnpm dev

# Run individual workspaces
pnpm --filter=cms dev
pnpm --filter=dashboard dev
pnpm --filter=microsite-template dev
```

**Turborepo tasks** (`turbo.json`):

- `dev` - Persistent, no cache
- `build` - Depends on `^build`, outputs to `.next/**` or `dist/**`

## Sanity CMS Conventions

### Schema Organization

- `/schemaTypes/documents/` - Top-level content types (products, collections, `micrositeCampaign`)
- `/schemaTypes/objects/module/` - Reusable editorial modules (hero, callout, product features)
- `/schemaTypes/objects/` - General objects (links, custom product options)

**Key document type**: `micrositeCampaign` links Shopify products with editorial content for microsite generation.

### Custom Structure Builder

The studio uses `defineStructure` utility (see `packages/cms/utils/defineStructure.ts`) to create type-safe structure definitions:

```typescript
export default defineStructure<ListItemBuilder>(
  (S) => S.listItem().title('Products').schemaType('product'),
  // ...
)
```

**Structure files** in `/structure/` organize the sidebar: singletons (home, settings), grouped products with variants, collections, and pages.

### Shopify Integration

- **Read-only Shopify data**: Stored in `store` object on documents (synced via Sanity Connect app)
- **Shopify is source of truth** for: product titles, slugs (handles), thumbnail images, collections
- **Sanity adds**: Editorial content, custom modules, metadata

**Custom input components:**

- `ShopifyProductSelector` - Select products from Shopify catalog
- `PlaceholderString` - Use another field's value as placeholder

**Custom document actions** (`/plugins/customDocumentActions/`):

- `shopifyDelete` - Delete product + all variants
- `shopifyLink` - Open in Shopify admin (requires `SHOPIFY_STORE_DOMAIN` env var)

### Locked Documents

Constants defined in `packages/cms/constants.ts`:

- `LOCKED_DOCUMENT_TYPES` - Cannot create, duplicate, delete: `settings`, `home`, `media.tag`
- `SHOPIFY_DOCUMENT_TYPES` - Synced from Shopify: `product`, `productVariant`, `collection`

## Environment Variables

Required across apps:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=qymf097m
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=<token>

# Shopify (both variants supported)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<store>.myshopify.com
SANITY_STUDIO_SHOPIFY_STORE_DOMAIN=<store>.myshopify.com
NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN=<token>
SANITY_STUDIO_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
```

The codebase checks both `NEXT_PUBLIC_*` and `SANITY_STUDIO_*` variants (see `packages/api/shopify.ts`).

## Data Fetching Patterns

### Sanity Client Setup

Both apps create separate clients with identical config:

```typescript
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2025-01-01', // Use current date
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})
```

Dashboard creates client at `apps/dashboard/src/app/libs/sanity.ts`. Use `api/cms` for shared queries.

### Fetching Campaigns

Standard pattern in both dashboard and template:

```typescript
const campaigns = await sanity.fetch(`*[_type == "micrositeCampaign"]`)
const campaign = await sanity.fetch(`*[_type == "micrositeCampaign" && slug.current == $slug][0]`, {
  slug,
})
```

### Shopify GraphQL

Uses `graphql-request` with Storefront API (`packages/api/shopify.ts`):

```typescript
const client = new GraphQLClient(`https://${SHOPIFY_DOMAIN}/api/2025-10/graphql.json`, {
  headers: {'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN},
})
```

**Key functions**: `getProductsByIds()` (converts IDs to `gid://shopify/Product/{id}` format), cart URL generation

**Image handling**: Shopify product images require Next.js config with `cdn.shopify.com` in `remotePatterns` (see `apps/microsite-template/next.config.ts`)

## Tech Stack

- **Frameworks**: Next.js 15.5 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components (dashboard only)
- **CMS**: Sanity 4.19
- **Build**: Turbo 2.5, pnpm 9.12
- **UI**: Radix UI primitives, `lucide-react` icons

## Common Patterns

1. **Turbopack enabled**: All Next.js scripts use `--turbopack` flag
2. **Module aliases over relative imports**: Use `api/cms` not `../../../packages/api/cms`
3. **Server components by default**: All page components are async RSC
4. **Type-safe Sanity schemas**: Use `defineType()` and `defineField()` from `sanity`
5. **Custom preview logic**: Define `preview.select` and `preview.prepare` for document types

## File Naming

- React components: PascalCase (e.g., `CampaignsList.tsx`)
- Utilities/API: camelCase (e.g., `defineStructure.ts`)
- Sanity schema files: camelCase with "Type" suffix for objects (e.g., `heroType.tsx`)
- Sanity documents: camelCase without suffix (e.g., `micrositeCampaign.ts`)

## When Adding New Features

1. **New Sanity content type**: Add to `/schemaTypes/`, export in `index.ts`, optionally add structure builder
2. **New module**: Create in `/schemaTypes/objects/module/`, follow existing patterns (hero, callout)
3. **Shared API logic**: Add to `packages/api/` and use via path alias
4. **Dashboard page**: Use App Router conventions in `src/app/(pages)/`
5. **Cross-workspace dependencies**: Leverage TypeScript path aliases, avoid direct `import '../../packages'`
