import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alert_id } = body

    if (!alert_id) {
      return NextResponse.json(
        { success: false, error: 'alert_id diperlukan' },
        { status: 400 }
      )
    }

    // Get current upvotes
    const { data: current, error: getError } = await getSupabaseAdmin()
      .from('alerts')
      .select('upvotes')
      .eq('id', alert_id)
      .single()

    if (getError || !current) {
      return NextResponse.json(
        { success: false, error: 'Alert tidak ditemukan' },
        { status: 404 }
      )
    }

    // Increment
    const newUpvotes = (current.upvotes ?? 0) + 1

    const { data, error: updateError } = await getSupabaseAdmin()
      .from('alerts')
      .update({ upvotes: newUpvotes })
      .eq('id', alert_id)
      .select('id, upvotes')
      .single()

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Gagal upvote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { id: alert_id, upvotes: newUpvotes },
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
