import { addProductToCustomer } from '@/modules/product/product-service';
import { insertProductSchema } from '@/modules/product/product-schema';
import { defineAction, ActionError } from 'astro:actions';
import { env } from 'cloudflare:workers';
import { getDb } from '@/utils';

export const createProduct = defineAction({
    accept: 'json',
    input: insertProductSchema,
    handler: async (input, context) => {
        // 1. Get user session from context locals
        const user = context.locals.staff;

        if (!user || !user.name) {
            throw new ActionError({
                code: 'UNAUTHORIZED',
                message: 'অনুমোদিত নন। দয়া করে আবার লগইন করুন।',
            });
        }

        const db = getDb(env);

        try {
            // 2. Automatically inject createdByName from session
            const productData = {
                ...input,
                createdByName: user.name,
            };

            const newProduct = await addProductToCustomer(db, productData);

            return {
                success: true,
                data: newProduct,
            };
        } catch (error: any) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: error?.message || 'পণ্য সংরক্ষণ করতে একটি সমস্যা হয়েছে।',
            });
        }
    },
});