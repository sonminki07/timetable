export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'pro';
  status: 'active' | 'expired' | 'cancelled';
  starts_at: string;
  expires_at: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  portone_payment_id?: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  method?: string;
  paid_at?: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  benefit_type: 'period' | 'credit' | 'hybrid' | 'ad_free';
  duration_days?: number;
  credits_grant?: {
    ai_v2?: number;
    pdf_export?: number;
  };
  max_redemptions?: number | null;
  current_redemptions?: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
}

export interface UserCredit {
  user_id: string;
  ai_v2_count: number;
  pdf_export_count: number;
  ad_free_until?: string | null;
  vip_until?: string | null;
  updated_at: string;
}
