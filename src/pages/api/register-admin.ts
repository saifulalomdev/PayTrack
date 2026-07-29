import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // 1. You can fetch data here (for example, from a database or static data)
  const data = [
    { id: '1', name: 'John Doe', role: 'admin' },
    { id: '2', name: 'Jane Smith', role: 'staff' },
  ];

  // 2. Return a JSON Response
  return new Response(JSON.stringify({
    success: true,
    data: data,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};