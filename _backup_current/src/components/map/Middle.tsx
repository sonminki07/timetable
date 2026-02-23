import React, { useState } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { parseText } from '../../utils/parser';

const Middle: React.FC = () => {
  const { groups, updateGroupText, excludedLectureKeys, toggleExcludeLecture, tableModeGroups, toggleTableMode } = useTimetableStore();

  return (
    <div id="groups-container">
      {groups.map((group) => {
        const isTable = tableModeGroups.has(group.id);
        const parsed = parseText(group.text, group.id);
        
        return (
          <div key={group.id} className="group" id={`group-box-${group.id}`}>
            <div className="group-header">
              <h3>그룹 {group.id}</h3>
              <div className="header-btns">
                <button className="convert-btn" onClick={() => toggleTableMode(group.id)}>
                  {isTable ? "텍스트 수정" : "표로 보기"}
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
              <div className="group-table-container show animate-in fade-in duration-300">
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
  );
};

export default Middle;
