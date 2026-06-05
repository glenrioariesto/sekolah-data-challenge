export interface AttendanceRecord {
  day: string;
  present: number;
  absent: number;
}

export interface StudentRecord {
  name: string;
  status: 'Hadir' | 'Tidak Hadir';
}

export interface DailyRoster {
  day: string;
  students: StudentRecord[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DecisionChoice {
  id: string;
  scenario: string;
  question: string;
  options: {
    text: string;
    scoreWeight: number; // For pedagogical feedback
    feedback: string;
  }[];
}

export interface GameLevel {
  id: number;
  title: string;
  description: string;
  focus: string;
  durationLabel: string;
  daysCount: number;
  records: AttendanceRecord[]; // Target records for verification
  rosters?: DailyRoster[]; // Detailed roster for Levels where student has to count
  questions: QuizQuestion[];
  decision: DecisionChoice;
  badgeName: string;
  badgeIcon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achievedAtLevel: number;
}

export type GameStage = 'intro' | 'roster' | 'input' | 'chart' | 'analysis' | 'decision' | 'complete';
