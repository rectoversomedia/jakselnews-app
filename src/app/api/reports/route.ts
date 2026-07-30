import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Auto-categorize based on keywords in description
function autoCategorize(description: string): string {
  const text = description.toLowerCase()

  const categories: Record<string, string[]> = {
    keamanan: ['rampok', 'curat', 'curanmor', 'pencurian', 'perampokan', 'maling', 'kejadian', 'kriminal', 'polisi', 'teror', 'begal', 'preman', 'tawuran', 'pencopet'],
    lalu_lintas: ['macet', 'lalu lintas', 'kemacetan', 'laka', 'kecelakaan', 'tabrakan', 'arus balik', 'lalin', 'parkir', 'lampu merah'],
    banjir: ['banjir', 'genangan', 'air', 'tenggelam', 'kali meluap', 'drainase', 'luapan'],
    kebakaran: ['kebakaran', 'api', 'bakar', 'asap', 'kobar', 'merembet'],
    penerangan: ['lampu jalan', 'penerangan', 'tiang listrik', 'pju', 'gelap', 'listrik padam'],
    lingkungan: ['sampah', 'bau', 'limbah', 'pohon tumbang', 'tumpukan'],
    kemacetan: ['macet parah', 'pengalihan', 'demonstrasi', 'demo'],
    'jalan-rusak': ['jalan rusak', 'lubang', 'bolong', 'retak', 'kerusakan jalan', 'aspal'],
    kriminal: ['narkoba', 'balap liar', 'judi', 'prostitusi'],
    sampah: ['tumpukan sampah', 'tpa', 'buang sampah', 'bau sampah'],
    fenomena: ['langka', 'aneh', 'viral', 'fenomena'],
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  return 'lainnya'
}

// GET - List reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ success: false, error: 'Gagal mengambil laporan' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// POST - Create new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      description,
      latitude,
      longitude,
      kecamatan,
      kelurahan,
      reporter_name,
      reporter_phone,
      reporter_email,
      is_anonymous = false,
      media_url,
    } = body

    // Basic validation
    if (!type || !description) {
      return NextResponse.json(
        { success: false, error: 'Kategori dan deskripsi harus diisi' },
        { status: 400 }
      )
    }

    if (description.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Deskripsi minimal 10 karakter' },
        { status: 400 }
      )
    }

    // Build location
    const location_name = [kelurahan, kecamatan, 'Jakarta Selatan'].filter(Boolean).join(', ')

    // Auto-categorize
    const auto_category = autoCategorize(description)

    const { data, error } = await supabase
      .from('reports')
      .insert({
        id: uuidv4(),
        type,
        description,
        latitude: latitude || null,
        longitude: longitude || null,
        location_name: location_name || null,
        media_url: media_url || null,
        status: 'pending',
        verified: false,
        auto_category: auto_category,
        priority: auto_category !== 'lainnya' ? 'normal' : 'low',
        reporter_name: is_anonymous ? null : (reporter_name || null),
        reporter_phone: is_anonymous ? null : (reporter_phone || null),
        reporter_email: is_anonymous ? null : (reporter_email || null),
        is_anonymous,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan laporan' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Laporan berhasil dikirim. Terima kasih atas kontribusi Anda!',
      data,
    }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
