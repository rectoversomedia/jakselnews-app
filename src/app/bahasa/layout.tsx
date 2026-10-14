import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bahasa | Jakselnews',
  description: 'Pilih bahasa antarmuka Jakselnews.',
  alternates: {
    canonical: 'https://www.jakselnews.com/bahasa',
  },
};

export default function BahasaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
