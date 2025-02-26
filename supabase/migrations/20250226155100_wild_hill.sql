/*
  # Create Profiles Table and Update Policies

  1. Tables
    - Create profiles table first
    - Add necessary columns for user management
  
  2. Security
    - Drop existing policies
    - Create new policies with proper profile checks
    - Add admin functions
*/

-- Create profiles table first
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  phone text UNIQUE,
  is_admin boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Verification codes policies
  DROP POLICY IF EXISTS "Users can see own verification codes" ON verification_codes;
  DROP POLICY IF EXISTS "Anyone can insert verification codes" ON verification_codes;
  DROP POLICY IF EXISTS "Users can update verification codes" ON verification_codes;
  
  -- User sessions policies
  DROP POLICY IF EXISTS "Users can see own sessions" ON user_sessions;
  
  -- Chat rooms policies
  DROP POLICY IF EXISTS "Users can see their chat rooms" ON chat_rooms;
  DROP POLICY IF EXISTS "Admins can manage all chat rooms" ON chat_rooms;
  
  -- Chat messages policies
  DROP POLICY IF EXISTS "Users can see messages in their rooms" ON chat_messages;
  DROP POLICY IF EXISTS "Admins can manage all messages" ON chat_messages;
  
  -- Chat participants policies
  DROP POLICY IF EXISTS "Users can see participants in their rooms" ON chat_participants;
  
  -- Blocked users policies
  DROP POLICY IF EXISTS "Admins can manage blocked users" ON blocked_users;
END $$;

-- Create new policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Verification codes policies
CREATE POLICY "Anyone can insert verification codes"
  ON verification_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can see verification codes"
  ON verification_codes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update verification codes"
  ON verification_codes
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- User sessions policies
CREATE POLICY "Users can manage own sessions"
  ON user_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Chat rooms policies
CREATE POLICY "Users can view public and joined rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (
    type = 'public' OR
    id IN (
      SELECT room_id 
      FROM chat_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms"
  ON chat_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Chat messages policies
CREATE POLICY "Users can view messages in their rooms"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    room_id IN (
      SELECT room_id 
      FROM chat_participants 
      WHERE user_id = auth.uid()
    )
    AND NOT is_deleted
  );

CREATE POLICY "Users can send messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    room_id IN (
      SELECT room_id 
      FROM chat_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Chat participants policies
CREATE POLICY "Users can view room participants"
  ON chat_participants
  FOR SELECT
  TO authenticated
  USING (
    room_id IN (
      SELECT room_id 
      FROM chat_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Admin policies
CREATE POLICY "Admins can do anything with chat rooms"
  ON chat_rooms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can do anything with messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage blocked users"
  ON blocked_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Helper functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin management functions
CREATE OR REPLACE FUNCTION approve_user(user_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve users';
  END IF;
  
  UPDATE profiles
  SET is_approved = true
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION block_user(user_id uuid, reason text)
RETURNS void AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can block users';
  END IF;
  
  INSERT INTO blocked_users (user_id, blocked_by, reason)
  VALUES (user_id, auth.uid(), reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;