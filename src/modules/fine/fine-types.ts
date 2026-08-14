// src/modules/fine/fine-types.ts
import { z } from "zod";
import { insertFineSchema, selectFineSchema, updateFineSchema } from "./fine-schema";

export type InsertFine = z.infer<typeof insertFineSchema>;
export type SelectFine = z.infer<typeof selectFineSchema>;
export type UpdateFine = z.infer<typeof updateFineSchema>;

/**
 * PublicFine is the client-facing shape — identical to SelectFine since
 * fine has no sensitive field to strip.
 */
export type PublicFine = SelectFine;

// Represents the full row the repository actually writes: the client
// input plus the server-injected `createdByName` snapshot field and the
// `productId`, which comes from the route param rather than the form body.
export type NewFine = InsertFine & { createdByName: string; productId: string };