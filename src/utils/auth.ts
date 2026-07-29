import { staffRepository } from "@/modules/staff/staff.repository";
import type { AstroCookies } from "astro";
import { env } from "cloudflare:workers";
import { getDb } from "@/utils";

const SESSION_COOKIE_NAME = "staff_session";

export async function getAuthenticatedStaff(cookies: AstroCookies) {
  const staffId = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!staffId) {
    return null;
  }

  const db = getDb(env);
  const staff = await staffRepository.findById(db, staffId);

  if (!staff) {
    cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }

  return staff;
}