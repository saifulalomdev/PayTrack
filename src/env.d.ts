// src/env.d.ts
/// <reference types="astro/client" />

declare global {
  namespace App {
    interface Locals {
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