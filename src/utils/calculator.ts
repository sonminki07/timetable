import { Lecture, Schedule, Settings, TimeBlock } from "../types/timetable";
import { DAYS } from "./parser";

/**
 * 두 강의실 사이의 이동 시간을 분 단위로 계산합니다.
 */
export function getDistance(room1: string, room2: string): number | null {
  if (!room1 || !room2) return null;
  const match1 = room1.match(/^[A-Za-z]+/);
  const match2 = room2.match(/^[A-Za-z]+/);
  if (!match1 || !match2) return null;

  const b1 = match1[0].toUpperCase();
  const b2 = match2[0].toUpperCase();
  if (b1 === b2) return 0; // 같은 건물

  const exactMatrix: Record<string, number> = {
    "M-N": 1, "N-M": 1, "M-T": 5, "T-M": 5, "M-L": 4, "L-M": 4, "M-SH": 6, "SH-M": 6, "M-NP": 6, "NP-M": 6,
    "N-T": 6, "T-N": 6, "N-L": 5, "L-N": 5, "N-SH": 7, "SH-N": 7, "N-NP": 7, "NP-N": 7,
    "T-L": 1, "L-T": 1, "T-SH": 2, "SH-T": 2, "T-NP": 2, "NP-T": 2,
    "L-SH": 2, "SH-L": 2, "L-NP": 2, "NP-L": 2, "SH-NP": 1, "NP-SH": 1,
    "K-M": 2, "M-K": 2, "K-N": 2, "N-K": 2, "A-M": 3, "M-A": 3, "A-N": 3, "N-A": 3,
    "F-M": 8, "M-F": 8, "F-N": 9, "N-F": 9,
  };

  const key = b1 + "-" + b2;
  if (exactMatrix[key] !== undefined) return exactMatrix[key];

  const zones: Record<string, string> = {
    K: "DOWN", A: "DOWN", F: "DOWN",
    M: "CENTER", N: "CENTER", BA: "CENTER", D: "CENTER", V: "CENTER", B: "CENTER",
    H: "UP", T: "UP", L: "UP", SH: "UP", NP: "UP",
    CH: "RIGHT", P: "LEFT", I: "LEFT", C: "LEFT",
  };

  const z1 = zones[b1];
  const z2 = zones[b2];
  if (z1 && z2) {
    if (z1 === "CENTER" && z2 === "CENTER") return 2;
    if (z1 === "UP" && z2 === "UP") return 2;
    if (z1 === "DOWN" && z2 === "DOWN") return 3;
    if ((z1 === "CENTER" && z2 === "UP") || (z1 === "UP" && z2 === "CENTER")) return 6;
    if ((z1 === "CENTER" && z2 === "DOWN") || (z1 === "DOWN" && z2 === "CENTER")) return 4;
    if ((z1 === "UP" && z2 === "DOWN") || (z1 === "DOWN" && z2 === "UP")) return 10;
  }
  return 5;
}

/**
 * 전체 시간표의 추천도(점수)를 계산합니다.
 */
export function calculateScore(
  schedule: Lecture[],
  settings: Settings
): { score: number; text: string; maxConsecutiveTotal: number } {
  let score = 100;
  const details: string[] = [];
  const dayCount: Record<string, number> = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0 };
  let hasClass1 = false;
  let maxConsecutiveTotal = 0;
  const dayHours: Record<string, number[]> = { 월: [], 화: [], 수: [], 목: [], 금: [] };

  schedule.forEach((c) => {
    // 선호 수업 가점
    if (settings.prefSubject && c.title.includes(settings.prefSubject)) {
      score += 15;
      details.push(`선호수업(+15)`);
    }

    // 우선순위(Rank) 기반 가점 (기존 선호 교수님 가점 대체)
    if (settings.useProfWeight && c.rank !== undefined && settings.profWeights[c.rank] && c.useRank !== false) {
      const weight = settings.profWeights[c.rank].weight;
      if (weight > 0) {
        score += weight;
        details.push(`${c.rank + 1}순위(+${weight})`);
      }
    }

    c.timeBlocks.forEach((tb: TimeBlock) => {
      dayCount[tb.day]++;
      // 1교시(09:00~10:00) 포함 여부 (인덱스 0~3)
      if (tb.start < 4) hasClass1 = true;
      for (let i = tb.start; i <= tb.end; i++) dayHours[tb.day].push(i);
    });
  });

  // 점심/쉬는 시간 가점
  if (settings.prefLunch && settings.prefLunch.length > 0) {
    let lunchGuaranteedAllDays = true;
    let hasAnyClass = false;
    for (const d of DAYS) {
      if (dayCount[d] > 0) {
        hasAnyClass = true;
        // 점심 교시를 인덱스 범위로 변환하여 확인
        const canEatToday = settings.prefLunch.some((p: number) => {
           // p교시 -> (p-1)*4 ~ p*4-1
           const startIdx = (p - 1) * 4;
           const endIdx = p * 4 - 1;
           // 해당 범위 내에 수업이 하나라도 있으면 식사 불가
           for (let i = startIdx; i <= endIdx; i++) {
             if (dayHours[d].includes(i)) return false;
           }
           return true;
        });
        if (!canEatToday) lunchGuaranteedAllDays = false;
      }
    }
    if (hasAnyClass && lunchGuaranteedAllDays) {
      score += 15;
      details.push("쉬는시간(+15)");
    }
  }

  // 1교시 감점
  if (hasClass1) {
    score -= 30;
    details.push("1교시(-30)");
  }

  // 공강 가점 및 연강 계산
  for (const d of DAYS) {
    const dayIdx = DAYS.indexOf(d);
    if (dayCount[d] === 0) {
      score += 15;
      let dayText = `${d}공강(+15)`;
      if (settings.prefDays[dayIdx]) {
        score += 20;
        dayText = `${d} 선호공강(+35)`;
      }
      details.push(dayText);
    } else {
      // 중복 제거 후 정렬 (겹치는 수업이나 데이터 오류로 인한 중복 방지)
      const hours = [...new Set(dayHours[d])].sort((a, b) => a - b);
      let consecutive = 1;
      let maxConsecToday = 1; // 칸 수 (15분 단위)
      for (let i = 1; i < hours.length; i++) {
        if (hours[i] === hours[i - 1] + 1) {
          consecutive++;
        } else {
          maxConsecToday = Math.max(maxConsecToday, consecutive);
          consecutive = 1;
        }
      }
      maxConsecToday = Math.max(maxConsecToday, consecutive);
      maxConsecutiveTotal = Math.max(maxConsecutiveTotal, maxConsecToday);
    }
  }

  // 연강 제한 감점 (설정값은 시간 단위, maxConsecutiveTotal은 15분 단위)
  // settings.maxConsec * 4 와 비교
  if (maxConsecutiveTotal >= settings.maxConsec * 4) {
    const penalty = 50 + (maxConsecutiveTotal - settings.maxConsec * 4) * 5; // 페널티 조정
    score -= penalty;
    details.push(`${settings.maxConsec}연강(-${penalty})`);
  }

  return {
    score,
    text: details.join(" | ") || "특이사항 없음",
    maxConsecutiveTotal,
  };
}
