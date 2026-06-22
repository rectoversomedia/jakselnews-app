import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

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
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
