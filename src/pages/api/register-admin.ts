import { jsonResponse, errorResponse } from '@/utils/response';
import { registerAdmin } from '@/utils/register-admin';
import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {

  try {
    await registerAdmin(env);
    return jsonResponse("Admin register succesfully", 200)
  } catch (error) {
    return errorResponse("Something went wrong!")
  }
}