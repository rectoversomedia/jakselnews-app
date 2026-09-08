import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const WP_HOST_IP = '153.92.8.164';
const WP_DOMAIN = 'jakselnews.com';

function fetchFromOldHost(path: string, params: URLSearchParams): Promise<{
  ok: boolean; status: number | string; data: any; error?: string;
  wpTotal?: string; wpTotalPages?: string;
}> {
  return new Promise((resolve) => {
    // Strip 'endpoint' from params if present — it's already in the path
    params.delete('endpoint');

    // Normalize: always use full WP REST API path
    let wpPath = path;
    if (!wpPath.startsWith('/wp-json/')) {
      wpPath = '/wp-json/wp/v2' + (wpPath.startsWith('/') ? wpPath : '/' + wpPath);
    }

    const options = {
      hostname: WP_HOST_IP,
      port: 443,
      path: `${wpPath}?${params.toString()}`,
      method: 'GET',
      headers: {
        'Host': WP_DOMAIN,
        'Accept': 'application/json',
        'User-Agent': 'Jakselnews-Proxy/1.0',
      },
      rejectUnauthorized: false,
      servername: WP_DOMAIN, // SNI — tells old host which SSL cert to present
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const h = res.headers;
        const rawTotal = h['x-wp-total'];
        const rawPages = h['x-wp-totalpages'];
        const wpTotal = (Array.isArray(rawTotal) ? rawTotal[0] : rawTotal) || '0';
        const wpTotalPages = (Array.isArray(rawPages) ? rawPages[0] : rawPages) || '1';
        try {
          const data = JSON.parse(body);
          resolve({ ok: true, status: res.statusCode || 0, data, wpTotal, wpTotalPages });
        } catch {
          resolve({ ok: false, status: res.statusCode || 0, data: null, error: 'Invalid JSON', wpTotal: '0', wpTotalPages: '1' });
        }
      });
    });

    req.on('error', (e) => resolve({ ok: false, status: 0, data: null, error: e.message }));
    req.setTimeout(10000, () => { req.destroy(); resolve({ ok: false, status: 0, data: null, error: 'Timeout' }); });
    req.end();
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const forwardedParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    forwardedParams.set(key, value);
  });

  const endpoint = forwardedParams.get('endpoint') || '/wp-json/wp/v2/posts';
  forwardedParams.delete('endpoint');

  try {
    const result = await fetchFromOldHost(endpoint, forwardedParams);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error || `WP Error: ${result.status}` },
        { status: Number(result.status) || 500 }
      );
    }

    const wpData = Array.isArray(result.data) ? result.data : [];

    return NextResponse.json({
      success: true,
      data: wpData,
      pagination: {
        page: parseInt(forwardedParams.get('page') || '1'),
        perPage: parseInt(forwardedParams.get('per_page') || '10'),
        total: parseInt(result.wpTotal || '0'),
        totalPages: parseInt(result.wpTotalPages || '1'),
      },
    });
  } catch (err) {
    console.error('[wordpress-proxy] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch WordPress data' },
      { status: 500 }
    );
  }
}
