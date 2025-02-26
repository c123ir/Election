// src/types/index.ts
export type BusinessCategory = 
  | 'computer'
  | 'office_equipment'
  | 'internet_cafe'
  | 'bookstore'
  | 'typing_copying'
  | 'stationery'
  | 'binding'
  | 'pos_terminal';

export const BUSINESS_CATEGORIES: { [key in BusinessCategory]: string } = {
  computer: 'رایانه',
  office_equipment: 'ماشین‌های اداری',
  internet_cafe: 'کافی‌نت',
  bookstore: 'کتاب فروشی',
  typing_copying: 'تایپ و تکثیر',
  stationery: 'نوشت افزار',
  binding: 'صحافی',
  pos_terminal: 'دستگاه‌های کارتخوان'
};

export interface ImprovementRequest {
  id: string;
  title: string;
  description: string;
  business_category: BusinessCategory;
  user_id: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    up: number;
    down: number;
  };
  comments: Comment[];
}

export interface ServiceImprovement {
  id: string;
  title: string;
  description: string;
  category: 'digital' | 'education' | 'support' | 'other';
  status: 'planned' | 'in_progress' | 'completed';
  target_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UnionService {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  is_active: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  user_name: string;
  likes: number;
  dislikes: number;
}

export interface User {
  id: string;
  phone: string;
  full_name: string;
  role: 'admin' | 'candidate' | 'member';
  created_at: string;
  business_category?: BusinessCategory;
  business_name?: string;
  logo_url?: string;
  is_approved?: boolean;
  nickname?: string;
  privacy_settings?: {
    hide_identity: boolean;
    hide_business_info: boolean;
    anonymous_chat: boolean;
    anonymous_voting: boolean;
    notification_preferences: {
      email: boolean;
      sms: boolean;
      webinar_reminders: boolean;
      vote_confirmations: boolean;
    };
  };
}

export interface Candidate extends User {
  bio?: string;
  proposals?: string[];
  avatar_url?: string;
  approved?: boolean;
  media?: CandidateMedia[];
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  type: 'text' | 'image' | 'file';
  room_id: string;
  is_anonymous?: boolean;
  reactions?: {
    likes: number;
    dislikes: number;
    userReaction?: 'like' | 'dislike';
  };
}

export interface ChatRoom {
  id: string;
  title: string;
  type: 'public' | 'private' | 'candidate';
  candidate_id?: string;
  created_at: string;
  last_message?: Message;
  participants: User[];
  allow_anonymous?: boolean;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  candidate_id: string;
  start_time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'live' | 'ended';
  participants_count: number;
  recording_url?: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  business_category: BusinessCategory;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  created_at: string;
  end_date: string;
  total_votes: number;
  is_active: boolean;
  participants: string[];
  created_by: string;
}

export interface Expectation {
  id: string;
  user_id: string;
  title: string;
  description: string;
  business_category: BusinessCategory;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
  candidate_responses: {
    id: string;
    candidate_id: string;
    expectation_id: string;
    content: string;
    action_plan: string[];
    estimated_time: string;
    created_at: string;
    likes: number;
    dislikes: number;
    comments: Comment[];
  }[];
}

export interface CandidateMedia {
  id: string;
  candidate_id: string;
  title: string;
  description?: string;
  url: string;
  type: 'video' | 'image' | 'document';
  file_type?: string;
  thumbnail_url?: string;
  created_at: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}