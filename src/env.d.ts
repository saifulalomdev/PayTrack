// src/env.d.ts
/// <reference types="astro/client" />
import type { PublicStaff } from "./modules/staff/staff-types";
import { Theme } from "./types/theme";


declare global {
  namespace App {
    interface Locals {
      staff: PublicStaff | null;
      theme: Theme;
      runtime: {
        env: Env;
      };
    }
  }
}

declare module "@astrojs/cloudflare/entrypoints/server" {
  const handler: {
    fetch: (
      request: Request,
      env: any,
      ctx: any
    ) => Promise<Response>;
  };
  export default handler;
}

export { };