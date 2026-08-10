// src/actions/product.ts
import { insertProductSchema, updateProductSchema } from "@/modules/product/product-schema";
import { productService } from "@/modules/product/product-service";
import { defineAction, ActionError } from "astro:actions";
import { env } from "cloudflare:workers";
import { getDb } from "@/utils";
import { z } from "zod";

export const createProduct = defineAction({
    accept: "json",
    input: insertProductSchema,
    handler: async (input, context) => {
        const user = context.locals.staff;

        if (!user || !user.name) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "অনুমোদিত নন। দয়া করে আবার লগইন করুন।",
            });
        }

        const db = getDb(env);

        try {
            const productData = {
                ...input,
                createdByName: user.name,
            };

            const newProduct = await productService.create(db, productData);

            return { success: true, data: newProduct };
        } catch (error: any) {
            throw new ActionError({
                code: "BAD_REQUEST",
                message: error?.message || "পণ্য সংরক্ষণ করতে একটি সমস্যা হয়েছে।",
            });
        }
    },
});

export const updateProduct = defineAction({
    accept: "json",
    input: updateProductSchema,
    handler: async (input, context) => {
        const user = context.locals.staff;

        if (!user || !user.name) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "অনুমোদিত নন। দয়া করে আবার লগইন করুন।",
            });
        }

        const db = getDb(env);

        try {
            const updated = await productService.update(db, input);
            return { success: true, data: updated };
        } catch (error: any) {
            throw new ActionError({
                code: "BAD_REQUEST",
                message: error?.message || "পণ্য আপডেট করতে একটি সমস্যা হয়েছে।",
            });
        }
    },
});

export const  deleteProduct = defineAction({
    accept: "json",
    input: z.object({ id: z.string() }),
    handler: async ({ id }, context) => {
        const user = context.locals.staff;

        if (!user) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "অনুমোদিত নন। দয়া করে আবার লগইন করুন।",
            });
        }

        const db = getDb(env);

        try {
            await productService.delete(db, id);
            return { success: true };
        } catch (error: any) {
            throw new ActionError({
                code: "BAD_REQUEST",
                message: error?.message || "পণ্য মুছতে একটি সমস্যা হয়েছে।",
            });
        }
    },
});
