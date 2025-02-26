// src/types/cafe.ts
export interface CafeSystem {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
  current_user?: CafeUser;
  start_time?: string;
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
    os: string;
  };
}

export interface CafeUser {
  id: string;
  name: string;
  national_id?: string;
  phone?: string;
  credit: number;
  total_time: number;
  favorite_systems: string[];
  last_visit: string;
}

export interface CafeService {
  id: string;
  name: string;
  price: number;
  category: 'print' | 'scan' | 'copy' | 'internet' | 'other';
  description?: string;
  unit: 'page' | 'minute' | 'hour' | 'piece';
}

export interface CafeTransaction {
  id: string;
  user_id: string;
  system_id?: string;
  service_id?: string;
  amount: number;
  type: 'time' | 'service';
  payment_method: 'cash' | 'credit' | 'online';
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface CafeReport {
  daily_income: number;
  system_usage: {
    system_id: string;
    total_hours: number;
    income: number;
  }[];
  service_usage: {
    service_id: string;
    count: number;
    income: number;
  }[];
  peak_hours: {
    hour: number;
    count: number;
  }[];
  user_statistics: {
    total_users: number;
    new_users: number;
    returning_users: number;
  };
}