# Two Days, One `D1_ERROR`: Debugging Drizzle + D1 Migrations in `@cloudflare/vitest-pool-workers`

If you're building on Astro + Cloudflare Workers with D1 and Drizzle, and your integration tests are throwing `D1_ERROR: no such table: site: SQLITE_ERROR` — sit down, this one took me two full days, and the fix touches three completely different layers of the stack.

## The Setup

The stack: an Astro app deployed to Cloudflare Workers/Pages, Drizzle ORM talking to D1, and `@cloudflare/vitest-pool-workers` for repository-level integration tests. The test itself was simple — provision an isolated in-memory D1 instance, insert a row via the repository layer, assert it came back.

```ts
describe("Website repository integration test", () => {
    it("should create a new site", async () => {
        const db = getDb(env);
        const createdSite = await siteRepository.create(db, {
            title: "My Production Analytics App",
            url: "https://trackflow.dev",
            isActive: true,
        });
        expect(createdSite).toBeDefined();
    });
});
```

Pool runner spins up a clean D1 database. Great. Except... it's *empty*. No tables. No schema. Every insert dies with:

```
D1_ERROR: no such table: site: SQLITE_ERROR
```

## Attempt #1: "I'll just call `migrate()`"

My first instinct was the obvious one — Drizzle ships a `migrate()` function, just call it in `beforeAll` with `path.resolve(__dirname, "./drizzle")` and apply the schema before the tests run.

That instinct is *wrong*, and the error message makes it very clear why: the test file runs **inside the `workerd` sandbox**, not Node. There's no real filesystem in there. `path`, `__dirname`, `fs.readFileSync` — none of it resolves the way you'd expect, because this isn't Node executing your test, it's a Workers runtime pretending to be one.

## Attempt #2: The Idiomatic Split

After digging through Cloudflare's Vitest integration docs, the actual pattern clicked: **split the work across the Node/worker boundary**.

- **Node side** (`vitest.config.ts`, inside `cloudflareTest()`): use `readD1Migrations(migrationsPath)` to read your `./drizzle/*.sql` files off disk — this runs in real Node, so `fs` works fine. It returns a plain array of migration objects.
- **Inject that array as a test-only binding** (`TEST_MIGRATIONS`) via Miniflare's `bindings` config.
- **Worker side** (a `setupFiles` entry): call `applyD1Migrations(env.DB, env.TEST_MIGRATIONS)` from `cloudflare:test` — no filesystem needed, it just runs the SQL that was already read on the Node side.

```ts
cloudflareTest(async () => {
    const migrationsPath = path.join(__dirname, "drizzle");
    const migrations = await readD1Migrations(migrationsPath);

    return {
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: { bindings: { TEST_MIGRATIONS: migrations } },
    };
}),
```

```ts
// src/test/apply-migrations.ts
import { applyD1Migrations, env } from "cloudflare:test";
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
```

Ran the tests. Still `no such table: site`. **Same error.**

## Attempt #3: The Missing Plumbing

Turns out I'd written `apply-migrations.ts`... and never told Vitest to actually run it. `setupFiles: ["./src/test/apply-migrations.ts"]` was missing from the `server-workers` project's `test` block. The migrations were being read correctly on the Node side, packaged into `TEST_MIGRATIONS` correctly — and then just sitting there, never applied, because the setup file that would've applied them was never executed.

One line fixed it:

```ts
test: {
    name: "server-workers",
    globals: true,
    include: ["**/__tests__/**/*.ts"],
    setupFiles: ["./src/test/apply-migrations.ts"], // <-- this was the whole problem
},
```

Ran it again. **The repository test passed.** First real win in two days.

## Attempt #4: Wait, Now I Have 8 New Errors?

Victory was short-lived. The single failing test now passed — but the run still exited `FAIL`, with **8 unhandled promise rejections**, one per test file in the `server-workers` project:

```
CompileError: WebAssembly.compile(): Wasm code generation disallowed by embedder
 ❯ dist/_worker.js/chunks/astro-designed-error-pages_oViR-boZ.mjs
 ❯ dist/_worker.js/chunks/_@astrojs-ssr-adapter_CC5PGjdZ.mjs
```

Every single test file — including ones that had *nothing to do with the database* — was somehow loading my **entire compiled production Astro SSR bundle** (`dist/_worker.js`), which contains a dependency that compiles WebAssembly at runtime. `workerd`'s test sandbox flat-out refuses dynamic Wasm compilation for security reasons, so this blew up every time, asynchronously, after each test file finished.

## The Root Cause: `main` Was Inherited From `wrangler.jsonc`

The smoking gun was sitting in plain sight in `wrangler.jsonc`:

```jsonc
{
    "main": "dist/_worker.js/index.js",
    "assets": { "binding": "ASSETS", "directory": "./dist" }
}
```

`cloudflareTest()` accepts a `main` option for the worker entrypoint used by the test runner. If you don't set it, and you *do* pass `wrangler.configPath`, it falls back to whatever `main` is defined there — which, for a deployed Astro app, is your full production SSR bundle, wasm-compiling dependencies and all. Every test isolate was booting up the *entire app* just to get access to a D1 binding.

## The Final Fix: A Stub Worker for `main`

The fix was almost embarrassingly small. Repository tests don't need the real Astro `fetch` handler — they call `siteRepository.create(db, ...)` directly via `getDb(env)`. So give the test pool a throwaway entrypoint instead:

```ts
// src/test/test-worker.ts
export default {
  async fetch() {
    return new Response("test worker");
  },
} satisfies ExportedHandler<Env>;
```

```ts
cloudflareTest(async () => {
    const migrationsPath = path.join(__dirname, "drizzle");
    const migrations = await readD1Migrations(migrationsPath);

    return {
        main: "./src/test/test-worker.ts", // <-- the actual fix
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: { bindings: { TEST_MIGRATIONS: migrations } },
    };
}),
```

`wrangler.configPath` still supplies the `DB` binding, compatibility date/flags, and `ASSETS` binding — only the entrypoint script changes. Ran the suite one more time:

```
 Test Files  8 passed | 1 skipped (9)
      Tests  46 passed (46)
 PASS  Waiting for file changes...
```

Clean. Zero unhandled rejections. Exit code `PASS`.

## What Actually Went Wrong (Recap)

Three independent issues, stacked on top of each other:

1. **`migrate()` doesn't work in `workerd`** — no filesystem, so reading `.sql` files at test-runtime is a non-starter. Solution: read migrations in Node (`readD1Migrations`), apply them in the worker (`applyD1Migrations`) via a `TEST_MIGRATIONS` binding.
2. **A missing `setupFiles` entry** meant the migration-application step never ran at all, despite all the plumbing being correct.
3. **An inherited `main`** from `wrangler.jsonc` was loading the entire production SSR bundle — including a wasm-compiling Astro adapter chunk that `workerd` refuses to run — into every test isolate.

None of these errors pointed directly at their cause. `no such table` looked like a migrations problem (it was, partially). The wasm `CompileError` looked like a dependency/bundling problem (it wasn't — it was a config inheritance problem). If you're hitting any of these, check `setupFiles` and your `main` override *before* you start questioning your Drizzle schema.