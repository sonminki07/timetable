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
        gridTemplateRows: '25px repeat(52, 1fr)', // 13시간 * 4 = 52칸 (09:00 ~ 22:00)
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)', // 다크 모드 배경색 적용
        // height: '600px', // 고정 높이 제거 -> 전체 표시
        minHeight: '400px',
        // overflowY: 'auto', // 스크롤 제거
        fontSize: '11px',
        color: 'var(--text-primary)' // 다크 모드 텍스트 색상
      }}>
        {/* 1. 요일 헤더 */}
        <div className="tt-cell tt-header" style={{ gridColumn: 1, gridRow: 1, borderRight: '1px solid #eee', borderBottom: '1px solid #ddd' }} />
        {DAYS.map((day, dIdx) => (
          <div key={day} className="tt-cell tt-header" style={{ 
            gridColumn: dIdx + 2, 
            gridRow: 1, 
            textAlign: 'center', 
            lineHeight: '25px', 
            fontWeight: 'bold', 
            borderBottom: '1px solid #ddd',
            borderRight: dIdx < 4 ? '1px solid #eee' : 'none'
          }}>
            {day}
          </div>
        ))}

        {/* 2. 시간축 (09시 ~ 21시) & 배경 격자 */}
        {Array.from({ length: 13 }).map((_, h) => {
          const hour = h + 9;
          const rowStart = h * 4 + 2; // 2, 6, 10...
          
          return (
            <React.Fragment key={h}>
              {/* 시간 라벨 (4칸 통합) */}
              <div style={{ 
                gridColumn: 1, 
                gridRow: `${rowStart} / span 4`, 
                textAlign: 'center', 
                borderRight: '1px solid #eee', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                fontWeight: 'bold',
                fontSize: '10px'
              }}>
                {hour}
              </div>
              
              {/* 배경 격자 (요일별) */}
              {DAYS.map((_, dIdx) => (
                <div key={`${h}-${dIdx}`} style={{ 
                  gridColumn: dIdx + 2, 
                  gridRow: `${rowStart} / span 4`,
                  borderRight: dIdx < 4 ? '1px solid #f5f5f5' : 'none',
                  borderBottom: '1px solid #f5f5f5' // 1시간 단위 선
                }}>
                  {/* 30분 단위 점선 (선택 사항) */}
                  <div style={{ height: '50%', borderBottom: '1px dashed #f9f9f9' }}></div>
                </div>
              ))}
            </React.Fragment>
          );
        })}

        {/* 3. 강의 블록 */}
        {gridBlocks.map((block, idx) => {
          const dayIdx = DAYS.indexOf(block.day);
          if (dayIdx === -1) return null;

          // start, end는 15분 단위 인덱스 (09:00 = 0)
          // gridRowStart = start + 2
          // gridRowEnd = end + 3 (end는 포함된 마지막 인덱스이므로 +1 해서 다음 라인까지)
          const rowStart = block.start + 2;
          const rowEnd = block.end + 3;
          
          const moveInfo = (block as any).moveInfo;

          return (
            <div
              key={idx}
              className="tt-block"
              style={{
                backgroundColor: block.color,
                gridColumn: dayIdx + 2,
                gridRow: `${rowStart} / ${rowEnd}`,
                margin: '1px',
                padding: '2px',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 10
              }}
              title={`${block.lecture.title} (${block.lecture.prof})`}
            >
              <div className="font-bold text-[10px] leading-tight truncate w-full">
                <span className="text-[9px] bg-white/50 px-1 rounded mr-1">G{block.lecture.groupIdx}</span>
                {block.lecture.title}
              </div>
              
              {block.lecture.prof && (
                <div className="text-[9px] truncate w-full">{block.lecture.prof}</div>
              )}
              
              <div className="text-[8px] text-gray-500 truncate w-full">{block.room || ''}</div>
              
              {/* 이동 알림 */}
              {moveInfo && moveInfo.distance !== null && (
                <div 
                  className="text-[8px] font-bold mt-0.5 px-1 rounded bg-white/60" 
                  style={{ 
                    color: moveInfo.distance >= 8 ? '#c0392b' : moveInfo.distance === 0 ? '#27ae60' : '#d35400',
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
