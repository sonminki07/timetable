import React, { useState, useEffect } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { DAYS } from '../../config/constants';
import AnalysisBox from '../common/AnalysisBox';
import TimetableCard from '../common/TimetableCard';
import ExclusionSettings from './ExclusionSettings';
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft, UserCheck } from 'lucide-react';
import { parseText } from '../../utils/parser';

const Bottom: React.FC = () => {
  const { 
    settings, updateSettings, 
    generate, schedules, isGenerating, 
    hasRun, groups 
  } = useTimetableStore();

  const [isResultExpanded, setIsResultExpanded] = useState(false);
  const [isProfWeightExpanded, setIsProfWeightExpanded] = useState(false);

  // 결과가 생성되면 자동으로 확장 애니메이션 트리거
  useEffect(() => {
    if (hasRun && schedules.length > 0) {
      setIsResultExpanded(true);
    }
  }, [hasRun, schedules.length]);

  const resetResultsOnly = () => {
    useTimetableStore.setState({ schedules: [], overlapCounts: {}, destroyedGroupId: null, hasRun: false });
    setIsResultExpanded(false);
  };

  const handleProfChange = (index: number, field: 'name' | 'weight', value: string) => {
    const currentWeights = settings.profWeights || [];
    if (!currentWeights[index]) return;

    const nextProfs = currentWeights.map((pw, i) => {
      if (i !== index) return pw;
      return { 
        ...pw, 
        [field]: field === 'weight' ? (parseInt(value) || 0) : value 
      };
    });
    updateSettings({ profWeights: nextProfs });
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

        <div className="option-row">
          <label className="title">🚫 기피 교시 (파괴)</label>
          <div>
            <input type="text" style={{ width: '80px' }} value={settings.excludePeriods.join(', ')} onChange={(e) => updateSettings({ excludePeriods: e.target.value === '' ? [] : e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)) })} placeholder="예: 1, 2" /> 
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>(입력 교시 포함 과목 파괴)</span>
          </div>
        </div>

        {/* <ExclusionSettings /> */}

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
            <input type="number" style={{ width: '40px' }} value={settings.maxConsec || ''} onChange={(e) => updateSettings({ maxConsec: parseInt(e.target.value) || 0 })} />
            <span>시간 이상 연속</span>
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

        {/* 🎓 선호 교수님 가점 설정 (가로 배치 버전) */}
        <div className="option-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0' }}>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <label className="title flex items-center gap-1.5 mb-0">
                <UserCheck size={14} className="text-emerald-500" /> 우선순위 배점 설정
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[14px] text-gray-600 dark:text-gray-300">
                <input 
                  type="checkbox" 
                  checked={settings.useProfWeight}
                  onChange={(e) => updateSettings({ useProfWeight: e.target.checked })}
                /> 적용
              </label>
            </div>
            
            <button 
              onClick={() => setIsProfWeightExpanded(!isProfWeightExpanded)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all"
            >
              {isProfWeightExpanded ? '설정 닫기' : '배점 설정'}
              {isProfWeightExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {isProfWeightExpanded && (
            <div className="mt-3 w-full bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col gap-2">
               <p className="text-[11px] text-gray-400 mb-1 px-1">
                 * 각 순위의 배점을 설정하세요. (우측에 해당 강의들이 표시됩니다)
               </p>
               
               {(settings.profWeights || []).map((pw, idx) => (
                 <div key={idx} className="flex items-center flex-wrap gap-2 bg-white dark:bg-gray-700/30 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
                    
                    {/* 1. 순위 배지 */}
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${idx === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300'}`}>
                      {idx + 1}순위
                    </span>

                    {/* 2. 점수 입력 */}
                    <div className="flex items-center gap-1 shrink-0">
                      <input 
                        type="number"
                        className="w-[60px] h-6 px-0 text-right font-bold text-[13px] bg-transparent border-b border-gray-300 dark:border-gray-500 focus:border-emerald-500 outline-none transition-colors"
                        value={pw?.weight || 0}
                        onChange={(e) => handleProfChange(idx, 'weight', e.target.value)}
                      />
                      <span className="text-[11px] text-gray-400">점ㅤㅤ</span>
                    </div>

                    {/* 3. 구분선 (선택) */}
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    {/* 4. 교수 리스트 (바로 이어짐) */}
                    {groups.map((g) => {
                      const courses = parseText(g.text, g.id);
                      const course = courses[idx]; // 현재 순위(idx)에 해당하는 강의
                      
                      if (!course) {
                        return (
                          <div key={g.id} className="flex items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/30 px-2 py-1 rounded border border-dashed border-gray-200 dark:border-gray-700 text-[13px] text-gray-400 shrink-0 min-w-[80px]" title="해당 순위 강의 없음">
                            <span className="font-bold text-[11px]">G{g.id}</span>
                            <span className="font-medium text-[11px]">-</span>
                          </div>
                        );
                      }

                      return (
                        <div key={g.id} className="flex items-center gap-1 bg-gray-50 dark:bg-gray-600/50 px-2 py-1 rounded border border-gray-100 dark:border-gray-500/30 text-[13px] text-gray-700 dark:text-gray-200 shrink-0 min-w-[80px]" title={course.title}>
                          <span className="font-bold text-gray-400 text-[11px]">ㅤG{g.id}</span>
                          <span className="font-medium">{course.prof}</span>
                        </div>
                      );
                    })}
                    {groups.every(g => !parseText(g.text, g.id)[idx]) && (
                      <span className="text-[10px] text-gray-300 italic">정보 없음</span>
                    )}
                 </div>
               ))}
            </div>
          )}
        </div>
        
        <div className="main-btns">
          <button className="run-btn" onClick={generate} disabled={isGenerating}>
            {isGenerating ? "✨ 생성 중..." : "✨ 이 조건으로 시간표 그리기 & 분석"}
          </button>
          <button className="reset-results-btn" onClick={resetResultsOnly}>결과 화면 초기화</button>
        </div>
      </div>

      <AnalysisBox />

      {/* 결과 영역: 항상 표시 */}
      {hasRun && (
        <div className="mt-8 transition-all duration-500 ease-in-out">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
            📊 생성된 시간표 ({schedules.length}개)
          </h3>

          <div className="grid py-4 animate-in fade-in slide-in-from-top-4 duration-500" style={{ gridTemplateColumns: `repeat(${settings.cols}, 1fr)`, gap: '1rem' }}>
            {schedules.length > 0 ? (
              schedules.map((s, sIdx) => (
                <TimetableCard key={sIdx} schedule={s} index={sIdx} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                조합 가능한 시간표가 없습니다. 필터를 완화해 보세요.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bottom;
