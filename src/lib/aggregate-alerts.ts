import { getSupabase } from '@/lib/supabase'

const VERIFIED_THRESHOLD = 3
const LOOKBACK_HOURS = 24
const ALERT_EXPIRE_HOURS = 48

const CAT_LABELS: Record<string, string> = {
  keamanan: 'Waspada Keamanan',
  lalu_lintas: 'Kemacetan Lalu Lintas',
  banjir: 'Banjir / Genangan Air',
  kebakaran: 'Kebakaran',
  penerangan: 'Gangguan Penerangan',
  lingkungan: 'Isu Lingkungan',
  kemacetan: 'Kemacetan Parah',
  'jalan-rusak': 'Jalan Rusak',
  kriminal: 'Aktivitas Kriminal',
  sampah: 'Tumpukan Sampah',
  fenomena: 'Fenomena Menarik',
  lainnya: 'Laporan Warga',
}

const CAT_ICONS: Record<string, string> = {
  keamanan: '🛡️',
  lalu_lintas: '🚗',
  banjir: '🌊',
  kebakaran: '🔥',
  penerangan: '💡',
  lingkungan: '🌿',
  kemacetan: '🚦',
  'jalan-rusak': '🕳️',
  kriminal: '⚠️',
  sampah: '🗑️',
  fenomena: '✨',
  lainnya: '📌',
}

interface AlertSummary {
  category: string
  count: number
  firstReport: string
  lastReport: string
}

export async function aggregateReports() {
  const supabase = getSupabase()
  const results = { created: 0, updated: 0, deactivated: 0, upgraded: 0, errors: 0 }

  try {
    const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString()

    // Fetch recent reports
    const { data: recentReports, error: reportsError } = await supabase
      .from('reports')
      .select('id, type, created_at, description')
      .gte('created_at', since)
      .eq('status', 'pending')

    if (reportsError) {
      console.error('[aggregate] Error fetching reports:', reportsError)
      return { ...results, errors: results.errors + 1 }
    }

    // Group by type
    const counts: Record<string, AlertSummary> = {}
    for (const r of recentReports || []) {
      if (!counts[r.type]) {
        counts[r.type] = { category: r.type, count: 0, firstReport: r.created_at, lastReport: r.created_at }
      }
      counts[r.type].count++
      if (r.created_at > counts[r.type].lastReport) counts[r.type].lastReport = r.created_at
      if (r.created_at < counts[r.type].firstReport) counts[r.type].firstReport = r.created_at
    }

    // Fetch active alerts
    const { data: activeAlerts, error: alertsError } = await supabase
      .from('alerts')
      .select('id, category, report_count, is_active, expires_at, verification_type, upvotes')
      .eq('is_active', true)

    if (alertsError) {
      console.error('[aggregate] Error fetching alerts:', alertsError)
      return { ...results, errors: results.errors + 1 }
    }

    const activeAlertMap = new Map((activeAlerts || []).map(a => [a.category, a]))

    const now = new Date()
    const expiresAt = new Date(now.getTime() + ALERT_EXPIRE_HOURS * 60 * 60 * 1000).toISOString()

    for (const [category, summary] of Object.entries(counts)) {
      const existing = activeAlertMap.get(category)
      const icon = CAT_ICONS[category] || CAT_ICONS['lainnya']

      const catReports = (recentReports || []).filter(r => r.type === category).slice(0, 3)
      const sampleReports = catReports.map(r => r.description.substring(0, 100)).join(' | ')

      // Title: use first report's description (truncated to 80 chars) for specificity.
      // Fall back to category label only when no description is available.
      const firstDesc = catReports[0]?.description
      const title = firstDesc
        ? (firstDesc.length > 80 ? firstDesc.substring(0, 80) + '…' : firstDesc)
        : CAT_LABELS[category] || CAT_LABELS['lainnya']

      if (existing) {
        // Update existing alert
        const shouldUpgrade = summary.count >= VERIFIED_THRESHOLD && existing.verification_type !== 'verified'
        const updateData: Record<string, unknown> = {
          title,
          report_count: summary.count,
          expires_at: expiresAt,
        }
        if (sampleReports) updateData.description = sampleReports
        if (shouldUpgrade) {
          updateData.verification_type = 'verified'
          results.upgraded++
        }

        await supabase.from('alerts').update(updateData).eq('id', existing.id)
        results.updated++
        activeAlertMap.delete(category)
      } else {
        // Create alert — works from 1st report (early warning)
        const verificationType = summary.count >= VERIFIED_THRESHOLD ? 'verified' : 'early'
        const { error: insertError } = await supabase.from('alerts').insert({
          title,
          category,
          icon,
          description: sampleReports || `Ada laporan warga terkait ${title.toLowerCase()} di Jakarta Selatan.`,
          report_count: summary.count,
          is_active: true,
          verification_type: verificationType,
          upvotes: 0,
          expires_at: expiresAt,
        })

        if (insertError) {
          console.error(`[aggregate] Error creating alert for ${category}:`, insertError)
          results.errors++
        } else {
          results.created++
        }
      }
    }

    // Deactivate alerts for categories with no recent reports
    for (const [, alert] of activeAlertMap) {
      await supabase.from('alerts').update({ is_active: false }).eq('id', alert.id)
      results.deactivated++
    }

    // Deactivate expired alerts
    const nowISO = new Date().toISOString()
    const { data: expiredAlerts } = await supabase
      .from('alerts')
      .select('id')
      .eq('is_active', true)
      .lt('expires_at', nowISO)

    for (const expired of expiredAlerts || []) {
      await supabase.from('alerts').update({ is_active: false }).eq('id', expired.id)
      results.deactivated++
    }

    console.log('[aggregate] Done:', results)
    return results
  } catch (err) {
    console.error('[aggregate] Unexpected error:', err)
    return { ...results, errors: results.errors + 1 }
  }
}
