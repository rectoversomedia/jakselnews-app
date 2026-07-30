// Simplified API Client for Jakselnews
// All routes are now Next.js API routes

const BASE_URL = '' // Relative path - uses same origin

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Report {
  id: string
  type: string
  description: string
  latitude?: number
  longitude?: number
  location_name?: string
  status: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  reporter_name?: string
  reporter_phone?: string
  reporter_email?: string
  is_anonymous: boolean
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  color: string
  bg_color: string
  keywords?: string[]
  sort_order: number
}

interface Service {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  icon_color?: string
  url?: string
  is_popular: boolean
  order_index: number
}

interface Alert {
  id: string
  title: string
  description?: string
  category: string
  icon?: string
  is_active: boolean
  report_count: number
  created_at: string
  expires_at?: string
}

interface Comment {
  id: string
  report_id: string
  author_name?: string
  body: string
  created_at: string
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Terjadi kesalahan',
        }
      }

      return data
    } catch (error: any) {
      console.error('API Error:', error)
      return {
        success: false,
        error: error.message || 'Gagal terhubung ke server',
      }
    }
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/api/categories')
  }

  // Services
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>('/api/services')
  }

  // Alerts
  async getAlerts(): Promise<ApiResponse<Alert[]>> {
    return this.request<Alert[]>('/api/alerts')
  }

  // Reports
  async getReports(params?: {
    type?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<Report[]>> {
    const queryParams = new URLSearchParams()
    if (params?.type) queryParams.set('type', params.type)
    if (params?.status) queryParams.set('status', params.status)
    if (params?.page) queryParams.set('page', String(params.page))
    if (params?.limit) queryParams.set('limit', String(params.limit))

    const query = queryParams.toString()
    return this.request<Report[]>(`/api/reports${query ? `?${query}` : ''}`)
  }

  async createReport(data: {
    type: string
    description: string
    latitude?: number
    longitude?: number
    kecamatan?: string
    kelurahan?: string
    reporter_name?: string
    reporter_phone?: string
    reporter_email?: string
    is_anonymous?: boolean
    media_url?: string
  }): Promise<ApiResponse<Report>> {
    return this.request<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Comments
  async getComments(reportId: string): Promise<ApiResponse<Comment[]>> {
    return this.request<Comment[]>(`/api/comments?report_id=${reportId}`)
  }

  async createComment(data: {
    report_id: string
    author_name?: string
    author_phone?: string
    comment: string
  }): Promise<ApiResponse<Comment>> {
    return this.request<Comment>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient()
export type { Report, Category, Service, Alert, Comment, ApiResponse }
