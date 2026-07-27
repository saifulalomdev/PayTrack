// @ts-ignore
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    test: {
        projects: [
            {
                plugins: [
                    tsconfigPaths(),
                    cloudflareTest(async () => {
                        const migrationsPath = path.join(__dirname, "drizzle");
                        const migrations = await readD1Migrations(migrationsPath);

                        return {
                            main: "./src/test/test-worker.ts",
                            wrangler: { configPath: "./wrangler.jsonc" },
                            miniflare: {
                                bindings: { TEST_MIGRATIONS: migrations },
                            },
                        };
                    }),
                ],
                test: {
                    name: "server-workers",
                    globals: true,
                    include: ["**/__tests__/**/*.ts"],
                    setupFiles: ["./src/test/apply-migrations.ts"],

                },
            },
            {
                plugins: [tsconfigPaths()],
                test: {
                    name: "client-ui",
                    globals: true,
                    include: ["**/__tests__/**/*.tsx"],
                    environment: "jsdom",
                },
            },
        ],
    },
});