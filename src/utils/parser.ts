import { Lecture, TimeBlock } from "../types/timetable";

export const DAYS = ["월", "화", "수", "목", "금"];

export function parseText(text: string, groupIdx: number, university: string = 'catholic'): Lecture[] {
  if (!text.trim()) return [];
  const lines = text.split("\n");
  const courses: Lecture[] = [];
  
  // 가톨릭대 시간 파싱 (예: 월1~2)
  const timeRegex = /(월|화|수|목|금)\s*(\d+)(?:~(\d+))?(?:\((.*?)\))?/g;

  // 한신대 시간 파싱 (예: 화(13:00~14:15))
  const hanshinTimeRegex = /(월|화|수|목|금)\((\d{2}:\d{2})~(\d{2}:\d{2})\)/g;

  // 한신대 시간 -> 교시 매핑 (근사치)
  function mapTimeToPeriod(timeStr: string): number {
    const hour = parseInt(timeStr.split(':')[0]);
    if (hour < 10) return 1; 
    if (hour < 11) return 2; 
    if (hour < 12) return 3; 
    if (hour < 13) return 4; 
    if (hour < 14) return 5; 
    if (hour < 15) return 6; 
    if (hour < 16) return 7; 
    if (hour < 17) return 8; 
    return 9;
  }

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
    let timeStr = ""; 
    let roomStr = ""; 

    if (university === 'hanshin') {
       // 한신대 파싱 로직 (공백 분리 우선)
       const spaceParts = line.split(/\s{2,}/); 
       if (spaceParts.length >= 4) {
          title = spaceParts[1]?.trim() || title;
          prof = spaceParts[2]?.trim() || "";
          timeStr = spaceParts[3]?.trim() || "";
          roomStr = spaceParts[4]?.trim() || "";
       } else if (parts.length >= 4) {
          title = parts[1]?.trim() || title;
          prof = parts[2]?.trim() || "";
          timeStr = parts[3]?.trim() || "";
          roomStr = parts[4]?.trim() || "";
       }
    } else {
       // 가톨릭대 파싱 로직
       if (parts.length >= 3) {
         title = parts[1]?.trim() || title;
         prof = parts[2]?.trim() || "";
         if (!prof || prof.match(/\d/)) {
           const nextPart = parts[3]?.trim();
           if (nextPart && !nextPart.match(/\d/) && !nextPart.match(/[월화수목금]/)) {
              prof = nextPart;
              isTabParsed = true;
           }
         } else {
           isTabParsed = true;
         }
       }
       if (!isTabParsed) {
         const spaceParts = line.split(/\s{2,}/);
         if (spaceParts.length >= 3) {
           title = spaceParts[1]?.trim() || title;
           const potentialProf = spaceParts[2]?.trim();
           if (potentialProf && !potentialProf.match(/\d/) && !potentialProf.match(/[월화수목금]/)) {
             prof = potentialProf;
           } else {
              const nextPart = spaceParts[3]?.trim();
              if (nextPart && !nextPart.match(/\d/) && !nextPart.match(/[월화수목금]/)) {
                prof = nextPart;
              }
           }
         }
       }
    }

    // 공통: 정규식으로 제목/교수 추출 시도 (실패 시)
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

    if (university === 'hanshin') {
      hanshinTimeRegex.lastIndex = 0;
      const targetStr = timeStr || line; 
      while ((match = hanshinTimeRegex.exec(targetStr)) !== null) {
        const day = match[1];
        const startStr = match[2]; 
        const endStr = match[3];   
        
        const start = mapTimeToPeriod(startStr);
        const end = start; 

        const room = roomStr || ""; 

        timeBlocks.push({ day, start, end, room });
        timeStrArray.push(`${day}${start} (${startStr}~${endStr})`);
        
        for (let i = start; i <= end; i++) {
          allTimes.push(day + i);
        }
      }
    } else {
        // 가톨릭대
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
    }

    if (timeBlocks.length > 0) {
      courses.push({
        raw: line,
        title,
        prof,
        timeBlocks,
        allTimes,
        timesOnly: timeStrArray.join(", "),
        roomsOnly: university === 'hanshin' ? roomStr : [...new Set(timeBlocks.map((tb) => tb.room).filter((r) => r))].join(", "),
        groupIdx,
        rank: courses.length,
      });
    }
  }
  return courses;
}
