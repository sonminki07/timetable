import { Lecture, TimeBlock } from "../../types/timetable";

export const DAYS = ["월", "화", "수", "목", "금"];

export function parseText(text: string, groupIdx: number): Lecture[] {
  if (!text.trim()) return [];
  const lines = text.split("\n");
  const courses: Lecture[] = [];
  
  // 정규식 수정: 월, 화, 수, 목, 금을 인식하도록 처리
  const timeRegex = /(월|화|수|목|금)\s*(\d+)(?:~(\d+))?(?:\((.*?)\))?/g;

  for (const line of lines) {
    if (
      !line.trim() ||
      line.includes("강의코드") ||
      line.includes("강의명") ||
      line.includes("교수")
    )
      continue;

    const parts = line.split("\t");
    let title = "알 수 없는 강의";
    let prof = "";

    if (parts.length >= 4) {
      title = parts[1]?.trim() || title;
      prof = parts[2]?.trim() || "";
    } else {
      const titleMatch = line.match(/\[(.*?)\]/);
      if (titleMatch) {
        title = titleMatch[1];
        const profMatch = line.match(/교수:(.*?)\|/);
        if (profMatch) prof = profMatch[1].trim();
      } else {
        title = line.split(/\s+/)[1] || title;
      }
    }

    let match;
    const timeBlocks: TimeBlock[] = [];
    const allTimes: string[] = [];
    const timeStrArray: string[] = [];

    // regex.exec()를 사용할 때는 lastIndex 초기화에 주의
    timeRegex.lastIndex = 0; 
    while ((match = timeRegex.exec(line)) !== null) {
      const day = match[1];
      const start = parseInt(match[2]);
      const end = match[3] ? parseInt(match[3]) : start;
      const room = match[4] || "";
      
      timeBlocks.push({ day, start, end, room });
      timeStrArray.push(`${day}${start}${end !== start ? "~" + end : ""}`);
      
      for (let i = start; i <= end; i++) {
        allTimes.push(day + i);
      }
    }

    if (timeBlocks.length > 0) {
      courses.push({
        raw: line,
        title,
        prof,
        timeBlocks,
        allTimes,
        timesOnly: timeStrArray.join(", "),
        roomsOnly: [...new Set(timeBlocks.map((tb) => tb.room).filter((r) => r))].join(", "),
        groupIdx,
      });
    }
  }
  return courses;
}
