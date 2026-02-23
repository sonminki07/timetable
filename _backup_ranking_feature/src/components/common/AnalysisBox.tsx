"use client";

import { useTimetableStore } from "../../store/useTimetableStore";

export default function AnalysisBox() {
  const { overlapCounts, hasRun, schedules } = useTimetableStore();

  const sortedConflicts = Object.entries(overlapCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 분석 실행 후 결과가 없고 충돌 데이터가 있을 때만 표시
  if (!hasRun || schedules.length > 0 || sortedConflicts.length === 0) return null;

  return (
    <div className="analysis-box" style={{ display: 'block' }}>
      <h4>🚨 앗! 시간표가 하나도 완성되지 않습니다!</h4>
      {sortedConflicts.length > 0 ? (
        <>
          <p style={{ fontSize: '14px', marginBottom: '10px' }}>
            아래 과목들이 서로 겹치고 있습니다 (충돌 Top 5):
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
            {sortedConflicts.map(([conflict, count], idx) => (
              <li key={idx}>
                <b>{conflict}</b> (동시 수강 불가)
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
            💡 <b>해결책:</b> 겹치는 과목 중 하나를 '특정 강의 제외'에서 끄거나, 다른 시간대의 분반을 추가해 보세요.
          </p>
        </>
      ) : (
        <p>• 현재 선택하신 '필수 공강 요일' 때문에 조합이 불가능합니다.</p>
      )}
    </div>
  );
}
