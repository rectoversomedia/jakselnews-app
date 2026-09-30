import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Info Terkini | Jakselnews',
  description: 'Info terkini dan laporan warga dari Jakarta Selatan — langsung dari warga untuk warga Jaksel.',
  alternates: {
    canonical: 'https://jakselnews.com/info-terkini',
  },
  openGraph: {
    title: 'Info Terkini | Jakselnews',
    description: 'Info terkini dan laporan warga dari Jakarta Selatan.',
    url: 'https://jakselnews.com/info-terkini',
    type: 'website',
    siteName: 'Jakselnews',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Info Terkini | Jakselnews',
    description: 'Info terkini dan laporan warga dari Jakarta Selatan.',
  },
};

const breadcrumbItems = [
  { name: 'Beranda', url: 'https://jakselnews.com' },
  { name: 'Info Terkini', url: 'https://jakselnews.com/info-terkini' },
];

const breadcrumbSchemaScript = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  numberOfItems: breadcrumbItems.length,
  itemListElement: breadcrumbItems.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export default function InfoTerkiniLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchemaScript }}
      />
      {children}
    </>
  );
}
