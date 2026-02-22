"use client";

import { useEffect, useState } from "react";
import { useTimetableStore } from "../store/useTimetableStore";
import { DAYS, parseText } from "../lib/utils/parser";
import { getDistance } from "../lib/utils/calculator";
import { splitBulkText } from "../lib/utils/distributor";

export default function Home() {
  const { 
    groups, addGroup, removeGroup, updateGroupText, setBulkGroups,
    settings, updateSettings, 
    generate, schedules, isGenerating, resetAll,
    overlapCounts, excludedLectureKeys, toggleExcludeLecture,
    destroyedGroupId, hasRun
  } = useTimetableStore();

  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState("💻 PC MODE");
  const [bulkInput, setBulkInput] = useState("");
  const [tableModeGroups, setTableModeGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      setDeviceStatus("📱 MOBILE (S23 Ultra)");
    }
    setMounted(true);
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty('--cols', String(settings.cols));
    }
  }, [settings.cols, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleGroupFormat = (id: number) => {
    const newSet = new Set(tableModeGroups);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setTableModeGroups(newSet);
  };
  const allToTable = () => setTableModeGroups(new Set(groups.map(g => g.id)));
  const allToText = () => setTableModeGroups(new Set());

  const handleDistribute = () => {
    const texts = splitBulkText(bulkInput);
    if (texts.length === 0) { alert("데이터를 올바르게 인식하지 못했습니다."); return; }
    setBulkGroups(texts);
    alert(`${texts.length}개의 그룹에 데이터가 자동 배분되었습니다.`);
  };

  // 결과 화면만 초기화 (Zustand 스토어의 schedules만 비움)
  const resetResultsOnly = () => {
    useTimetableStore.setState({ schedules: [], overlapCounts: {}, destroyedGroupId: null });
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}></div>;

  const COLORS = ['#ffeaa7', '#a29bfe', '#81ecec', '#fab1a0', '#74b9ff', '#55efc4', '#ff7675', '#74b9ff', '#55efc4', '#ffeaa7'];

  const allParsedCourses = groups.flatMap((g) => {
    const courses = parseText(g.text, g.id);
    return courses.map((c) => ({
      ...c,
      key: `${g.id}|${c.title}|${c.prof}|${c.timesOnly}`,
    }));
  });

  return (
    <div className={`main-container analog-fade ${isLoaded ? 'loaded' : ''}`}>
      {sidebarOpen && (
        <>
          <div className="sidebar-overlay open" onClick={toggleSidebar}></div>
          <div className="sidebar open">
              <h2>⚙️ 환경 설정</h2>
              <div className="sidebar-item">
                  <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>테마 설정</p>
                  <button 
                    className={`sidebar-btn-primary ${theme === 'light' ? 'theme-btn-light' : 'theme-btn-dark'}`}
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? '🌙 다크 모드 전환' : '☀️ 라이트 모드 전환'}
                  </button>
              </div>
              <div className="sidebar-item" style={{ marginTop: '40px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-red)' }}>위험 구역</p>
                  <button className="sidebar-btn-danger" onClick={() => { if(confirm('모든 데이터를 초기화하시겠습니까?')) resetAll(); }}>🧨 데이터 전체 초기화</button>
              </div>
              <button onClick={toggleSidebar} style={{ marginTop: '50px', background: 'none', border: '1px solid var(--border)', width: '100%', padding: '10px', color: 'var(--text-gray)', borderRadius: '5px', cursor: 'pointer' }}>닫기</button>
          </div>
        </>
      )}

      <div className="header-wrapper">
          <div>
              <h1>🎓 가톨릭대 시간표 분석기 V8</h1>
              <p className="desc">🌟 <strong>[V8 Premium]</strong> 모바일 & PC 자동 최적화 시스템 적용</p>
          </div>
          <div className="header-right-tools">
              <span className="device-badge">{deviceStatus}</span>
              <button className="settings-btn" onClick={toggleSidebar}>⚙️</button>
          </div>
      </div>

      <div className="group-controls-container">
        <div>
          <div className="left-btn-row">
            <button onClick={addGroup}>➕ 그룹 추가</button>
            <button onClick={() => { if(groups.length > 1) removeGroup(groups[groups.length-1].id); else alert('최소 1개의 그룹은 있어야 합니다.'); }}>➖ 그룹 삭제</button>
            <button onClick={allToTable} style={{ backgroundColor: '#2980b9' }}>📊 전체 표로 보기</button>
            <button onClick={allToText} style={{ backgroundColor: '#7f8c8d' }}>📝 전체 텍스트로 보기</button>
          </div>
          <div className="group-status-info">(현재 <span id="group-count-display">{groups.length}</span>개 / 최대 10개)</div>
        </div>
        <div className="control-right-bulk">
          <textarea 
            className="bulk-textarea" 
            value={bulkInput} 
            onChange={(e) => setBulkInput(e.target.value)} 
            placeholder="여기에 모든 그룹의 강의를 한꺼번에 붙여넣으세요.&#10;(그룹 간에는 빈 줄 하나를 넣어 구분하세요)" 
          />
          <button className="bulk-distribute-btn" onClick={handleDistribute}>⚡ 모든 그룹에 자동 배분</button>
        </div>
      </div>

      <div id="groups-container">
        {groups.map((group) => {
          const isTable = tableModeGroups.has(group.id);
          const parsed = parseText(group.text, group.id);
          return (
            <div key={group.id} className="group" id={`group-box-${group.id}`}>
              <div className="group-header">
                <h3>그룹 {group.id}</h3>
                <div className="header-btns">
                  <button className="convert-btn" onClick={() => toggleGroupFormat(group.id)}>
                    {isTable ? "텍스트 수정" : "표로 보기"}
                  </button>
                  <button className="reset-btn" onClick={() => updateGroupText(group.id, "")}>초기화</button>
                </div>
              </div>
              {!isTable ? (
                <textarea 
                  className="group-input" 
                  value={group.text} 
                  onChange={(e) => updateGroupText(group.id, e.target.value)} 
                  placeholder="에브리타임 장바구니 목록을 붙여넣으세요." 
                />
              ) : (
                <div className="group-table-container show">
                  <table className="group-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30px', textAlign: 'center' }}>제외</th>
                        <th>과목명</th><th>교수</th><th>시간</th><th>강의실</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.map((c, idx) => {
                        const key = `${group.id}|${c.title}|${c.prof}|${c.timesOnly}`;
                        const isExcluded = excludedLectureKeys.has(key);
                        return (
                          <tr key={idx} style={{ opacity: isExcluded ? 0.4 : 1 }}>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                onClick={() => toggleExcludeLecture(key)} 
                                style={{ 
                                  background: isExcluded ? '#27ae60' : '#e74c3c', 
                                  color: 'white', 
                                  border: 'none', 
                                  borderRadius: '3px', 
                                  cursor: 'pointer',
                                  width: '20px',
                                  height: '20px',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {isExcluded ? '+' : '-'}
                              </button>
                            </td>
                            <td style={{ textDecoration: isExcluded ? 'line-through' : 'none' }}>{c.title}</td>
                            <td>{c.prof}</td>
                            <td>{c.timesOnly}</td>
                            <td className="room-col">{c.roomsOnly}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="controls">
        <h3>⚙️ 맞춤형 추천도(가점/감점) 및 필터 설정</h3>
        <div className="option-row" id="layout-option-row">
          <label className="title">🖥️ 화면 표시 레이아웃</label>
          <div>
            한 줄에 시간표 <input type="number" style={{ width: '40px' }} value={settings.cols || ''} min="1" max="5" onChange={(e) => updateSettings({ cols: parseInt(e.target.value) || 0 })} /> 개씩 표시
          </div>
        </div>
        <div className="option-row">
          <label className="title">🚫 필수 공강 요일</label>
          <div>
            {DAYS.map((day, idx) => (
              <label key={idx} style={{ marginRight: '10px', cursor: 'pointer' }}>
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
        
        <div className="option-row" style={{ backgroundColor: '#f0f4f8', padding: '8px', borderRadius: '5px', alignItems: 'flex-start' }}>
          <details style={{ width: '100%' }}>
            <summary style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', listStyle: 'none', outline: 'none' }}>
              <label className="title" style={{ color: 'var(--text-blue)', cursor: 'pointer', marginRight: '10px' }}>🚫 특정 강의 제외</label>
              <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>(접기/펼치기)</span>
            </summary>
            <div id="lecture-exclude-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', marginTop: '10px' }}>
              {allParsedCourses.length > 0 ? (
                groups.map(group => {
                  const groupCourses = allParsedCourses.filter(c => c.groupIdx === group.id);
                  if (groupCourses.length === 0) return null;
                  return (
                    <details key={group.id} open style={{ width: '100%', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '5px' }}>
                      <summary style={{ fontSize: '13px', fontWeight: 'bold', color: '#2980b9', cursor: 'pointer', padding: '2px 0' }}>그룹 {group.id} 강의 목록 ({groupCourses.length}개)</summary>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '5px 0 5px 15px' }}>
                        {groupCourses.map((course, idx) => (
                          <label key={idx} style={{ fontSize: '13px', background: 'var(--bg-input)', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--border)', width: 'fit-content', minWidth: '300px', marginBottom: '2px' }}>
                            <input type="checkbox" checked={excludedLectureKeys.has(course.key)} onChange={() => toggleExcludeLecture(course.key)} />
                            <span style={{ color: 'var(--text-dark)', flex: 1 }}>
                              <span style={{ fontWeight: 500 }}>{course.title}</span> 
                              <span style={{ color: 'var(--text-red)', fontWeight: 'bold', marginLeft: '5px', fontSize: '13px' }}>({course.prof || '교수 미정'})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </details>
                  );
                })
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>그룹 '표로 보기' 클릭 시 목록 활성화</span>
              )}
            </div>
          </details>
        </div>

        <div className="option-row">
          <label className="title">💖 선호 공강 요일</label>
          <div>
            {DAYS.map((day, idx) => (
              <label key={idx} style={{ marginRight: '10px', cursor: 'pointer' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

      <div className="analysis-box" id="analysis-box" style={{ display: hasRun && (destroyedGroupId !== null || Object.keys(overlapCounts).length > 0 || (schedules.length === 0 && !isGenerating)) ? 'block' : 'none' }}>
        {destroyedGroupId !== null ? (
          <>
            <h4>🚨 그룹 {destroyedGroupId}의 과목이 '기피 교시' 조건에 막혀 모두 파괴되었습니다!</h4>
            <p>기피 교시를 완화하거나 그룹 {destroyedGroupId}에 다른 시간대의 과목을 추가해주세요.</p>
          </>
        ) : schedules.length === 0 && !isGenerating ? (
          <>
            <h4>🚨 앗! 시간표가 하나도 완성되지 않습니다!</h4>
            {Object.keys(overlapCounts).length > 0 ? (
              <>
                <p>아래 과목들이 서로 겹치고 있습니다 (충돌 Top 5):</p>
                <ul>
                  {Object.entries(overlapCounts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([key, count]: any) => (
                    <li key={key}><b>{key}</b> (동시 수강 불가)</li>
                  ))}
                </ul>
                <p>💡 해결책: 겹치는 과목 중 하나를 다른 시간대로 바꾸거나, '필수 공강 요일'을 해제해보세요.</p>
              </>
            ) : (
              <p>• 현재 선택하신 '필수 공강 요일' 또는 '기피 교시' 때문에 조합이 불가능합니다.</p>
            )}
          </>
        ) : null}
      </div>

      <div id="result-container">
        {schedules.map((s, sIdx) => (
          <div key={sIdx} className="timetable-wrapper">
            <div className="timetable-header">
              <h4>조합 {sIdx + 1} <span style={{ fontSize: '12px', color: '#7f8c8d' }}>(추천도: {s.score}점)</span></h4>
              <div className="score-detail">★ {s.scoreText}</div>
            </div>
            <div className="timetable">
              <div className="tt-cell tt-header" style={{ gridColumn: 1, gridRow: 1 }}></div>
              {DAYS.map((d, i) => (<div key={d} className="tt-cell tt-header" style={{ gridColumn: i + 2, gridRow: 1 }}>{d}</div>))}
              {Array.from({length: 10}).map((_, h) => (
                <div key={h} style={{ display: 'contents' }}>
                  <div className="tt-cell tt-time" style={{ gridColumn: 1, gridRow: h + 2 }}>{h + 1}</div>
                  {DAYS.map((d, i) => (<div key={i} className="tt-cell" style={{ gridColumn: i + 2, gridRow: h + 2 }}></div>))}
                </div>
              ))}
              {s.lectures.map((lecture) => {
                const color = COLORS[(lecture.groupIdx - 1) % COLORS.length];
                return lecture.timeBlocks.map((block, bIdx) => {
                  const rowSpan = block.end - block.start + 1;
                  return (
                    <div 
                      key={bIdx} 
                      className={`tt-block ${rowSpan === 1 ? 'can-hover' : ''}`}
                      style={{ 
                        backgroundColor: color, 
                        gridColumn: DAYS.indexOf(block.day) + 2, 
                        gridRow: `${block.start + 1} / span ${rowSpan}` 
                      }}
                    >
                      <div className="tt-block-title">
                        <span className="group-badge">G{lecture.groupIdx}</span>{lecture.title}
                      </div>
                      {lecture.prof && <div style={{ fontSize: '9px', opacity: 0.8, color: '#c0392b', fontWeight: 'bold', marginBottom: '2px' }}>{lecture.prof}</div>}
                      <div className="tt-block-room">{block.room}</div>
                      <MoveAlert block={block} />
                    </div>
                  );
                });
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function MoveAlert({ block }: any) {
  const moveInfo = block.moveInfo;
  if (moveInfo && moveInfo.distance !== null) {
    let color = '#d35400';
    let text = `🚶${moveInfo.distance}분`;
    if (moveInfo.distance === 0) { color = '#27ae60'; text = '🚶건물같음'; }
    else if (moveInfo.distance >= 8) { color = '#c0392b'; text = `🏃${moveInfo.distance}분!`; }
    return <div className="move-alert" style={{ color, fontWeight: 'bold' }}>{text}</div>;
  }
  return null;
}
