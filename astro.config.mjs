// @ts-check
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    host: true,
    port: 3000
  },

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  adapter: cloudflare()
});