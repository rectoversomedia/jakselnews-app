import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/context/NotificationContext";
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
      <body className="min-h-screen flex flex-col antialiased bg-gray-50 font-sans dark:bg-gray-900">
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
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
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
