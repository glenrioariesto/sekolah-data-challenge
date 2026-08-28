/**
 * Sekolah Data Challenge - Kunci Jawaban & Panduan Solusi Lengkap
 * 
 * 🌐 Live URL Demo: https://glenrioariesto.github.io/sekolah-data-challenge/
 * 📂 Repository: https://github.com/glenrioariesto/sekolah-data-challenge
 */

export interface SchoolDataAnswer {
  levelId: number;
  title: string;
  focus: string;
  liveUrl: string;
  attendanceData: {
    day: string;
    present: number;
    absent: number;
    total: number;
  }[];
  chartAnswer: {
    recommendedChart: string;
    reason: string;
  };
  quizAnswers: {
    questionId: string;
    question: string;
    correctAnswer: string;
    explanation: string;
  }[];
  decisionAnswer: {
    decisionId: string;
    scenario: string;
    question: string;
    bestOption: string;
    scoreWeight: number;
    feedback: string;
  };
}

export const sekolahDataAnswers: SchoolDataAnswer[] = [
  {
    levelId: 1,
    title: 'Level 1: Menyajikan Data ke Grafik',
    focus: 'Berpikir Komputasional - Abstraksi: Merangkum data numerik yang rumit menjadi tampilan grafik yang mudah dimengerti.',
    liveUrl: 'https://glenrioariesto.github.io/sekolah-data-challenge/',
    attendanceData: [
      { day: 'Senin', present: 28, absent: 2, total: 30 },
      { day: 'Selasa', present: 29, absent: 1, total: 30 },
      { day: 'Rabu', present: 24, absent: 6, total: 30 },
      { day: 'Kamis', present: 27, absent: 3, total: 30 },
      { day: 'Jumat', present: 20, absent: 10, total: 30 }
    ],
    chartAnswer: {
      recommendedChart: 'Diagram Batang (Bar Chart)',
      reason: 'Diagram Batang paling efektif untuk membandingkan jumlah diskrit siswa hadir vs tidak hadir per hari kerja.'
    },
    quizAnswers: [
      {
        questionId: 'l3-q1',
        question: 'Bagaimana metode Abstraksi (Berpikir Komputasional) membantu kita dalam menyajikan data kehadiran kelas ke bentuk Diagram Batang?',
        correctAnswer: 'Mengabaikan detail nama individu dan hanya menampilkan informasi penting berupa total angka kehadiran per hari secara visual',
        explanation: 'Betul! Abstraksi adalah memilah informasi penting (total angka harian) dan mengesampingkan detail yang kurang relevan (nama-nama siswa) agar data lebih mudah dipahami secara visual.'
      },
      {
        questionId: 'l3-q2',
        question: 'Berdasarkan grafik hasil abstraksi data mingguan tersebut, hari apa yang menunjukkan tren penurunan kehadiran paling drastis (ketidakhadiran tertinggi)?',
        correctAnswer: 'Jumat',
        explanation: 'Hari Jumat memiliki tingkat ketidakhadiran paling tinggi yaitu mencapai 10 siswa absen (hanya 20 siswa yang hadir).'
      }
    ],
    decisionAnswer: {
      decisionId: 'l3-d1',
      scenario: 'Laporan visual menunjukkan kelas Anda jatuh ke tingkat kehadiran 66% di hari Jumat (20 dari 30 siswa yang hadir). Kepala sekolah menuntut tindakan darurat.',
      question: 'Sebagai admin berbasis data, bagaimana cara terbaik memanfaatkan grafik ini?',
      bestOption: 'Mengirim grafik ini ke komite kelas dan orang tua murid agar bersama-sama memantau komitmen kehadiran hari Jumat',
      scoreWeight: 40,
      feedback: 'Sangat Tepat! Keterbukaan data visual kepada orang tua membangun kerja sama solid untuk perbaikan disiplin siswa.'
    }
  }
];

export const projectMeta = {
  title: 'Sekolah Data Challenge',
  url: 'https://glenrioariesto.github.io/sekolah-data-challenge/',
  github: 'https://github.com/glenrioariesto/sekolah-data-challenge'
};
