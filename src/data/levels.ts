import { GameLevel, Badge } from '@/src/types';


export const BAD_PRACTICES_WARNINGS = [
  "⚠️ Periksa kembali data hari Senin! Pastikan hitunganmu tepat.",
  "⚠️ Periksa kembali data hari Selasa! Mungkin ada siswa yang terlewat.",
  "⚠️ Periksa kembali data hari Rabu! Ingat, hitung dengan cermat.",
  "⚠️ Periksa kembali data hari Kamis! Jangan terburu-buru.",
  "⚠️ Periksa kembali data hari Jumat! Perhatikan status Hadir/Tidak Hadir."
];

export const BADGES: Badge[] = [
  {
    id: 'data-collector',
    name: '📊 Pengumpul Data',
    description: 'Siswa mampu mengurai (Dekomposisi) dan menghitung data mentah kehadiran dari daftar kelas dengan tepat.',
    icon: 'Database',
    achievedAtLevel: 1
  },
  {
    id: 'graph-maker',
    name: '📈 Pembuat Grafik',
    description: 'Siswa mampu menginput dan menyajikan data (Abstraksi) secara visual menggunakan tipe grafik yang tepat.',
    icon: 'BarChart2',
    achievedAtLevel: 3
  },
  {
    id: 'data-analyst',
    name: '🔍 Analis Data',
    description: 'Siswa mampu mengidentifikasi pola (Pengenalan Pola) dan membaca informasi penting dari grafik data.',
    icon: 'TrendingUp',
    achievedAtLevel: 4
  },
  {
    id: 'school-statistician',
    name: '🏆 Ahli Statistik Sekolah',
    description: 'Siswa menguasai seluruh algoritma manajemen data untuk mengambil keputusan strategis demi kemajuan sekolah.',
    icon: 'Award',
    achievedAtLevel: 5
  }
];

export const LEVELS: GameLevel[] = [
  {
    id: 1,
    title: 'Level 1: Dasar Pengumpulan Data',
    description: 'Membantu Kepala Sekolah mengumpulkan data kehadiran kelas kecil selama 3 hari pertama. Hitung manual jumlah siswa yang Hadir dan Tidak Hadir!',
    focus: 'Berpikir Komputasional - Dekomposisi: Mengurai daftar siswa menjadi jumlah angka harian.',
    durationLabel: '3 Hari Kerja',
    daysCount: 3,
    badgeName: 'Data Collector',
    badgeIcon: 'Database',
    records: [
      { day: 'Senin', present: 8, absent: 2 },
      { day: 'Selasa', present: 9, absent: 1 },
      { day: 'Rabu', present: 6, absent: 4 }
    ],
    rosters: [
      {
        day: 'Senin',
        students: [
          { name: 'Andi', status: 'Hadir' },
          { name: 'Budi', status: 'Hadir' },
          { name: 'Cici', status: 'Tidak Hadir' },
          { name: 'Dodi', status: 'Hadir' },
          { name: 'Eka', status: 'Hadir' },
          { name: 'Fani', status: 'Hadir' },
          { name: 'Gita', status: 'Hadir' },
          { name: 'Hari', status: 'Hadir' },
          { name: 'Iwan', status: 'Tidak Hadir' },
          { name: 'Joko', status: 'Hadir' }
        ]
      },
      {
        day: 'Selasa',
        students: [
          { name: 'Andi', status: 'Hadir' },
          { name: 'Budi', status: 'Hadir' },
          { name: 'Cici', status: 'Hadir' },
          { name: 'Dodi', status: 'Tidak Hadir' },
          { name: 'Eka', status: 'Hadir' },
          { name: 'Fani', status: 'Hadir' },
          { name: 'Gita', status: 'Hadir' },
          { name: 'Hari', status: 'Hadir' },
          { name: 'Iwan', status: 'Hadir' },
          { name: 'Joko', status: 'Hadir' }
        ]
      },
      {
        day: 'Rabu',
        students: [
          { name: 'Andi', status: 'Tidak Hadir' },
          { name: 'Budi', status: 'Hadir' },
          { name: 'Cici', status: 'Tidak Hadir' },
          { name: 'Dodi', status: 'Hadir' },
          { name: 'Eka', status: 'Tidak Hadir' },
          { name: 'Fani', status: 'Hadir' },
          { name: 'Gita', status: 'Tidak Hadir' },
          { name: 'Hari', status: 'Hadir' },
          { name: 'Iwan', status: 'Hadir' },
          { name: 'Joko', status: 'Hadir' }
        ]
      }
    ],
    questions: [
      {
        id: 'l1-q1',
        question: 'Berapa jumlah total siswa yang TIDAK HADIR selama 3 hari sekolah tersebut?',
        options: ['4 Siswa', '6 Siswa', '7 Siswa', '9 Siswa'],
        correctAnswer: '7 Siswa',
        explanation: 'Betul! Pada hari Senin ada 2 absen, Selasa 1 absen, dan Rabu 4 absen. 2 + 1 + 4 = 7 siswa.'
      },
      {
        id: 'l1-q2',
        question: 'Pada hari apa tingkat kehadiran siswa merupakan yang tertinggi?',
        options: ['Senin', 'Selasa', 'Rabu', 'Semua hari sama'],
        correctAnswer: 'Selasa',
        explanation: 'Hebat! Hari Selasa memiliki jumlah kehadiran terbanyak yaitu 9 siswa hadir (hanya 1 yang absen).'
      }
    ],
    decision: {
      id: 'l1-d1',
      scenario: 'Data menunjukkan bahwa tingkat ketidakhadiran paling tinggi terjadi pada hari Rabu (4 siswa absen). Sebagai petugas admin sekolah yang kritis, Anda melaporkan temuan ini ke pihak sekolah.',
      question: 'Apa langkah paling bijak yang perlu diambil sekolah setelah melihat data hari Rabu tersebut?',
      options: [
        {
          text: 'Menganalisis penyebab ketidakhadiran di hari Rabu (misalnya jadwal pelajaran yang berat, atau cuaca buruk)',
          scoreWeight: 40,
          feedback: 'Sangat Tepat! Memahami penyebab di balik data adalah esensi sejati pengelolaan data dalam kehidupan nyata.'
        },
        {
          text: 'Menghapus data ketidakhadiran siswa agar laporan sekolah terlihat sempurna tanpa ada yang absen',
          scoreWeight: 10,
          feedback: 'Kurang Tepat! Memalsukan data sangat berbahaya dan membuat sekolah tidak tahu masalah yang sebenarnya.'
        },
        {
          text: 'Mengabaikan saja data tersebut karena absensi adalah urusan pribadi masing-masing siswa',
          scoreWeight: 15,
          feedback: 'Kurang Tepat! Jika diabaikan, siswa yang sering membolos tidak akan mendapatkan bantuan akademis/konseling.'
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Level 2: Pengolahan ke Tabel Sistem',
    description: 'Sekarang, kelola data kehadiran penuh 5 hari kerja (Senin s.d Jumat) untuk kelas beranggotakan 12 siswa. Hitung kehadiran di lembar absensi lalu input nilai ke tabel digital!',
    focus: 'Berpikir Komputasional - Dekomposisi & Algoritma: Memasukkan data mentah ke dalam tabel terstruktur.',
    durationLabel: '5 Hari Kerja',
    daysCount: 5,
    badgeName: 'Data Collector',
    badgeIcon: 'Database',
    records: [
      { day: 'Senin', present: 10, absent: 2 },
      { day: 'Selasa', present: 11, absent: 1 },
      { day: 'Rabu', present: 9, absent: 3 },
      { day: 'Kamis', present: 12, absent: 0 },
      { day: 'Jumat', present: 8, absent: 4 }
    ],
    rosters: [
      {
        day: 'Senin',
        students: [
          { name: 'Andi', status: 'Hadir' }, { name: 'Budi', status: 'Hadir' }, { name: 'Cici', status: 'Tidak Hadir' },
          { name: 'Dodi', status: 'Hadir' }, { name: 'Eka', status: 'Hadir' }, { name: 'Fani', status: 'Hadir' },
          { name: 'Gita', status: 'Hadir' }, { name: 'Hari', status: 'Hadir' }, { name: 'Iwan', status: 'Tidak Hadir' },
          { name: 'Joko', status: 'Hadir' }, { name: 'Kirana', status: 'Hadir' }, { name: 'Lia', status: 'Hadir' }
        ]
      },
      {
        day: 'Selasa',
        students: [
          { name: 'Andi', status: 'Hadir' }, { name: 'Budi', status: 'Hadir' }, { name: 'Cici', status: 'Hadir' },
          { name: 'Dodi', status: 'Hadir' }, { name: 'Eka', status: 'Hadir' }, { name: 'Fani', status: 'Tidak Hadir' },
          { name: 'Gita', status: 'Hadir' }, { name: 'Hari', status: 'Hadir' }, { name: 'Iwan', status: 'Hadir' },
          { name: 'Joko', status: 'Hadir' }, { name: 'Kirana', status: 'Hadir' }, { name: 'Lia', status: 'Hadir' }
        ]
      },
      {
        day: 'Rabu',
        students: [
          { name: 'Andi', status: 'Tidak Hadir' }, { name: 'Budi', status: 'Hadir' }, { name: 'Cici', status: 'Tidak Hadir' },
          { name: 'Dodi', status: 'Hadir' }, { name: 'Eka', status: 'Tidak Hadir' }, { name: 'Fani', status: 'Hadir' },
          { name: 'Gita', status: 'Hadir' }, { name: 'Hari', status: 'Hadir' }, { name: 'Iwan', status: 'Hadir' },
          { name: 'Joko', status: 'Hadir' }, { name: 'Kirana', status: 'Hadir' }, { name: 'Lia', status: 'Hadir' }
        ]
      },
      {
        day: 'Kamis',
        students: [
          { name: 'Andi', status: 'Hadir' }, { name: 'Budi', status: 'Hadir' }, { name: 'Cici', status: 'Hadir' },
          { name: 'Dodi', status: 'Hadir' }, { name: 'Eka', status: 'Hadir' }, { name: 'Fani', status: 'Hadir' },
          { name: 'Gita', status: 'Hadir' }, { name: 'Hari', status: 'Hadir' }, { name: 'Iwan', status: 'Hadir' },
          { name: 'Joko', status: 'Hadir' }, { name: 'Kirana', status: 'Hadir' }, { name: 'Lia', status: 'Hadir' }
        ]
      },
      {
        day: 'Jumat',
        students: [
          { name: 'Andi', status: 'Tidak Hadir' }, { name: 'Budi', status: 'Hadir' }, { name: 'Cici', status: 'Tidak Hadir' },
          { name: 'Dodi', status: 'Hadir' }, { name: 'Eka', status: 'Hadir' }, { name: 'Fani', status: 'Tidak Hadir' },
          { name: 'Gita', status: 'Tidak Hadir' }, { name: 'Hari', status: 'Hadir' }, { name: 'Iwan', status: 'Hadir' },
          { name: 'Joko', status: 'Hadir' }, { name: 'Kirana', status: 'Hadir' }, { name: 'Lia', status: 'Hadir' }
        ]
      }
    ],
    questions: [
      {
        id: 'l2-q1',
        question: 'Berapakah total kehadiran siswa (Hadir) selama 5 hari pertama di sistem?',
        options: ['38 Hadir', '40 Hadir', '50 Hadir', '52 Hadir'],
        correctAnswer: '50 Hadir',
        explanation: 'Tepat sekali! Total hadir = 10 (Senin) + 11 (Selasa) + 9 (Rabu) + 12 (Kamis) + 8 (Jumat) = 50 kehadiran.'
      },
      {
        id: 'l2-q2',
        question: 'Pada hari apa sekolah mencapai "Kehadiran Sempurna" (seluruh 12 siswa masuk sekolah)?',
        options: ['Selasa', 'Kamis', 'Jumat', 'Senin'],
        correctAnswer: 'Kamis',
        explanation: 'Benar! Hari Kamis adalah satu-satunya hari di mana 12 siswa hadir dan tidak ada yang absen.'
      }
    ],
    decision: {
      id: 'l2-d1',
      scenario: 'Data terstruktur membantu sekolah melihat bahwa kehadiran hari Jumat (8 orang masuk) berkurang karena banyak yang memperpanjang akhir pekan secara tidak resmi.',
      question: 'Solusi apa yang paling tepat didasarkan pada data untuk memperbaiki kebiasaan absensi hari Jumat?',
      options: [
        {
          text: 'Mengadakan kegiatan ekskul yang menarik atau kuis seru berhadiah di setiap hari Jumat pagi',
          scoreWeight: 40,
          feedback: 'Sangat Kreatif! Memberikan insentif positif mendorong siswa lebih semangat bersekolah di hari rawan bolos.'
        },
        {
          text: 'Memberikan hukuman fisik berat ke semua siswa yang tidak hadir tanpa memeriksa alasannya',
          scoreWeight: 10,
          feedback: 'Kurang Bijaksana! Hukuman fisik keras melanggar aturan dan tidak menyelesaikan kendala sakit/transportasi.'
        },
        {
          text: 'Meliburkan sekolah di hari Jumat agar tingkat ketidakhadiran tercatat 0%',
          scoreWeight: 15,
          feedback: 'Tidak Logis! Ini adalah solusi menghindari masalah yang justru mengurangi waktu belajar siswa secara signifikan.'
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Level 3: Menyajikan Data ke Grafik',
    description: 'Anda telah menginput data dengan benar. Sekarang mulailah tahap Abstraksi! Pilih jenis diagram yang tepat dan buat grafik dengan mengatur tinggi balok untuk mencocokkan data mingguan kelas.',
    focus: 'Berpikir Komputasional - Abstraksi: Merangkum data numerik yang rumit menjadi tampilan grafik yang mudah dimengerti.',
    durationLabel: '1 Minggu Penuh (Kelas Besar - 30 Siswa)',
    daysCount: 5,
    badgeName: 'Graph Maker',
    badgeIcon: 'BarChart2',
    records: [
      { day: 'Senin', present: 28, absent: 2 },
      { day: 'Selasa', present: 29, absent: 1 },
      { day: 'Rabu', present: 24, absent: 6 },
      { day: 'Kamis', present: 27, absent: 3 },
      { day: 'Jumat', present: 20, absent: 10 }
    ],
    questions: [
      {
        id: 'l3-q1',
        question: 'Ketika kita ingin menyajikan perbandingan jumlah kehadiran antarhari secara jelas dan instan, bentuk penyajian data apa yang paling efektif?',
        options: ['Tabel mentah tanpa baris', 'Diagram Batang', 'Peta Geografis', 'Tulisan Narasi Panjang'],
        correctAnswer: 'Diagram Batang',
        explanation: 'JOSS! Diagram batang memudahkan mata membandingkan perbedaan tinggi (jumlah) antar kategori secara instan.'
      },
      {
        id: 'l3-q2',
        question: 'Berdasarkan grafik yang Anda buat, hari apa yang memiliki tingkat ketidakhadiran (Absen) paling mengkhawatirkan (10 siswa)?',
        options: ['Senin', 'Rabu', 'Kamis', 'Jumat'],
        correctAnswer: 'Jumat',
        explanation: 'Benar sekali. Hari Jumat memiliki tingkat ketidakhadiran paling tinggi yaitu mencapai 10 siswa absen.'
      }
    ],
    decision: {
      id: 'l3-d1',
      scenario: 'Laporan visual menunjukkan kelas Anda jatuh ke tingkat kehadiran 66% di hari Jumat (20 dari 30 siswa yang hadir). Kepala sekolah menuntut tindakan darurat.',
      question: 'Sebagai admin berbasis data, bagaimana cara terbaik memanfaatkan grafik ini?',
      options: [
        {
          text: 'Mengirim grafik ini ke komite kelas dan orang tua murid agar bersama-sama memantau komitmen kehadiran hari Jumat',
          scoreWeight: 40,
          feedback: 'Sangat Tepat! Keterbukaan data visual kepada orang tua membangun kerja sama solid untuk perbaikan disiplin siswa.'
        },
        {
          text: 'Menghias grafik dengan warna-warna cerah agar seolah-olah penurunan data tersebut terlihat tidak masalah',
          scoreWeight: 15,
          feedback: 'Kurang Relevan! Desain visual memang penting, namun tidak boleh dipakai untuk mengaburkan masalah riil.'
        },
        {
          text: 'Menghentikan pembuatan grafik karena grafik memaparkan sisi buruk tingkat kehadiran sekolah',
          scoreWeight: 10,
          feedback: 'Sangat Buruk! Menghentikan pencatatan ibarat menutup mata saat menyeberang jalan. Data harus dihadapi.'
        }
      ]
    }
  },
  {
    id: 4,
    title: 'Level 4: Membandingkan Dua Grafik',
    description: 'Selamat! Anda dipercaya mengelola data 2 Minggu. Di sini tantangannya adalah membandingkan visualisasi grafik Minggu ke-1 vs Minggu ke-2 untuk melihat progres kedisiplinan siswa.',
    focus: 'Berpikir Komputasional - Pengenalan Pola: Mencari kesamaan atau tren antar dua kelompok data visual.',
    durationLabel: '2 Minggu (Komparatif)',
    daysCount: 10,
    badgeName: 'Data Analyst',
    badgeIcon: 'TrendingUp',
    // We will have records for week 1 and week 2 separately to compare!
    records: [
      // Representing Week 1 (Present values)
      { day: 'Senin', present: 22, absent: 8 },
      { day: 'Selasa', present: 24, absent: 6 },
      { day: 'Rabu', present: 20, absent: 10 },
      { day: 'Kamis', present: 25, absent: 5 },
      { day: 'Jumat', present: 18, absent: 12 }
    ],
    questions: [
      {
        id: 'l4-q1',
        question: 'Di Minggu ke-2, kehadiran Senin=28, Selasa=29, Rabu=27, Kamis=28, Jumat=29. Dibandingkan dengan Minggu ke-1 (Senin=22, Selasa=24, Rabu=20, dll), kesimpulan apa yang kalian dapatkan tentang tren kehadiran?',
        options: [
          'Minggu ke-2 mengalami penurunan kehadiran',
          'Minggu ke-2 mengalami peningkatan kehadiran yang sangat signifikan dan lebih stabil',
          'Kedua minggu sama persis tingkat kehadirannya',
          'Tidak ada pola yang dapat dibaca sama sekali'
        ],
        correctAnswer: 'Minggu ke-2 mengalami peningkatan kehadiran yang sangat signifikan dan lebih stabil',
        explanation: 'Sempurna! Minggu ke-2 menunjukkan barisan grafik yang tinggi-tinggi hampir menyentuh batas atas (27-29 siswa), menandakan program kehadiran sekolah sukses berjalan.'
      },
      {
        id: 'l4-q2',
        question: 'Pada hari apa di Minggu ke-1 kemerosotan kehadiran terdalam terjadi (absen terbanyak)?',
        options: ['Selasa', 'Rabu', 'Jumat', 'Senin'],
        correctAnswer: 'Jumat',
        explanation: 'Hebat! Di Jumat Minggu ke-1, ada 12 siswa absen, yang merupakan angka ketidakhadiran terbesar dalam periode tersebut.'
      }
    ],
    decision: {
      id: 'l4-d1',
      scenario: 'Pihak sekolah menguji program "Jumat Ceria Berhadiah" di Minggu ke-2. Data menunjukkan kehadiran hari Jumat meroket dari 18 siswa menjadi 29 siswa.',
      question: 'Apa arti kenaikan data yang sangat mencolok tersebut bagi pemangku kebijakan sekolah?',
      options: [
        {
          text: 'Program "Jumat Ceria" terbukti sangat efektif dan layak dipatenkan/dilanjutkan untuk bulan-bulan berikutnya',
          scoreWeight: 40,
          feedback: 'Sangat Tepat! Ini membuktikan efektivitas keputusan berbasis kepatuhan bukti (pengambilan keputusan berbasis data).'
        },
        {
          text: 'Menghentikan program karena tantangannya sudah selesai dan menghemat biaya hadiah',
          scoreWeight: 20,
          feedback: 'Kurang Tepat! Jika program langsung dihentikan tanpa pengganti, pola buruk ketidakhadiran bisa terulang lagi.'
        },
        {
          text: 'Menganggap peningkatan ini hanyalah kebetulan belaka tanpa ada hubungannya dengan program',
          scoreWeight: 10,
          feedback: 'Kurang Bijak! Data statistik perbandingan yang mencolok jarang terjadi karena kebetulan acak semata.'
        }
      ]
    }
  },
  {
    id: 5,
    title: 'Level 5: Analisis Tren Bulanan',
    description: 'Ujian Akhir! Anda mengelola data 1 Bulan (4 Minggu sekaligus). Tugas Anda adalah melakukan analisis mendalam mengenai fluktuasi kehadiran dan mendeteksi anomali di tengah semester.',
    focus: 'Berpikir Komputasional - Pengenalan Pola & Algoritma: Menemukan anomali di dalam gelombang data yang sangat besar.',
    durationLabel: '1 Bulan (4 Minggu)',
    daysCount: 20,
    badgeName: 'School Statistician',
    badgeIcon: 'Award',
    records: [
      // Week 1 (Senin-Jumat)
      { day: 'M1-Sen', present: 26, absent: 4 },
      { day: 'M1-Sel', present: 28, absent: 2 },
      { day: 'M1-Rab', present: 27, absent: 3 },
      { day: 'M1-Kam', present: 29, absent: 1 },
      { day: 'M1-Jum', present: 25, absent: 5 },
      // Week 2
      { day: 'M2-Sen', present: 27, absent: 3 },
      { day: 'M2-Sel', present: 28, absent: 2 },
      { day: 'M2-Rab', present: 10, absent: 20 }, // ANOMALI: Banjir bandang/hujan lebat ekstrem!
      { day: 'M2-Kam', present: 26, absent: 4 },
      { day: 'M2-Jum', present: 24, absent: 6 },
      // Week 3
      { day: 'M3-Sen', present: 28, absent: 2 },
      { day: 'M3-Sel', present: 29, absent: 1 },
      { day: 'M3-Rab', present: 28, absent: 2 },
      { day: 'M3-Kam', present: 27, absent: 3 },
      { day: 'M3-Jum', present: 25, absent: 5 },
      // Week 4
      { day: 'M4-Sen', present: 29, absent: 1 },
      { day: 'M4-Sel', present: 30, absent: 0 },
      { day: 'M4-Rab', present: 29, absent: 1 },
      { day: 'M4-Kam', present: 28, absent: 2 },
      { day: 'M4-Jum', present: 27, absent: 3 }
    ],
    questions: [
      {
        id: 'l5-q1',
        question: 'Perhatikan grafik bulanan. Terjadi penurunan tajam kehadiran yang drastis pada Rabu Minggu ke-2 (hanya 10 siswa hadir). Apa istilah yang tepat untuk data yang melonjak aneh di luar pola normal ini?',
        options: ['Rata-rata data', 'Anomali Data (Pencilan)', 'Data Sempurna', 'Data Konvensional'],
        correctAnswer: 'Anomali Data (Pencilan)',
        explanation: 'LUAR BIASA! Anomali atau pencilan adalah titik data yang sangat berbeda dari pola umum dan biasanya disebabkan oleh kejadian luar biasa.'
      },
      {
        id: 'l5-q2',
        question: 'Setelah diselidiki di catatan cuaca, hari Rabu Minggu ke-2 tersebut rupanya bertepatan dengan badai badai dan banjir bandang di sekitar sekolah. Apakah data penurunan ini harus disikapi sebagai kelalaian membolos masal?',
        options: [
          'Ya, mereka semua harus dihukum',
          'Tidak, karena ketidakhadiran disebabkan oleh keadaan darurat cuaca (darurat bencana alam) demi keselamatan siswa',
          'Dihapus saja heri tersebut agar datanya kembali tinggi',
          'Mengganti siswa yang rajin untuk mewakili sekolah'
        ],
        correctAnswer: 'Tidak, karena ketidakhadiran disebabkan oleh keadaan darurat cuaca (darurat bencana alam) demi keselamatan siswa',
        explanation: 'Betul sekali! Sebagai analis data yang empati, kita harus sadar konteks di balik data sebelum membuat penilaian moral.'
      }
    ],
    decision: {
      id: 'l5-d1',
      scenario: 'Evaluasi akhir bulan membuktikan program manajemen data kehadiran Anda berhasil meningkatkan rata-rata kehadiran bulanan sekolah secara konsisten hingga 93%, kecuali pada hari bencana banjir tersebut.',
      question: 'Sebagai administrator sekolah teladan, langkah preventif berbasis data apa yang akan Anda ajukan pada rapat besar terkait anomali banjir?',
      options: [
        {
          text: 'Menyiapkan modul pembelajaran jarak jauh (online) yang siap diaktifkan otomatis jika prakiraan cuaca menunjukkan potensi banjir/badai ekstrem di hari sekolah',
          scoreWeight: 40,
          feedback: 'Keputusan Luar Biasa! Dengan data, Anda tidak hanya belajar masa lalu, tetapi sanggup bersiap menghadapi masa depan dengan bijaksana.'
        },
        {
          text: 'Meminta dinas meteorologi untuk menghentikan hujan lebat agar sekolah tidak kebanjiran lagi',
          scoreWeight: 10,
          feedback: 'Sangat Mustahil! Kita tidak bisa mengontrol cuaca ekstrem semesta, melainkan mengontrol kesiapan sekolah menghadapinya.'
        },
        {
          text: 'Melarang siswa yang tinggal di daerah banjir untuk mendaftar sekolah di sini lagi',
          scoreWeight: 15,
          feedback: 'Diskriminatif! Keputusan ini melanggar hak anak untuk memperoleh pendidikan yang adil dan merata.'
        }
      ]
    }
  }
];

export const MOCK_WEEK_2_DATA_LEVEL_4 = [
  { day: 'Senin', present: 28, absent: 2 },
  { day: 'Selasa', present: 29, absent: 1 },
  { day: 'Rabu', present: 27, absent: 3 },
  { day: 'Kamis', present: 28, absent: 2 },
  { day: 'Jumat', present: 29, absent: 1 }
];
