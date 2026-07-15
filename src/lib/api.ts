// API Client for Jakselnews

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fallback to VPS if localhost not available
const FALLBACK_API_URL = 'https://31.97.106.177:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Report {
  id: string;
  type: string;
  description: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  status: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  reporter_name?: string;
  reporter_phone?: string;
  reporter_email?: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color: string;
  bg_color: string;
  keywords?: string[];
  is_active: boolean;
  sort_order: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Terjadi kesalahan',
        };
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message || 'Gagal terhubung ke server',
      };
    }
  }

  // Reports
  async getReports(params?: {
    type?: string;
    status?: string;
    kecamatan?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Report[]>> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.set('type', params.type);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.kecamatan) queryParams.set('kecamatan', params.kecamatan);
    if (params?.page) queryParams.set('page', String(params.page));
    if (params?.limit) queryParams.set('limit', String(params.limit));

    const query = queryParams.toString();
    return this.request<Report[]>(`/reports${query ? `?${query}` : ''}`);
  }

  async getReport(id: string): Promise<ApiResponse<Report>> {
    return this.request<Report>(`/reports/${id}`);
  }

  async createReport(data: {
    type: string;
    description: string;
    latitude?: number;
    longitude?: number;
    kecamatan?: string;
    kelurahan?: string;
    reporter_name?: string;
    reporter_phone?: string;
    reporter_email?: string;
    is_anonymous?: boolean;
    media_url?: string;
  }): Promise<ApiResponse<Report>> {
    return this.request<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReportStats(): Promise<ApiResponse<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byKecamatan: Record<string, number>;
  }>> {
    return this.request('/reports/stats/summary');
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; latency: string }>> {
    return this.request('/health');
  }
}

export const api = new ApiClient();
export type { Report, Category, ApiResponse };
