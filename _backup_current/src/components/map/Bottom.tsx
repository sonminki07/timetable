import React from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { DAYS } from '../../config/constants';
import AnalysisBox from '../common/AnalysisBox';
import TimetableCard from '../common/TimetableCard';
import ExclusionSettings from './ExclusionSettings';

const Bottom: React.FC = () => {
  const { 
    settings, updateSettings, 
    generate, schedules, isGenerating, 
    hasRun
  } = useTimetableStore();

  const resetResultsOnly = () => {
    useTimetableStore.setState({ schedules: [], overlapCounts: {}, destroyedGroupId: null, hasRun: false });
  };

  return (
    <div className="bottom-container">
      <div className="controls">
        <h3>⚙️ 맞춤형 추천도(가점/감점) 및 필터 설정</h3>
        
        <div className="option-row">
          <label className="title">🖥️ 화면 표시 레이아웃</label>
          <div>
            한 줄에 시간표 <input type="number" style={{ width: '40px' }} value={settings.cols || ''} min="1" max="5" onChange={(e) => updateSettings({ cols: parseInt(e.target.value) || 0 })} /> 개씩 표시
          </div>
        </div>

        <div className="option-row">
          <label className="title">🚫 필수 공강 요일</label>
          <div>
            {DAYS.map((day, idx) => (
              <label key={idx} style={{ marginRight: '10px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={settings.hardDays[idx]} onChange={() => {
                  const next = [...settings.hardDays];
                  next[idx] = !next[idx];
                  updateSettings({ hardDays: next });
                }} /> {day}
              </label>
            ))}
          </div>
        </div>

        <div className="option-row" style={{ backgroundColor: '#ffefef', padding: '8px', borderRadius: '5px' }}>
          <label className="title" style={{ color: '#c0392b' }}>🚫 기피 교시 (파괴)</label>
          <div>
            <input type="text" style={{ width: '80px', borderColor: '#e74c3c' }} value={settings.excludePeriods.join(', ')} onChange={(e) => updateSettings({ excludePeriods: e.target.value === '' ? [] : e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)) })} placeholder="예: 1, 2" /> 
            <span style={{ fontSize: '12px', color: '#c0392b', fontWeight: 'bold', marginLeft: '5px' }}>(입력 교시 포함 과목 파괴)</span>
          </div>
        </div>

        <ExclusionSettings />

        <div className="option-row">
          <label className="title">💖 선호 공강 요일</label>
          <div>
            {DAYS.map((day, idx) => (
              <label key={idx} style={{ marginRight: '10px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={settings.prefDays[idx]} onChange={() => {
                  const next = [...settings.prefDays];
                  next[idx] = !next[idx];
                  updateSettings({ prefDays: next });
                }} /> {day}
              </label>
            ))}
          </div>
        </div>

        <div className="option-row">
          <label className="title">🏃 연강 제한 설정</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <input type="number" style={{ width: '50px' }} value={settings.maxConsec || ''} onChange={(e) => updateSettings({ maxConsec: parseInt(e.target.value) || 0 })} />
            <span>시간 초과 시</span>
            <select 
              value={settings.consecPolicy} 
              onChange={(e) => updateSettings({ consecPolicy: e.target.value as 'penalty' | 'destroy' })}
              style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg-input)', color: 'var(--text-dark)', cursor: 'pointer' }}
            >
              <option value="penalty">무자비 감점 (추천도 하락)</option>
              <option value="destroy">조합 파괴 (결과에서 제외)</option>
            </select>
          </div>
        </div>

        <div className="option-row">
          <label className="title">❤️ 선호 수업 (가점)</label>
          <div><input type="text" style={{ width: '150px' }} value={settings.prefSubject} placeholder="예: 미디어 (+15점)" onChange={(e) => updateSettings({ prefSubject: e.target.value })} /></div>
        </div>

        <div className="option-row">
          <label className="title">🍱 내맘대로 쉬는시간</label>
          <div>
            <input type="text" style={{ width: '80px' }} value={settings.prefLunch.join(', ')} onChange={(e) => updateSettings({ prefLunch: e.target.value === '' ? [] : e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)) })} placeholder="예: 4, 5" /> 
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>지정 교시 비어있을 시 (+15점)</span>
          </div>
        </div>
        
        <div className="main-btns">
          <button className="run-btn" onClick={generate} disabled={isGenerating}>
            {isGenerating ? "✨ 생성 중..." : "✨ 이 조건으로 시간표 그리기 & 분석"}
          </button>
          <button className="reset-results-btn" onClick={resetResultsOnly}>결과 화면 초기화</button>
        </div>
      </div>

      <AnalysisBox />

      <div id="result-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${settings.cols}, 1fr)`, gap: '20px' }}>
        {hasRun && schedules.length > 0 ? (
          schedules.map((s, sIdx) => (
            <TimetableCard key={sIdx} schedule={s} index={sIdx} />
          ))
        ) : hasRun && schedules.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400">
            조합 가능한 시간표가 없습니다. 필터를 완화해 보세요.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Bottom;
