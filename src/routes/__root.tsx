import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, createContext, useContext, type FormEvent, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import type { MenuItem } from "@/lib/mock-data";

export type User = {
  name: string;
  email: string;
  role: string;
};

export type CartItem = MenuItem & {
  cartItemId: string;
  qty: number;
  selectedAddons: string[];
  selectedVariants?: Record<string, string>;
};

export interface AuthContext {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  cartItems: CartItem[];
  addToCart: (menu: MenuItem, qty: number, selectedAddons: string[], selectedVariants?: Record<string, string>) => void;
  removeFromCart: (menuId: string) => void;
  updateQty: (menuId: string, qty: number) => void;
  clearCart: () => void;
}

const AuthContextReact = createContext<AuthContext | null>(null);

export function useAuth() {
  const context = useContext(AuthContextReact);
  if (!context) {
    throw new Error("useAuth must be used within AuthContextReact.Provider");
  }
  return context;
}


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Halaman gagal dimuat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terjadi kesalahan. Coba muat ulang atau kembali ke beranda.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Coba lagi
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kantin Pintar — Pesan Makan Kantin Tanpa Antri" },
      { name: "description", content: "Platform digital pemesanan makanan kantin sekolah, kampus, dan perkantoran. Cepat, praktis, tanpa antri." },
      { name: "author", content: "Kantin Pintar" },
      { property: "og:title", content: "Kantin Pintar — Pesan Makan Kantin Tanpa Antri" },
      { property: "og:description", content: "Platform digital pemesanan makanan kantin sekolah, kampus, dan perkantoran." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [user, setUser] = useState<User | null>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("kantin_user") : null;
    return stored ? JSON.parse(stored) : null;
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("kantin_cart") : null;
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("kantin_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("kantin_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const auth: AuthContext = {
    user,
    login: (nextUser) => setUser(nextUser),
    logout: () => {
      setUser(null);
      setCartItems([]);
      window.localStorage.removeItem("kantin_user");
      window.localStorage.removeItem("kantin_cart");
    },
    cartItems,
    addToCart: (menu, qty, selectedAddons, selectedVariants) => {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === menu.id && JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants));
        if (existing) {
          return prev.map((item) =>
            item.cartItemId === existing.cartItemId
              ? { ...item, qty: item.qty + qty, selectedAddons }
              : item,
          );
        }
        return [...prev, { ...menu, cartItemId: crypto.randomUUID(), qty, selectedAddons, selectedVariants }];
      });
    },
    removeFromCart: (cartItemId) => setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId)),
    updateQty: (cartItemId, qty) => setCartItems((prev) => prev.map((item) => (item.cartItemId === cartItemId ? { ...item, qty } : item))),
    clearCart: () => setCartItems([]),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextReact.Provider value={auth}>
        <Outlet />
        <Toaster position="top-center" richColors />
      </AuthContextReact.Provider>
    </QueryClientProvider>
  );
}
