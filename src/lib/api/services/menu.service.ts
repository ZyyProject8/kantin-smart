import { apiFetch, USE_MOCK } from "@/lib/api/client";
import { menus, categories } from "@/lib/mock-data";
import type { MenuItem, Category, PaginatedResponse } from "@/lib/api/types";

export type MenuListParams = {
  page?: number;
  per_page?: number;
  category?: string;
  tenant?: string;
  search?: string;
  sort?: "popular" | "newest" | "price_asc" | "price_desc";
};

export async function getMenus(params?: MenuListParams): Promise<PaginatedResponse<MenuItem>> {
  if (USE_MOCK) {
    let result = [...menus];

    if (params?.category && params.category !== "all") {
      result = result.filter((m) => m.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.tenant) {
      result = result.filter((m) => m.tenantId === params.tenant);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.tenant.toLowerCase().includes(q));
    }

    if (params?.sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (params?.sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (params?.sort === "popular") result.sort((a, b) => b.rating - a.rating);

    const page = params?.page || 1;
    const perPage = params?.per_page || 12;
    const start = (page - 1) * perPage;
    const paginated = result.slice(start, start + perPage);

    return {
      data: paginated as unknown as MenuItem[],
      current_page: page,
      last_page: Math.ceil(result.length / perPage),
      per_page: perPage,
      total: result.length,
    };
  }

  const response = await apiFetch<PaginatedResponse<MenuItem>>("/menus", { params });
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

export async function getMenuById(id: string | number): Promise<MenuItem | null> {
  if (USE_MOCK) {
    const found = menus.find((m) => String(m.id) === String(id));
    return (found as unknown as MenuItem) || null;
  }

  const response = await apiFetch<MenuItem>(`/menus/${id}`);
  if (!response.success) {
    if (response.error.status === 404) return null;
    throw new Error(response.error.message);
  }
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    return categories as unknown as Category[];
  }

  const response = await apiFetch<Category[]>("/categories");
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}
