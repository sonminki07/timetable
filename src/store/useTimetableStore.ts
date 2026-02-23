import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Group, Lecture, Schedule, Settings, ProfWeight } from "../types/timetable";
import { generateSchedules } from "../utils/generator";
import { parseText } from "../utils/parser";

interface TimetableState {
  groups: Group[];
  settings: Settings;
  excludedLectureKeys: Set<string>;
  schedules: Schedule[];
  overlapCounts: Record<string, number>;
  destroyedGroupId: number | null;
  hasRun: boolean;
  isGenerating: boolean;
  tableModeGroups: Set<number>;

  // Actions
  addGroup: () => void;
  removeGroup: (id: number) => void;
  updateGroupText: (id: number, text: string) => void;
  reorderGroupText: (id: number, fromIndex: number, toIndex: number) => void;
  setBulkGroups: (texts: string[]) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  toggleExcludeLecture: (key: string) => void;
  generate: () => void;
  resetAll: () => void;
  setAllTableMode: (isTable: boolean) => void;
  toggleTableMode: (id: number) => void;
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
  useProfWeight: false,
  profWeights: [
    { name: "", weight: 100 },
    { name: "", weight: 80 },
    { name: "", weight: 60 },
    { name: "", weight: 40 },
    { name: "", weight: 20 },
  ],
  university: 'catholic', // 기본 대학: 가톨릭대
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
      tableModeGroups: new Set<number>(),

      addGroup: () =>
        set((state) => ({
          groups: [...state.groups, { id: state.groups.length + 1, text: "" }],
        })),

      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          tableModeGroups: new Set(Array.from(state.tableModeGroups).filter(gid => gid !== id))
        })),

      updateGroupText: (id, text) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, text } : g)),
          hasRun: false,
        })),

      reorderGroupText: (id, fromIndex, toIndex) => {
        set((state) => {
          const group = state.groups.find((g) => g.id === id);
          if (!group) return {};

          const parsedCourses = parseText(group.text, id);
          if (!parsedCourses || parsedCourses.length === 0) return {};

          const newCourses = [...parsedCourses];
          const [moved] = newCourses.splice(fromIndex, 1);
          newCourses.splice(toIndex, 0, moved);

          // 순서가 변경된 강의들의 raw 텍스트를 다시 합쳐서 저장
          const newText = newCourses.map(c => c.raw).join("\n");
          
          return {
            groups: state.groups.map((g) => (g.id === id ? { ...g, text: newText } : g)),
            hasRun: false,
          };
        });
      },

      setBulkGroups: (texts) => {
        set((state) => {
          const maxCount = Math.max(state.groups.length, texts.length);
          const finalCount = Math.min(maxCount, 50);
          const newGroups: Group[] = [];
          
          for (let i = 1; i <= finalCount; i++) {
            const existingGroup = state.groups.find(g => g.id === i);
            const newText = texts[i - 1]; // 해당 인덱스에 새 텍스트가 있는지 확인

            newGroups.push({
              id: i,
              // 새 텍스트가 있으면(빈 문자열이 아니면) 덮어쓰고, 없으면 기존 텍스트 유지
              // 단, '모든 그룹에 자동 배분' 기능의 취지가 '전체 덮어쓰기'라면 기존 로직이 맞을 수 있음.
              // 하지만 사용자는 "그룹 7이 추가되면서 다른 거에는 안 넣어지는" 상황을 문제로 지적함.
              // 즉, texts 배열이 [t1, t2, ..., t7] 형태로 들어오는데,
              // 만약 texts가 [undefined, undefined, ..., t7] 처럼 희소 배열(sparse array)로 들어오는 경우를 대비해야 함.
              // splitBulkText는 순차 배열을 반환하므로, texts[0]은 그룹1, texts[1]은 그룹2... 로 매핑됨.
              // 사용자의 의도는 "그룹 1~6에 데이터가 있는데, 텍스트 뭉치에 그룹 7 데이터가 있어서 그룹 7이 생성되었을 때,
              // 그룹 1~6의 데이터도 텍스트 뭉치에 있는 대로 잘 들어가야 한다"는 것.
              
              // 만약 `texts` 배열이 전체 데이터를 다 가지고 있다면:
              text: newText !== undefined ? newText : (existingGroup ? existingGroup.text : ""),
            });
          }
          return { groups: newGroups, hasRun: false };
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
                courses: parseText(g.text, g.id, settings.university),
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
          tableModeGroups: new Set(),
        });
        window.location.reload();
      },

      setAllTableMode: (isTable) => 
        set((state) => ({
          tableModeGroups: isTable ? new Set(state.groups.map(g => g.id)) : new Set()
        })),

      toggleTableMode: (id) => 
        set((state) => {
          const newSet = new Set(state.tableModeGroups);
          if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
          return { tableModeGroups: newSet };
        }),
    }),
    {
      name: "timetable-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: { 
              ...state, 
              excludedLectureKeys: new Set(state.excludedLectureKeys),
              tableModeGroups: new Set(state.tableModeGroups || [])
            },
          };
        },
        setItem: (name, newValue) => {
          const { state } = newValue as any;
          const { isGenerating, ...rest } = state;
          const str = JSON.stringify({
            state: { 
              ...rest, 
              excludedLectureKeys: Array.from(state.excludedLectureKeys),
              tableModeGroups: Array.from(state.tableModeGroups || [])
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
