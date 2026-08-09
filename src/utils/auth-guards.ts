import { ActionError } from "astro:actions";
import type { ActionAPIContext } from "astro:actions";

export function requireAuth(context: ActionAPIContext) {
  const staff = context.locals.staff;
  if (!staff) {
    throw new ActionError({ code: "UNAUTHORIZED", message: "লগইন প্রয়োজন।" });
  }
  return staff;
}

export function requireAdmin(context: ActionAPIContext) {
  const staff = requireAuth(context);
  if (staff.role !== "admin") {
    throw new ActionError({ code: "FORBIDDEN", message: "এই কাজের জন্য অ্যাডমিন অনুমতি প্রয়োজন।" });
  }
  return staff;
}