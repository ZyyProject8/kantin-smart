-- Sample seed data for Kantin Pintar

-- Enable pgcrypto for gen_random_uuid if not present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
INSERT INTO users (id, role, name, email, password_hash)
VALUES
  (gen_random_uuid(), 'admin', 'Admin Test', 'admin@example.com', NULL),
  (gen_random_uuid(), 'seller', 'Seller Satu', 'seller1@example.com', NULL),
  (gen_random_uuid(), 'customer', 'Customer Satu', 'customer1@example.com', NULL)
ON CONFLICT (email) DO NOTHING;

-- Create a seller linked to seller user (simple approach: find user id)
WITH s AS (
  SELECT id as user_id FROM users WHERE email = 'seller1@example.com' LIMIT 1
)
INSERT INTO sellers (id, user_id, shop_name, description)
SELECT gen_random_uuid(), user_id, 'Warung Satu', 'Makanan enak dan murah' FROM s
ON CONFLICT DO NOTHING;

-- Menus and menu items
WITH sel AS (
  SELECT id as seller_id FROM sellers LIMIT 1
)
INSERT INTO menus (id, seller_id, title, description)
SELECT gen_random_uuid(), seller_id, 'Menu Sarapan', 'Menu sarapan pagi' FROM sel
ON CONFLICT DO NOTHING;

-- Insert sample menu items linked to the first menu
WITH m AS (
  SELECT id as menu_id FROM menus LIMIT 1
)
INSERT INTO menu_items (id, menu_id, name, description, price_cents)
SELECT gen_random_uuid(), menu_id, 'Nasi Goreng', 'Nasi goreng spesial', 20000 FROM m
UNION ALL
SELECT gen_random_uuid(), menu_id, 'Mie Ayam', 'Mie ayam bakso', 15000 FROM m
ON CONFLICT DO NOTHING;
