// src/env.d.ts
/// <reference types="astro/client" />

declare global {
  namespace App {
    interface Locals {
      staff: import("@/modules/staff/staff.types").SelectStaff | null;
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