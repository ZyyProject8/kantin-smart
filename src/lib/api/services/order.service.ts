import { apiFetch, USE_MOCK } from "@/lib/api/client";
import { orderHistory, kitchenOrders } from "@/lib/mock-data";
import type { Order, OrderStatus, CartItem } from "@/lib/api/types";

export type CreateOrderRequest = {
  tenant_id: string | number;
  items: Pick<CartItem, "menu_item_id" | "quantity" | "addons" | "note">[];
  pickup_method: "dine_in" | "takeaway";
  pickup_time?: string;
  payment_method: "cash" | "ewallet" | "card";
  note?: string;
};

export async function createOrder(payload: CreateOrderRequest): Promise<Order> {
  if (USE_MOCK) {
    const mockOrder: Order = {
      id: `o-${Date.now()}`,
      user_id: 1,
      tenant_id: payload.tenant_id,
      items: [],
      total: 0,
      status: "pending",
      pickup_method: payload.pickup_method,
      pickup_time: payload.pickup_time,
      payment_method: payload.payment_method,
      note: payload.note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return new Promise((resolve) => setTimeout(() => resolve(mockOrder), 600));
  }

  const response = await apiFetch<Order>("/orders", { method: "POST", body: payload as Record<string, unknown> });
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

export async function getOrders(params?: { status?: OrderStatus; page?: number }): Promise<Order[]> {
  if (USE_MOCK) {
    return orderHistory.map((o) => ({
      id: o.id,
      tenant_id: 1,
      total: o.total,
      status: mapStatusLabel(o.status),
      pickup_method: "takeaway",
      payment_method: "cash",
      items: [],
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })) as Order[];
  }

  const response = await apiFetch<Order[]>("/orders", { params });
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

export async function getOrderById(id: string | number): Promise<Order | null> {
  if (USE_MOCK) {
    const found = orderHistory.find((o) => String(o.id) === String(id));
    if (!found) return null;
    return {
      id: found.id,
      tenant_id: 1,
      total: found.total,
      status: mapStatusLabel(found.status),
      pickup_method: "takeaway",
      payment_method: "cash",
      items: [],
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Order;
  }

  const response = await apiFetch<Order>(`/orders/${id}`);
  if (!response.success) {
    if (response.error.status === 404) return null;
    throw new Error(response.error.message);
  }
  return response.data;
}

export async function updateOrderStatus(id: string | number, status: OrderStatus): Promise<Order> {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id,
          status,
          tenant_id: 1,
          total: 0,
          pickup_method: "takeaway",
          payment_method: "cash",
          items: [],
          user_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Order);
      }, 400)
    );
  }

  const response = await apiFetch<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: { status } as Record<string, unknown>,
  });
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

export async function getKitchenOrders(): Promise<Order[]> {
  if (USE_MOCK) {
    return kitchenOrders.map((k) => ({
      id: k.id,
      tenant_id: 1,
      total: 0,
      status: k.status as OrderStatus,
      pickup_method: "takeaway",
      payment_method: "cash",
      items: [],
      user_id: 1,
      note: k.items.join(", "),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })) as Order[];
  }

  const response = await apiFetch<Order[]>("/orders/kitchen");
  if (!response.success) throw new Error(response.error.message);
  return response.data;
}

function mapStatusLabel(label: string): OrderStatus {
  switch (label) {
    case "Selesai":
      return "completed";
    case "Dibatalkan":
      return "cancelled";
    case "Diproses":
      return "processing";
    case "Siap":
      return "ready";
    default:
      return "pending";
  }
}
