'use client';

import Head from 'next/head';

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  '@id': 'https://dev.jakselnews.com/#organization',
  name: 'Jakselnews',
  alternateName: 'Jakselnews.com',
  url: 'https://dev.jakselnews.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://dev.jakselnews.com/logo-utama.png',
    width: 400,
    height: 104,
  },
  image: {
    '@type': 'ImageObject',
    url: 'https://dev.jakselnews.com/logo-jakselnews.png',
    width: 512,
    height: 512,
  },
  description: 'Portal berita warga Jakarta Selatan. Kabar terkini, layanan publik, dan informasi penting seputar Jaksel langsung dari warga.',
  foundingDate: '2024',
  areaServed: {
    '@type': 'City',
    name: 'South Jakarta',
    alternateName: 'Jakarta Selatan',
    '@id': 'https://www.wikidata.org/wiki/Q1317190',
    containedInPlace: {
      '@type': 'Country',
      name: 'Indonesia',
      '@id': 'https://www.wikidata.org/wiki/Q252',
    },
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jakarta Selatan',
    addressRegion: 'DKI Jakarta',
    addressCountry: 'ID',
    addressCountry: 'Indonesia',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-6.2615',
    longitude: '106.8107',
  },
  telephone: '+62-21-1234-5678',
  email: 'redaksi@jakselnews.com',
  sameAs: [
    'https://www.instagram.com/jakselnews',
    'https://twitter.com/jakselnews',
    'https://www.facebook.com/jakselnews',
  ],
  knowsAbout: [
    { '@type': 'Thing', name: 'Local News', alternateName: 'Berita Lokal' },
    { '@type': 'Thing', name: 'Community Reporting', alternateName: 'Laporan Warga' },
    { '@type': 'Thing', name: 'Public Services', alternateName: 'Layanan Publik Jakarta' },
    { '@type': 'Thing', name: 'South Jakarta', alternateName: 'Jakarta Selatan' },
  ],
  language: [
    { '@type': 'Language', name: 'Indonesian', alternateName: 'id', inCode: 'id-ID' },
  ],
  publisher: {
    '@id': 'https://dev.jakselnews.com/#organization',
  },
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://dev.jakselnews.com/#website',
  url: 'https://dev.jakselnews.com',
  name: 'Jakselnews — Portal Berita Warga Jakarta Selatan',
  description: 'Portal berita warga Jakarta Selatan. Kabar terkini, layanan publik, dan informasi penting seputar Jaksel langsung dari warga.',
  inLanguage: 'id-ID',
  isAccessibleForFree: true,
  about: {
    '@type': 'Place',
    name: 'Jakarta Selatan',
  },
  audience: {
    '@type': 'Audience',
    name: 'Citizens of South Jakarta',
    geographicArea: {
      '@type': 'City',
      name: 'South Jakarta',
    },
  },
  publisher: {
    '@id': 'https://dev.jakselnews.com/#organization',
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://dev.jakselnews.com/cari?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
      description: 'Cari berita dan artikel di Jakselnews',
    },
    {
      '@type': 'ContactAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://dev.jakselnews.com/lapor',
      },
      description: 'Laporkan kejadian di Jakarta Selatan',
    },
  ],
};

const ORGANIZATION_SCRIPT = JSON.stringify(ORGANIZATION_SCHEMA);
const WEBSITE_SCRIPT = JSON.stringify(WEBSITE_SCHEMA);

export function OrganizationSchema() {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ORGANIZATION_SCRIPT }}
      />
    </Head>
  );
}

export function WebsiteSchema() {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: WEBSITE_SCRIPT }}
      />
    </Head>
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  author,
  datePublished,
  dateModified,
  category,
  section = 'news',
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  category?: string;
  section?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': url,
    headline: title,
    description: description,
    url: url,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: 'id-ID',
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: section,
    genre: category,
    keywords: category ? `jaksel, jakarta selatan, ${category.toLowerCase()}` : 'jaksel, jakarta selatan',
    author: {
      '@type': 'Organization',
      name: author || 'Tim Jakselnews',
      url: 'https://dev.jakselnews.com',
    },
    publisher: {
      '@id': 'https://dev.jakselnews.com/#organization',
    },
    copyrightYear: new Date(datePublished).getFullYear().toString(),
    copyrightHolder: {
      '@id': 'https://dev.jakselnews.com/#organization',
    },
    wordCount: description.split(' ').length * 10, // rough estimate
    timeRequired: 'PT5M',
    about: [
      {
        '@type': 'Place',
        name: 'Jakarta Selatan',
        containedInPlace: {
          '@type': 'Country',
          name: 'Indonesia',
        },
      },
    ],
    locationCreated: {
      '@type': 'Place',
      name: 'Jakarta Selatan',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'DKI Jakarta',
        containedInPlace: {
          '@type': 'Country',
          name: 'Indonesia',
        },
      },
    },
  };

  if (imageUrl) {
    (schema as any).image = {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    };
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://dev.jakselnews.com/#localbusiness',
    name: 'Jakselnews',
    description: 'Portal berita hyperlocal warga Jakarta Selatan',
    url: 'https://dev.jakselnews.com',
    areaServed: {
      '@type': 'City',
      name: 'South Jakarta',
      containedInPlace: {
        '@type': 'Country',
        name: 'Indonesia',
      },
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-6.2615',
      longitude: '106.8107',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'redaksi@jakselnews.com',
      contactType: 'customer service',
      availableLanguage: 'Indonesian',
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

export function ReportSchema({
  title,
  description,
  datePublished,
  location,
  category,
}: {
  title: string;
  description: string;
  datePublished: string;
  location?: string;
  category?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    '@id': `https://dev.jakselnews.com/info-terkini`,
    headline: title,
    description: description,
    datePublished,
    inLanguage: 'id-ID',
    publisher: {
      '@id': 'https://dev.jakselnews.com/#organization',
    },
    about: location
      ? {
          '@type': 'Place',
          name: location,
          containedInPlace: {
            '@type': 'City',
            name: 'South Jakarta',
          },
        }
      : undefined,
    genre: category,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
