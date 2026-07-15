/**
 * Test Helpers for Jakselnews E2E Tests
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

/**
 * API Helper class for test data management
 */
export class ApiHelpers {
  /**
   * Create a test user for testing
   */
  static async createTestUser(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  }

  /**
   * Login and get auth token
   */
  static async login(email: string, password: string): Promise<string | null> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data.success ? data.data.token : null;
  }

  /**
   * Create a test report
   */
  static async createTestReport(token: string | null, data: {
    type: string;
    description: string;
    kecamatan?: string;
    reporter_name?: string;
    is_anonymous?: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * Get reports list
   */
  static async getReports(token?: string) {
    const response = await fetch(`${API_BASE_URL}/reports?limit=50`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return response.json();
  }

  /**
   * Update report status (admin only)
   */
  static async updateReportStatus(token: string, reportId: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  /**
   * Get admin stats
   */
  static async getAdminStats(token: string) {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  }

  /**
   * Health check
   */
  static async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

/**
 * Test data generators
 */
export class TestDataGenerators {
  /**
   * Generate random email
   */
  static randomEmail(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@test.com`;
  }

  /**
   * Generate random report data
   */
  static randomReport() {
    const types = ['keamanan', 'banjir', 'kemacetan', 'kebakaran', 'penerangan', 'lingkungan'];
    const kecamatans = ['Cilandak', 'Kebayoran Baru', 'Tebet', 'Kemang', 'Blok M'];

    return {
      type: types[Math.floor(Math.random() * types.length)],
      description: `Test report ${Date.now()}: ${Math.random().toString(36).substring(7)}`,
      kecamatan: kecamatans[Math.floor(Math.random() * kecamatans.length)],
      reporter_name: `Test User ${Math.random().toString(36).substring(7)}`,
      is_anonymous: false,
    };
  }
}
