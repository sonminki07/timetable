export interface TimeBlock {
  day: string;
  start: number;
  end: number;
  room: string;
}

export interface Lecture {
  groupIdx: number;
  title: string;
  prof: string;
  timeBlocks: TimeBlock[];
  allTimes: string[]; // "월1", "월2" 형태의 문자열 배열
  timesOnly: string;
  roomsOnly: string;
  raw: string;
}

export interface Group {
  id: number;
  text: string;
}

export interface Settings {
  cols: number;
  hardDays: boolean[]; // [월, 화, 수, 목, 금]
  excludePeriods: number[];
  prefDays: boolean[];
  maxConsec: number;
  consecPolicy: 'penalty' | 'destroy';
  prefSubject: string;
  prefLunch: number[];
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
