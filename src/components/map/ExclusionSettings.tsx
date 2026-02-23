import React from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { parseText } from '../../utils/parser';

const ExclusionSettings: React.FC = () => {
  const { groups, excludedLectureKeys, toggleExcludeLecture } = useTimetableStore();

  const allParsedCourses = groups.flatMap((g) => {
    const courses = parseText(g.text, g.id);
    return courses.map((c) => ({
      ...c,
      key: `${g.id}|${c.title}|${c.prof}|${c.timesOnly}`,
    }));
  });

  if (allParsedCourses.length === 0) return null;

  return (
    <div className="option-row" style={{ backgroundColor: '#f0f4f8', padding: '8px', borderRadius: '5px', alignItems: 'flex-start' }}>
      <details className="w-full group/details">
        <summary className="flex items-center cursor-pointer list-none outline-none">
          <label className="title text-blue-600 font-bold w-[140px] cursor-pointer">🚫 특정 강의 제외</label>
          <span className="text-[12px] text-gray-500 group-open/details:rotate-180 transition-transform">(접기/펼치기)</span>
        </summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
          {groups.map(group => {
            const groupCourses = allParsedCourses.filter(c => c.groupIdx === group.id);
            if (groupCourses.length === 0) return null;

            return (
              <React.Fragment key={group.id}>
                <div className="col-span-full text-[10px] font-bold text-blue-400 mt-2 first:mt-0 uppercase tracking-widest border-b border-blue-50 dark:border-blue-900/30 pb-1">
                  Group {group.id}
                </div>
                {groupCourses.map((course, idx) => {
                  const isExcluded = excludedLectureKeys.has(course.key);
                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                        isExcluded 
                          ? "opacity-40 grayscale bg-gray-50 border-gray-100" 
                          : "hover:border-blue-300 hover:bg-blue-50/30 border-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!isExcluded}
                        onChange={() => toggleExcludeLecture(course.key)}
                        className="w-3.5 h-3.5 rounded text-blue-600"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold truncate">{course.title}</p>
                        <p className="text-[9px] text-gray-500 truncate">{course.prof} | {course.timesOnly}</p>
                      </div>
                    </label>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </details>
    </div>
  );
};

export default ExclusionSettings;
