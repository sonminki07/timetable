import { Lecture, Schedule, Settings } from "../../types/timetable";
import { DAYS } from "./parser";

// 강의실 간 거리 행렬 및 로직
export function getDistance(room1: string, room2: string): number | null {
  if (!room1 || !room2) return null;
  const match1 = room1.match(/^[A-Za-z]+/);
  const match2 = room2.match(/^[A-Za-z]+/);
  if (!match1 || !match2) return null;

  const b1 = match1[0].toUpperCase();
  const b2 = match2[0].toUpperCase();
  if (b1 === b2) return 0;

  const exactMatrix: Record<string, number> = {
    "M-N": 1, "N-M": 1, "M-T": 5, "T-M": 5, "M-L": 4, "L-M": 4, "M-SH": 6, "SH-M": 6, "M-NP": 6, "NP-M": 6,
    "N-T": 6, "T-N": 6, "N-L": 5, "L-N": 5, "N-SH": 7, "SH-N": 7, "N-NP": 7, "NP-N": 7,
    "T-L": 1, "L-T": 1, "T-SH": 2, "SH-T": 2, "T-NP": 2, "NP-T": 2,
    "L-SH": 2, "SH-L": 2, "L-NP": 2, "NP-L": 2, "SH-NP": 1, "NP-SH": 1,
    "K-M": 2, "M-K": 2, "K-N": 2, "N-K": 2, "A-M": 3, "M-A": 3, "A-N": 3, "N-A": 3,
    "F-M": 8, "M-F": 8, "F-N": 9, "N-F": 9
  };

  const key = b1 + "-" + b2;
  if (exactMatrix[key] !== undefined) return exactMatrix[key];

  const zones: Record<string, string> = {
    K: "DOWN", A: "DOWN", F: "DOWN",
    M: "CENTER", N: "CENTER", BA: "CENTER", D: "CENTER", V: "CENTER", B: "CENTER",
    H: "UP", T: "UP", L: "UP", SH: "UP", NP: "UP",
    CH: "RIGHT", P: "LEFT", I: "LEFT", C: "LEFT"
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

export function calculateScore(lectures: Lecture[], settings: Settings): { score: number; text: string; maxConsecutiveTotal: number } {
  let score = 100;
  const details: string[] = [];
  const dayCount: Record<string, number> = { "월": 0, "화": 0, "수": 0, "목": 0, "금": 0 };
  let hasClass1 = false;
  let maxConsecutiveTotal = 0;
  const dayHours: Record<string, number[]> = { "월": [], "화": [], "수": [], "목": [], "금": [] };

  lectures.forEach((c) => {
    // 특정 과목 선호
    if (settings.prefSubject && c.title.includes(settings.prefSubject)) {
      score += 15;
      details.push(`${c.title} 선호(+15)`);
    }
    c.timeBlocks.forEach((tb) => {
      dayCount[tb.day]++;
      if (tb.start === 1) hasClass1 = true;
      for (let i = tb.start; i <= tb.end; i++) dayHours[tb.day].push(i);
    });
  });

  // 점심 시간 보장
  if (settings.prefLunch && settings.prefLunch.length > 0) {
    let lunchGuaranteedAllDays = true;
    let hasAnyClass = false;
    for (const d of DAYS) {
      if (dayCount[d] > 0) {
        hasAnyClass = true;
        const canEatToday = settings.prefLunch.some((p) => !dayHours[d].includes(p));
        if (!canEatToday) lunchGuaranteedAllDays = false;
      }
    }
    if (hasAnyClass && lunchGuaranteedAllDays) {
      score += 15;
      details.push("점심시간 확보(+15)");
    }
  }

  // 1교시 수업 감점
  if (hasClass1) {
    score -= 30;
    details.push("1교시 수업(-30)");
  }

  // 공강 및 연강 계산
  for (const d of DAYS) {
    if (dayCount[d] === 0) {
      score += 15;
      let dayText = `${d}요일 공강(+15)`;
      const dayIdx = DAYS.indexOf(d);
      if (settings.prefDays[dayIdx]) {
        score += 20;
        dayText = `${d}요일 선호 공강(+35)`;
      }
      details.push(dayText);
    } else {
      const hours = [...dayHours[d]].sort((a, b) => a - b);
      let consecutive = 1;
      let maxDayConsecutive = 1;
      for (let i = 1; i < hours.length; i++) {
        if (hours[i] === hours[i - 1] + 1) {
          consecutive++;
        } else {
          maxDayConsecutive = Math.max(maxDayConsecutive, consecutive);
          consecutive = 1;
        }
      }
      maxDayConsecutive = Math.max(maxDayConsecutive, consecutive);
      maxConsecutiveTotal = Math.max(maxConsecutiveTotal, maxDayConsecutive);
    }
  }

  // 최대 연강 제한 위반 감점 (필터링과 별도로 점수에도 반영)
  if (maxConsecutiveTotal > settings.maxConsec) {
    const penalty = 50 + (maxConsecutiveTotal - settings.maxConsec) * 10;
    score -= penalty;
    details.push(`${maxConsecutiveTotal}시간 연강(-${penalty})`);
  }

  return { score, text: details.join(" | ") || "기본 점수", maxConsecutiveTotal };
}
