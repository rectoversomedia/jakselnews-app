import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Jakselnews',
  description: 'Kebijakan privasi Jakselnews — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
  alternates: {
    canonical: 'https://jakselnews.com/kebijakan-privasi',
  },
  openGraph: {
    title: 'Kebijakan Privasi | Jakselnews',
    description: 'Kebijakan privasi Jakselnews.',
    url: 'https://jakselnews.com/kebijakan-privasi',
    type: 'website',
    siteName: 'Jakselnews',
  },
};

export default function KebijakanPrivasiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
