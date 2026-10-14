import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cari Berita | Jakselnews',
  description: 'Cari berita dan artikel di Jakselnews — portal berita warga Jakarta Selatan.',
  alternates: {
    canonical: 'https://www.jakselnews.com/cari',
  },
  openGraph: {
    title: 'Cari Berita | Jakselnews',
    description: 'Cari berita dan artikel di Jakselnews — portal berita warga Jakarta Selatan.',
    url: 'https://www.jakselnews.com/cari',
    type: 'website',
    siteName: 'Jakselnews',
  },
  twitter: {
    card: 'summary',
    title: 'Cari Berita | Jakselnews',
    description: 'Cari berita dan artikel di Jakselnews.',
  },
};

export default function CariLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
