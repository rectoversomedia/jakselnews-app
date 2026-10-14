import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layanan Publik | Jakselnews',
  description: 'Kumpulan nomor hotline dan tautan layanan publik Jakarta Selatan — dari kesehatan, transportasi, hingga darurat. Langsung dari warga untuk warga.',
  alternates: {
    canonical: 'https://www.jakselnews.com/layanan',
  },
  openGraph: {
    title: 'Layanan Publik Jakarta Selatan | Jakselnews',
    description: 'Nomor hotline dan tautan layanan publik Jakarta Selatan.',
    url: 'https://www.jakselnews.com/layanan',
    type: 'website',
    siteName: 'Jakselnews',
  },
  twitter: {
    card: 'summary',
    title: 'Layanan Publik Jakarta Selatan | Jakselnews',
    description: 'Nomor hotline dan tautan layanan publik Jakarta Selatan.',
  },
};

const faqItems = [
  {
    question: 'Nomor darurat apa yang harus dihubungi di Jakarta Selatan?',
    answer: 'Untuk keadaan darurat di Jakarta Selatan: Ambulans 119, Polisi 110, Pemadam Kebakaran 113, dan PSC 119 ext 9 untuk kegawatdaruratan lainnya.',
  },
  {
    question: 'Bagaimana cara cek penerima bansos di Jakarta?',
    answer: 'Cek penerima bantuan sosial di Jakarta melalui situs siladu.jakarta.go.id dengan memasukkan NIK dan nama. Cek juga melalui aplikasi JakOne.',
  },
  {
    question: 'Di mana tempat pembuangan sampah di Jakarta Selatan?',
    answer: 'Jakarta Selatan memiliki TPS (Tempat Pembuangan Sementara) di setiap kelurahan. Hubungi Kelurahan atau Kecamatan setempat untuk informasi lokasi terdekat. Limbah rumah tangga bisa拨打 112 untuk penjemputan.',
  },
  {
    question: 'Bagaimana cara melapor banjir di Jakarta Selatan?',
    answer: 'Lapor banjir melalui JakConnect di aplikasi Jakarta Smart City, website jakarta.go.id, atau拨打 112. Jakselnews juga menerima laporan warga melalui halaman /lapor.',
  },
  {
    question: 'Nomor Pos Jakarta Selatan berapa?',
    answer: 'Kode Pos Jakarta Selatan berkisar antara 12110 hingga 12840, tergantung kelurahan. Contoh: Kebayoran Baru 12110, Simprug 12220, Pondok Indah 12310.',
  },
];

const faqSchemaScript = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

export default function LayananLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchemaScript }}
      />
      {children}
    </>
  );
}
