import { apiFetch, USE_MOCK } from "@/lib/api/client";
import { tenants, salesData } from "@/lib/mock-data";
import type { Tenant, PaginatedResponse, MenuItem } from "@/lib/api/types";

export async function getTenants(): Promise<Tenant[]> {
  if (USE_MOCK) {
    return tenants as unknown as Tenant[];
  }

  const response = await apiFetch<Tenant[]>("/tenants");
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

export async function getTenantById(id: string | number): Promise<Tenant | null> {
  if (USE_MOCK) {
    const found = tenants.find((t) => String(t.id) === String(id));
    return (found as unknown as Tenant) || null;
  }

  const response = await apiFetch<Tenant>(`/tenants/${id}`);
  if (!response.success) {
    if (response.error.status === 404) return null;
    throw new Error(response.error.message);
  }
  return response.data;
}

export async function getTenantMenus(tenantId: string | number): Promise<MenuItem[]> {
  if (USE_MOCK) {
    const { menus: allMenus } = await import("@/lib/mock-data");
    return allMenus.filter((m) => String(m.tenantId) === String(tenantId)) as unknown as MenuItem[];
  }

  const response = await apiFetch<MenuItem[]>(`/tenants/${tenantId}/menus`);
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

export type SalesSummary = {
  labels: string[];
  values: number[];
  total: number;
  today: number;
  orders: number;
};

export async function getTenantSalesSummary(tenantId: string | number): Promise<SalesSummary> {
  if (USE_MOCK) {
    const total = salesData.reduce((sum, d) => sum + d.value, 0);
    return {
      labels: salesData.map((d) => d.day),
      values: salesData.map((d) => d.value),
      total,
      today: salesData[salesData.length - 1].value,
      orders: Math.floor(total / 15000),
    };
  }

  const response = await apiFetch<SalesSummary>(`/tenants/${tenantId}/sales-summary`);
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}
