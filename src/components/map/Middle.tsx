import React, { useState } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { parseText } from '../../utils/parser';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoveVertical } from 'lucide-react';

// 드래그 가능한 테이블 행 컴포넌트
const SortableRow = ({ id, lecture, index, isExcluded, onToggleExclude }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.95 : (isExcluded ? 0.4 : 1),
    zIndex: isDragging ? 9999 : 'auto',
    position: isDragging ? 'relative' : 'static',
    backgroundColor: isDragging ? '#ffffff' : 'transparent',
    boxShadow: isDragging ? '0 15px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.1)' : 'none',
    outline: isDragging ? '2px solid #3b82f6' : 'none',
  } as React.CSSProperties;

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="drag-handle" {...attributes} {...listeners} style={{ cursor: 'grab', width: '30px', textAlign: 'center', touchAction: 'none' }}>
        <MoveVertical size={16} color="#94a3b8" />
      </td>
      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#666', fontSize: '12px' }}>
        {index + 1}순위
      </td>
      <td style={{ textAlign: 'center' }}>
        <button 
          onClick={() => onToggleExclude()} 
          style={{ 
            background: isExcluded ? '#27ae60' : '#e74c3c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isExcluded ? '+' : '-'}
        </button>
      </td>
      <td style={{ textDecoration: isExcluded ? 'line-through' : 'none', fontWeight: '500' }}>{lecture.title}</td>
      <td style={{ fontSize: '13px' }}>{lecture.prof}</td>
      <td style={{ fontSize: '12px' }}>{lecture.timesOnly}</td>
      <td className="room-col" style={{ fontSize: '12px' }}>{lecture.roomsOnly}</td>
    </tr>
  );
};

const Middle: React.FC = () => {
  const { 
    groups, updateGroupText, reorderGroupText, 
    excludedLectureKeys, toggleExcludeLecture, 
    tableModeGroups, toggleTableMode, settings,
    toggleGroupRank
  } = useTimetableStore();

  const [isDraggingItem, setIsDraggingItem] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200, // 200ms 동안 꾹 누르면 드래그 시작 (홀드 즉시)
        tolerance: 5, // 5px 이상 움직이면 취소
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms 동안 꾹 누르면 드래그 시작
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent, groupId: number) => {
    setIsDraggingItem(false);
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      // id가 'group-idx' 형태이므로 index 추출
      const oldIndex = parseInt(String(active.id).split('-')[2]);
      const newIndex = parseInt(String(over?.id).split('-')[2]);
      
      reorderGroupText(groupId, oldIndex, newIndex);
    }
  };

  return (
    <>
      {/* 글로벌 토스트 메시지 (드래그 중일 때만 표시) */}
      <div 
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] transition-all duration-300 pointer-events-none ${
          isDraggingItem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-2xl text-sm font-bold flex items-center gap-2">
          ↕ 강의를 위아래로 움직여 순서를 변경하세요
        </div>
      </div>

      <div id="groups-container">
        {groups.map((group) => {
          const isTable = tableModeGroups.has(group.id);
          const parsed = parseText(group.text, group.id, settings.university);
          // 각 항목에 고유 ID 부여 (인덱스 활용)
          const items = parsed.map((c, idx) => `item-${group.id}-${idx}`);

          return (
            <div key={group.id} className="group" id={`group-box-${group.id}`}>
              <div className="group-header flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="whitespace-nowrap">그룹 {group.id} <span className="hidden sm:inline text-xs font-normal text-gray-400">(드래그하여 우선순위 변경)</span></h3>
                  <label className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={group.useRank ?? true} 
                      onChange={() => toggleGroupRank(group.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-[11px] font-bold text-gray-500">우선순위 적용</span>
                  </label>
                </div>
                <div className="header-btns shrink-0 ml-auto">
                  <button className="convert-btn" onClick={() => toggleTableMode(group.id)}>
                    {isTable ? "텍스트 수정" : "리스트 보기"}
                  </button>
                  <button className="reset-btn" onClick={() => updateGroupText(group.id, "")}>초기화</button>
                </div>
              </div>
              {!isTable ? (
                <textarea 
                  className="group-input focus:ring-2 focus:ring-blue-400 outline-none transition-all" 
                  value={group.text} 
                  onChange={(e) => updateGroupText(group.id, e.target.value)} 
                  placeholder="에브리타임 장바구니 목록을 붙여넣으세요." 
                />
              ) : (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={() => setIsDraggingItem(true)}
                  onDragEnd={(e) => handleDragEnd(e, group.id)}
                  onDragCancel={() => setIsDraggingItem(false)}
                >
                  <div className="group-table-container show animate-in fade-in duration-300 overflow-x-auto hide-scrollbar">
                    <table className="group-table w-full whitespace-nowrap">
                      <thead>
                        <tr>
                          <th style={{ width: '30px' }}></th>
                          <th style={{ width: '50px', textAlign: 'center' }}>순위</th>
                          <th style={{ width: '40px', textAlign: 'center' }}>제외</th>
                          <th className="min-w-[120px]">과목명</th>
                          <th style={{ width: '60px' }}>교수</th>
                          <th style={{ width: '80px' }}>시간</th>
                          <th style={{ width: '60px' }}>강의실</th>
                        </tr>
                      </thead>
                      <SortableContext 
                        items={items}
                        strategy={verticalListSortingStrategy}
                      >
                        <tbody>
                          {parsed.map((c, idx) => {
                            const key = `${group.id}|${c.title}|${c.prof}|${c.timesOnly}`;
                            const isExcluded = excludedLectureKeys.has(key);
                            const id = items[idx]; // Unique ID for Sortable

                            return (
                              <SortableRow 
                                key={id} 
                                id={id} 
                                lecture={c} 
                                index={idx}
                                isExcluded={isExcluded} 
                                onToggleExclude={() => toggleExcludeLecture(key)} 
                              />
                            );
                          })}
                          {parsed.length === 0 && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
                                강의 목록이 비어있습니다. 텍스트를 먼저 입력해주세요.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </SortableContext>
                    </table>
                  </div>
                </DndContext>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Middle;
