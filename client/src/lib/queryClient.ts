import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData;
    try {
      // Try to parse JSON error response first
      errorData = await res.json();
      const errorMessage = errorData.message || errorData.error || res.statusText || 'An error occurred';
      throw new Error(errorMessage);
    } catch (jsonError) {
      // If JSON parsing failed, use text or statusText
      try {
        const text = await res.text();
        throw new Error(text || res.statusText || `Error ${res.status}`);
      } catch (textError) {
        // Last resort fallback
        throw new Error(`Request failed with status ${res.status}`);
      }
    }
  }
}

export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  console.log(`API Request: ${options?.method || 'GET'} ${url}`);
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    await throwIfResNotOk(res);
    const data = await res.json();
    console.log(`API Response received for ${url}`);
    return data;
  } catch (error) {
    console.error(`API Request failed for ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    console.log(`Query fetch: GET ${url}`);
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Auth required (401) for ${url}, returning null as configured`);
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      console.log(`Query data received for ${url}`);
      return data;
    } catch (error) {
      console.error(`Query fetch failed for ${url}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
