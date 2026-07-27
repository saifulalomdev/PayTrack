import { siteRepository } from '@/db';
import { getDb } from '@/lib';
import { env } from 'cloudflare:workers';
import { describe, it , expect} from 'vitest';

describe("Website repository integration test", () => {
    it("should create a new site", async () => {
        const db = getDb(env);
        const testMockSite = {
            title: "My Production Analytics App",
            url: "https://trackflow.dev",
            isActive: true
        };
        const createdSite = await siteRepository.create(db, testMockSite as any);
        expect(createdSite).toBeDefined();
    });
});