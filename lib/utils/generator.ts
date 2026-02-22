import { Lecture, Schedule, Settings } from "../../types/timetable";
import { calculateScore, getDistance } from "./calculator";
import { DAYS } from "./parser";

export function generateSchedules(
  groups: { id: number; courses: Lecture[] }[],
  settings: Settings,
  excludedLectureKeys: Set<string>
): { 
  schedules: Schedule[]; 
  overlapCounts: Record<string, number>;
  destroyedGroupId: number | null;
} {
  const overlapCounts: Record<string, number> = {};
  const validSchedules: Schedule[] = [];
  let destroyedGroupId: number | null = null;

  // 각 그룹에서 제외된 강의 필터링
  const filteredGroups = groups.map((g) => {
    const filteredCourses = g.courses.filter((c) => {
      const key = `${g.id}|${c.title}|${c.prof}|${c.timesOnly}`;
      if (excludedLectureKeys.has(key)) return false;

      // 특정 교시 제외 필터
      if (settings.excludePeriods.length > 0) {
        const isExcluded = c.timeBlocks.some((tb) => {
          for (let h = tb.start; h <= tb.end; h++) {
            if (settings.excludePeriods.includes(h)) return true;
          }
          return false;
        });
        if (isExcluded) return false;
      }
      return true;
    });

    if (filteredCourses.length === 0 && g.courses.length > 0) {
      destroyedGroupId = g.id;
    }

    return {
      id: g.id,
      courses: filteredCourses,
    };
  });

  if (destroyedGroupId !== null || filteredGroups.some((g) => g.courses.length === 0)) {
    return { schedules: [], overlapCounts, destroyedGroupId };
  }

  const hardDaysOff = DAYS.filter((_, idx) => settings.hardDays[idx]);

  function combine(
    groupIndex: number,
    currentLectures: Lecture[],
    currentTimes: string[]
  ) {
    if (groupIndex === filteredGroups.length) {
      // 지정 공강일 체크
      let hasHardDayOff = true;
      for (const day of hardDaysOff) {
        if (currentTimes.some((t) => t.startsWith(day))) {
          hasHardDayOff = false;
          break;
        }
      }
      if (hasHardDayOff) {
        const { score, text, maxConsecutiveTotal } = calculateScore(currentLectures, settings);
        
        // 🚀 연강 정책에 따른 필터링 (파괴 선택 시에만 제외)
        if (settings.consecPolicy === 'destroy' && maxConsecutiveTotal > settings.maxConsec) return;

        // 🚀 이동 정보 미리 계산하여 렌더링 렉 방지
        const enrichedLectures = currentLectures.map(l => ({
          ...l,
          timeBlocks: l.timeBlocks.map(block => {
            const dayBlocks = currentLectures
              .flatMap(otherL => otherL.timeBlocks.map(b => ({ ...b, title: otherL.title })))
              .filter(b => b.day === block.day)
              .sort((a, b) => a.start - b.start);
            
            const currentIndex = dayBlocks.findIndex(b => b.start === block.start && b.title === l.title);
            let moveInfo = null;
            if (currentIndex > 0) {
              const prev = dayBlocks[currentIndex - 1];
              const dist = getDistance(prev.room, block.room);
              if (dist !== null) {
                moveInfo = { distance: dist, isConsecutive: prev.end + 1 === block.start };
              }
            }
            return { ...block, moveInfo };
          })
        }));

        validSchedules.push({
          lectures: enrichedLectures as any,
          score,
          scoreText: text,
        });
      }
      return;
    }

    const currentGroup = filteredGroups[groupIndex];
    for (const course of currentGroup.courses) {
      // 동일한 제목의 강의가 이미 선택되었는지 확인 (중복 수강 방지)
      if (currentLectures.some((c) => c.title === course.title)) continue;

      // 시간 중복 확인
      const overlappingCourse = currentLectures.find((c) =>
        course.allTimes.some((t) => c.allTimes.includes(t))
      );

      if (overlappingCourse) {
        const key = `[${overlappingCourse.title}] ↔ [${course.title}]`;
        overlapCounts[key] = (overlapCounts[key] || 0) + 1;
      } else {
        currentLectures.push(course);
        combine(groupIndex + 1, currentLectures, currentTimes.concat(course.allTimes));
        currentLectures.pop();
      }
    }
  }

  if (filteredGroups.length > 0) {
    combine(0, [], []);
  }

  // 점수 높은 순으로 정렬 (최대 50개까지만 반환하여 렉 방지)
  const sorted = validSchedules
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  return { schedules: sorted, overlapCounts, destroyedGroupId: null };
}
