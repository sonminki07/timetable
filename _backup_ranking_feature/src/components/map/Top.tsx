import React, { useState, useEffect } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { splitBulkText } from '../../utils/distributor';

interface TopProps {
  onOpenSettings: () => void;
}

const Top: React.FC<TopProps> = ({ onOpenSettings }) => {
  const { groups, addGroup, removeGroup, setBulkGroups, setAllTableMode, tableModeGroups, generate } = useTimetableStore();
  const [deviceStatus, setDeviceStatus] = useState("💻 PC MODE");
  const [bulkInput, setBulkInput] = useState("");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      setDeviceStatus("📱 MOBILE (S23 Ultra)");
    }
  }, []);

  const handleDistribute = () => {
    const texts = splitBulkText(bulkInput);
    if (texts.length === 0) {
      alert("데이터를 올바르게 인식하지 못했습니다.");
      return;
    }
    setBulkGroups(texts);
    alert(`${texts.length}개의 그룹에 데이터가 자동 배분되었습니다.`);
  };

  const isAllTable = tableModeGroups.size === groups.length && groups.length > 0;
  const isAllText = tableModeGroups.size === 0;

  return (
    <>
      <div className="header-wrapper">
        <div>
          <h1>🎓 가톨릭대 시간표 분석기 V8</h1>
          <p className="desc">🌟 <strong>[V8 Premium]</strong> 모바일 & PC 자동 최적화 시스템 적용</p>
        </div>
        <div className="header-right-tools">
          <span className="device-badge">{deviceStatus}</span>
          <button className="settings-btn" onClick={onOpenSettings}>⚙️</button>
        </div>
      </div>

      <div className="group-controls-container">
        <div>
          <div className="left-btn-row">
            <button onClick={addGroup} className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md font-bold transition-colors">➕ 그룹 추가</button>
            <button onClick={() => { 
              if(groups.length > 1) removeGroup(groups[groups.length-1].id); 
              else alert('최소 1개의 그룹은 있어야 합니다.'); 
            }} className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md font-bold transition-colors">➖ 그룹 삭제</button>
            
            <button 
              onClick={() => setAllTableMode(true)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ml-2 ${
                isAllTable 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-slate-700 hover:bg-slate-800 text-white"
              }`}
            >
              📊 전체 표로 보기
            </button>
            <button 
              onClick={() => setAllTableMode(false)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ml-1 ${
                isAllText 
                ? "bg-gray-600 text-white shadow-md" 
                : "bg-slate-700 hover:bg-slate-800 text-white"
              }`}
            >
              📝 전체 텍스트로 보기
            </button>
          </div>
          <div className="group-status-info">(현재 <span id="group-count-display">{groups.length}</span>개 / 최대 10개)</div>
        </div>
        <div className="control-right-bulk">
          <textarea 
            className="bulk-textarea focus:ring-2 focus:ring-purple-400 outline-none transition-all" 
            value={bulkInput} 
            onChange={(e) => setBulkInput(e.target.value)} 
            placeholder="여기에 모든 그룹의 강의를 한꺼번에 붙여넣으세요.&#10;(그룹 간에는 빈 줄 하나를 넣어 구분하세요)" 
          />
          <button className="bulk-distribute-btn hover:brightness-110 active:scale-95 transition-all" onClick={handleDistribute}>⚡ 모든 그룹에 자동 배분</button>
        </div>
      </div>
    </>
  );
};

export default Top;
