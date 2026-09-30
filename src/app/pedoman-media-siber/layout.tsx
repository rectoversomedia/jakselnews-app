import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedoman Media Siber | Jakselnews',
  description: 'Pedoman Pemberitaan Media Siber (PERS) yang dipatuhi oleh Jakselnews dalam pemberitaan.',
  alternates: {
    canonical: 'https://jakselnews.com/pedoman-media-siber',
  },
  openGraph: {
    title: 'Pedoman Media Siber | Jakselnews',
    description: 'Pedoman Pemberitaan Media Siber Jakselnews.',
    url: 'https://jakselnews.com/pedoman-media-siber',
    type: 'website',
    siteName: 'Jakselnews',
  },
};

export default function PedomanMediaSiberLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
