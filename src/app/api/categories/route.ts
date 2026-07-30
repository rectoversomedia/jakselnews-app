import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('categories')
      .select('id, name, slug, icon, color, bg_color, keywords, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      return NextResponse.json({ success: false, error: 'Gagal mengambil kategori' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
