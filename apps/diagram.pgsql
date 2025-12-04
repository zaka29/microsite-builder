      ┌──────────────────────────┐
      │  Shopify Admin (Merchant)│
      │  Opens Your App Dashboard│
      └─────────────┬────────────┘
                    │
                    ▼
      ┌──────────────────────────┐
      │  Shopify App Dashboard   │
      │  (Next.js: Embedded App) │
      └─────────────┬────────────┘
             User presses
           “Publish Microsite”
                    │
                    ▼
      ┌───────────────────────────┐
      │ Your App Backend / API    │
      │ Node / Next.js API Routes │
      └─────────────┬─────────────┘
    Fetch latest CMS data from Sanity
                    │
                    ▼
      ┌───────────────────────────┐
      │ Build System Trigger      │
      │ (Vercel, Netlify, or CI)  │
      └─────────────┬─────────────┘
      Pull template + inject CMS data
                    │
              Build Microsite
                    │
                    ▼
      ┌──────────────────────────┐
      │ Deploy to Hosting        │
      │ (Vercel / Netlify / S3)  │
      └─────────────┬────────────┘
                    │
       Optionally assign / update domain
                    │
                    ▼
      ┌──────────────────────────┐
      │ Live Microsite           │
      │ e.g. https://brand.com/  │
      └──────────────────────────┘
