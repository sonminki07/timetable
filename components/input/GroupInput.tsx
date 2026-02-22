"use client";

import { Trash2, FileText, Table as TableIcon } from "lucide-react";
import { useTimetableStore } from "../../store/useTimetableStore";
import { useState } from "react";
import { parseText } from "../../lib/utils/parser";

interface GroupInputProps {
  id: number;
  text: string;
}

export default function GroupInput({ id, text }: GroupInputProps) {
  const { updateGroupText, removeGroup } = useTimetableStore();
  const [isTableMode, setIsTableMode] = useState(false);

  const parsedCourses = parseText(text, id);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold">
            G{id}
          </span>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            강의 그룹 {id}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsTableMode(!isTableMode)}
            className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isTableMode ? "텍스트 모드로 전환" : "테이블 모드로 전환"}
          >
            {isTableMode ? <FileText className="w-4 h-4" /> : <TableIcon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => removeGroup(id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="그룹 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isTableMode ? (
        <div className="min-h-[160px] max-h-[240px] overflow-auto border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs">
          {parsedCourses.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="p-2 font-semibold border-b border-gray-200 dark:border-gray-700">과목명</th>
                  <th className="p-2 font-semibold border-b border-gray-200 dark:border-gray-700">시간</th>
                  <th className="p-2 font-semibold border-b border-gray-200 dark:border-gray-700 text-right">장소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {parsedCourses.map((c, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="p-2 truncate font-medium dark:text-gray-300">{c.title}</td>
                    <td className="p-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{c.timesOnly}</td>
                    <td className="p-2 text-blue-600 dark:text-blue-400 font-bold text-right truncate">{c.roomsOnly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-[160px] text-gray-400">
              <p>표시할 강의 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => updateGroupText(id, e.target.value)}
          placeholder="에브리타임 강의 목록을 복사해서 붙여넣으세요.&#10;예: [컴퓨터구조] 홍길동 | 월1,2(A101)"
          className="w-full h-[160px] p-4 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-gray-700 dark:text-gray-300 placeholder:text-gray-400"
        />
      )}
    </div>
  );
}
