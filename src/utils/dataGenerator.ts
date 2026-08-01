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
  const daysCount = 5;
  const studentCount = 16;
  const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  // Pick random subset of student names
  const shuffledNames = [...INDONESIAN_NAMES].sort(() => Math.random() - 0.5);
  const classStudents = shuffledNames.slice(0, studentCount);

  const rosters: DailyRoster[] = [];
  const records: AttendanceRecord[] = [];

  // Pick 1 random day out of 5 to have high attendance (e.g. Senin or Wednesday)
  const highAttendanceDayIdx = Math.floor(Math.random() * daysCount);

  for (let i = 0; i < daysCount; i++) {
    const day = weekDays[i];
    const dayStudents: StudentRecord[] = [];
    
    let presentCount = 0;
    let permitCount = 0;
    let sickCount = 0;
    let alphaCount = 0;

    const isHighAttendanceDay = i === highAttendanceDayIdx;

    classStudents.forEach(name => {
      // If high attendance day: ~80% Hadir, ~20% Tidak Hadir. Otherwise: ~55% Hadir, ~45% Tidak Hadir.
      const pPresent = isHighAttendanceDay ? 0.80 : 0.55;
      const pPermit = isHighAttendanceDay ? 0.08 : 0.15;
      const pSick = isHighAttendanceDay ? 0.08 : 0.18;

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
  if (!records || records.length === 0) return [];

  // Calculate attendance statistics dynamically from current level records
  let maxAbsDay = records[0].day;
  let maxAbsVal = (records[0].permit || 0) + (records[0].sick || 0) + (records[0].alpha || 0);
  let minAbsDay = records[0].day;
  let minAbsVal = (records[0].permit || 0) + (records[0].sick || 0) + (records[0].alpha || 0);
  
  let maxPresDay = records[0].day;
  let maxPresVal = records[0].present;

  let totalPermit = 0;
  let totalSick = 0;
  let totalAlpha = 0;
  let totalPresent = 0;

  records.forEach(r => {
    const permit = r.permit || 0;
    const sick = r.sick || 0;
    const alpha = r.alpha || 0;

    const absVal = permit + sick + alpha;
    if (absVal > maxAbsVal) {
      maxAbsVal = absVal;
      maxAbsDay = r.day;
    }
    if (absVal < minAbsVal) {
      minAbsVal = absVal;
      minAbsDay = r.day;
    }

    if (r.present > maxPresVal) {
      maxPresVal = r.present;
      maxPresDay = r.day;
    }

    totalPresent += r.present;
    totalPermit += permit;
    totalSick += sick;
    totalAlpha += alpha;
  });

  const totalAbsence = totalPermit + totalSick + totalAlpha;

  // Pool of varied analysis questions
  const questionPool: QuizQuestion[] = [
    // Question 1: Computational Thinking Abstraction
    {
      id: 'q-abstraction',
      question: 'Bagaimana metode Abstraksi (Berpikir Komputasional) membantu kita dalam menyajikan data kehadiran kelas ke bentuk Diagram?',
      options: [
        'Menampilkan setiap detail nama siswa dan alasan mereka tidak hadir satu per satu secara lengkap',
        'Mengabaikan detail nama individu dan hanya menampilkan informasi penting berupa total angka kehadiran per hari secara visual',
        'Menggambar diagram secara sembarangan tanpa memperhatikan data numerik yang sebenarnya',
        'Menghilangkan hari-hari dengan kehadiran rendah agar grafiknya terlihat selalu bagus'
      ],
      correctAnswer: 'Mengabaikan detail nama individu dan meampilkan informasi penting berupa total angka kehadiran per hari secara visual',
      explanation: 'Betul! Abstraksi adalah memilah informasi penting (total angka harian) dan mengesampingkan detail individu (nama-nama siswa) agar data mudah dipahami secara visual.'
    },
    // Question 2: Max absence day
    {
      id: 'q-max-absent-day',
      question: 'Berdasarkan grafik hasil abstraksi data mingguan tersebut, hari apa yang menunjukkan angka ketidakhadiran (Izin, Sakit, Alfa) paling tinggi?',
      options: records.map(r => r.day),
      correctAnswer: maxAbsDay,
      explanation:`Hari ${maxAbsDay} memiliki tingkat ketidakhadiran tertinggi yaitu mencapai ${maxAbsVal} siswa.`
    },
    // Question 3: Max presence day
    {
      id: 'q-max-present-day',
      question: 'Hari apakah dalam minggu tersebut yang mencatatkan jumlah siswa HADIR terbanyak di kelas?',
      options: records.map(r => r.day),
      correctAnswer: maxPresDay,
      explanation: `Tepat! Pada hari ${maxPresDay}, tingkat kehadiran siswa mencapai puncaknya yaitu sejumlah ${maxPresVal} siswa hadir.`
    },
    // Question 4: Min absence day (best attendance)
    {
      id: 'q-min-absent-day',
      question: 'Hari apakah yang memiliki tingkat ketidakhadiran PALING SEDIKIT (kehadiran kelas paling tertib)?',
      options: records.map(r => r.day),
      correctAnswer: minAbsDay,
      explanation: `Hebat! Hari ${minAbsDay} hanya mencatatkan ${minAbsVal} siswa tidak hadir, menjadikannya hari dengan kedisiplinan terbanyak.`
    },
    // Question 5: Dominant non-attendance reason
    {
      id: 'q-dominant-reason',
      question: 'Dari total akumulasi ketidakhadiran selama seminggu, alasan/kategori manakah yang memiliki angka kejadian terbanyak?',
      options: ['Izin', 'Sakit', 'Alfa', 'Hadir'],
      correctAnswer: (totalSick >= totalPermit && totalSick >= totalAlpha) ? 'Sakit' : ((totalPermit >= totalAlpha) ? 'Izin' : 'Alfa'),
      explanation: `Tepat sekali! Kategori ketidakhadiran terbanyak secara akumulatif minggu ini didominasi oleh status tersebut.`
    },
    // Question 6: Data Representation Purpose
    {
      id: 'q-chart-purpose',
      question: 'Mengapa menyajikan data absensi dalam bentuk visual diagram lebih efektif daripada melihat tumpukan lembar kertas absen manual?',
      options: [
        'Karena diagram membuat angka absensi berubah menjadi lebih sedikit',
        'Karena grafik memudahkan kita melihat perbandingan dan pola tren kehadiran dengan cepat tanpa membaca satu per satu',
        'Karena diagram dapat menghapus data siswa yang alfa secara otomatis',
        'Karena lembar manual tidak memiliki warna sama sekali'
      ],
      correctAnswer: 'Karena grafik memudahkan kita melihat perbandingan dan pola tren kehadiran dengan cepat tanpa membaca satu per satu',
      explanation: 'Benar! Visualisasi grafik mengubah data mentah menjadi pola yang mudah dianalisis oleh pikiran manusia dengan sekejap.'
    }
  ];

  // Fix exact match string for abstraction option
  questionPool[0].correctAnswer = 'Mengabaikan detail nama individu dan hanya menampilkan informasi penting berupa total angka kehadiran per hari secara visual';

  // Shuffle the question pool and randomly pick exactly 2 questions
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};
