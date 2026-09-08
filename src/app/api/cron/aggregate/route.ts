import { NextResponse } from 'next/server'
import { aggregateReports } from '@/lib/aggregate-alerts'

// Vercel Cron: runs every 5 minutes
// Add to vercel.json: { "cron": "* /5 * * * *" }
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await aggregateReports()
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (err) {
    console.error('[cron/aggregate] Error:', err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
