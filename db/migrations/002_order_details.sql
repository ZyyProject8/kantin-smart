-- Migration: Add missing columns to orders and order_items tables
-- for full order sync support

-- Add payment_method and pickup_time to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'QRIS',
  ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(20);

-- Add item detail columns to order_items
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT '',
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS selected_variants JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS selected_addons JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS price BIGINT DEFAULT 0;
