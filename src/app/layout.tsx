import { Inter, Poppins } from "next/font/google";
import dynamic from "next/dynamic";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Jakselnews - Hyperlocal Media Jakarta Selatan",
    template: "%s | Jakselnews",
  },
  description: "Portal berita dan informasi hyperlocal untuk warga Jakarta Selatan. Berita terkini, layanan publik, dan informasi penting seputar Jaksel.",
  keywords: ["jakselnews", "jakarta selatan", "berita jaksel", "hyperlocal", "portal jaksel", "berita jakarta selatan"],
  authors: [{ name: "Jakselnews" }],
  creator: "Jakselnews",
  publisher: "Jakselnews",
  openGraph: {
    title: "Jakselnews - Hyperlocal Media Jakarta Selatan",
    description: "Portal berita dan informasi hyperlocal untuk warga Jakarta Selatan",
    type: "website",
    locale: "id_ID",
    siteName: "Jakselnews",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakselnews - Hyperlocal Media Jakarta Selatan",
    description: "Portal berita dan informasi hyperlocal untuk warga Jakarta Selatan",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#DC2626" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-gray-50 font-sans">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-red-600 focus:font-semibold focus:rounded-lg focus:shadow-lg"
        >
          Langsung ke konten utama
        </a>
        <Header />
        <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
