/*
  # ایجاد جدول کاربران و تنظیمات امنیتی

  1. جداول جدید
    - `users`
      - `id` (uuid، کلید اصلی)
      - `phone` (شماره موبایل، منحصر به فرد)
      - `full_name` (نام کامل)
      - `role` (نقش کاربر)
      - `created_at` (زمان ایجاد)
  2. امنیت
    - فعال‌سازی RLS برای جدول users
    - افزودن سیاست برای خواندن اطلاعات توسط کاربران احراز هویت شده
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  phone text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'candidate', 'user')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);