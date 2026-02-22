"use client";

import { AlertCircle, ChevronDown, ListFilter, Users, BookOpen } from "lucide-react";
import { useTimetableStore } from "../../store/useTimetableStore";
import { useState } from "react";
import { parseText } from "../../lib/utils/parser";

export default function AnalysisBox() {
  const { overlapCounts, groups, excludedLectureKeys, toggleExcludeLecture } = useTimetableStore();
  const [showExcludeList, setShowExcludeList] = useState(true);

  const sortedConflicts = Object.entries(overlapCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const allParsedCourses = groups.flatMap((g) => {
    const courses = parseText(g.text, g.id);
    return courses.map((c) => ({
      ...c,
      key: `${g.id}|${c.title}|${c.prof}|${c.timesOnly}`,
    }));
  });

  if (sortedConflicts.length === 0 && allParsedCourses.length === 0) return null;

  return (
    <div className="space-y-10 mb-16">
      {/* 1. 중복 분석 결과 */}
      {sortedConflicts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border-l-8 border-amber-400 dark:border-amber-600 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-200 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-2xl shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-800 dark:text-amber-200">시간표 생성 실패 분석</h3>
              <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                일부 강의가 겹쳐서 시간표를 만들 수 없습니다. 아래 강의들을 확인해 보세요.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-amber-800/60 dark:text-amber-300/60 uppercase tracking-widest">자주 충돌하는 조합 Top 5</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedConflicts.map(([conflict, count], idx) => (
                <li key={idx} className="flex items-center gap-3 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-sm">
                   <span className="flex items-center justify-center w-6 h-6 bg-amber-500 text-white rounded-lg text-xs font-black shadow-lg shadow-amber-200">{idx + 1}</span>
                   <span className="text-sm font-semibold text-amber-900 dark:text-amber-100 truncate flex-1">{conflict}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-700 mt-6 bg-amber-200/50 dark:bg-amber-800/50 p-4 rounded-xl leading-relaxed italic">
              * 팁: 충돌하는 강의 중 하나를 아래 '제외 목록'에서 선택하거나, 강의 그룹에 다른 분반의 시간을 추가해 보세요.
            </p>
          </div>
        </div>
      )}

      {/* 2. 강의 제외 관리 (Exclude List) */}
      {allParsedCourses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowExcludeList(!showExcludeList)}
            className="w-full flex items-center justify-between mb-8 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <ListFilter className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">강의별 제외 설정</h3>
            </div>
            <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${showExcludeList ? "rotate-180" : ""}`} />
          </button>

          {showExcludeList && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
               {groups.map(group => {
                 const groupCourses = allParsedCourses.filter(c => c.groupIdx === group.id);
                 if (groupCourses.length === 0) return null;

                 return (
                   <div key={group.id} className="space-y-4">
                     <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                       <span className="text-[10px] font-black px-2 py-0.5 bg-blue-500 text-white rounded">G{group.id}</span>
                       <span className="text-sm font-bold text-gray-800 dark:text-gray-200">강의 그룹 {group.id}</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                       {groupCourses.map((course, idx) => {
                         const isExcluded = excludedLectureKeys.has(course.key);
                         return (
                           <label
                             key={idx}
                             className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all duration-200 group/item ${
                               isExcluded
                                 ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50 grayscale"
                                 : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-600"
                             }`}
                           >
                             <input
                               type="checkbox"
                               checked={!isExcluded}
                               onChange={() => toggleExcludeLecture(course.key)}
                               className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                             />
                             <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2 mb-0.5">
                                 <BookOpen className="w-3 h-3 text-blue-500" />
                                 <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{course.title}</p>
                               </div>
                               <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                                 <Users className="w-3 h-3" />
                                 <span>{course.prof || "미지정"}</span>
                                 <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px] font-medium">{course.timesOnly}</span>
                               </div>
                             </div>
                           </label>
                         );
                       })}
                     </div>
                   </div>
                 );
               })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
