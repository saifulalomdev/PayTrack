---
name: module-generator
description: Scaffold a complete backend+frontend module (Drizzle table, Zod schema, types, repository, service, Astro Actions, React components, and Astro pages) for this project's stack. Use this whenever the user gives a data table/entity description (columns, types, constraints) and asks to "create a module", "add a new feature/entity", "create CRUD for X", or shows a table shape and says "now build X like Y". Also trigger if the user pastes an existing module (staff, customer, etc.) as a reference and asks for a new one "like this". Do NOT ask the user to separately describe the service/action/component layer — that structure is fixed by this skill; only the entity's fields and permission rules need to come from the user, and even permissions default sensibly if unstated.
---

# Module Generator

This project follows one exact, repeatable module shape everywhere: **table → schema → types → repository → service → actions → components → pages**. Given a table definition (or even just a rough field list), generate every layer below in one pass, without asking the user to spell out the service/action/component structure — that part is fixed convention, not something to elicit.

Only ask a clarifying question if the **permission model** is genuinely ambiguous (see "Permission model" below) — everything else has a sane default derived from this codebase's existing modules (`staff`, `customer`).

## Stack assumptions (fixed — don't ask about these)

- **Framework**: Astro, with server logic in Astro Actions (`astro:actions`, `defineAction`)
- **DB**: Cloudflare D1 (SQLite) via Drizzle ORM (`drizzle-orm/sqlite-core`)
- **Validation**: `drizzle-zod` (`createInsertSchema` / `createSelectSchema`) + `zod`
- **Frontend**: React components (`.tsx`) rendered from `.astro` pages with `client:load`, using shadcn/ui primitives (`Button`, `Input`, `Label`, `Card`, `DropdownMenu`, `AlertDialog`, `Select`) and `lucide-react` icons
- **Forms**: `react-hook-form`, driven by a `useFormAction` hook that already exists in the project (`@/hooks/use-form-action`), and a `useAction` hook for non-form actions like delete (`@/hooks/use-action`)
- **UI copy language**: Bangla (বাংলা) for all user-facing strings — labels, placeholders, buttons, toasts, error messages. Code (variable/function/file names, comments) stays in English.
- **Auth guards**: `@/utils/auth-guards` exports `requireAuth(context)` (any logged-in staff) and `requireAdmin(context)` (admin role only). Both throw `ActionError` and return `context.locals.staff`.
- **Utilities that already exist** — reuse, don't recreate: `generateUUID` and `generateUnixTimestamp` from `@/utils` / `@/utils/generate-timestamp`, `D1Instance` type from `@/utils`, `getDb(env)` from `@/utils`, `safeFetch` from `@/utils/safe-fetch`, `PageHeader` from `@/components/ui/page-header`, `ErrorAlert` from `@/components/ui/error-alert`.

## Step 1 — Get the entity definition

From the user's message, extract:
- **Entity name** (singular, e.g. `customer`, `product`, `invoice`) → drives file names, table name (`{entity}Table`), variable names.
- **Fields**: name, SQLite type (`text` / `integer` / `real`), nullability, uniqueness, defaults.
- Note which fields are **system-generated** (never client input): `id` (uuid), `createdAt` (unix timestamp), and any "snapshot" field that must survive even if its source record is deleted (see the `createdByName` pattern below — apply this same idea any time a field would otherwise be a foreign key to a table whose rows can be deleted, e.g. `updatedByName`, `approvedByName`).
- Note which fields are **manually entered but must stay unique** (like `serialNumber` on `customer` — unique, not auto-generated, validated at the service layer with a "find by X" existence check before insert).

If the user gives you a rough plain-English field list instead of a formal table, translate it into typed columns yourself using the conventions below — don't ask them to formalize it first.

## Step 2 — Permission model (only ask if ambiguous)

Default assumption, based on the existing `staff` (full CRUD, admin-only) and `customer` (staff can create+view, admin-only edit/delete) modules — pick whichever matches what the user described, defaulting to **Option B** if the user hasn't said anything:

- **Option A — Admin-only everything** (like `staff`): every action (`create`, `update`, `delete`, list/get) uses `requireAdmin`.
- **Option B — Staff can create+view, admin can edit+delete** (like `customer`): `create`, `listAll`/`getById` use `requireAuth`; `update`, `delete` use `requireAdmin`. This is the more common shape for "records staff enter but shouldn't be able to tamper with afterward" (customers, orders, entries, logs).
- **Option C — Fully open to any staff** (rare): everything uses `requireAuth`.

Only ask the user directly if their description doesn't map cleanly to one of these (e.g. they mention a role beyond `admin`/`staff`, or want per-owner permissions like "staff can only edit their own records").

## Step 3 — Generate the files

Create these seven files under `src/modules/{entity}/` (plus pages under `src/pages/{entity}/`). Substitute `{Entity}` (PascalCase), `{entity}` (camelCase), `{entity_table}` (snake_case table name if different from camelCase) throughout. Below is the exact template for each layer, annotated with what to adapt.

### 3.1 `{entity}.table.ts`

```typescript
// src/modules/{entity}/{entity}.table.ts
import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const {entity}Table = sqliteTable('{entity}Table', {
  id: text('id').primaryKey().$defaultFn(generateUUID),

  // ...map each user-given field to a column here, using snake_case column
  // names (Drizzle convention in this repo: camelCase in TS, snake_case in
  // the actual SQL column). Add .unique() where the field must be unique.
  // Add a short comment on any field whose purpose isn't obvious from its
  // name (mirror the tone of the "snapshot, not a foreign key" comment
  // used for created_by_name in the customer module).

  createdAt: integer('created_at').notNull().$defaultFn(generateUnixTimestamp),
});
```

Rules:
- `id`, `createdAt` always present, always system-generated, exactly as shown.
- Money-like fields: `integer`, no decimals, matching the existing convention (whole-currency-unit integers).
- Date/deadline fields: `integer` storing a unix timestamp (seconds), never a `text` date string — the frontend form converts at the boundary (see 3.6).
- Any "who did this" field: `text`, plain snapshot column, **not** a foreign key — add the same disclaimer comment as `createdByName` in the customer module.

### 3.2 `{entity}.schema.ts`

```typescript
// src/modules/{entity}/{entity}.schema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { {entity}Table } from "./{entity}.table";
import z from "zod";

const RULES = {
    // one entry per field that needs a custom validation rule/message
}

// Base insert shape. Any server-injected field (snapshot "who did this"
// fields, or anything else that must never come from client input) is
// omitted here — never trusted from client input. The action layer fills
// it in from the authenticated staff's session.
const base{Entity}Schema = createInsertSchema({entity}Table, {
    // one entry per field needing a custom rule, using Bangla messages,
    // e.g.:
    // name: (s) => s.min(RULES.name, `নাম কমপক্ষে ১ অক্ষরের হতে হবে`),
}).omit({
    createdAt: true,
    // ...omit any other server-injected snapshot fields here too
});

export const insert{Entity}Schema = base{Entity}Schema.extend({
    id: base{Entity}Schema.shape.id.optional(),
});

// UPDATE: admin-only (enforced in the action layer via requireAdmin, if
// this entity uses Option A or B). Everything optional EXCEPT id.
export const update{Entity}Schema = base{Entity}Schema.partial().extend({
    id: z.string(),
});

export const select{Entity}Schema = createSelectSchema({entity}Table);
```

If the entity has a password-like sensitive field (rare outside `staff`), follow the `staff.schema.ts` pattern instead: keep it out of `base{Entity}Schema` entirely, define a separate `{field}Rule` with min/max length, and `.extend()` it into both insert and update schemas with different requiredness (required on insert, optional on update).

### 3.3 `{entity}.types.ts`

```typescript
// src/modules/{entity}/{entity}.types.ts
import { z } from "zod";
import { insert{Entity}Schema, select{Entity}Schema, update{Entity}Schema } from "./{entity}.schema";

export type Insert{Entity} = z.infer<typeof insert{Entity}Schema>;
export type Select{Entity} = z.infer<typeof select{Entity}Schema>;
export type Update{Entity} = z.infer<typeof update{Entity}Schema>;

/**
 * Public{Entity} is the client-facing shape — identical to Select{Entity}
 * unless the entity has a sensitive field (e.g. a password hash), in
 * which case strip it here the way PublicStaff strips `password`.
 */
export type Public{Entity} = Select{Entity}; // or Omit<Select{Entity}, "sensitiveField">

// Only needed if the entity has server-injected fields omitted from
// Insert{Entity} (see 3.2). Represents the full row the repository
// actually writes. Name each injected field explicitly.
export type New{Entity} = Insert{Entity} & { /* e.g. createdByName: string */ };
```

### 3.4 `{entity}.repository.ts`

```typescript
// src/modules/{entity}/{entity}.repository.ts
import { D1Instance } from "@/utils";
import { desc, eq } from "drizzle-orm";
import { Insert{Entity}, New{Entity}, Select{Entity} } from "./{entity}.types";
import { {entity}Table } from "./{entity}.table";

export const {entity}Repository = {
  async create(db: D1Instance, data: New{Entity}): Promise<Select{Entity}> {
    const [new{Entity}] = await db.insert({entity}Table).values(data).returning();
    return new{Entity};
  },

  async update(db: D1Instance, id: string, data: Partial<Insert{Entity}>): Promise<Select{Entity}> {
    const [updated{Entity}] = await db.update({entity}Table).set(data).where(eq({entity}Table.id, id)).returning();
    return updated{Entity};
  },

  async delete(db: D1Instance, id: string): Promise<Select{Entity}> {
    const [deleted{Entity}] = await db.delete({entity}Table).where(eq({entity}Table.id, id)).returning();
    return deleted{Entity};
  },

  async findById(db: D1Instance, id: string): Promise<Select{Entity} | null> {
    const [row] = await db.select().from({entity}Table).where(eq({entity}Table.id, id)).execute();
    return row || null;
  },

  // Add one findByX per unique field (mirrors findByPhoneNumber /
  // findBySerialNumber) — needed for pre-insert/update uniqueness checks.

  async findAll(db: D1Instance): Promise<Select{Entity}[]> {
    const records = await db.select().from({entity}Table).orderBy(desc({entity}Table.createdAt)).execute();
    return records || [];
  },
};
```

If create doesn't need a `New{Entity}` type (no server-injected fields), use `Insert{Entity}` directly in `create`'s signature instead.

### 3.5 `{entity}.service.ts`

```typescript
// src/modules/{entity}/{entity}.service.ts
import { ActionError } from "astro:actions";
import type { D1Instance } from "@/utils";
import { {entity}Repository } from "./{entity}.repository";
import type { Insert{Entity}, New{Entity}, Update{Entity}, Select{Entity}, Public{Entity} } from "./{entity}.types";

function toSafe{Entity}(row: Select{Entity}): Public{Entity} {
    // If there's a sensitive field, destructure it out here, as in
    // staffService.toSafeStaff. Otherwise this is a pass-through.
    return row;
}

export const {entity}Service = {
    async create{Entity}(
        db: D1Instance,
        input: Insert{Entity},
        // add extra params here for any server-injected field, e.g. createdByName: string
    ): Promise<Public{Entity}> {
        // uniqueness check(s) for any unique-but-manual field, Bangla CONFLICT message
        const new{Entity} = await {entity}Repository.create(db, { ...input /*, createdByName */ });
        return toSafe{Entity}(new{Entity});
    },

    // Only include update/delete if permission Option A or B applies —
    // role enforcement itself belongs in the action layer, not here.
    async update{Entity}(db: D1Instance, id: string, input: Update{Entity}): Promise<Public{Entity}> {
        const existing = await {entity}Repository.findById(db, id);
        if (!existing) {
            throw new ActionError({ code: "NOT_FOUND", message: "{বাংলায় এন্টিটির নাম} পাওয়া যায়নি।" });
        }
        // re-check uniqueness if a unique field changed
        const updated = await {entity}Repository.update(db, id, input);
        return toSafe{Entity}(updated);
    },

    async delete{Entity}(db: D1Instance, id: string): Promise<Public{Entity}> {
        const existing = await {entity}Repository.findById(db, id);
        if (!existing) {
            throw new ActionError({ code: "NOT_FOUND", message: "{বাংলায়} পাওয়া যায়নি।" });
        }
        const deleted = await {entity}Repository.delete(db, id);
        return toSafe{Entity}(deleted);
    },

    async listAll(db: D1Instance): Promise<Public{Entity}[]> {
        const rows = await {entity}Repository.findAll(db);
        return rows.map(toSafe{Entity});
    },

    async getById(db: D1Instance, id: string): Promise<Public{Entity} | null> {
        const row = await {entity}Repository.findById(db, id);
        return row ? toSafe{Entity}(row) : null;
    },
};
```

### 3.6 `{entity}.actions.ts`

```typescript
// src/modules/{entity}/{entity}.actions.ts
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { {entity}Service } from "./{entity}.service";
import { insert{Entity}Schema, update{Entity}Schema } from "./{entity}.schema";

// CREATE — guard depends on the permission model chosen in Step 2
export const create{Entity} = defineAction({
  accept: "json",
  input: insert{Entity}Schema,
  handler: async (input, context) => {
    const staff = requireAuth(context); // or requireAdmin for Option A
    const db = getDb(env);
    const new{Entity} = await {entity}Service.create{Entity}(db, input /*, staff.name */);
    return { success: true, message: "{বাংলায়} সফলভাবে যোগ করা হয়েছে!", data: new{Entity} };
  },
});

// LIST / GET — same guard as create, unless the model restricts viewing too
export const list{Entity}s = defineAction({
  accept: "json",
  handler: async (_, context) => {
    requireAuth(context);
    const db = getDb(env);
    return { success: true, data: await {entity}Service.listAll(db) };
  },
});

export const get{Entity} = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);
    const db = getDb(env);
    const row = await {entity}Service.getById(db, input.id);
    if (!row) throw new ActionError({ code: "NOT_FOUND", message: "{বাংলায়} পাওয়া যায়নি।" });
    return { success: true, data: row };
  },
});

// UPDATE / DELETE — requireAdmin for Options A and B; requireAuth for Option C
export const update{Entity} = defineAction({
  accept: "json",
  input: update{Entity}Schema,
  handler: async (input, context) => {
    requireAdmin(context);
    if (!input.id) throw new ActionError({ code: "BAD_REQUEST", message: "আইডি প্রয়োজন।" });
    const db = getDb(env);
    const row = await {entity}Service.update{Entity}(db, input.id, input);
    return { success: true, message: "{বাংলায়} সফলভাবে আপডেট করা হয়েছে!", data: row };
  },
});

export const delete{Entity} = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);
    const deleted = await {entity}Service.delete{Entity}(db, input.id);
    return { success: true, message: "{বাংলায়} সফলভাবে মুছে ফেলা হয়েছে।", data: deleted };
  },
});
```

Then register in `src/actions/index.ts` (`import * as {entity} from '@/modules/{entity}/{entity}.actions'`, add to the `server` object) and export the table from `src/db/index.ts`.

### 3.7 Components — `src/modules/{entity}/components/`

Generate all six, following these fixed shapes (see `staff`/`customer` for full reference implementations):

- **`form.tsx`** — generic `{Entity}Form<T>` taking `form`, `onSubmit`, `isLoading`. One `<Label>`+`<Input>`+error block per field, `register(...)` for plain text/number fields (`valueAsNumber: true` for numeric ones), `Controller` for anything needing transformation (a `Select` for enums, or date↔unix conversion via local `unixToDateInputValue`/`dateInputValueToUnix` helpers for deadline/date fields — never register a unix-timestamp field directly). Bangla labels/placeholders/buttons. Footer: a "cancel" link back to `/{entity}` plus a submit button showing a Bangla loading label.
- **`{entity}-empty-state.tsx`** — icon + Bangla heading + Bangla helper text + a button linking to `/{entity}/new`.
- **`card.tsx`** — `{Entity}Card` displaying the entity's fields with icons, badges for unique/short identifiers. If Option B or C permission model: accept an `isAdmin?: boolean` prop (default `false`) and wrap the entire actions dropdown (edit + delete + confirm dialog) in `{isAdmin && ...}`. If Option A: no `isAdmin` prop needed, actions always shown (page itself is admin-gated).
- **`manager.tsx`** — `{Entity}Manager` taking `errorMsg`, the list prop, and (if applicable) `isAdmin`; renders `PageHeader` + "add new" button + empty state or list of cards; wires `useAction(actions.{entity}.delete{Entity})` for delete.
- **`edit.tsx`** — `Edit{Entity}` using `useFormAction` with `update{Entity}Schema` and `actions.{entity}.update{Entity}`. Only build this if update is allowed for someone other than "no one".
- **`add.tsx`** — `AddNew{Entity}` using `useFormAction` with `insert{Entity}Schema` and `actions.{entity}.create{Entity}`, sensible empty `defaultValues`, redirect to `/{entity}` on success.

### 3.8 Pages — `src/pages/{entity}/`

- **`new.astro`** — guard matches whatever the create action requires (usually none beyond being logged in).
- **`index.astro`** — fetch via `{entity}Service.listAll` + `safeFetch`; if Option B, compute `const isAdmin = currentStaff.role === "admin"` once here and pass it into the manager — this is the single source of truth, components just render what they're told.
- **`[id]/edit.astro`** — only generate if update is allowed for someone. If it's admin-only (Option A/B), add a **server-side redirect** for non-admins before fetching data (`if (currentStaff.role !== "admin") return Astro.redirect("/{entity}")`) — don't rely on the UI hiding the edit button as the only gate; the action's own `requireAdmin` is a third, final layer.

## Step 4 — Sanity pass before handing back

- Every user-facing string is in Bangla; every identifier/comment is in English.
- Every server-injected field (snapshots, ids, timestamps) is impossible to set from client input — check it's omitted from `insert{Entity}Schema` AND absent from the action's `input` schema.
- Uniqueness is checked in the service layer before insert/update, with a Bangla `CONFLICT` message, exactly like `findByPhoneNumber`/`findBySerialNumber`.
- Permission checks exist at **two** layers minimum for anything restricted beyond "any logged-in staff": the action (`requireAdmin`) and, for edit/delete-restricted entities, also the page (server-side redirect) and the card (`isAdmin` prop hiding the control). Don't rely on just one.
- Don't invent new UI conventions, icon choices, or color tokens — match the existing shadcn/ui + lucide-react + Tailwind usage already in `staff`/`customer` components exactly, so new modules are visually indistinguishable from old ones.