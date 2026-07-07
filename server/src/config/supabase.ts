import { createClient } from '@supabase/supabase-js';
import { config } from './index';

export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);

export const supabaseAdmin = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY
);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin' | 'superadmin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin' | 'superadmin';
        };
        Update: {
          phone?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin' | 'superadmin';
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          summary: string | null;
          image_url: string | null;
          category: string;
          location: string | null;
          views: number;
          is_breaking_news: boolean;
          is_published: boolean;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          icon: string | null;
          is_active: boolean;
          report_count: number;
          created_at: string;
          expires_at: string | null;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          description: string;
          latitude: number | null;
          longitude: number | null;
          location_name: string | null;
          media_url: string | null;
          status: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected';
          verified: boolean;
          auto_category: string | null;
          priority: 'low' | 'normal' | 'high' | 'urgent';
          assigned_to: string | null;
          admin_notes: string | null;
          reporter_name: string | null;
          reporter_phone: string | null;
          reporter_email: string | null;
          is_anonymous: boolean;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          description: string;
          latitude?: number | null;
          longitude?: number | null;
          location_name?: string | null;
          media_url?: string | null;
          status?: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected';
          verified?: boolean;
          auto_category?: string | null;
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          assigned_to?: string | null;
          admin_notes?: string | null;
          reporter_name?: string | null;
          reporter_phone?: string | null;
          reporter_email?: string | null;
          is_anonymous?: boolean;
        };
        Update: {
          status?: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected';
          verified?: boolean;
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          assigned_to?: string | null;
          admin_notes?: string | null;
          resolved_at?: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          icon_color: string | null;
          url: string | null;
          is_popular: boolean;
          order_index: number;
          created_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          color: string;
          bg_color: string;
          keywords: string[];
          is_active: boolean;
          sort_order: number;
        };
      };
    };
  };
}
