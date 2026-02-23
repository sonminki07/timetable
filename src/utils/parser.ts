import { Lecture, TimeBlock } from "../types/timetable";

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

    let parts = line.split("\t");
    let title = "알 수 없는 강의";
    let prof = "";
    let isTabParsed = false;

    // 1. 탭으로 구분된 경우 우선 시도
    if (parts.length >= 3) {
      title = parts[1]?.trim() || title;
      prof = parts[2]?.trim() || "";
      // 교수명에 숫자가 섞여있거나 비어있으면 실패로 간주하고 재시도
      if (!prof || prof.match(/\d/)) {
        // 혹시 3번째 필드(parts[3])에 있을 수 있으므로 체크 (시간표 정보가 아니면 교수명일 확률 높음)
        const nextPart = parts[3]?.trim();
        if (nextPart && !nextPart.match(/\d/) && !nextPart.match(/[월화수목금]/)) {
           prof = nextPart;
           isTabParsed = true;
        }
      } else {
        isTabParsed = true;
      }
    }

    // 2. 탭 분리 실패 시, 공백 2개 이상으로 분리 시도 (모바일/웹 복사 대응)
    if (!isTabParsed) {
      const spaceParts = line.split(/\s{2,}/);
      if (spaceParts.length >= 3) {
        title = spaceParts[1]?.trim() || title;
        const potentialProf = spaceParts[2]?.trim();
        // 교수명이 시간표 정보(요일/숫자 포함)가 아니면 채택
        if (potentialProf && !potentialProf.match(/\d/) && !potentialProf.match(/[월화수목금]/)) {
          prof = potentialProf;
        } else {
           // 혹시 3번째 필드에 있을 수 있음
           const nextPart = spaceParts[3]?.trim();
           if (nextPart && !nextPart.match(/\d/) && !nextPart.match(/[월화수목금]/)) {
             prof = nextPart;
           }
        }
      }
    }

    // 3. 여전히 실패 시 정규식 패턴 시도 (대괄호 [강의명] [교수명] 형태)
    if (!prof && line.includes("[")) {
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
        rank: courses.length, // 현재 강의의 순위 (0부터 시작)
      });
    }
  }
  return courses;
}
