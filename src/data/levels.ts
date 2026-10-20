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
    id: 'graph-maker',
    name: '📈 Pembuat Grafik',
    description: 'Siswa mampu menginput dan menyajikan data (Abstraksi) secara visual menggunakan tipe grafik yang tepat.',
    icon: 'BarChart2',
    achievedAtLevel: 1
  }
];

export const LEVELS: GameLevel[] = [
  {
    id: 1,
    title: 'Menyajikan Data ke Grafik',
    description: 'Anda dipercaya mengelola data kehadiran penuh 5 hari kerja (Senin s.d Jumat) untuk kelas besar beranggotakan 15 siswa. Hitung kehadiran di lembar absensi manual, lalu langsung sajikan ke diagram grafik yang tepat!',
    focus: 'Berpikir Komputasional - Abstraksi: Merangkum data numerik yang rumit menjadi tampilan grafik yang mudah dimengerti.',
    durationLabel: '1 Minggu Penuh (Senin - Jumat)',
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
    rosters: [],
    questions: [
      {
        id: 'l3-q1',
        question: 'Dalam Berpikir Komputasional (Abstraksi), mengapa data kehadiran kelas lebih mudah disajikan ke bentuk diagram batang?',
        options: [
          'Menampilkan seluruh nama dan biodata siswa secara lengkap satu per satu',
          'Menyederhanakan data dengan menampilkan total jumlah siswa per hari',
          'Menghapus hari-hari yang jumlah ketidakhadirannya tinggi agar grafik terlihat bagus',
          'Menggambar grafik bebas tanpa perlu menghitung data kehadiran siswa'
        ],
        correctAnswer: 'Menyederhanakan data dengan menampilkan total jumlah siswa per hari',
        explanation: 'Tepat! Abstraksi adalah memilah informasi penting (total jumlah kehadiran harian) dan mengabaikan detail yang belum diperlukan (nama individu) agar data cepat dan mudah dipahami.'
      },
      {
        id: 'l3-q2',
        question: 'Berdasarkan grafik hasil abstraksi data mingguan tersebut, hari apa yang menunjukkan tren penurunan kehadiran paling drastis (ketidakhadiran tertinggi)?',
        options: ['Senin', 'Rabu', 'Kamis', 'Jumat'],
        correctAnswer: 'Jumat',
        explanation: 'Hari Jumat memiliki tingkat ketidakhadiran paling tinggi yaitu mencapai 10 siswa absen (hanya 20 siswa yang hadir).'
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
        },
        {
          text: 'Menghapus data hari Jumat dari grafik agar rata-rata kehadiran mingguan kelas terlihat tinggi',
          scoreWeight: 5,
          feedback: 'Keliru! Menghapus data nyata melanggar etika pengolahan data dan tidak menyelesaikan masalah kehadiran.'
        }
      ]
    }
  }
];
