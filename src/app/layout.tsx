import dynamic from "next/dynamic";
import Script from "next/script";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData";
import "./globals.css";

// Dynamic import to avoid SSR issues with Phosphor Icons
const Header = dynamic(() => import("@/components/layout/Header").then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="h-14 lg:h-16 bg-white border-b" />,
});
const BottomNav = dynamic(() => import("@/components/layout/BottomNav").then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="h-16 bg-white border-t" />,
});

export const metadata = {
  metadataBase: new URL('https://dev.jakselnews.com'),
  title: {
    default: "Jakselnews — Portal Berita Warga Jakarta Selatan",
    template: "%s | Jakselnews",
  },
  description: "Portal berita warga Jakarta Selatan. Kabar terkini, layanan publik, dan informasi penting seputar Jaksel langsung dari warga.",
  keywords: ["jakselnews", "jakarta selatan", "berita jaksel", "hyperlocal", "portal jaksel", "berita jakarta selatan", "berita jakarta", "laporan warga"],
  authors: [{ name: "Jakselnews", url: "https://dev.jakselnews.com" }],
  creator: "Jakselnews",
  publisher: "Jakselnews",
  openGraph: {
    title: "Jakselnews — Portal Berita Warga Jakarta Selatan",
    description: "Portal berita warga Jakarta Selatan. Kabar terkini, layanan publik, dan informasi penting seputar Jaksel langsung dari warga.",
    url: "https://dev.jakselnews.com",
    type: "website",
    locale: "id_ID",
    alternateLocale: "ms_MY",
    siteName: "Jakselnews",
    images: [
      {
        url: "/logo-utama.png",
        width: 1200,
        height: 630,
        alt: "Jakselnews — Portal Berita Warga Jakarta Selatan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jakselnews",
    creator: "@jakselnews",
    title: "Jakselnews — Portal Berita Warga Jakarta Selatan",
    description: "Portal berita warga Jakarta Selatan. Kabar terkini, layanan publik, dan informasi penting seputar Jaksel langsung dari warga.",
    images: ["/logo-utama.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://dev.jakselnews.com",
    languages: {
      "id-ID": "https://dev.jakselnews.com",
      "ms-MY": "https://dev.jakselnews.com",
      "x-default": "https://dev.jakselnews.com",
    },
  },
  icons: {
    icon: [
      { url: "/logo-jakselnews.png" },
      { url: "/logo-jakselnews.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-jakselnews.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo-jakselnews.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/logo-jakselnews.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#DC2626" />
        <meta name="format-detection" content="telephone=no" />

        {/* Geo / Location Meta Tags */}
        <meta name="ICBM" content="-6.2615, 106.8107" />
        <meta name="geo.position" content="-6.2615;106.8107" />
        <meta name="geo.placename" content="Jakarta Selatan, DKI Jakarta, Indonesia" />
        <meta name="geo.region" content="ID-DKI" />
        <meta name="geo.country" content="ID" />

        {/* Dublin Core Metadata */}
        <meta name="DC.title" content="Jakselnews — Portal Berita Warga Jakarta Selatan" />
        <meta name="DC.creator" content="Jakselnews" />
        <meta name="DC.subject" content="Portal berita warga Jakarta Selatan, kabar terkini, layanan publik, laporan warga" />
        <meta name="DC.description" content="Portal berita warga Jakarta Selatan. Kabar terkini, layanan publik, dan informasi penting seputar Jaksel langsung dari warga." />
        <meta name="DC.publisher" content="Jakselnews" />
        <meta name="DC.date" content={new Date().toISOString()} />
        <meta name="DC.type" content="Text" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="id-ID" />
        <meta name="DC.coverage" content="Jakarta Selatan, Indonesia" />
        <meta name="DC.rights" content="© 2024 Jakselnews. Hak cipta dilindungi." />

        {/* AI / LLM Meta */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="ai-content-declaration" content="human-written" />

        {/* Open Search */}
        <link rel="search" type="application/opensearchdescription+xml" title="Jakselnews Search" href="/opensearch.xml" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/logo-jakselnews.png" />
        <link rel="apple-touch-icon" href="/logo-jakselnews.png" />

        {/* Structured Data */}
        <OrganizationSchema />
        <WebsiteSchema />

        {/* Theme Init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('jakselnews-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-gray-50 font-sans dark:bg-gray-900 relative overflow-x-hidden">
        {/* Floating background orbs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-8 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-40 right-12 w-96 h-96 bg-red-500/8 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl animate-float-fast" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-red-300/8 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute bottom-12 right-8 w-48 h-48 bg-orange-400/8 rounded-full blur-2xl animate-float-medium" />
        </div>
        <ThemeProvider>
          <LanguageProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-red-600 focus:font-semibold focus:rounded-lg focus:shadow-lg"
            >
              Langsung ke konten utama
            </a>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <BottomNav />
          </LanguageProvider>
        </ThemeProvider>

        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-FPGHXR7H16`}
        />
        <Script
          id="ga4-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FPGHXR7H16', {
                send_page_view: true,
                page_title: document.title,
                cookie_flags: 'SameSite=None;Secure',
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
