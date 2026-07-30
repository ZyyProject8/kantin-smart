/**
 * Laravel API Client
 *
 * Konfigurasi fetch client untuk komunikasi ke backend Laravel.
 * Secara default frontend tetap menggunakan mock data.
 * Untuk menghubungkan ke Laravel, set VITE_API_URL di .env
 * dan pastikan VITE_USE_MOCK_API tidak bernilai "true".
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
};

export type ApiResponse<T> =
  | { success: true; data: T; meta?: Record<string, unknown> }
  | { success: false; error: ApiError };

export type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, params?: FetchOptions["params"]): string {
  const url = new URL(path.replace(/^\//, ""), API_BASE_URL.replace(/\/$/, "") + "/");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

function getHeaders(opts: FetchOptions): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers || {}),
  };

  // Laravel Sanctum / session-based auth biasanya memerlukan header ini
  headers["X-Requested-With"] = "XMLHttpRequest";

  if (!(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = typeof localStorage !== "undefined" ? localStorage.getItem("laravel_token") : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    // Mock mode: service modules akan mengembalikan data dummy.
    // Fungsi ini tidak dipakai saat mock aktif.
    return {
      success: false,
      error: { message: "Mock mode aktif. Gunakan service layer, bukan apiFetch langsung.", status: 0 },
    };
  }

  try {
    const url = buildUrl(path, opts.params);
    const response = await fetch(url, {
      method: opts.method || "GET",
      headers: getHeaders(opts),
      body: opts.body ? (opts.body instanceof FormData ? opts.body : JSON.stringify(opts.body)) : undefined,
      credentials: "include",
    });

    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    if (!response.ok) {
      return {
        success: false,
        error: {
          message: (data.message as string) || response.statusText || "Terjadi kesalahan",
          errors: (data.errors as Record<string, string[]>) || undefined,
          status: response.status,
        },
      };
    }

    return {
      success: true,
      data: data as T,
      meta: (data.meta as Record<string, unknown>) || undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        message: err instanceof Error ? err.message : "Gagal terhubung ke server",
        status: 0,
      },
    };
  }
}

export { API_BASE_URL, USE_MOCK };
