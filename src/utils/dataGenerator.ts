import { AttendanceRecord, DailyRoster, StudentRecord, QuizQuestion } from '../types';

const INDONESIAN_NAMES = [
  'Andi', 'Budi', 'Cici', 'Dodi', 'Eka', 'Fani', 'Gita', 'Hari', 'Iwan', 'Joko',
  'Kirana', 'Lia', 'Maman', 'Nina', 'Oki', 'Puji', 'Rian', 'Susi', 'Tono', 'Udin',
  'Vera', 'Wati', 'Yudi', 'Zacky', 'Adit', 'Amel', 'Bambang', 'Dewi', 'Endang', 'Fitri',
  'Hendra', 'Indah', 'Kartika', 'Lukman', 'Mega', 'Novi', 'Putra', 'Ratna', 'Sari', 'Tri',
  'Asep', 'Cecep', 'Dadang', 'Euis', 'Guruh', 'Indra', 'Jajang', 'Koko', 'Lilis', 'Mamat'
];

export const generateDynamicLevelData = (levelId: number): {
  records: AttendanceRecord[];
  rosters: DailyRoster[];
} => {
  let daysCount = 5;
  let studentCount = 15;
  let weekDays: string[] = [];

  if (levelId === 1) {
    daysCount = 3;
    studentCount = 10;
    weekDays = ['Senin', 'Selasa', 'Rabu'];
  } else if (levelId === 2) {
    daysCount = 5;
    studentCount = 12;
    weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  } else if (levelId === 3) {
    daysCount = 5;
    studentCount = 15;
    weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  } else if (levelId === 4) {
    daysCount = 10;
    studentCount = 20;
    weekDays = [
      'Senin (M1)', 'Selasa (M1)', 'Rabu (M1)', 'Kamis (M1)', 'Jumat (M1)',
      'Senin (M2)', 'Selasa (M2)', 'Rabu (M2)', 'Kamis (M2)', 'Jumat (M2)'
    ];
  } else if (levelId === 5) {
    daysCount = 20;
    studentCount = 25;
    weekDays = [];
    for (let w = 1; w <= 4; w++) {
      ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].forEach(d => {
        weekDays.push(`${d} (M${w})`);
      });
    }
  }

  // Pick random subset of student names
  const shuffledNames = [...INDONESIAN_NAMES].sort(() => Math.random() - 0.5);
  const classStudents = shuffledNames.slice(0, studentCount);

  const rosters: DailyRoster[] = [];
  const records: AttendanceRecord[] = [];

  for (let i = 0; i < daysCount; i++) {
    const day = weekDays[i];
    const dayStudents: StudentRecord[] = [];
    
    let presentCount = 0;
    let permitCount = 0;
    let sickCount = 0;
    let alphaCount = 0;

    classStudents.forEach(name => {
      // Determine random status with realistic probabilities
      let pPresent = 0.80;
      let pPermit = 0.08;
      let pSick = 0.08;
      let pAlpha = 0.04;

      if (levelId === 5 && day === 'Rabu (M2)') {
        // Wednesday Week 2 has flood anomaly
        pPresent = 0.20;
        pPermit = 0.30;
        pSick = 0.20;
        pAlpha = 0.30;
      } else if (levelId === 4) {
        if (day === 'Jumat (M1)') {
          // Friday Week 1 low attendance
          pPresent = 0.40;
          pPermit = 0.20;
          pSick = 0.15;
          pAlpha = 0.25;
        } else if (day === 'Jumat (M2)') {
          // Friday Week 2 high attendance due to Friday Ceria
          pPresent = 0.95;
          pPermit = 0.02;
          pSick = 0.02;
          pAlpha = 0.01;
        }
      }

      const rand = Math.random();
      let status: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';

      if (rand < pPresent) {
        status = 'Hadir';
        presentCount++;
      } else if (rand < pPresent + pPermit) {
        status = 'Izin';
        permitCount++;
      } else if (rand < pPresent + pPermit + pSick) {
        status = 'Sakit';
        sickCount++;
      } else {
        status = 'Alfa';
        alphaCount++;
      }

      dayStudents.push({ name, status });
    });

    rosters.push({ day, students: dayStudents });
    records.push({
      day,
      present: presentCount,
      permit: permitCount,
      sick: sickCount,
      alpha: alphaCount
    });
  }

  return { records, rosters };
};

export const generateDynamicQuestions = (levelId: number, records: AttendanceRecord[]): QuizQuestion[] => {
  if (levelId === 1) {
    const totalAbsent = records.reduce((sum, r) => sum + r.permit + r.sick + r.alpha, 0);
    
    const q1Options = [
      `${totalAbsent} Siswa`,
      `${totalAbsent + 3} Siswa`,
      `${Math.max(0, totalAbsent - 2)} Siswa`,
      `${totalAbsent + 5} Siswa`
    ];
    const uniqueQ1Options = Array.from(new Set(q1Options));
    while (uniqueQ1Options.length < 4) {
      uniqueQ1Options.push(`${totalAbsent + uniqueQ1Options.length + 10} Siswa`);
    }
    uniqueQ1Options.sort(() => Math.random() - 0.5);

    const explanationQ1 = `Betul! Pada hari ${records[0].day} ada ${records[0].permit + records[0].sick + records[0].alpha} siswa absen, ` +
      `${records[1].day} ada ${records[1].permit + records[1].sick + records[1].alpha} siswa absen, ` +
      `dan ${records[2].day} ada ${records[2].permit + records[2].sick + records[2].alpha} siswa absen. ` +
      `Total: ${records[0].permit + records[0].sick + records[0].alpha} + ${records[1].permit + records[1].sick + records[1].alpha} + ${records[2].permit + records[2].sick + records[2].alpha} = ${totalAbsent} siswa.`;

    return [
      {
        id: 'l1-q1',
        question: 'Bagaimana penerapan metode Dekomposisi (Berpikir Komputasional) yang paling tepat untuk menghitung total ketidakhadiran siswa selama 3 hari?',
        options: [
          'Menghitung seluruh nama siswa sekaligus di daftar tanpa membaginya per hari',
          'Mengurai data kehadiran per hari (Senin, Selasa, Rabu), menghitung absen masing-masing hari, lalu menjumlahkannya',
          'Mengira-ngira jumlah siswa yang bolos tanpa melihat lembar daftar kehadiran',
          'Menghapus nama-nama siswa yang tidak hadir agar tugas administrasi menjadi lebih cepat selesai'
        ],
        correctAnswer: 'Mengurai data kehadiran per hari (Senin, Selasa, Rabu), menghitung absen masing-masing hari, lalu menjumlahkannya',
        explanation: 'Benar! Dekomposisi dilakukan dengan memecah masalah besar (menghitung total 3 hari) menjadi masalah-masalah kecil (menghitung per hari), lalu menggabungkannya kembali.'
      },
      {
        id: 'l1-q2',
        question: 'Berdasarkan dekomposisi data harian tersebut, berapa jumlah total siswa yang TIDAK HADIR (Izin, Sakit, atau Alfa) selama 3 hari sekolah tersebut?',
        options: uniqueQ1Options,
        correctAnswer: `${totalAbsent} Siswa`,
        explanation: explanationQ1
      }
    ];
  }

  if (levelId === 2) {
    const totalPresent = records.reduce((sum, r) => sum + r.present, 0);
    
    const q1Options = [
      `${totalPresent} Kehadiran`,
      `${totalPresent + 5} Kehadiran`,
      `${Math.max(0, totalPresent - 4)} Kehadiran`,
      `${totalPresent + 10} Kehadiran`
    ];
    const uniqueQ1Options = Array.from(new Set(q1Options));
    while (uniqueQ1Options.length < 4) {
      uniqueQ1Options.push(`${totalPresent + uniqueQ1Options.length + 12} Kehadiran`);
    }
    uniqueQ1Options.sort(() => Math.random() - 0.5);

    return [
      {
        id: 'l2-q1',
        question: 'Dalam memindahkan data kehadiran siswa selama 5 hari ke tabel digital, mengapa kita harus mengikuti urutan langkah terstruktur (Algoritma)?',
        options: [
          'Agar data diinput secara acak dan tidak berurutan',
          'Agar proses pengolahan data konsisten, meminimalkan kesalahan input, dan menghasilkan total hitungan yang akurat',
          'Agar hasil hitungan akhir selalu berubah-ubah setiap kali dilihat',
          'Agar data kehadiran siswa yang bolos otomatis terhapus dari sistem'
        ],
        correctAnswer: 'Agar proses pengolahan data konsisten, meminimalkan kesalahan input, dan menghasilkan total hitungan yang akurat',
        explanation: 'Sempurna! Urutan langkah terstruktur (Algoritma) memastikan setiap data diinput dengan prosedur yang benar agar hasilnya valid.'
      },
      {
        id: 'l2-q2',
        question: 'Berdasarkan tabel digital terstruktur yang sudah kamu lengkapi, berapa total kehadiran (Hadir) seluruh siswa selama 5 hari kerja?',
        options: uniqueQ1Options,
        correctAnswer: `${totalPresent} Kehadiran`,
        explanation: `Tepat sekali! Total hadir = ${records.map(r => r.present).join(' + ')} = ${totalPresent} kehadiran.`
      }
    ];
  }

  if (levelId === 3) {
    let maxAbsDay = records[0].day;
    let maxAbsVal = records[0].permit + records[0].sick + records[0].alpha;
    records.forEach(r => {
      const v = r.permit + r.sick + r.alpha;
      if (v > maxAbsVal) {
        maxAbsVal = v;
        maxAbsDay = r.day;
      }
    });

    return [
      {
        id: 'l3-q1',
        question: 'Bagaimana metode Abstraksi (Berpikir Komputasional) membantu kita dalam menyajikan data kehadiran kelas ke bentuk Diagram Batang?',
        options: [
          'Menampilkan setiap detail nama siswa dan alasan mereka tidak hadir satu per satu secara lengkap',
          'Mengabaikan detail nama individu dan hanya menampilkan informasi penting berupa total angka kehadiran per hari secara visual',
          'Menggambar diagram secara sembarangan tanpa memperhatikan data numerik yang sebenarnya',
          'Menghilangkan hari-hari dengan kehadiran rendah agar grafiknya terlihat selalu bagus'
        ],
        correctAnswer: 'Mengabaikan detail nama individu dan hanya menampilkan informasi penting berupa total angka kehadiran per hari secara visual',
        explanation: 'Betul! Abstraksi adalah memilah informasi penting (total angka harian) dan mengesampingkan detail yang kurang relevan (nama-nama siswa) agar data lebih mudah dipahami secara visual.'
      },
      {
        id: 'l3-q2',
        question: 'Berdasarkan grafik hasil abstraksi data mingguan tersebut, hari apa yang menunjukkan tren penurunan kehadiran paling drastis (ketidakhadiran tertinggi)?',
        options: records.map(r => r.day).slice(0, 4),
        correctAnswer: maxAbsDay,
        explanation: `Benar sekali. Hari ${maxAbsDay} memiliki tingkat ketidakhadiran paling tinggi yaitu mencapai ${maxAbsVal} siswa.`
      }
    ];
  }

  if (levelId === 4) {
    const week1 = records.slice(0, 5);
    let maxAbsDay = week1[0].day;
    let maxAbsVal = week1[0].permit + week1[0].sick + week1[0].alpha;
    week1.forEach(r => {
      const v = r.permit + r.sick + r.alpha;
      if (v > maxAbsVal) {
        maxAbsVal = v;
        maxAbsDay = r.day;
      }
    });

    return [
      {
        id: 'l4-q1',
        question: 'Saat membandingkan grafik Minggu 1 dan Minggu 2, pola perubahan apa yang paling mencolok terkait dampak program peningkatan kehadiran siswa?',
        options: [
          'Kehadiran di Minggu 2 mengalami penurunan drastis di semua hari dibanding Minggu 1',
          'Kehadiran di Minggu 2 mengalami peningkatan konsisten dan jauh lebih stabil mendekati kapasitas maksimal kelas',
          'Kedua minggu sama persis tingkat kehadirannya tanpa ada perbedaan pola visual apa pun',
          'Grafik Minggu 2 menjadi sangat acak dan tidak membentuk tren pola yang jelas'
        ],
        correctAnswer: 'Kehadiran di Minggu 2 mengalami peningkatan konsisten dan jauh lebih stabil mendekati kapasitas maksimal kelas',
        explanation: 'Sempurna! Pengenalan pola grafik menunjukkan visualisasi Minggu 2 jauh lebih tinggi dan stabil dibanding Minggu 1, menandakan program kehadiran sekolah sukses.'
      },
      {
        id: 'l4-q2',
        question: 'Pola fluktuasi di Minggu 1 menunjukkan penurunan kehadiran terendah (absen terbanyak) terjadi di hari apa?',
        options: week1.map(r => r.day).slice(0, 4),
        correctAnswer: maxAbsDay,
        explanation: `Hebat! Di hari ${maxAbsDay}, ada ${maxAbsVal} siswa absen, yang merupakan angka ketidakhadiran terbesar dalam periode tersebut.`
      }
    ];
  }

  // Level 5
  return [
    {
      id: 'l5-q1',
      question: 'Perhatikan grafik bulanan. Terjadi penurunan tajam kehadiran yang drastis pada Rabu Minggu ke-2 (hanya 10 siswa hadir). Dalam analisis data, apa istilah yang tepat untuk titik data ekstrem yang menyimpang jauh dari pola normal ini?',
      options: ['Nilai Rata-rata (Mean)', 'Anomali Data / Pencilan (Outlier)', 'Tren Linier Naik', 'Data Konvensional'],
      correctAnswer: 'Anomali Data / Pencilan (Outlier)',
      explanation: 'LUAR BIASA! Anomali atau pencilan adalah titik data yang sangat berbeda dari pola umum dan biasanya disebabkan oleh kejadian luar biasa.'
    },
    {
      id: 'l5-q2',
      question: 'Jika hasil penelusuran menunjukkan bahwa anomali di Rabu Minggu ke-2 disebabkan oleh bencana banjir bandang, bagaimana seorang analis data menyikapi hal tersebut?',
      options: [
        'Tetap menganggapnya sebagai kelalaian siswa membolos masal dan memberikan sanksi tegas',
        'Memahami konteks bencana alam sebagai faktor eksternal di luar kendali siswa, dan tidak menyamakannya dengan membolos biasa',
        'Menghapus hari tersebut dari laporan bulanan agar rata-rata statistik sekolah terlihat sempurna',
        'Mengubah angka kehadiran hari tersebut secara manual menjadi 30 siswa agar grafik tidak terlihat turun'
      ],
      correctAnswer: 'Memahami konteks bencana alam sebagai faktor eksternal di luar kendali siswa, dan tidak menyamakannya dengan membolos biasa',
      explanation: 'Betul sekali! Sebagai analis data yang kritis, kita harus menghubungkan data dengan konteks dunia nyata sebelum mengambil kesimpulan.'
    }
  ];
};
