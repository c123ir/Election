/*
  # اسکیمای کامل بانک اطلاعاتی برای سامانه انتخابات

  1. جداول جدید
    - `candidate_media` (رسانه‌های کاندیداها)
    - `surveys` (نظرسنجی‌ها)
    - `expectations` (انتظارات اعضا)
    - `webinars` (وبینارها)
    - `webinar_participants` (شرکت‌کنندگان وبینارها)
  
  2. توابع
    - توابع مربوط به احراز هویت
    - توابع مربوط به رأی‌گیری
    - توابع مربوط به چت و پیام‌رسانی
    
  3. تغییرات
    - اضافه کردن فیلدهای مورد نیاز به جداول موجود
*/

-- جدول رسانه‌های کاندیداها
CREATE TABLE IF NOT EXISTS candidate_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES candidates(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('video', 'image', 'document')),
  file_type text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  comments jsonb DEFAULT '[]'::jsonb
);

-- جدول نظرسنجی‌ها
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  business_category text REFERENCES business_categories(id),
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  end_date timestamptz NOT NULL,
  total_votes integer DEFAULT 0,
  is_active boolean DEFAULT true,
  participants jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users(id)
);

-- جدول انتظارات اعضا
CREATE TABLE IF NOT EXISTS expectations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text NOT NULL,
  business_category text REFERENCES business_categories(id),
  priority text CHECK (priority IN ('low', 'medium', 'high')),
  status text CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  comments jsonb DEFAULT '[]'::jsonb,
  candidate_responses jsonb DEFAULT '[]'::jsonb
);

-- جدول وبینارها
CREATE TABLE IF NOT EXISTS webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  candidate_id uuid REFERENCES candidates(user_id),
  start_time timestamptz NOT NULL,
  duration integer NOT NULL, -- in minutes
  status text CHECK (status IN ('scheduled', 'live', 'ended')) DEFAULT 'scheduled',
  participants_count integer DEFAULT 0,
  recording_url text
);

-- جدول شرکت‌کنندگان وبینارها
CREATE TABLE IF NOT EXISTS webinar_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id uuid REFERENCES webinars(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  registered_at timestamptz DEFAULT now(),
  attended boolean DEFAULT false,
  UNIQUE(webinar_id, user_id)
);

-- جدول رسته‌های صنفی
CREATE TABLE IF NOT EXISTS business_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- درج رسته‌های صنفی پیش‌فرض
INSERT INTO business_categories (id, name) VALUES
  ('computer', 'رایانه'),
  ('office_equipment', 'ماشین‌های اداری'),
  ('internet_cafe', 'کافی‌نت'),
  ('bookstore', 'کتاب فروشی'),
  ('typing_copying', 'تایپ و تکثیر'),
  ('stationery', 'نوشت افزار'),
  ('binding', 'صحافی'),
  ('pos_terminal', 'دستگاه‌های کارتخوان')
ON CONFLICT (id) DO NOTHING;

-- فعال‌سازی RLS برای جداول جدید
ALTER TABLE candidate_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE expectations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;

-- سیاست‌های RLS برای رسانه‌های کاندیداها
CREATE POLICY "Anyone can view candidate media"
  ON candidate_media
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Candidates can insert their own media"
  ON candidate_media
  FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM candidates
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update their own media"
  ON candidate_media
  FOR UPDATE
  TO authenticated
  USING (candidate_id = auth.uid())
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can delete their own media"
  ON candidate_media
  FOR DELETE
  TO authenticated
  USING (candidate_id = auth.uid());

-- سیاست‌های RLS برای نظرسنجی‌ها
CREATE POLICY "Anyone can view surveys"
  ON surveys
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert surveys"
  ON surveys
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update surveys"
  ON surveys
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete surveys"
  ON surveys
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- سیاست‌های RLS برای انتظارات
CREATE POLICY "Anyone can view expectations"
  ON expectations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Members can insert expectations"
  ON expectations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can update their own expectations"
  ON expectations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any expectation"
  ON expectations
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- سیاست‌های RLS برای وبینارها
CREATE POLICY "Anyone can view webinars"
  ON webinars
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Candidates can insert their own webinars"
  ON webinars
  FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM candidates
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update their own webinars"
  ON webinars
  FOR UPDATE
  TO authenticated
  USING (candidate_id = auth.uid())
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Admins can update any webinar"
  ON webinars
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- سیاست‌های RLS برای شرکت‌کنندگان وبینارها
CREATE POLICY "Users can view their own webinar registrations"
  ON webinar_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Candidates can view their webinar participants"
  ON webinar_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM webinars
      WHERE id = webinar_id AND candidate_id = auth.uid()
    )
  );

CREATE POLICY "Users can register for webinars"
  ON webinar_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- سیاست‌های RLS برای رسته‌های صنفی
CREATE POLICY "Anyone can view business categories"
  ON business_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage business categories"
  ON business_categories
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- توابع مربوط به احراز هویت
CREATE OR REPLACE FUNCTION create_verification_code(
  phone_number text,
  code text
) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  expires timestamptz;
  code_id uuid;
BEGIN
  -- تنظیم زمان انقضا (5 دقیقه)
  expires := now() + interval '5 minutes';
  
  -- حذف کدهای قبلی برای این شماره
  DELETE FROM verification_codes
  WHERE phone = phone_number;
  
  -- ایجاد کد جدید
  INSERT INTO verification_codes (phone, code, expires_at)
  VALUES (phone_number, code, expires)
  RETURNING id INTO code_id;
  
  RETURN code_id::text;
END;
$$;

CREATE OR REPLACE FUNCTION verify_code(
  phone_number text,
  input_code text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  code_record verification_codes;
BEGIN
  -- دریافت کد
  SELECT * INTO code_record
  FROM verification_codes
  WHERE phone = phone_number
    AND code = input_code
    AND expires_at > now()
    AND NOT is_used;
  
  -- بررسی وجود کد
  IF code_record.id IS NULL THEN
    RETURN false;
  END IF;
  
  -- علامت‌گذاری کد به عنوان استفاده شده
  UPDATE verification_codes
  SET is_used = true
  WHERE id = code_record.id;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION register_user(
  phone_number text,
  name text,
  business_cat text,
  business_name text
) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- بررسی وجود کاربر
  IF EXISTS (SELECT 1 FROM users WHERE phone = phone_number) THEN
    RAISE EXCEPTION 'کاربر با این شماره موبایل قبلاً ثبت شده است';
  END IF;
  
  -- ایجاد کاربر جدید
  INSERT INTO users (phone, full_name, role, business_category, business_name)
  VALUES (phone_number, name, 'member', business_cat, business_name)
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id::text;
END;
$$;

-- توابع مربوط به کاندیداها
CREATE OR REPLACE FUNCTION register_candidate(
  user_id uuid,
  bio text,
  proposals jsonb
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- بررسی وجود کاربر
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = user_id) THEN
    RAISE EXCEPTION 'کاربر یافت نشد';
  END IF;
  
  -- بروزرسانی نقش کاربر
  UPDATE users
  SET role = 'candidate'
  WHERE id = user_id;
  
  -- ایجاد کاندیدا
  INSERT INTO candidates (user_id, bio, proposals, approved)
  VALUES (user_id, bio, proposals, false)
  ON CONFLICT (user_id) DO UPDATE
  SET bio = EXCLUDED.bio,
      proposals = EXCLUDED.proposals;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION approve_candidate(
  candidate_id uuid
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- بررسی مدیر بودن
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'فقط مدیران می‌توانند کاندیداها را تأیید کنند';
  END IF;
  
  -- بررسی وجود کاندیدا
  IF NOT EXISTS (SELECT 1 FROM candidates WHERE user_id = candidate_id) THEN
    RAISE EXCEPTION 'کاندیدا یافت نشد';
  END IF;
  
  -- تأیید کاندیدا
  UPDATE candidates
  SET approved = true
  WHERE user_id = candidate_id;
  
  RETURN true;
END;
$$;

-- توابع مربوط به رأی‌گیری
CREATE OR REPLACE FUNCTION cast_vote(
  voter uuid,
  candidate uuid
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- بررسی وجود کاربر
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = voter) THEN
    RAISE EXCEPTION 'کاربر یافت نشد';
  END IF;
  
  -- بررسی وجود کاندیدا
  IF NOT EXISTS (SELECT 1 FROM candidates WHERE user_id = candidate AND approved = true) THEN
    RAISE EXCEPTION 'کاندیدا یافت نشد یا تأیید نشده است';
  END IF;
  
  -- بررسی رأی قبلی
  IF EXISTS (SELECT 1 FROM votes WHERE voter_id = voter) THEN
    RAISE EXCEPTION 'کاربر قبلاً رأی داده است';
  END IF;
  
  -- ثبت رأی
  INSERT INTO votes (voter_id, candidate_id)
  VALUES (voter, candidate);
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION get_vote_results()
RETURNS TABLE (
  candidate_id uuid,
  candidate_name text,
  votes_count bigint
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.user_id,
    u.full_name,
    COUNT(v.id)::bigint
  FROM candidates c
  JOIN users u ON c.user_id = u.id
  LEFT JOIN votes v ON c.user_id = v.candidate_id
  WHERE c.approved = true
  GROUP BY c.user_id, u.full_name
  ORDER BY COUNT(v.id) DESC;
END;
$$;

-- توابع مربوط به چت و پیام‌رسانی
CREATE OR REPLACE FUNCTION create_chat_room(
  room_title text,
  room_type text,
  creator_id uuid
) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  new_room_id uuid;
BEGIN
  -- بررسی وجود کاربر
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = creator_id) THEN
    RAISE EXCEPTION 'کاربر یافت نشد';
  END IF;
  
  -- ایجاد اتاق چت
  INSERT INTO chat_rooms (title, type, created_by)
  VALUES (room_title, room_type, creator_id)
  RETURNING id INTO new_room_id;
  
  -- افزودن سازنده به شرکت‌کنندگان
  INSERT INTO chat_participants (room_id, user_id)
  VALUES (new_room_id, creator_id);
  
  RETURN new_room_id::text;
END;
$$;

CREATE OR REPLACE FUNCTION send_message(
  room uuid,
  sender uuid,
  msg_content text
) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  new_message_id uuid;
BEGIN
  -- بررسی وجود اتاق
  IF NOT EXISTS (SELECT 1 FROM chat_rooms WHERE id = room) THEN
    RAISE EXCEPTION 'اتاق چت یافت نشد';
  END IF;
  
  -- بررسی وجود کاربر
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = sender) THEN
    RAISE EXCEPTION 'کاربر یافت نشد';
  END IF;
  
  -- بررسی عضویت کاربر در اتاق
  IF NOT EXISTS (SELECT 1 FROM chat_participants WHERE room_id = room AND user_id = sender) THEN
    -- اگر اتاق عمومی است، کاربر را اضافه می‌کنیم
    IF EXISTS (SELECT 1 FROM chat_rooms WHERE id = room AND type = 'public') THEN
      INSERT INTO chat_participants (room_id, user_id)
      VALUES (room, sender);
    ELSE
      RAISE EXCEPTION 'کاربر عضو این اتاق چت نیست';
    END IF;
  END IF;
  
  -- ارسال پیام
  INSERT INTO chat_messages (room_id, sender_id, content)
  VALUES (room, sender, msg_content)
  RETURNING id INTO new_message_id;
  
  RETURN new_message_id::text;
END;
$$;

-- تابع بررسی وجود رأی کاربر
CREATE OR REPLACE FUNCTION has_user_voted(
  user_id uuid
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM votes
    WHERE voter_id = user_id
  );
END;
$$;

-- تابع ثبت رأی در نظرسنجی
CREATE OR REPLACE FUNCTION vote_in_survey(
  survey_id uuid,
  option_id text,
  user_id uuid
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  survey_data surveys;
  updated_options jsonb;
  participants jsonb;
BEGIN
  -- دریافت نظرسنجی
  SELECT * INTO survey_data
  FROM surveys
  WHERE id = survey_id;
  
  -- بررسی وجود نظرسنجی
  IF survey_data.id IS NULL THEN
    RAISE EXCEPTION 'نظرسنجی یافت نشد';
  END IF;
  
  -- بررسی فعال بودن نظرسنجی
  IF NOT survey_data.is_active THEN
    RAISE EXCEPTION 'نظرسنجی فعال نیست';
  END IF;
  
  -- بررسی شرکت قبلی کاربر
  IF survey_data.participants ? user_id::text THEN
    RAISE EXCEPTION 'کاربر قبلاً در این نظرسنجی شرکت کرده است';
  END IF;
  
  -- بروزرسانی گزینه‌ها
  WITH options_array AS (
    SELECT jsonb_array_elements(survey_data.options) AS option_obj
  ),
  updated_array AS (
    SELECT
      CASE
        WHEN option_obj->>'id' = option_id THEN
          jsonb_set(
            option_obj,
            '{votes}',
            to_jsonb((option_obj->>'votes')::int + 1)
          )
        ELSE option_obj
      END AS updated_option
    FROM options_array
  )
  SELECT jsonb_agg(updated_option) INTO updated_options
  FROM updated_array;
  
  -- بروزرسانی شرکت‌کنندگان
  participants := survey_data.participants || jsonb_build_array(user_id::text);
  
  -- بروزرسانی نظرسنجی
  UPDATE surveys
  SET
    options = updated_options,
    total_votes = survey_data.total_votes + 1,
    participants = participants
  WHERE id = survey_id;
  
  RETURN true;
END;
$$;

-- تابع افزودن پاسخ کاندیدا به انتظار
CREATE OR REPLACE FUNCTION add_candidate_response(
  expectation_id uuid,
  candidate_id uuid,
  content text,
  action_plan jsonb,
  estimated_time text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  expectation_data expectations;
  candidate_responses jsonb;
  new_response jsonb;
  response_id text;
  existing_index int;
BEGIN
  -- بررسی وجود کاندیدا
  IF NOT EXISTS (
    SELECT 1 FROM candidates
    WHERE user_id = candidate_id AND approved = true
  ) THEN
    RAISE EXCEPTION 'کاندیدا یافت نشد یا تأیید نشده است';
  END IF;
  
  -- دریافت انتظار
  SELECT * INTO expectation_data
  FROM expectations
  WHERE id = expectation_id;
  
  -- بررسی وجود انتظار
  IF expectation_data.id IS NULL THEN
    RAISE EXCEPTION 'انتظار یافت نشد';
  END IF;
  
  -- ایجاد شناسه پاسخ
  response_id := 'response-' || floor(extract(epoch from now()))::text;
  
  -- ایجاد پاسخ جدید
  new_response := jsonb_build_object(
    'id', response_id,
    'candidate_id', candidate_id,
    'expectation_id', expectation_id,
    'content', content,
    'action_plan', action_plan,
    'estimated_time', estimated_time,
    'created_at', now(),
    'likes', 0,
    'dislikes', 0,
    'comments', jsonb_build_array()
  );
  
  -- بررسی وجود پاسخ قبلی
  existing_index := -1;
  
  IF expectation_data.candidate_responses IS NOT NULL THEN
    FOR i IN 0..jsonb_array_length(expectation_data.candidate_responses) - 1 LOOP
      IF expectation_data.candidate_responses->i->>'candidate_id' = candidate_id::text THEN
        existing_index := i;
        EXIT;
      END IF;
    END LOOP;
  END IF;
  
  -- بروزرسانی پاسخ‌ها
  IF existing_index >= 0 THEN
    -- بروزرسانی پاسخ موجود
    candidate_responses := jsonb_set(
      expectation_data.candidate_responses,
      ARRAY[existing_index::text],
      new_response
    );
  ELSE
    -- افزودن پاسخ جدید
    IF expectation_data.candidate_responses IS NULL OR jsonb_array_length(expectation_data.candidate_responses) = 0 THEN
      candidate_responses := jsonb_build_array(new_response);
    ELSE
      candidate_responses := expectation_data.candidate_responses || new_response;
    END IF;
  END IF;
  
  -- بروزرسانی انتظار
  UPDATE expectations
  SET candidate_responses = candidate_responses
  WHERE id = expectation_id;
  
  RETURN true;
END;
$$;

-- تابع افزودن نظر به انتظار
CREATE OR REPLACE FUNCTION add_expectation_comment(
  expectation_id uuid,
  user_id uuid,
  content text,
  is_anonymous boolean DEFAULT false
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  expectation_data expectations;
  comments jsonb;
  new_comment jsonb;
  comment_id text;
  user_name text;
BEGIN
  -- دریافت انتظار
  SELECT * INTO expectation_data
  FROM expectations
  WHERE id = expectation_id;
  
  -- بررسی وجود انتظار
  IF expectation_data.id IS NULL THEN
    RAISE EXCEPTION 'انتظار یافت نشد';
  END IF;
  
  -- دریافت نام کاربر
  IF is_anonymous THEN
    user_name := 'کاربر ناشناس';
  ELSE
    SELECT full_name INTO user_name
    FROM users
    WHERE id = user_id;
  END IF;
  
  -- ایجاد شناسه نظر
  comment_id := 'comment-' || floor(extract(epoch from now()))::text;
  
  -- ایجاد نظر جدید
  new_comment := jsonb_build_object(
    'id', comment_id,
    'user_id', user_id,
    'content', content,
    'created_at', now(),
    'is_anonymous', is_anonymous,
    'user_name', user_name,
    'likes', 0,
    'dislikes', 0
  );
  
  -- بروزرسانی نظرات
  IF expectation_data.comments IS NULL OR jsonb_array_length(expectation_data.comments) = 0 THEN
    comments := jsonb_build_array(new_comment);
  ELSE
    comments := expectation_data.comments || new_comment;
  END IF;
  
  -- بروزرسانی انتظار
  UPDATE expectations
  SET comments = comments
  WHERE id = expectation_id;
  
  RETURN true;
END;
$$;

-- تابع افزودن نظر به رسانه کاندیدا
CREATE OR REPLACE FUNCTION add_media_comment(
  media_id uuid,
  user_id uuid,
  content text,
  is_anonymous boolean DEFAULT false
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  media_data candidate_media;
  comments jsonb;
  new_comment jsonb;
  comment_id text;
  user_name text;
BEGIN
  -- دریافت رسانه
  SELECT * INTO media_data
  FROM candidate_media
  WHERE id = media_id;
  
  -- بررسی وجود رسانه
  IF media_data.id IS NULL THEN
    RAISE EXCEPTION 'رسانه یافت نشد';
  END IF;
  
  -- دریافت نام کاربر
  IF is_anonymous THEN
    user_name := 'کاربر ناشناس';
  ELSE
    SELECT full_name INTO user_name
    FROM users
    WHERE id = user_id;
  END IF;
  
  -- ایجاد شناسه نظر
  comment_id := 'comment-' || floor(extract(epoch from now()))::text;
  
  -- ایجاد نظر جدید
  new_comment := jsonb_build_object(
    'id', comment_id,
    'user_id', user_id,
    'content', content,
    'created_at', now(),
    'is_anonymous', is_anonymous,
    'user_name', user_name,
    'likes', 0,
    'dislikes', 0
  );
  
  -- بروزرسانی نظرات
  IF media_data.comments IS NULL OR jsonb_array_length(media_data.comments) = 0 THEN
    comments := jsonb_build_array(new_comment);
  ELSE
    comments := media_data.comments || new_comment;
  END IF;
  
  -- بروزرسانی رسانه
  UPDATE candidate_media
  SET comments = comments
  WHERE id = media_id;
  
  RETURN true;
END;
$$;

-- تابع واکنش به رسانه (لایک/دیسلایک)
CREATE OR REPLACE FUNCTION react_to_media(
  media_id uuid,
  user_id uuid,
  reaction_type text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  media_data candidate_media;
BEGIN
  -- دریافت رسانه
  SELECT * INTO media_data
  FROM candidate_media
  WHERE id = media_id;
  
  -- بررسی وجود رسانه
  IF media_data.id IS NULL THEN
    RAISE EXCEPTION 'رسانه یافت نشد';
  END IF;
  
  -- بروزرسانی واکنش
  IF reaction_type = 'like' THEN
    UPDATE candidate_media
    SET likes = likes + 1
    WHERE id = media_id;
  ELSIF reaction_type = 'dislike' THEN
    UPDATE candidate_media
    SET dislikes = dislikes + 1
    WHERE id = media_id;
  ELSE
    RAISE EXCEPTION 'نوع واکنش نامعتبر است';
  END IF;
  
  RETURN true;
END;
$$;

-- تابع واکنش به انتظار (لایک/دیسلایک)
CREATE OR REPLACE FUNCTION react_to_expectation(
  expectation_id uuid,
  user_id uuid,
  reaction_type text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  expectation_data expectations;
BEGIN
  -- دریافت انتظار
  SELECT * INTO expectation_data
  FROM expectations
  WHERE id = expectation_id;
  
  -- بررسی وجود انتظار
  IF expectation_data.id IS NULL THEN
    RAISE EXCEPTION 'انتظار یافت نشد';
  END IF;
  
  -- بروزرسانی واکنش
  IF reaction_type = 'like' THEN
    UPDATE expectations
    SET likes = likes + 1
    WHERE id = expectation_id;
  ELSIF reaction_type = 'dislike' THEN
    UPDATE expectations
    SET dislikes = dislikes + 1
    WHERE id = expectation_id;
  ELSE
    RAISE EXCEPTION 'نوع واکنش نامعتبر است';
  END IF;
  
  RETURN true;
END;
$$;