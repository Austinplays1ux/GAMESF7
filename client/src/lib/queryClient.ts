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
      // Check for parameters in the queryKey
      let fullUrl = url;
      if (queryKey.length > 1 && typeof queryKey[1] === 'object') {
        const params = queryKey[1] as Record<string, any>;
        const searchParams = new URLSearchParams();
        
        // Add all params to the URL
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
        
        const queryString = searchParams.toString();
        if (queryString) {
          fullUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
        }
      }
      
      console.log(`Full URL with params: ${fullUrl}`);
      
      const res = await fetch(fullUrl, {
        credentials: "include",
      });

      // Handle 401 based on configuration
      if (res.status === 401) {
        console.log(`Auth required (401) for ${fullUrl}`);
        if (unauthorizedBehavior === "returnNull") {
          console.log(`Returning null as configured`);
          return null;
        }
      }
      
      // Handle other error statuses
      if (!res.ok) {
        console.log(`Request failed with status ${res.status} for ${fullUrl}`);
        if (res.status >= 500) {
          console.log(`Server error (${res.status}), using mock data if available`);
          // For server errors, we'll let the component use its fallback data
          return null;
        }
        await throwIfResNotOk(res);
      }
      
      const data = await res.json();
      console.log(`Query data received for ${fullUrl}: ${data ? (Array.isArray(data) ? `${data.length} items` : 'object') : 'null'}`);
      return data;
    } catch (error) {
      console.error(`Query fetch failed for ${url}:`, error);
      // Return null to allow components to use fallback data
      return null;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Changed to returnNull so 401 doesn't cause errors
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 1, // Add one retry for network issues
    },
    mutations: {
      retry: 1, // Add one retry for network issues
    },
  },
});
