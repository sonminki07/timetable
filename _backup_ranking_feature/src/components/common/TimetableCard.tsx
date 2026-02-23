"use client";

import React from 'react';
import { Schedule, Lecture, TimeBlock } from "../../types/timetable";
import { DAYS } from "../../utils/parser";

interface TimetableCardProps {
  schedule: Schedule;
  index: number;
}

// 레거시 HTML과 동일한 컬러셋
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
      {/* 🏛️ 레거시 헤더 스타일 */}
      <div className="timetable-header">
        <h4>
          조합 {index + 1} 
          <span style={{ fontSize: '12px', color: '#7f8c8d', marginLeft: '8px' }}>
            (추천도: {schedule.score}점)
          </span>
        </h4>
        <div className="score-detail">★ {schedule.scoreText}</div>
      </div>

      {/* 🗓️ 레거시 그리드 엔진 */}
      <div className="timetable">
        {/* 헤더 빈 칸 */}
        <div className="tt-cell tt-header" style={{ gridColumn: 1, gridRow: 1 }} />
        
        {/* 요일 헤더 (정확히 25px) */}
        {DAYS.map((day, dIdx) => (
          <div key={day} className="tt-cell tt-header" style={{ gridColumn: dIdx + 2, gridRow: 1 }}>
            {day}
          </div>
        ))}

        {/* 시간축 및 빈 격자 (정확히 45px 단위) */}
        {Array.from({ length: 10 }).map((_, h) => (
          <React.Fragment key={h}>
            <div className="tt-cell tt-time" style={{ gridColumn: 1, gridRow: h + 2 }}>
              {h + 1}
            </div>
            {DAYS.map((_, dIdx) => (
              <div key={dIdx} className="tt-cell" style={{ gridColumn: dIdx + 2, gridRow: h + 2 }} />
            ))}
          </React.Fragment>
        ))}

        {/* 🌟 원본 'tt-block' 로직 완벽 재현 */}
        {gridBlocks.map((block, idx) => {
          const dayIdx = DAYS.indexOf(block.day);
          const rowStart = block.start + 1;
          const rowSpan = block.end - block.start + 1;
          const moveInfo = (block as any).moveInfo;

          return (
            <div
              key={idx}
              className={`tt-block ${rowSpan === 1 ? 'can-hover' : ''}`}
              style={{
                backgroundColor: block.color,
                gridColumn: dayIdx + 2,
                gridRow: `${rowStart} / span ${rowSpan}`,
              }}
            >
              <div className="tt-block-title">
                <span className="group-badge">G{block.lecture.groupIdx}</span>
                {block.lecture.title}
              </div>
              
              {block.lecture.prof && (
                <div className="tt-block-prof">{block.lecture.prof}</div>
              )}
              
              <div className="tt-block-room">{block.room || ''}</div>
              
              {/* 레거시 이동 알림 스타일 */}
              {moveInfo && moveInfo.distance !== null && (
                <div 
                  className="move-alert" 
                  style={{ 
                    color: moveInfo.distance >= 8 ? '#c0392b' : moveInfo.distance === 0 ? '#27ae60' : '#d35400',
                    fontWeight: 'bold'
                  }}
                >
                  {moveInfo.distance === 0 ? '🚶건물같음' : 
                   moveInfo.distance >= 8 ? `🏃${moveInfo.distance}분! 뜀박질` : 
                   `🚶${moveInfo.distance}분 이동`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
