import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// GET - List comments for a report
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('report_id')

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'report_id diperlukan' },
        { status: 400 }
      )
    }

    const { data, error } = await getSupabase()
      .from('comments')
      .select('id, report_id, author_name, body, created_at')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil komentar' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// POST - Add a comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { report_id, author_name, author_phone, comment } = body

    if (!report_id || !comment) {
      return NextResponse.json(
        { success: false, error: 'report_id dan comment harus diisi' },
        { status: 400 }
      )
    }

    if (comment.length < 1 || comment.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Komentar minimal 1 karakter, maksimal 1000 karakter' },
        { status: 400 }
      )
    }

    const { data, error } = await getSupabase()
      .from('comments')
      .insert({
        report_id,
        author_name: author_name || 'Warga Jaksel',
        author_phone: author_phone || null,
        body: comment,
      })
      .select('id, report_id, author_name, body, created_at')
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan komentar' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Komentar berhasil dikirim',
        data,
      },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
