import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, slug, description, icon, icon_color, url, is_popular, order_index')
      .order('order_index', { ascending: true })

    if (error) {
      return NextResponse.json({ success: false, error: 'Gagal mengambil layanan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
