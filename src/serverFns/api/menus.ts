import { createMenu, deleteMenu, getMenu, listMenus } from "../menus";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function parseMenuId(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "api" && parts[1] === "menus") {
    return null;
  }
  if (parts.length === 3 && parts[0] === "api" && parts[1] === "menus") {
    return parts[2];
  }
  return null;
}

export async function handleMenusApiRequest(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const menuId = parseMenuId(pathname);

  if (request.method === "GET" && pathname === "/api/menus") {
    const sellerId = url.searchParams.get("sellerId");
    if (!sellerId) {
      return jsonResponse({ error: "sellerId query param is required" }, 400);
    }
    const menus = await listMenus(sellerId);
    return jsonResponse(menus);
  }

  if (request.method === "POST" && pathname === "/api/menus") {
    const body = await request.json();
    const { sellerId, title, description } = body;
    if (!sellerId || !title) {
      return jsonResponse({ error: "sellerId and title are required" }, 400);
    }
    const menu = await createMenu(sellerId, title, description);
    return jsonResponse(menu, 201);
  }

  if (request.method === "GET" && menuId) {
    const menu = await getMenu(menuId);
    if (!menu) {
      return jsonResponse({ error: "Menu not found" }, 404);
    }
    return jsonResponse(menu);
  }

  if (request.method === "DELETE" && menuId) {
    await deleteMenu(menuId);
    return jsonResponse({ ok: true }, 204);
  }

  return jsonResponse({ error: "Not found" }, 404);
}
