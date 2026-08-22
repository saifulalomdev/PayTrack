# 📜 Messrs. Madina Enterprise Coding Standards

This document defines the strict rules for writing clean, consistent, and scalable code in the **Messrs. Madina Enterprise** project. All developers and AI collaborators must adhere to these standards.

---

## 1. Directory Structure & File Naming

Maintain modular feature-based organization inside `src/modules/<feature-name>/`.

### File Naming Conventions
* Use `kebab-case` for all source files.
* Every module **MUST** adhere to this file structure:
  * `index.ts` — Barrel exports for schemas, types, and actions/services.
  * `<feature>-table.ts` — Drizzle ORM table definitions.
  * `<feature>-types.ts` — TypeScript type definitions (`Select`, `Insert`, `Public`, etc.).
  * `<feature>-schema.ts` — Zod validation schemas for forms, actions, and API inputs.
  * `<feature>-repository.ts` — Database queries only (Drizzle ORM).
  * `<feature>-service.ts` — Business logic, authorization assertions, and orchestration.
  * `<feature>-actions.ts` — Astro Actions (handling client requests, cookies, and responses).

---

## 2. Architecture & Layer Separation

Strict unidirectional data flow: **Action → Service → Repository → Database**.


```

[ Client / UI ] ──> [ Actions ] ──> [ Service Layer ] ──> [ Repository Layer ] ──> [ D1 DB ]

```

### Layer Responsibilities

1. **Actions Layer (`*-actions.ts`)**
   * Validates input using Zod schemas.
   * Resolves context (auth guards like `requireAdmin`, cookies, headers).
   * Calls the Service Layer. Never query repositories or D1 directly inside actions.
   * Returns consistent JSON response objects `{ success: boolean, message?: string, data?: T }`.

2. **Service Layer (`*-service.ts`)**
   * Implements business logic, validation rules, state transitions, and authorization checks.
   * Throws `ActionError` with appropriate HTTP status codes (`BAD_REQUEST`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`).
   * Never leaks raw infrastructure or internal domain objects (e.g., password hashes).

3. **Repository Layer (`*-repository.ts`)**
   * Handles database access using Drizzle ORM exclusively.
   * **Zero Business Logic**: Repositories must not contain domain checks or throw business errors.
   * **Data Sanitization**: Automatically strip sensitive fields (e.g., `password`) from database return payloads to return `Public<Entity>` types by default.

---

## 3. Mandatory Repository Interface

Every feature repository **MUST** implement the following core standard methods where applicable:

* `list(db, limit, offset)`: Returns `{ items: PublicEntity[], totalCount: number }`.
* `findById(db, id)`: Returns a single record or `null`.
* `create(db, data)`: Inserts and returns the sanitized record.
* `update(db, id, data)`: Updates and returns the sanitized record.
* `deleteById(db, id)`: Deletes and returns the sanitized record.
* `findAll(db)`: Returns all sanitized records without pagination.

### Database Query Rules
* **Aggregates**: Always wrap Drizzle aggregate outputs (e.g., `count()`, `sum()`) in `Number(...)` to prevent TypeScript `BigInt` string conversion issues.
* **Pagination**: Default limits to `10` or `20`, with an `offset` starting at `0`.
* **Ordering**: Default queries to explicit sorting (e.g., `.orderBy(desc(table.createdAt))`).

---

## 4. Zod Schemas & Type Safety

* **Input Sanitization**: Always apply `.trim()` on text fields (`name`, `email`, `phoneNumber`).
* **Bangladeshi Mobile Format**: Standardize phone number fields with regex validation:

```typescript
  z.string().trim().regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন")

```

* **Optional Field Updates**: Transform empty string values `""` into `undefined` in update schemas so defaults or existing database values are not accidentally overwritten:

```typescript
password: passwordRule.or(z.literal("")).transform((val) => (val === "" ? undefined : val)).optional()

```


* **Explicit Type Exports**: Derive TypeScript types strictly from Zod or Drizzle schemas in `*-types.ts`:
```typescript
export type SelectStaff = typeof staffTable.$inferSelect;
export type PublicStaff = Omit<SelectStaff, "password">;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type UpdateStaff = z.infer<typeof updateStaffSchema>;

```



---

## 5. Error Handling & Internationalization

* **Consistent Error Class**: Throw `ActionError` from `astro:actions` across services and actions.
* **Bengali User Messages**: End-user failure messages must be clear, actionable, and written in standard Bengali.
* **English Code/Logs**: System code, log messages, variable names, and documentation must remain strictly in English.

---

## 6. Code Formatting Rules

* **End of File**: All files must end with a single blank newline.
* **Imports Order**: Group imports logically:
1. External modules (`astro:actions`, `zod`, `drizzle-orm`)
2. Internal utilities (`@/utils`)
3. Local module files (`./staff-types`, `./staff-repository`)


* **Strict Monomorphism**: Avoid using `any` types. Use explicit Zod schema inference or generic type parameters.