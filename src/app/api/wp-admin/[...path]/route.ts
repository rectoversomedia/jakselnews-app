import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const WP_HOST_IP = '153.92.8.164';
const WP_DOMAIN = 'jakselnews.com';

function buildWpPath(pathSegments: string[]): string {
  const wpPath = '/' + (pathSegments || []).join('/');
  if (!wpPath.endsWith('/') && (
    wpPath === '/wp-admin' ||
    wpPath === '/wp-login.php' ||
    wpPath.startsWith('/wp-admin/')
  )) {
    return wpPath + '/';
  }
  return wpPath;
}

function wpFetch(
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  return new Promise((resolve) => {
    const url = new URL(`https://${WP_DOMAIN}${path}`);
    const isLoginPage = path.includes('wp-login');

    const reqOptions = {
      hostname: WP_HOST_IP,
      port: 443,
      path: path + (url.search || ''),
      method: options.method || 'GET',
      headers: {
        'Host': WP_DOMAIN,
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': options.headers?.['user-agent'] || 'Mozilla/5.0',
        'Referer': `https://${WP_DOMAIN}/wp-admin/`,
        ...options.headers,
      },
      rejectUnauthorized: false,
      servername: WP_DOMAIN,
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const headers: Record<string, string> = {};
        Object.entries(res.headers).forEach(([k, v]) => {
          headers[k] = Array.isArray(v) ? v[0] : (v || '');
        });
        resolve({ status: res.statusCode || 0, headers, body });
      });
    });

    req.on('error', (e) => resolve({ status: 0, headers: {}, body: '', }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ status: 0, headers: {}, body: '' }); });

    if (options.body) req.write(options.body);
    req.end();
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const wpPath = buildWpPath(path);
  const result = await wpFetch(wpPath, {
    headers: {
      'user-agent': request.headers.get('user-agent') || '',
      'cookie': request.headers.get('cookie') || '',
    },
  });

  if (result.status === 0) {
    return new NextResponse('Cannot reach WordPress admin', { status: 502 });
  }

  const contentType = result.headers['content-type'] || '';
  const location = result.headers['location'];

  // Handle WordPress redirects
  if (location) {
    let proxyPath = location;
    // Strip domain and protocol
    proxyPath = proxyPath.replace(/^https?:\/\/[^/]+/, '');
    // Strip trailing slash to match our URL convention
    proxyPath = proxyPath.replace(/\/$/, '');
    const respHeaders = new Headers();
    if (result.headers['set-cookie']) {
      respHeaders.set('Set-Cookie', result.headers['set-cookie']);
    }
    respHeaders.set('Location', `/api/wp-admin${proxyPath}`);
    return new NextResponse(null, { status: 302, headers: respHeaders });
  }

  if (contentType.includes('text/html')) {
    const rewritten = rewriteHtml(result.body, wpPath);
    const respHeaders = new Headers();
    respHeaders.set('Content-Type', contentType);
    respHeaders.set('Cache-Control', 'no-store');
    if (result.headers['set-cookie']) {
      respHeaders.set('Set-Cookie', result.headers['set-cookie']);
    }
    return new NextResponse(rewritten, { status: 200, headers: respHeaders });
  }

  return new NextResponse(result.body, {
    status: result.status,
    headers: { 'Content-Type': contentType },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const wpPath = buildWpPath(path);
  const body = await request.text();

  const result = await wpFetch(wpPath, {
    method: 'POST',
    headers: {
      'user-agent': request.headers.get('user-agent') || '',
      'cookie': request.headers.get('cookie') || '',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (result.status === 0) {
    return new NextResponse('Cannot reach WordPress admin', { status: 502 });
  }

  const contentType = result.headers['content-type'] || 'text/html';
  const rewritten = rewriteHtml(result.body, wpPath);

  const respHeaders = new Headers();
  respHeaders.set('Content-Type', contentType);
  respHeaders.set('Cache-Control', 'no-store');
  if (result.headers['set-cookie']) {
    respHeaders.set('Set-Cookie', result.headers['set-cookie']);
  }

  // If WP redirects after login, rewrite to proxy
  const location = result.headers['location'];
  if (location) {
    const proxyPath = location.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '');
    respHeaders.set('Location', `/api/wp-admin${proxyPath || '/wp-admin'}`);
    return new NextResponse(null, { status: 302, headers: respHeaders });
  }

  return new NextResponse(rewritten, { status: 200, headers: respHeaders });
}

function rewriteHtml(html: string, currentPath: string): string {
  return html
    .replace(/url=\/wp-login\.php[^"]*/g, 'url=/api/wp-admin/wp-login.php')
    .replace(/url=\/wp-admin[^"]*/g, 'url=/api/wp-admin/wp-admin')
    .replace(/action="https:\/\/[^"]+\/wp-login\.php[^"]*"/g, 'action="/api/wp-admin/wp-login.php"')
    .replace(/action="\/wp-login\.php"/g, 'action="/api/wp-admin/wp-login.php"')
    .replace(/https:\/\/[^/]+\/wp-admin\//g, '/api/wp-admin/')
    .replace(/https:\/\/[^/]+\/wp-content\//g, '/api/wp-admin/wp-content/')
    .replace(/https:\/\/[^/]+\/wp-includes\//g, '/api/wp-admin/wp-includes/')
    .replace(/(src|href)="https:\/\/[^"]+((?:wp-includes|wp-content|wp-admin)[^"]*)"/g, '$1="/api/wp-admin/$2"')
    .replace(/https:\/\/[^/]+\/wp-login\.php/g, '/api/wp-admin/wp-login.php');
}
