import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Group, Lecture, Schedule, Settings } from "../types/timetable";
import { generateSchedules } from "../lib/utils/generator";
import { parseText } from "../lib/utils/parser";

interface TimetableState {
  groups: Group[];
  settings: Settings;
  excludedLectureKeys: Set<string>;
  schedules: Schedule[];
  overlapCounts: Record<string, number>;
  destroyedGroupId: number | null;
  hasRun: boolean;
  isGenerating: boolean;

  // Actions
  addGroup: () => void;
  removeGroup: (id: number) => void;
  updateGroupText: (id: number, text: string) => void;
  setBulkGroups: (texts: string[]) => void; // 자동 배분을 위한 신규 액션
  updateSettings: (settings: Partial<Settings>) => void;
  toggleExcludeLecture: (key: string) => void;
  generate: () => void;
  resetAll: () => void;
}

const defaultSettings: Settings = {
  cols: 3,
  hardDays: [false, false, false, false, false],
  excludePeriods: [1],
  prefDays: [false, false, false, false, false],
  maxConsec: 3,
  consecPolicy: 'penalty',
  prefSubject: "",
  prefLunch: [],
};

export const useTimetableStore = create<TimetableState>()(
  persist(
    (set, get) => ({
      groups: [
        { id: 1, text: "" }, { id: 2, text: "" }, { id: 3, text: "" },
        { id: 4, text: "" }, { id: 5, text: "" }, { id: 6, text: "" },
      ],
      settings: defaultSettings,
      excludedLectureKeys: new Set<string>(),
      schedules: [],
      overlapCounts: {},
      destroyedGroupId: null,
      hasRun: false,
      isGenerating: false,

      addGroup: () =>
        set((state) => ({
          groups: [...state.groups, { id: state.groups.length + 1, text: "" }],
        })),

      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
        })),

      updateGroupText: (id, text) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, text } : g)),
        })),

      // 원자적 업데이트: 필요한 만큼 그룹을 늘리고 텍스트를 채움
      setBulkGroups: (texts) => {
        set((state) => {
          const maxCount = Math.max(state.groups.length, texts.length);
          const finalCount = Math.min(maxCount, 10);
          const newGroups: Group[] = [];
          
          for (let i = 1; i <= finalCount; i++) {
            newGroups.push({
              id: i,
              text: texts[i - 1] || "", // 배분된 텍스트가 있으면 넣고 없으면 빈 값
            });
          }
          return { groups: newGroups };
        });
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      toggleExcludeLecture: (key) =>
        set((state) => {
          const newSet = new Set(state.excludedLectureKeys);
          if (newSet.has(key)) newSet.delete(key);
          else newSet.add(key);
          return { excludedLectureKeys: newSet };
        }),

      generate: () => {
        const { groups, settings, excludedLectureKeys } = get();
        set({ isGenerating: true });
        
        setTimeout(() => {
          try {
            const parsedGroups = groups
              .map((g) => ({
                id: g.id,
                text: g.text,
                courses: parseText(g.text, g.id),
              }))
              .filter((g) => g.courses.length > 0 || g.text.trim().length > 0);

            const { schedules, overlapCounts, destroyedGroupId } = generateSchedules(
              parsedGroups,
              settings,
              excludedLectureKeys
            );

            set({ schedules, overlapCounts, destroyedGroupId, hasRun: true, isGenerating: false });
          } catch (error) {
            console.error("Timetable generation failed:", error);
            set({ isGenerating: false });
            alert("시간표 생성 중 오류가 발생했습니다.");
          }
        }, 100);
      },

      resetAll: () => {
        localStorage.removeItem('theme');
        document.documentElement.setAttribute('data-theme', 'light');
        set({
          groups: [
            { id: 1, text: "" }, { id: 2, text: "" }, { id: 3, text: "" },
            { id: 4, text: "" }, { id: 5, text: "" }, { id: 6, text: "" },
          ],
          settings: defaultSettings,
          excludedLectureKeys: new Set(),
          schedules: [],
          overlapCounts: {},
          destroyedGroupId: null,
          hasRun: false,
        });
        window.location.reload();
      },
    }),
    {
      name: "timetable-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: { ...state, excludedLectureKeys: new Set(state.excludedLectureKeys) },
          };
        },
        setItem: (name, newValue) => {
          const { state } = newValue as any;
          // isGenerating은 저장하지 않음 (새로고침 시 항상 false로 시작)
          const { isGenerating, ...rest } = state;
          const str = JSON.stringify({
            state: { ...rest, excludedLectureKeys: Array.from(state.excludedLectureKeys) },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
