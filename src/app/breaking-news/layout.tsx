import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Breaking News | Jakselnews',
  description: 'Laporan warga terkini dan breaking news dari Jakarta Selatan. Langsung dari warga untuk warga Jaksel.',
  alternates: {
    canonical: 'https://www.jakselnews.com/breaking-news',
  },
  openGraph: {
    title: 'Breaking News | Jakselnews',
    description: 'Laporan warga terkini dan breaking news dari Jakarta Selatan.',
    url: 'https://www.jakselnews.com/breaking-news',
    type: 'website',
    siteName: 'Jakselnews',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Breaking News | Jakselnews',
    description: 'Laporan warga terkini dan breaking news dari Jakarta Selatan.',
  },
};

export default function BreakingNewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
