/**
 * Tipe data kontrak API antara frontend Smart Kantin dan backend Laravel.
 *
 * Tipe ini disesuaikan dengan resource yang umum dihasilkan Laravel/Eloquent.
 * Kamu bisa menyesuaikan nama field sesuai response JSON Laravel-mu.
 */

export type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "buyer" | "seller" | "admin";
} & Timestamps;

export type Tenant = {
  id: string | number;
  name: string;
  rating: number;
  orders: number;
  image?: string;
  description?: string;
  location?: string;
  is_open: boolean;
} & Timestamps;

export type Category = {
  id: string | number;
  name: string;
  icon?: string;
  slug?: string;
} & Timestamps;

export type Addon = {
  id: string | number;
  name: string;
  price: number;
};

export type MenuItem = {
  id: string | number;
  name: string;
  tenant_id: string | number;
  tenant?: Tenant;
  price: number;
  rating: number;
  image?: string;
  category_id?: string | number;
  category?: Category;
  description: string;
  stock: number;
  prep_time: string;
  allergens: string[];
  addons: Addon[];
  tags?: string[];
  is_available: boolean;
} & Timestamps;

export type CartItem = {
  id: string | number;
  menu_item_id: string | number;
  menu_item: MenuItem;
  quantity: number;
  addons: Addon[];
  note?: string;
  subtotal: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled";

export type Order = {
  id: string | number;
  user_id: string | number;
  user?: User;
  tenant_id: string | number;
  tenant?: Tenant;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  pickup_method: "dine_in" | "takeaway";
  pickup_time?: string;
  payment_method: "cash" | "ewallet" | "card";
  qr_code?: string;
  note?: string;
} & Timestamps;

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  role?: "buyer" | "seller";
};

export type AuthResponse = {
  user: User;
  token: string;
};
