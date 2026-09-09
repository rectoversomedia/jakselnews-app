import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
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
      { url: "/logo-jakselnews.png" },
      { url: "/logo-jakselnews.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-jakselnews.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo-jakselnews.png", sizes: "180x180", type: "image/png" },
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#DC2626" />
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
            {/* Skip to main content link for accessibility */}
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
      </body>
    </html>
  );
}
