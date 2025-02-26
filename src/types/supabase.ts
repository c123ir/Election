/**
 * تعریف انواع داده‌های Supabase
 * 
 * این فایل تایپ‌های TypeScript را برای جداول دیتابیس تعریف می‌کند
 * برای استفاده با کلاینت Supabase و تضمین type safety
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          full_name: string | null
          role: string
          business_category?: string
          business_name?: string
          created_at: string
          is_approved?: boolean
        }
        Insert: {
          id?: string
          phone: string
          full_name?: string | null
          role?: string
          business_category?: string
          business_name?: string
          created_at?: string
          is_approved?: boolean
        }
        Update: {
          id?: string
          phone?: string
          full_name?: string | null
          role?: string
          business_category?: string
          business_name?: string
          created_at?: string
          is_approved?: boolean
        }
      }
      candidates: {
        Row: {
          user_id: string
          bio: string | null
          proposals: Json | null
          avatar_url: string | null
          approved: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          bio?: string | null
          proposals?: Json | null
          avatar_url?: string | null
          approved?: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          bio?: string | null
          proposals?: Json | null
          avatar_url?: string | null
          approved?: boolean
          created_at?: string
        }
      }
      verification_codes: {
        Row: {
          id: string
          phone: string
          code: string
          created_at: string
          expires_at: string
          is_used: boolean
        }
        Insert: {
          id?: string
          phone: string
          code: string
          created_at?: string
          expires_at: string
          is_used?: boolean
        }
        Update: {
          id?: string
          phone?: string
          code?: string
          created_at?: string
          expires_at?: string
          is_used?: boolean
        }
      }
      chat_rooms: {
        Row: {
          id: string
          title: string
          type: string
          created_at: string
          created_by: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          type: string
          created_at?: string
          created_by?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          type?: string
          created_at?: string
          created_by?: string | null
          is_active?: boolean
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string | null
          content: string
          created_at: string
          is_deleted: boolean
          deleted_by: string | null
        }
        Insert: {
          id?: string
          room_id: string
          sender_id?: string | null
          content: string
          created_at?: string
          is_deleted?: boolean
          deleted_by?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string | null
          content?: string
          created_at?: string
          is_deleted?: boolean
          deleted_by?: string | null
        }
      }
      chat_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          phone: string | null
          is_admin: boolean
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          is_admin?: boolean
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          is_admin?: boolean
          is_approved?: boolean
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          voter_id: string
          candidate_id: string
          created_at: string
        }
        Insert: {
          id?: string
          voter_id: string
          candidate_id: string
          created_at?: string
        }
        Update: {
          id?: string
          voter_id?: string
          candidate_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      approve_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      block_user: {
        Args: {
          user_id: string
          reason: string
        }
        Returns: undefined
      }
      create_verification_code: {
        Args: {
          phone_number: string
          code: string
        }
        Returns: string
      }
      verify_code: {
        Args: {
          phone_number: string
          input_code: string
        }
        Returns: boolean
      }
      register_user: {
        Args: {
          phone_number: string
          name: string
          business_cat: string
          business_name: string
        }
        Returns: string
      }
      register_candidate: {
        Args: {
          user_id: string
          bio: string
          proposals: Json
        }
        Returns: boolean
      }
      approve_candidate: {
        Args: {
          candidate_id: string
        }
        Returns: boolean
      }
      cast_vote: {
        Args: {
          voter: string
          candidate: string
        }
        Returns: boolean
      }
      get_vote_results: {
        Args: Record<PropertyKey, never>
        Returns: {
          candidate_id: string
          candidate_name: string
          votes_count: number
        }[]
      }
      create_chat_room: {
        Args: {
          room_title: string
          room_type: string
          creator_id: string
        }
        Returns: string
      }
      send_message: {
        Args: {
          room: string
          sender: string
          msg_content: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}