import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami | Jakselnews',
  description: 'Jakselnews — portal berita warga Jakarta Selatan. Baca tentang misi kami dalam menghadirkan kabar akurat dan relevan untuk masyarakat Jaksel.',
  alternates: {
    canonical: 'https://www.jakselnews.com/tentang',
  },
  openGraph: {
    title: 'Tentang Jakselnews',
    description: 'Portal berita warga Jakarta Selatan. Misi kami menghadirkan berita akurat, cepat, dan relevan untuk masyarakat Jaksel.',
    url: 'https://www.jakselnews.com/tentang',
    type: 'website',
    siteName: 'Jakselnews',
  },
  twitter: {
    card: 'summary',
    title: 'Tentang Jakselnews',
    description: 'Portal berita warga Jakarta Selatan.',
  },
};

export default function TentangLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
