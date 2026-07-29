// src/utils/safe-fetch.ts
export async function safeFetch<T>(fetchFn: () => Promise<T>) {
  try {
    const data = await fetchFn();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || "Something went wrong" };
  }
}