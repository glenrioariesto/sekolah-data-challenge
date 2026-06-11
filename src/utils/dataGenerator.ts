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
    const dayNames = records.map(r => r.day);
    
    // Find day with highest present
    let maxPresentDay = records[0].day;
    let maxPresentVal = records[0].present;
    records.forEach(r => {
      if (r.present > maxPresentVal) {
        maxPresentVal = r.present;
        maxPresentDay = r.day;
      }
    });

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
        question: 'Berapa jumlah total siswa yang TIDAK HADIR (Izin, Sakit, atau Alfa) selama 3 hari sekolah tersebut?',
        options: uniqueQ1Options,
        correctAnswer: `${totalAbsent} Siswa`,
        explanation: explanationQ1
      },
      {
        id: 'l1-q2',
        question: 'Pada hari apa tingkat kehadiran siswa (Hadir) merupakan yang tertinggi?',
        options: [...dayNames, 'Semua hari sama'].slice(0, 4),
        correctAnswer: maxPresentDay,
        explanation: `Hebat! Hari ${maxPresentDay} memiliki jumlah kehadiran terbanyak yaitu ${maxPresentVal} siswa hadir.`
      }
    ];
  }

  if (levelId === 2) {
    const totalPresent = records.reduce((sum, r) => sum + r.present, 0);
    const dayNames = records.map(r => r.day);
    
    let maxPresentDay = records[0].day;
    let maxPresentVal = records[0].present;
    records.forEach(r => {
      if (r.present > maxPresentVal) {
        maxPresentVal = r.present;
        maxPresentDay = r.day;
      }
    });

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
        question: 'Berapakah total kehadiran siswa (Hadir) selama 5 hari di sistem?',
        options: uniqueQ1Options,
        correctAnswer: `${totalPresent} Kehadiran`,
        explanation: `Tepat sekali! Total hadir = ${records.map(r => r.present).join(' + ')} = ${totalPresent} kehadiran.`
      },
      {
        id: 'l2-q2',
        question: 'Pada hari apa sekolah mencapai tingkat kehadiran tertinggi (Hadir paling banyak)?',
        options: dayNames.slice(0, 4),
        correctAnswer: maxPresentDay,
        explanation: `Benar! Hari ${maxPresentDay} adalah hari di mana siswa paling banyak hadir (${maxPresentVal} siswa).`
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
        question: 'Ketika kita ingin menyajikan perbandingan jumlah kehadiran atau absensi antarhari secara jelas dan instan, bentuk penyajian data apa yang paling efektif?',
        options: ['Tabel mentah tanpa baris', 'Diagram Batang', 'Peta Geografis', 'Tulisan Narasi Panjang'],
        correctAnswer: 'Diagram Batang',
        explanation: 'JOSS! Diagram batang memudahkan mata membandingkan perbedaan tinggi (jumlah) antar kategori secara instan.'
      },
      {
        id: 'l3-q2',
        question: 'Berdasarkan grafik yang Anda buat, hari apa yang memiliki tingkat ketidakhadiran (Izin, Sakit, dan Alfa digabung) paling tinggi?',
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
        question: 'Dibandingkan dengan Minggu ke-1, kesimpulan apa yang kalian dapatkan tentang tren kehadiran pada Minggu ke-2?',
        options: [
          'Minggu ke-2 mengalami penurunan kehadiran',
          'Minggu ke-2 mengalami peningkatan kehadiran yang sangat signifikan dan lebih stabil',
          'Kedua minggu sama persis tingkat kehadirannya',
          'Tidak ada pola yang dapat dibaca sama sekali'
        ],
        correctAnswer: 'Minggu ke-2 mengalami peningkatan kehadiran yang sangat signifikan dan lebih stabil',
        explanation: 'Sempurna! Minggu ke-2 menunjukkan tingkat kehadiran yang lebih tinggi dan stabil hampir setiap hari berkat program baru.'
      },
      {
        id: 'l4-q2',
        question: 'Pada hari apa di Minggu ke-1 kemerosotan kehadiran terdalam terjadi (absen terbanyak)?',
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
      question: 'Perhatikan grafik bulanan. Terjadi penurunan tajam kehadiran yang drastis pada Rabu Minggu ke-2. Apa istilah yang tepat untuk data yang melonjak aneh di luar pola normal ini?',
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
        'Dihapus saja hari tersebut agar datanya kembali tinggi',
        'Mengganti siswa yang rajin untuk mewakili sekolah'
      ],
      correctAnswer: 'Tidak, karena ketidakhadiran disebabkan oleh keadaan darurat cuaca (darurat bencana alam) demi keselamatan siswa',
      explanation: 'Betul sekali! Sebagai analis data yang empati, kita harus sadar konteks di balik data sebelum membuat penilaian moral.'
    }
  ];
};
