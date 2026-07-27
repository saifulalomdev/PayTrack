import type { APIRoute } from 'astro';
// Inline the script as raw text. Astro's bundler will minify it 
// when you run 'npm run build' for production.
import trackerCode from '@/assets/tracker?raw';

export const GET: APIRoute = async () => {
  return new Response(trackerCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};