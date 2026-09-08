import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

    let client: ReturnType<typeof createClient>

    if (serviceKey) {
      client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
    } else {
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      client = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
    }

    const { data, error } = await client
      .from('alerts')
      .select('id, title, description, category, icon, is_active, report_count, created_at, expires_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[alerts] error:', JSON.stringify(error));
      return NextResponse.json({ success: false, error: 'Gagal mengambil peringatan' }, { status: 500 })
    }

    // Add defaults for new fields
    const alerts = (data || []).map((a: any) => ({
      ...a,
      verification_type: a.verification_type || 'early',
      upvotes: a.upvotes || 0,
    }))

    // Sort by upvotes descending
    alerts.sort((a: any, b: any) => b.upvotes - a.upvotes)

    return NextResponse.json({ success: true, data: alerts })
  } catch (err) {
    console.error('[alerts] catch error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
