"use client";

import { Settings2, Clock, CalendarDays, Utensils, Zap, BookOpen } from "lucide-react";
import { useTimetableStore } from "../../store/useTimetableStore";
import { DAYS } from "../../lib/utils/parser";

export default function FilterSettings() {
  const { settings, updateSettings } = useTimetableStore();

  const handleToggleHardDay = (idx: number) => {
    const newHardDays = [...settings.hardDays];
    newHardDays[idx] = !newHardDays[idx];
    updateSettings({ hardDays: newHardDays });
  };

  const handleTogglePrefDay = (idx: number) => {
    const newPrefDays = [...settings.prefDays];
    newPrefDays[idx] = !newPrefDays[idx];
    updateSettings({ prefDays: newPrefDays });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm mb-12">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <Settings2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">상세 조건 설정</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* 1. 공강 및 요일 설정 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4">
            <CalendarDays className="w-5 h-5" />
            <span>요일 및 공강 설정</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">필수 공강일 (반드시 비움)</label>
              <div className="flex gap-2">
                {DAYS.map((day, idx) => (
                  <button
                    key={`hard-${idx}`}
                    onClick={() => handleToggleHardDay(idx)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                      settings.hardDays[idx]
                        ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-red-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">선호 공강일 (비우면 가점)</label>
              <div className="flex gap-2">
                {DAYS.map((day, idx) => (
                  <button
                    key={`pref-${idx}`}
                    onClick={() => handleTogglePrefDay(idx)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                      settings.prefDays[idx]
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 교시 및 연강 설정 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-4">
            <Clock className="w-5 h-5" />
            <span>시간 제약 설정</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">제외할 교시 (콤마 구분)</label>
              <input
                type="text"
                value={settings.excludePeriods.join(",")}
                onChange={(e) => updateSettings({ excludePeriods: e.target.value.split(",").map(v => parseInt(v)).filter(v => !isNaN(v)) })}
                placeholder="예: 1, 9, 10"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">최대 연속 강의 시간</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={settings.maxConsec}
                  onChange={(e) => updateSettings({ maxConsec: parseInt(e.target.value) })}
                  className="flex-1 accent-blue-500"
                />
                <span className="w-12 text-center font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                  {settings.maxConsec}H
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 기타 선호도 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold mb-4">
            <Zap className="w-5 h-5" />
            <span>선호 가점 설정</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <BookOpen className="w-4 h-4" /> 선호 과목 키워드
              </label>
              <input
                type="text"
                value={settings.prefSubject}
                onChange={(e) => updateSettings({ prefSubject: e.target.value })}
                placeholder="예: 컴퓨터, 자료구조"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Utensils className="w-4 h-4" /> 점심 확보 교시
              </label>
              <input
                type="text"
                value={settings.prefLunch.join(",")}
                onChange={(e) => updateSettings({ prefLunch: e.target.value.split(",").map(v => parseInt(v)).filter(v => !isNaN(v)) })}
                placeholder="예: 4, 5"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
