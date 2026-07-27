# ⚡ TrackFlow

TrackFlow is an open-source, privacy-first, edge-native web analytics platform available at [trackflow.saifulalom.com](https://trackflow.saifulalom.com). Rebuilt as a unified, high-performance architecture on top of **Astro and Astro API Routes**, TrackFlow records visits, unique users, traffic sources, and conversions via a lightweight script without tracking cookies or heavy client-side overhead.

![TrackFlow Open Source Analytics Dashboard Preview](/public/thumbnail.png)
---

## 🗺️ Live Ecosystem & Source Code


## 🗺️ Live Ecosystem & Source Code

| Platform | Role | Live Demo | Source Code |
|---|---|---|---|
| **Landing page** | Application Hub | [Visit Site](https://trackflow.saifulalom.com) | [GitHub](https://github.com/saifulalomdev/track-flow) |

---

## ⚡ Performance & Accessibility

We care deeply about user experience, speed, and accessibility. TrackFlow is fully optimized to achieve perfect scores across all core web metrics:

| Metric | Score | Status |
| :--- | :---: | :---: |
| 🚀 Performance | **100/100** | ✅ Passed |
| ♿ Accessibility | **100/100** | ✅ Passed |
| 🛡️ Best Practices | **100/100** | ✅ Passed |
| 🔍 SEO | **100/100** | ✅ Passed |

### PageSpeed Insights Audit
Below is our latest desktop core vitals audit showing a clean sweep:

[![TrackFlow PageSpeed Insights Audit Score](/public/pagespeed-insights.png)](https://pagespeed.web.dev/analysis/https-features-trackflow-8il-pages-dev/hs2w77n7ny?form_factor=desktop)

_Audit captured on June 4, 2026 via Google Lighthouse._

---

## 🛠️ Tech Stack & Architecture

TrackFlow is built using an **Edge-Native Minimalist Architecture** designed for 100/100 Lighthouse performance scores and sub-millisecond edge processing:

* **Framework:** Astro (Unified SSR Frontends & Type-Safe API Routes)
* **Frontend Components:** React, Tailwind CSS, Lucide Icons
* **Schema Validation:** Zod
* **Database Engine:** Cloudflare D1 (Distributed SQLite at the Edge)
* **Object-Relational Mapping:** Drizzle ORM (Schema-First Type Pipelines)
* **Testing Runner:** Vitest (In-Memory `better-sqlite3` and `jsdom` runtimes)

---

## 📊 Dashboard Metrics & Visual Components

The TrackFlow dashboard gives developers and digital businesses a scannable overview of their traffic metrics without bloating client tracking payloads.

### Core Metrics Covered
* **Total Traffic:** Aggregated session network volumes.
* **Bounce Rate:** Single-page bounces without interactions.
* **Avg. Session Duration:** High-accuracy real-time reading duration metrics.
* **Conversion Rate:** Goal completions tracked via micro-event pixels.

### Component Architecture
The layout decomposes into modular, decoupled component lanes:
* `<DashboardStatsGrid />` — Higher metric summary layout rows.
* `<TrafficTrendsChart />` — Visualizes *Network Hit Volumes* with smart timeline aggregation.
* `<DevicesCard />` — High-accuracy browser, engine, and platform footprints.
* `<DashboardReferrerList />` — Clean referrer origin domain stripping.
* `<PageviewsCard />` — Top performing URL node lists.
* `<TrafficMap />` — Global geographic distribution mappings.

---

## 📂 Project Structure

```text
src/
├── components/          # React components (Charts, Cards, Maps, UI)
├── db/                  # Drizzle ORM schema definitions and migrations
│   ├── schema/          # Table definitions and TypeScript relationships
│   └── migrations/      # D1 SQL migration scripts
├── lib/                 # Core system configurations and DB client initialization
├── modules/             # Domain-driven feature sets
│   └── dashboard/       # Dashboard module (Components, libs, actions, hooks)
│       └── __tests__/   # Complete Vitest Unit & Integration suite
└── pages/               # SSR pages and Astro API routes (pixel ingestion)

public/
└── pixel.js             # High-performance tracking script snippet

```

---

## 💻 Local Development

### Prerequisites

* Node.js 18+
* pnpm (Workspace runner)
* Wrangler CLI (Authenticated to your Cloudflare ecosystem)

### 1. Installation & Environment Cloning

```bash
git clone [https://github.com/saifulalomdev/track-flow.git](https://github.com/saifulalomdev/track-flow.git)
cd track-flow
pnpm install

```

### 2. Database Migrations (Local Schema Setup)

Generate your SQL migration assets and execute them against your local sandbox instance:

```bash
pnpm run db:generate
pnpm run db:migrate

```

### 3. Running the Application Locally

Boot your local dev environment:

```bash
pnpm dev

```

---

## 🧪 Test Suite

TrackFlow features 100% code coverage across core utilities and UI logic using Vitest.

```bash
# Execute the full test runner suite (Utils, DOM Cards, Path Resolvers)
pnpm test

# Run tests in continuous file watch mode during active development
pnpm test:watch

```

---

## 🚀 Deployment

TrackFlow runs completely within Cloudflare's edge runtime environment. To provision your database properties and compile your Astro build targets:

```bash
# 1. Generate local Cloudflare type-safety files
pnpm cf-types

# 2. Apply your schema migrations directly to your production Cloudflare D1 Database
pnpm db:migrate

# 3. Build the Astro optimization bundle
pnpm build

```

---

## 🏗️ Architectural Philosophy & Lessons Learned

* **Crash-Only Software:** Designed around type-safe data pipelines where corrupt inputs or failing network dependencies fail early and cleanly without side effects.
* **Privacy-First Tracking:** Bypasses cookie banners completely by performing host-stripping calculations at the edge without recording Personally Identifiable Information (PII).
* **Zero Overhead Monoliths:** Rebuilding from independent edge microservices to a single unified Astro project improved developer velocity while keeping Cold Starts near 0ms.

---

## 📬 Contact

Built by **Saiful Alom** — Edge Architecture & Distributed Systems Specialist.

* **GitHub:** [@saifulalomdev](https://github.com/saifulalomdev)
* **Portfolio:** [saifulalom.com](https://saifulalom.com)
* **TrackFlow Hub:** [trackflow.saifulalom.com](https://trackflow.saifulalom.com)