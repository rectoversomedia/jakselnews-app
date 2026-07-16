export type Language = 'id' | 'en';

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navigation
    'nav.home': 'Beranda',
    'nav.articles': 'Artikel',
    'nav.report': 'Lapor Kejadian',
    'nav.info': 'Info Terkini',
    'nav.services': 'Layanan',

    // Menu sections
    'menu.navigasi': 'Navigasi',
    'menu.tentang': 'Tentang',
    'menu.pengaturan': 'Pengaturan',

    // About page
    'about.title': 'Tentang Jakselnews',
    'about.subtitle': 'Portal Berita Hyperlocal Jakarta Selatan',
    'about.p1': 'Jakselnews adalah platform berita hyperlocal yang melayani komunitas Jakarta Selatan. Kami berkomitmen untuk menyediakan berita dan informasi lokal yang cepat, akurat, dan relevan.',
    'about.p2': 'Jakselnews didirikan pada tahun 2024 untuk menjembatani kesenjangan informasi antara media mainstream dan warga Jakarta Selatan. Kami percaya setiap warga berhak mendapatkan akses mudah terhadap berita yang mempengaruhi kehidupan sehari-hari mereka.',
    'about.p3': ' Melalui Jakselnews, warga dapat melaporkan kejadian di sekitar mereka, melihat pembaruan secara real-time, mengakses informasi layanan publik, dan berpartisipasi dalam diskusi yang membentuk komunitas mereka.',
    'about.mission': 'Misi Kami',
    'about.missionText': 'Menjadi sumber informasi terpercaya bagi warga Jakarta Selatan dengan menyediakan berita yang cepat, akurat, dan relevan.',
    'about.vision': 'Visi Kami',
    'about.visionText': 'Membangun komunitas warga yang terinformasi dan saling terhubung melalui platform berita hyperlocal.',
    'about.contact': 'Hubungi Kami',
    'about.email': 'Email',
    'about.address': 'Alamat',
    'about.social': 'Media Sosial',

    // Privacy Policy
    'privacy.title': 'Kebijakan Privasi',
    'privacy.lastUpdated': 'Terakhir diperbarui: 15 Juli 2024',
    'privacy.intro': 'Di Jakselnews, kami sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
    'privacy.section1Title': 'Informasi yang Kami Kumpulkan',
    'privacy.section1Text': 'Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, termasuk nama, alamat email, nomor telepon, dan lokasi saat Anda mendaftar akun atau提交 laporan. Kami juga mengumpulkan data penggunaan seperti alamat IP, jenis perangkat, dan riwayat 浏览.',
    'privacy.section2Title': 'Bagaimana Kami Menggunakan Informasi Anda',
    'privacy.section2Text': 'Kami menggunakan informasi yang dikumpulkan untuk menyediakan layanan kami, memproses laporan Anda, menghubungi Anda tentang pembaruan atau通知 penting, dan发送 pemasaran atau pembaruan dengan persetujuan Anda.',
    'privacy.section3Title': 'Perlindungan Data',
    'privacy.section3Text': 'Kami menerapkan langkah-langkah keamanan yang ketat untuk melindungi informasi pribadi Anda dari akses yang tidak sah, pengubahan, pengungkapan, atau penghancuran. Data Anda disimpan dengan aman dan hanya dapat diakses oleh персонал yang berwenang.',
    'privacy.section4Title': 'Hak Anda',
    'privacy.section4Text': 'Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus informasi pribadi Anda. Anda juga dapat menarik persetujuan untuk обработка данных Anda kapan saja. Untuk行使 hak Anda, silakan hubungi kami melalui email.',
    'privacy.section5Title': 'Cookie',
    'privacy.section5Text': 'Kami menggunakan cookie dan технологии serupa untuk meningkatkan pengalaman пользователя Anda dan menganalisis penggunaan situs. Anda dapat mengatur browser Anda untuk menolak cookie jika Anda mau.',
    'privacy.section6Title': 'Perubahan Kebijakan',
    'privacy.section6Text': 'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan material melalui email atau pemberitahuan di situs kami.',
    'privacy.contactTitle': 'Hubungi Kami',
    'privacy.contactText': 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di privacy@jakselnews.com.',

    // Media Guidelines
    'media.title': 'Pedoman Media Siber',
    'media.lastUpdated': 'Terakhir diperbarui: 15 Juli 2024',
    'media.intro': 'Pedoman Media Siber ini mengatur standar dan etika yang kami pegang dalam menyajikan berita dan informasi di Jakselnews.',
    'media.section1Title': 'Akurasi dan Verifikasi',
    'media.section1Text': 'Kami berkomitmen untuk memastikan semua berita yang kami publikasikan akurat dan dapat diverifikasi. Setiap laporan diverifikasi sebelum dipublikasikan. Kami segera mengoreksi setiap kesalahan yang ditemukan.',
    'media.section2Title': 'Sumber dan Attribusi',
    'media.section2Text': 'Kami selalu mengidentifikasi sumber informasi kami. Berita yang получен dari sumber yang tidak terverifikasi akan ditandai dengan jelas. Kami tidak mempublikasikan informasi dari匿名 sumber kecuali ada alasan kuat untuk melakukannya.',
    'media.section3Title': 'Pemisahan Opini dan Berita',
    'media.section3Text': 'Kami memisahkan opini dan komentar editorial dari berita faktual. Opini akan ditandai dengan jelas sebagai opini penulis atauredaksi.',
    'media.section4Title': 'Perlindungan Privasi',
    'media.section4Text': 'Kami menghormati privasi individu. Kami tidak mempublikasikan informasi pribadi seperti alamat rumah, nomor telepon, atau informasi keuangan tanpa persetujuan. Dalam pelaporan sensitif, kami mempertimbangkan keseimbangan antara kepentingan publik dan hak privasi.',
    'media.section5Title': 'Pelecehan dan Ujaran Kebencian',
    'media.section5Text': 'Kami tidak mentolerir pelecehan, ujaran kebencian, atau konten yang memecah belah. Komentar pembaca yang melanggar pedoman ini akan dihapus dan pengguna dapat diblokir.',
    'media.section6Title': 'Hak Koreksi dan Tanggapan',
    'media.section6Text': 'Kami memberikan ruang bagi individu untuk mengkoreksi informasi yang tidak akurat tentang mereka dan menanggapi pemberitaan yang mengenai mereka.',

    // Notification Settings
    'notif.title': 'Pengaturan Notifikasi',
    'notif.subtitle': 'Kelola bagaimana Anda menerima pemberitahuan',
    'notif.breakingNews': 'Berita Terkini',
    'notif.breakingNewsDesc': 'Pemberitahuan untuk berita dan peristiwa penting',
    'notif.localNews': 'Berita Lokal',
    'notif.localNewsDesc': 'Update tentang peristiwa di sekitar Jakarta Selatan',
    'notif.comments': 'Komentar',
    'notif.commentsDesc': 'Notifikasi ketika seseorang membalas komentar Anda',
    'notif.weekly': 'Ringkasan Mingguan',
    'notif.weeklyDesc': 'Ringkasan berita dan peristiwa minggu lalu',
    'notif.push': 'Push Notification',
    'notif.email': 'Email',
    'notif.save': 'Simpan Pengaturan',
    'notif.saved': 'Pengaturan berhasil disimpan!',

    // Language Settings
    'lang.title': 'Bahasa',
    'lang.subtitle': 'Pilih bahasa yang Anda inginkan',
    'lang.indonesian': 'Indonesia',
    'lang.indonesianDesc': 'Tampilkan semua konten dalam Bahasa Indonesia',
    'lang.english': 'English',
    'lang.englishDesc': 'Tampilkan semua konten dalam Bahasa Inggris',

    // Settings
    'settings.appearance': 'Tampilan',
    'settings.appearanceDesc': 'Atur tema aplikasi',
    'settings.light': 'Terang',
    'settings.dark': 'Gelap',
    'settings.system': 'Ikuti Sistem',

    // Common
    'common.back': 'Kembali',
    'common.loading': 'Memuat...',
    'common.error': 'Terjadi kesalahan',
    'common.success': 'Berhasil',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.articles': 'Articles',
    'nav.report': 'Report Incident',
    'nav.info': 'Latest Info',
    'nav.services': 'Services',

    // Menu sections
    'menu.navigasi': 'Navigation',
    'menu.tentang': 'About',
    'menu.pengaturan': 'Settings',

    // About page
    'about.title': 'About Jakselnews',
    'about.subtitle': 'Hyperlocal News Portal for South Jakarta',
    'about.p1': 'Jakselnews is a hyperlocal news platform dedicated to serving the Jakarta Selatan community. We are committed to providing fast, accurate, and relevant local news and information services.',
    'about.p2': 'Founded in 2024, Jakselnews aims to bridge the information gap between mainstream media and Jakarta Selatan residents. We believe every community member should have easy access to news and information that affects their daily lives.',
    'about.p3': 'Through Jakselnews, users can report incidents, view real-time updates, access public service information, and participate in discussions shaping the community they live in.',
    'about.mission': 'Our Mission',
    'about.missionText': 'To be the trusted source of information for Jakarta Selatan residents by providing fast, accurate, and relevant news.',
    'about.vision': 'Our Vision',
    'about.visionText': 'To build an informed and connected community of residents through a hyperlocal news platform.',
    'about.contact': 'Contact Us',
    'about.email': 'Email',
    'about.address': 'Address',
    'about.social': 'Social Media',

    // Privacy Policy
    'privacy.title': 'Privacy Policy',
    'privacy.lastUpdated': 'Last updated: July 15, 2024',
    'privacy.intro': 'At Jakselnews, we highly value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.',
    'privacy.section1Title': 'Information We Collect',
    'privacy.section1Text': 'We collect information you provide directly to us, including name, email address, phone number, and location when you register an account or submit a report. We also collect usage data such as IP address, device type, and browsing history.',
    'privacy.section2Title': 'How We Use Your Information',
    'privacy.section2Text': 'We use the information collected to provide our services, process your reports, contact you about updates or important notifications, and send marketing or updates with your consent.',
    'privacy.section3Title': 'Data Protection',
    'privacy.section3Text': 'We implement strict security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and can only be accessed by authorized personnel.',
    'privacy.section4Title': 'Your Rights',
    'privacy.section4Text': 'You have the right to access, correct, or delete your personal information. You can also withdraw consent for the processing of your data at any time. To exercise your rights, you can contact us via email.',
    'privacy.section5Title': 'Cookies',
    'privacy.section5Text': 'We use cookies and similar technologies to improve your user experience and analyze site usage. You can set your browser to refuse cookies if you wish.',
    'privacy.section6Title': 'Policy Changes',
    'privacy.section6Text': 'We may update this Privacy Policy from time to time. We will notify you about material changes via email or notice on our website.',
    'privacy.contactTitle': 'Contact Us',
    'privacy.contactText': 'If you have questions about this Privacy Policy, please contact us at privacy@jakselnews.com.',

    // Media Guidelines
    'media.title': 'Media Guidelines',
    'media.lastUpdated': 'Last updated: July 15, 2024',
    'media.intro': 'These Media Guidelines set the standards and ethics we uphold in presenting news and information on Jakselnews.',
    'media.section1Title': 'Accuracy and Verification',
    'media.section1Text': 'We are committed to ensuring all news we publish is accurate and verifiable. Every report is verified before publication. We promptly correct any errors found.',
    'media.section2Title': 'Sources and Attribution',
    'media.section2Text': 'We always identify our sources of information. News obtained from unverified sources will be clearly marked. We do not publish information from anonymous sources unless there is a compelling reason to do so.',
    'media.section3Title': 'Separation of Opinion and News',
    'media.section3Text': 'We separate opinions and editorial comments from factual news. Opinions will be clearly marked as the writers opinion.',
    'media.section4Title': 'Privacy Protection',
    'media.section4Text': 'We respect individuals privacy. We do not publish personal information such as home addresses, phone numbers, or financial information without consent. In sensitive reporting, we consider the balance between public interest and privacy rights.',
    'media.section5Title': 'Harassment and Hate Speech',
    'media.section5Text': 'We do not tolerate harassment, hate speech, or divisive content. Reader comments that violate these guidelines will be removed and users may be blocked.',
    'media.section6Title': 'Right of Correction and Response',
    'media.section6Text': 'We provide space for individuals to correct inaccurate information about them and respond to coverage concerning them.',

    // Notification Settings
    'notif.title': 'Notification Settings',
    'notif.subtitle': 'Manage how you receive notifications',
    'notif.breakingNews': 'Breaking News',
    'notif.breakingNewsDesc': 'Notifications for important news and events',
    'notif.localNews': 'Local News',
    'notif.localNewsDesc': 'Updates about events around South Jakarta',
    'notif.comments': 'Comments',
    'notif.commentsDesc': 'Notifications when someone replies to your comment',
    'notif.weekly': 'Weekly Summary',
    'notif.weeklyDesc': 'Summary of news and events from the past week',
    'notif.push': 'Push Notification',
    'notif.email': 'Email',
    'notif.save': 'Save Settings',
    'notif.saved': 'Settings saved successfully!',

    // Language Settings
    'lang.title': 'Language',
    'lang.subtitle': 'Choose your preferred language',
    'lang.indonesian': 'Indonesian',
    'lang.indonesianDesc': 'Display all content in Indonesian',
    'lang.english': 'English',
    'lang.englishDesc': 'Display all content in English',

    // Settings
    'settings.appearance': 'Appearance',
    'settings.appearanceDesc': 'Adjust app theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'Follow System',

    // Common
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
  },
};

export default translations;
