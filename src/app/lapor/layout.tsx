import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lapor | Jakselnews',
  description: 'Laporkan kejadian atau informasi penting di Jakarta Selatan. Jakselnews — portal berita warga Jakarta Selatan.',
  alternates: {
    canonical: 'https://jakselnews.com/lapor',
  },
  openGraph: {
    title: 'Lapor | Jakselnews',
    description: 'Laporkan kejadian atau informasi penting di Jakarta Selatan.',
    url: 'https://jakselnews.com/lapor',
    type: 'website',
    siteName: 'Jakselnews',
  },
  twitter: {
    card: 'summary',
    title: 'Lapor | Jakselnews',
    description: 'Laporkan kejadian atau informasi penting di Jakarta Selatan.',
  },
};

export default function LaporLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
