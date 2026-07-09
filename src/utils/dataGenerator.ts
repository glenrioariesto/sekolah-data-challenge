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
  const studentCount = 15;
  const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

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
      const pPresent = 0.80;
      const pPermit = 0.08;
      const pSick = 0.08;
      const pAlpha = 0.04;

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
      options: records.map(r => r.day),
      correctAnswer: maxAbsDay,
      explanation: `Benar sekali. Hari ${maxAbsDay} memiliki tingkat ketidakhadiran paling tinggi yaitu mencapai ${maxAbsVal} siswa.`
    }
  ];
};
