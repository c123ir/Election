/*
  # Authentication and Chat System Setup

  1. New Tables
    - `verification_codes`: Stores OTP codes for phone verification
    - `user_sessions`: Tracks user login sessions
    - `chat_rooms`: Manages chat rooms (public/private)
    - `chat_messages`: Stores chat messages
    - `chat_participants`: Tracks users in chat rooms
    - `blocked_users`: Tracks blocked users

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Admin-only operations for user management
*/

-- Verification Codes Table
CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_used boolean DEFAULT false
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Chat Rooms Table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text CHECK (type IN ('public', 'private', 'candidate')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_by uuid REFERENCES auth.users(id)
);

-- Chat Participants Table
CREATE TABLE IF NOT EXISTS chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Blocked Users Table
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_by uuid REFERENCES auth.users(id),
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, blocked_by)
);

-- Add admin phone column to profiles
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Enable RLS
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

-- Policies

-- Verification codes: Only the owner can see their codes
CREATE POLICY "Users can see own verification codes"
  ON verification_codes
  FOR SELECT
  TO authenticated
  USING (phone = auth.jwt()->>'phone');

-- User sessions: Users can see their own sessions
CREATE POLICY "Users can see own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Chat rooms: Users can see rooms they're part of
CREATE POLICY "Users can see their chat rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT room_id 
      FROM chat_participants 
      WHERE user_id = auth.uid()
    )
    OR type = 'public'
  );

-- Chat messages: Users can see messages in their rooms
CREATE POLICY "Users can see messages in their rooms"
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

-- Chat participants: Users can see participants in their rooms
CREATE POLICY "Users can see participants in their rooms"
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

-- Admin functions
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

-- Admin policies
CREATE POLICY "Admins can manage all chat rooms"
  ON chat_rooms
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can manage all messages"
  ON chat_messages
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can manage blocked users"
  ON blocked_users
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Function to approve user
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

-- Function to block user
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