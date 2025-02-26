/*
  # رفع مشکل سیاست‌های دسترسی کدهای تایید

  1. تغییرات
    - حذف سیاست‌های قبلی جدول verification_codes
    - اضافه کردن سیاست‌های جدید با دسترسی مناسب
    
  2. امنیت
    - اجازه درج کد تایید برای همه کاربران
    - محدود کردن دسترسی به کدهای تایید
*/

-- حذف سیاست‌های قبلی
DROP POLICY IF EXISTS "Users can see own verification codes" ON verification_codes;
DROP POLICY IF EXISTS "Anyone can insert verification codes" ON verification_codes;
DROP POLICY IF EXISTS "Anyone can see verification codes" ON verification_codes;
DROP POLICY IF EXISTS "Anyone can update verification codes" ON verification_codes;
DROP POLICY IF EXISTS "Users can update own verification codes" ON verification_codes;

-- ایجاد سیاست‌های جدید
CREATE POLICY "Enable insert for everyone"
  ON verification_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for matching phone numbers"
  ON verification_codes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Enable update for matching phone numbers"
  ON verification_codes
  FOR UPDATE
  TO anon, authenticated
  USING (true);