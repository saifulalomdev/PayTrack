import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { staffRepository } from "@/modules/staff/staff.repository";
import type { AstroCookies } from "astro";
import type { SelectStaff } from "@/modules/staff/staff.types";

export const SESSION_COOKIE_NAME = "staff_session";

/**
 * Cookie value format: "<staffId>:<tokenVersion>"
 * The tokenVersion is checked against the DB so that a password/phone
 * change invalidates every previously-issued cookie for that staff member.
 */
export function buildSessionCookieValue(staff: Pick<SelectStaff, "id" | "tokenVersion">): string {
  return `${staff.id}:${staff.tokenVersion}`;
}

export async function getAuthenticatedStaff(cookies: AstroCookies): Promise<SelectStaff | null> {
  const raw = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;

  const [id, versionStr] = raw.split(":");
  const version = Number(versionStr);
  if (!id || Number.isNaN(version)) {
    cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }

  const db = getDb(env);
  const staff = await staffRepository.findById(db, id);

  if (!staff || staff.tokenVersion !== version) {
    // Not found, or a stale/invalidated session (credentials changed since
    // this cookie was issued) — clean up the dead cookie rather than
    // leaving it to expire naturally.
    cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }

  return staff;
}