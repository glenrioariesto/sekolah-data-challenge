import { AttendanceRecord, DailyRoster, StudentRecord, QuizQuestion } from '../types';

export const MALE_NAMES = [
  'Raka', 'Rizky', 'Farel', 'Rafi', 'Alvin',
  'Daffa', 'Arka', 'Naufal', 'Raihan', 'Keanu',
  'Zidan', 'Fathan', 'Alif', 'Revan', 'Dimas'
];

export const FEMALE_NAMES = [
  'Alya', 'Nayla', 'Zahra', 'Aurel', 'Keisha',
  'Nabila', 'Celine', 'Keyla', 'Aisyah', 'Shakira',
  'Nadine', 'Tiara', 'Naura', 'Syifa', 'Clarissa'
];

// 30 Total Names (15 Females + 15 Males)
export const INDONESIAN_NAMES = [
  ...FEMALE_NAMES,
  ...MALE_NAMES
];

export const generateDynamicLevelData = (levelId: number): {
  records: AttendanceRecord[];
  rosters: DailyRoster[];
} => {
  const daysCount = 5;
  const studentCount = 16;
  const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  // Select 8 girls and 8 boys (total 16 students) for balanced representation, shuffled
  const selectedGirls = [...FEMALE_NAMES].sort(() => Math.random() - 0.5).slice(0, 8);
  const selectedBoys = [...MALE_NAMES].sort(() => Math.random() - 0.5).slice(0, 8);
  const classStudents = [...selectedGirls, ...selectedBoys].sort(() => Math.random() - 0.5);

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

  // Helper to ensure day-based questions always have exactly 4 options (A-D) consistent with SMP standard
  const getFourDayOptions = (correctDay: string, allRecords: AttendanceRecord[]): string[] => {
    const weekOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const others = allRecords.map(r => r.day).filter(d => d !== correctDay);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const four = [correctDay, ...shuffledOthers];
    return four.sort((a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
  };

  // Pool of varied analysis questions (All standardized to exactly 4 options A, B, C, D)
  const questionPool: QuizQuestion[] = [
    // Question 1: Computational Thinking Abstraction (Simplified for SMP)
    {
      id: 'q-abstraction',
      question: 'Dalam Berpikir Komputasional (Abstraksi), mengapa data kehadiran kelas lebih mudah disajikan ke bentuk diagram batang?',
      options: [
        'Menampilkan seluruh nama dan biodata siswa secara lengkap satu per satu',
        'Menyederhanakan data dengan menampilkan total jumlah siswa per hari',
        'Menghapus hari-hari yang jumlah ketidakhadirannya tinggi agar grafik terlihat bagus',
        'Menggambar grafik bebas tanpa perlu menghitung data kehadiran siswa'
      ],
      correctAnswer: 'Menyederhanakan data dengan menampilkan total jumlah siswa per hari',
      explanation: 'Tepat! Prinsip Abstraksi memfokuskan kita pada informasi penting (total angka per hari) dan mengabaikan detail yang belum diperlukan (nama individu) agar data cepat dan mudah dipahami.'
    },
    // Question 2: Max absence day (4 options)
    {
      id: 'q-max-absent-day',
      question: 'Berdasarkan grafik hasil abstraksi data mingguan tersebut, hari apa yang menunjukkan angka ketidakhadiran (Izin, Sakit, Alfa) paling tinggi?',
      options: getFourDayOptions(maxAbsDay, records),
      correctAnswer: maxAbsDay,
      explanation: `Hari ${maxAbsDay} memiliki tingkat ketidakhadiran tertinggi yaitu mencapai ${maxAbsVal} siswa.`
    },
    // Question 3: Max presence day (4 options)
    {
      id: 'q-max-present-day',
      question: 'Hari apakah dalam minggu tersebut yang mencatatkan jumlah siswa HADIR terbanyak di kelas?',
      options: getFourDayOptions(maxPresDay, records),
      correctAnswer: maxPresDay,
      explanation: `Pada hari ${maxPresDay}, tingkat kehadiran siswa mencapai puncaknya yaitu sejumlah ${maxPresVal} siswa hadir.`
    },
    // Question 4: Min absence day (best attendance, 4 options)
    {
      id: 'q-min-absent-day',
      question: 'Hari apakah yang memiliki tingkat ketidakhadiran PALING SEDIKIT (kehadiran kelas paling tertib)?',
      options: getFourDayOptions(minAbsDay, records),
      correctAnswer: minAbsDay,
      explanation: `Hari ${minAbsDay} hanya mencatatkan ${minAbsVal} siswa tidak hadir, menjadikannya hari dengan kedisiplinan terbanyak.`
    },
    // Question 5: Dominant non-attendance reason (4 options)
    {
      id: 'q-dominant-reason',
      question: 'Dari total akumulasi ketidakhadiran selama seminggu, alasan/kategori manakah yang memiliki angka kejadian terbanyak?',
      options: ['Izin', 'Sakit', 'Alfa', 'Hadir'],
      correctAnswer: (totalSick >= totalPermit && totalSick >= totalAlpha) ? 'Sakit' : ((totalPermit >= totalAlpha) ? 'Izin' : 'Alfa'),
      explanation: `Kategori ketidakhadiran terbanyak secara akumulatif minggu ini didominasi oleh status tersebut.`
    },
    // Question 6: Data Representation Purpose (4 options)
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
      explanation: 'Visualisasi grafik mengubah data mentah menjadi pola yang mudah dianalisis oleh pikiran manusia dengan sekejap.'
    }
  ];

  // Fix exact match string for abstraction option
  questionPool[0].correctAnswer = 'Menyederhanakan data dengan menampilkan total jumlah siswa per hari';

  // Shuffle the question pool and randomly pick exactly 2 questions
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};
