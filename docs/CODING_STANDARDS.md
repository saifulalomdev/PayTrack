# 📜 Messrs. Madina Enterprise Coding Standards

This document defines the rules for writing clean, consistent, and scalable code in the **Messrs. Madina Enterprise (m-m-enterprise.com)** project. All developers and AI assistants must follow these rules.

---

## 1. Tech Stack & Architecture

* **Framework**: Astro (Server-side rendering)
* **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
* **Backend Logic**: Edge-native TypeScript with Cloudflare Workers
* **UI & Styling**: React, Tailwind CSS, and shadcn/ui components

---

## 2. Directory & Module Structure

Each feature lives inside its own folder in `src/modules/<feature-name>`:

* `components/`: UI components for this feature.
* `*-table.ts`: Drizzle ORM database schema definition.
* `*-types.ts`: TypeScript interfaces and types.
* `*-schema.ts`: Zod validation schemas.
* `*-repository.ts`: Database queries only (no business logic).
* `*-service.ts`: Business logic and data transformations.
* `*-actions.ts`: Server actions, input validation, and permissions.

---

## 3. Database Rules (`*-table.ts`)

* **Primary Keys**: Always use UUID strings generated with `generateUUID()`.
* **Timestamps**: Store all dates as **Unix timestamps in milliseconds** (`Date.now()`).
* **Foreign Keys**: Always define explicit delete behavior (for example: `onDelete: "cascade"`).

---

## 4. Repository Rules (`*-repository.ts`)

Repositories handle database operations. Do not write business logic inside repository files.

Every module repository MUST implement these core methods:

* `list(db, limit, offset)`: Returns `{ items, totalCount }`.
* `findById(db, id)`: Returns a single record or `null`.
* `create(db, data)`: Inserts a new record.
* `update(db, id, data)`: Updates an existing record.
* `deleteById(db, id)`: Deletes a record by ID.
* `findAll(db)`: Returns all records.

**Query Rules:**
* Always wrap Drizzle aggregate results (like `sum()`) in `Number(...)` to prevent TypeScript type errors.
* Use the local timezone (`Asia/Dhaka`) when formatting dates with SQL functions like `strftime`.

---

## 5. Service Rules (`*-service.ts`)

Services handle business rules, data calculations, and query coordination.

Every module service MUST implement these standard methods:

* `getAll(db, page, limit)`: Returns data along with a standard `pagination` object.
* `getOne(db, id)`: Fetches a single item and checks business rules.
* `createNew(db, payload)`: Validates rules and creates data.
* `updateExisting(db, id, payload)`: Validates rules and updates data.
* `remove(db, id)`: Manages deletion rules and dependency checks.

---

## 6. UI & Pagination Rules

* **URL-Based Pagination**: Control page state using URL search parameters (for example: `?page=1&limit=10`).
* **Server Fetching**: Fetch data inside Astro page files (`.astro`) on the server side using `safeFetch`.
* **Component Reuse**: Use shadcn/ui components from `@/components/ui/` for tables, buttons, and form elements.