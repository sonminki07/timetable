export interface TimeBlock {
  day: string;
  start: number;
  end: number;
  room: string;
  moveInfo?: {
    distance: number;
    isConsecutive: boolean;
  } | null;
}

export interface Lecture {
  groupIdx: number;
  title: string;
  prof: string;
  timeBlocks: TimeBlock[];
  allTimes: string[];
  timesOnly: string;
  roomsOnly: string;
  raw: string;
  rank?: number;
}

export interface Group {
  id: number;
  text: string;
}

export interface ProfWeight {
  name: string;
  weight: number;
}

export interface Settings {
  cols: number;
  hardDays: boolean[];
  excludePeriods: number[];
  prefDays: boolean[];
  maxConsec: number;
  consecPolicy: 'penalty' | 'destroy';
  prefSubject: string;
  prefLunch: number[];
  useProfWeight: boolean;
  profWeights: ProfWeight[];
  university?: 'catholic' | 'hanshin'; // 기본값: 'catholic'
}

export interface Schedule {
  lectures: Lecture[];
  score: number;
  scoreText: string;
}

export interface AnalysisResult {
  message: string;
  conflicts?: string[];
}
