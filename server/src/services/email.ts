// Email Notification Service using Resend
// https://resend.com

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'Jakselnews <noreply@jakselnews.com>';
const API_URL = 'https://api.resend.com';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface ReportStatusEmail {
  recipientEmail: string;
  recipientName: string;
  reportType: string;
  reportDescription: string;
  newStatus: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected';
  reportId: string;
  adminNotes?: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Baru',
  verified: 'Terverifikasi',
  processing: 'Sedang Diproses',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  verified: '#3b82f6',
  processing: '#8b5cf6',
  resolved: '#10b981',
  rejected: '#ef4444',
};

/**
 * Send email using Resend API
 */
async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch(`${API_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return { success: false, error: errorData.message || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Generate HTML email template
 */
function getEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jakselnews</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ef4444 0%, #f43f5e 100%); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Jakselnews</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Hyperlocal Media Jakarta Selatan</p>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="padding: 24px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
          Email ini dikirim otomatis oleh sistem Jakselnews.<br>
          Jangan balas email ini.<br><br>
          © ${new Date().getFullYear()} Jakselnews - Rectoverso Media
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send report status update email
 */
export async function sendReportStatusEmail(data: ReportStatusEmail): Promise<{ success: boolean; error?: string }> {
  const statusLabel = statusLabels[data.newStatus] || data.newStatus;
  const statusColor = statusColors[data.newStatus] || '#6b7280';

  const content = `
    <h2 style="color: #111827; margin: 0 0 24px; font-size: 20px;">Status Laporan Anda Telah Diperbarui</h2>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Halo <strong>${data.recipientName || 'Warga Jaksel'</strong>,
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Status laporan Anda telah diperbarui menjadi:
    </p>

    <div style="background: ${statusColor}15; border-left: 4px solid ${statusColor}; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">Status:</p>
      <p style="margin: 0; font-size: 24px; font-weight: 700; color: ${statusColor};">${statusLabel}</p>
    </div>

    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">Detail Laporan:</p>
      <p style="margin: 0 0 8px; font-size: 14px; color: #374151;"><strong>Kategori:</strong> ${data.reportType}</p>
      <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.5;"><strong>Deskripsi:</strong> ${data.reportDescription.substring(0, 200)}${data.reportDescription.length > 200 ? '...' : ''}</p>
    </div>

    ${data.adminNotes ? `
    <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #92400e;"><strong>Catatan Admin:</strong></p>
      <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.5;">${data.adminNotes}</p>
    </div>
    ` : ''}

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 24px 0;">
      Anda dapat melihat detail lengkap dan riwayat laporan Anda di dashboard Jakselnews.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://jakselnews.com'}/profil"
         style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600;">
        Lihat Laporan
      </a>
    </div>
  `;

  return sendEmail({
    to: data.recipientEmail,
    subject: `[Jakselnews] Status Laporan: ${statusLabel}`,
    html: getEmailTemplate(content),
  });
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const content = `
    <h2 style="color: #111827; margin: 0 0 24px; font-size: 20px;">Selamat Datang di Jakselnews!</h2>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Halo <strong>${name}</strong>,
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Terima kasih telah bergabung dengan Jakselnews - Hyperlocal Media Jakarta Selatan.
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Dengan Jakselnews, Anda dapat:
    </p>

    <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 24px 0; padding-left: 24px;">
      <li>📰 Membaca berita dan informasi terkini dari Jakarta Selatan</li>
      <li>📍 Melaporkan kejadian di sekitar Anda</li>
      <li>🔔 Mendapatkan notifikasi tentang informasi penting</li>
      <li>🛡️ Berpartisipasi dalam menjaga keamanan lingkungan</li>
    </ul>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://jakselnews.com'}"
         style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #f43f5e 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600;">
        Mulai Sekarang
      </a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Selamat Datang di Jakselnews!',
    html: getEmailTemplate(content),
  });
}
