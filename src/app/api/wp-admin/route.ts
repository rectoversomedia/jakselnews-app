import { NextRequest, NextResponse } from 'next/server'

// Redirect /api/wp-admin (exact path) to the admin login
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  url.pathname = '/api/wp-admin/wp-login.php';
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  url.pathname = '/api/wp-admin/wp-login.php';
  return NextResponse.redirect(url);
}
