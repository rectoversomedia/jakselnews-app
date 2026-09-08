import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const WP_HOST_IP = '153.92.8.164'
const WP_DOMAIN = 'jakselnews.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const wpPath = '/' + (path || []).join('/')
  const query = request.nextUrl.search

  return new Promise<Response>((resolve) => {
    const req = https.request(
      {
        hostname: WP_HOST_IP,
        port: 443,
        path: wpPath + query,
        method: 'GET',
        headers: {
          'Host': WP_DOMAIN,
          'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
          'Accept': 'image/webp,image/apng,image/*,*/*',
          'Referer': `https://${WP_DOMAIN}/`,
        },
        rejectUnauthorized: false,
        servername: WP_DOMAIN,
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => {
          const body = Buffer.concat(chunks)
          const rawCt = (res.headers['content-type'] as string) || ''
          // Fallback content-type detection from URL extension when server sends wrong type
          const extMap: Record<string, string> = {
            '.avif': 'image/avif',
            '.webp': 'image/webp',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
          }
          const ext = wpPath.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || ''
          const ct = rawCt.startsWith('image/') || !extMap[ext]
            ? rawCt
            : extMap[ext]
          const cache = res.statusCode === 200
            ? 'public, max-age=31536000, immutable'
            : 'no-store'
          resolve(new NextResponse(body, {
            status: res.statusCode || 200,
            headers: {
              'Content-Type': ct,
              'Cache-Control': cache,
              'X-Proxy': 'wp-image',
            },
          }))
        })
      }
    )
    req.on('error', () =>
      resolve(new NextResponse(null, { status: 502 }))
    )
    req.setTimeout(15000, () => {
      req.destroy()
      resolve(new NextResponse(null, { status: 504 }))
    })
    req.end()
  })
}
