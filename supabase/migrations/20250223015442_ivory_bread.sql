/*
  # ایجاد جدول کاندیداها و تنظیمات امنیتی

  1. جداول جدید
    - `candidates`
      - `user_id` (uuid، کلید خارجی به جدول users)
      - `bio` (زندگی‌نامه)
      - `proposals` (برنامه‌ها و پیشنهادات)
      - `avatar_url` (آدرس تصویر پروفایل)
      - `approved` (وضعیت تایید)
  2. امنیت
    - فعال‌سازی RLS برای جدول candidates
    - افزودن سیاست برای خواندن اطلاعات تایید شده
*/

CREATE TABLE IF NOT EXISTS candidates (
  user_id uuid PRIMARY KEY REFERENCES users(id),
  bio text,
  proposals jsonb DEFAULT '[]'::jsonb,
  avatar_url text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved candidates"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (approved = true);

CREATE POLICY "Candidates can update own data"
  ON candidates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);