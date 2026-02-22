"use client";

import { Schedule } from "../../types/timetable";
import { DAYS } from "../../lib/utils/parser";
import { getDistance } from "../../lib/utils/calculator";

interface TimetableCardProps {
  schedule: Schedule;
  index: number;
}

const COLORS = [
  "bg-amber-100 border-amber-200 text-amber-900",
  "bg-indigo-100 border-indigo-200 text-indigo-900",
  "bg-emerald-100 border-emerald-200 text-emerald-900",
  "bg-rose-100 border-rose-200 text-rose-900",
  "bg-sky-100 border-sky-200 text-sky-900",
  "bg-violet-100 border-violet-200 text-violet-900",
  "bg-teal-100 border-teal-200 text-teal-900",
  "bg-orange-100 border-orange-200 text-orange-900",
  "bg-lime-100 border-lime-200 text-lime-900",
  "bg-fuchsia-100 border-fuchsia-200 text-fuchsia-900",
];

export default function TimetableCard({ schedule, index }: TimetableCardProps) {
  // 교시별(row), 요일별(col) 데이터 구성
  const gridData: any[] = [];
  schedule.lectures.forEach((lecture) => {
    const colorClass = COLORS[(lecture.groupIdx - 1) % COLORS.length];
    lecture.timeBlocks.forEach((block) => {
      gridData.push({
        ...block,
        title: lecture.title,
        prof: lecture.prof,
        colorClass,
        groupIdx: lecture.groupIdx,
      });
    });
  });

  // 이동 거리 경고 로직 (이전 시간 수업과의 거리 계산)
  const getMoveAlert = (currentBlock: any) => {
    const dayBlocks = gridData
      .filter((b) => b.day === currentBlock.day)
      .sort((a, b) => a.start - b.start);
    
    const currentIndex = dayBlocks.findIndex(
      (b) => b.start === currentBlock.start && b.title === currentBlock.title
    );
    
    if (currentIndex > 0) {
      const prevBlock = dayBlocks[currentIndex - 1];
      if (prevBlock.end + 1 === currentBlock.start) {
        const dist = getDistance(prevBlock.room, currentBlock.room);
        if (dist === 0) return { text: "이동 없음", type: "success" };
        if (dist && dist >= 8) return { text: `매우 먼 거리(${dist}분)`, type: "danger" };
        if (dist && dist >= 4) return { text: `보통 거리(${dist}분)`, type: "warning" };
      }
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-900/50 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/20 transition-colors">
        <div>
          <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            추천 조합 {index + 1}
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
              {schedule.score}점
            </span>
          </h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {schedule.scoreText}
          </p>
        </div>
      </div>

      <div className="relative p-4 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-[30px_repeat(5,1fr)] grid-rows-[30px_repeat(10,minmax(40px,1fr))] gap-px bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner">
          {/* Header: Days */}
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700" />
          {DAYS.map((day) => (
            <div
              key={day}
              className="bg-gray-50 dark:bg-gray-800 text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center justify-center border-b border-gray-100 dark:border-gray-700"
            >
              {day}
            </div>
          ))}

          {/* Body: Time & Cells */}
          {Array.from({ length: 10 }).map((_, h) => (
            <div key={`row-${h + 1}`} className="contents">
              <div className="bg-gray-50 dark:bg-gray-800 text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center justify-center border-r border-gray-100 dark:border-gray-700">
                {h + 1}
              </div>
              {DAYS.map((day) => (
                <div key={`${day}-${h + 1}`} className="bg-white dark:bg-gray-800 border-r border-b border-gray-50 dark:border-gray-900/50" />
              ))}
            </div>
          ))}

          {/* Floating Blocks */}
          {gridData.map((block, idx) => {
            const dayIdx = DAYS.indexOf(block.day);
            const rowStart = block.start + 1;
            const rowSpan = block.end - block.start + 1;
            const alert = getMoveAlert(block);

            return (
              <div
                key={idx}
                className={`absolute inset-px rounded-lg p-2 flex flex-col border shadow-sm group/block transition-all hover:z-50 hover:scale-[1.02] hover:shadow-lg ${block.colorClass}`}
                style={{
                  gridColumn: dayIdx + 2,
                  gridRow: `${rowStart} / span ${rowSpan}`,
                  position: "relative",
                  margin: "2px",
                }}
              >
                <div className="flex items-center gap-1 mb-1 truncate">
                  <span className="text-[8px] font-black px-1 py-px bg-black/10 rounded">G{block.groupIdx}</span>
                  <span className="text-[10px] font-bold truncate">{block.title}</span>
                </div>
                {block.prof && <span className="text-[9px] opacity-80 truncate">{block.prof}</span>}
                <div className="mt-auto flex flex-col gap-0.5">
                  <span className="text-[9px] font-semibold opacity-90 truncate">{block.room}</span>
                  {alert && (
                    <span
                      className={`text-[8px] font-bold ${
                        alert.type === "danger"
                          ? "text-red-600"
                          : alert.type === "warning"
                          ? "text-orange-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {alert.text}
                    </span>
                  )}
                </div>
                
                {/* Tooltip on Hover */}
                <div className="absolute left-full top-0 ml-2 z-[60] w-48 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 opacity-0 pointer-events-none group-hover/block:opacity-100 transition-opacity whitespace-normal">
                   <p className="text-xs font-bold text-gray-800 dark:text-white mb-1">{block.title}</p>
                   <p className="text-[10px] text-gray-500 dark:text-gray-400">{block.prof} | {block.room}</p>
                   {alert && <p className={`text-[10px] font-bold mt-2 ${alert.type === 'danger' ? 'text-red-500' : 'text-emerald-500'}`}>{alert.text}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
