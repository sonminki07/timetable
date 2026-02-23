"use client";

import React from 'react';
import { Schedule } from "../../types/timetable";
import { DAYS } from "../../utils/parser";

interface TimetableCardProps {
  schedule: Schedule;
  index: number;
}

const COLORS = ['#ffeaa7', '#a29bfe', '#81ecec', '#fab1a0', '#74b9ff', '#55efc4', '#ff7675', '#74b9ff', '#55efc4', '#ffeaa7'];

export default function TimetableCard({ schedule, index }: TimetableCardProps) {
  // 요일별/교시별 블록 데이터 구성
  const gridBlocks: any[] = [];
  schedule.lectures.forEach((lecture) => {
    const color = COLORS[(lecture.groupIdx - 1) % COLORS.length];
    lecture.timeBlocks.forEach((block) => {
      gridBlocks.push({
        ...block,
        lecture,
        color,
      });
    });
  });

  return (
    <div className="timetable-wrapper">
      <div className="timetable-header">
        <h4>
          조합 {index + 1} 
          <span style={{ fontSize: '12px', color: '#7f8c8d', marginLeft: '8px' }}>
            (추천도: {schedule.score}점)
          </span>
        </h4>
        <div className="score-detail">★ {schedule.scoreText}</div>
      </div>

      <div className="timetable" style={{
        display: 'grid',
        gridTemplateColumns: '30px repeat(5, 1fr)',
        gridTemplateRows: '25px repeat(52, 11px)', // 15분 단위 높이 축소
        backgroundColor: 'var(--grid-bg)', // 기존 배경색 사용
        gap: '1px',
        border: '1px solid var(--grid-bg)',
        height: 'auto', // 높이 자동
        minHeight: '400px',
        fontSize: '11px',
        color: 'var(--text-primary)'
      }}>
        {/* 1. 요일 헤더 */}
        <div className="tt-cell tt-header" style={{ gridColumn: 1, gridRow: 1 }} />
        {DAYS.map((day, dIdx) => (
          <div key={day} className="tt-cell tt-header" style={{ gridColumn: dIdx + 2, gridRow: 1 }}>
            {day}
          </div>
        ))}

        {/* 2. 시간축 (09시 ~ 21시) */}
        {Array.from({ length: 13 }).map((_, h) => {
          const hour = h + 9;
          const rowStart = h * 4 + 2;
          
          return (
            <React.Fragment key={h}>
              {/* 시간 라벨 (4칸 통합) */}
              <div className="tt-cell tt-time" style={{ 
                gridColumn: 1, 
                gridRow: `${rowStart} / span 4`, 
              }}>
                {hour}
              </div>
              
              {/* 배경 빈 셀 (요일별) - 점선 제거 */}
              {DAYS.map((_, dIdx) => (
                <div key={`${h}-${dIdx}`} className="tt-cell" style={{ 
                  gridColumn: dIdx + 2, 
                  gridRow: `${rowStart} / span 4`,
                  // borderBottom: 'none' // 점선 제거됨 (tt-cell 기본 스타일 사용)
                }} />
              ))}
            </React.Fragment>
          );
        })}

        {/* 3. 강의 블록 */}
        {gridBlocks.map((block, idx) => {
          const dayIdx = DAYS.indexOf(block.day);
          if (dayIdx === -1) return null;

          // 15분 단위 인덱스 (09:00 = 0)
          const rowStart = block.start + 2;
          const rowEnd = block.end + 3;
          const rowSpan = block.end - block.start + 1; // 15분 단위 개수
          
          const moveInfo = (block as any).moveInfo;

          // 1시간(4칸) 이하 수업에 대해 호버 효과 적용?
          // 원본은 1교시(1칸)일 때 적용했음. 여기선 15분 단위이므로 4칸 이하 정도면 작을 수 있음.
          // 사용자가 "칸이 하나인 거에 마우스 올려두면"이라고 했으므로,
          // 시각적으로 1시간 미만(rowSpan < 4)이거나 좁은 경우 적용.
          // 일단 rowSpan <= 4 (1시간) 일 때 can-hover 적용.
          const isSmallBlock = rowSpan <= 4;

          return (
            <div
              key={idx}
              className={`tt-block ${isSmallBlock ? 'can-hover' : ''}`}
              style={{
                backgroundColor: block.color,
                gridColumn: dayIdx + 2,
                gridRow: `${rowStart} / ${rowEnd}`,
                // 인라인 스타일 최소화, CSS 클래스(tt-block) 활용
              }}
              title={`${block.lecture.title} (${block.lecture.prof})`}
            >
              <div className="tt-block-title">
                <span className="group-badge">G{block.lecture.groupIdx}</span>
                {block.lecture.title}
              </div>
              
              {block.lecture.prof && (
                <div className="tt-block-prof">{block.lecture.prof}</div>
              )}
              
              <div className="tt-block-room">{block.room || ''}</div>
              
              {/* 이동 알림 */}
              {moveInfo && moveInfo.distance !== null && (
                <div 
                  className="move-alert" 
                  style={{ 
                    color: moveInfo.distance >= 8 ? '#c0392b' : moveInfo.distance === 0 ? '#27ae60' : '#d35400',
                    fontSize: '9px', fontWeight: 'bold'
                  }}
                >
                  {moveInfo.distance === 0 ? '이동없음' : `${moveInfo.distance}분`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
