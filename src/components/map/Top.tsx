import React, { useState, useEffect } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { splitBulkText } from '../../utils/distributor';
import { RefreshCw } from 'lucide-react';

interface TopProps {
  onOpenSettings: () => void;
}

const formatVersion = (ts: string) => {
  if (!ts) return 'v0.0.0';
  const num = parseInt(ts);
  if (isNaN(num)) return ts;
  const date = new Date(num);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `v${yy}.${mm}.${dd}-${hh}:${min}`;
};

const Top: React.FC<TopProps> = ({ onOpenSettings }) => {
  const { groups, addGroup, removeGroup, setBulkGroups, setAllTableMode, tableModeGroups, generate } = useTimetableStore();
  const [bulkInput, setBulkInput] = useState("");
  
  // 자동 업데이트 감지 상태
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const [isLatest, setIsLatest] = useState<boolean>(true);

  const fetchVersion = async () => {
    try {
      const res = await fetch('/version.json?t=' + Date.now());
      const data = await res.json();
      return data.version as string;
    } catch (e) {
      console.error('Failed to fetch version:', e);
      return '';
    }
  };

  useEffect(() => {
    // 최초 버전 로드
    fetchVersion().then(ver => {
      if (ver) {
        setCurrentVersion(ver);
      }
    });

    const handleFocus = async () => {
      if (document.visibilityState === 'visible') {
        const serverVer = await fetchVersion();
        if (serverVer && currentVersion && serverVer !== currentVersion) {
          setIsLatest(false);
          // 사용자 경험 향상을 위해 1초 후 자동 새로고침 진행
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentVersion]);

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
        <div className="min-w-0 overflow-x-auto hide-scrollbar flex-1">
          <h1 className="whitespace-nowrap text-lg sm:text-2xl font-bold">🎓 시간표 제작기</h1>
          <div className="flex flex-col">
            <p className="desc whitespace-nowrap text-xs sm:text-sm"> <strong>[Premium]</strong> 모바일 & PC 시스템</p>
            {currentVersion && (
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                <span className="font-semibold">{formatVersion(currentVersion)}</span>
                {isLatest ? (
                  <span className="text-emerald-500 dark:text-emerald-400 font-medium">최신 버전</span>
                ) : (
                  <span className="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                    최신 아님 <RefreshCw size={10} className="animate-spin" />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="header-right-tools shrink-0 ml-2">
          <button className="settings-btn shrink-0" onClick={onOpenSettings}>⚙️</button>
        </div>
      </div>

      <div className="group-controls-container">
        <div className="w-full overflow-x-auto hide-scrollbar pb-2">
          <div className="left-btn-row flex-nowrap w-max">
            <button onClick={addGroup} className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 sm:px-4 rounded-md font-bold transition-colors whitespace-nowrap text-xs sm:text-sm">➕ 그룹 추가</button>
            <button onClick={() => { 
              if(groups.length > 1) removeGroup(groups[groups.length-1].id); 
              else alert('최소 1개의 그룹은 있어야 합니다.'); 
            }} className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 sm:px-4 rounded-md font-bold transition-colors whitespace-nowrap text-xs sm:text-sm">➖ 그룹 삭제</button>
            
            <button 
              onClick={() => setAllTableMode(true)}
              className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isAllTable 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-slate-700 hover:bg-slate-800 text-white"
              }`}
            >
              📊 전체 표로 보기
            </button>
            <button 
              onClick={() => setAllTableMode(false)}
              className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isAllText 
                ? "bg-gray-600 text-white shadow-md" 
                : "bg-slate-700 hover:bg-slate-800 text-white"
              }`}
            >
              📝 전체 텍스트로 보기
            </button>
          </div>
          <div className="group-status-info whitespace-nowrap">(현재 <span id="group-count-display">{groups.length}</span>개 / 최대 10개)</div>
        </div>
        <div className="control-right-bulk shrink-0 mt-2 sm:mt-0">
          <textarea 
            className="bulk-textarea focus:ring-2 focus:ring-purple-400 outline-none transition-all" 
            value={bulkInput} 
            onChange={(e) => setBulkInput(e.target.value)} 
            placeholder="여기에 모든 그룹의 강의를 한꺼번에 붙여넣으세요.&#10;(그룹 간에는 빈 줄 하나를 넣어 구분하세요)" 
          />
          <button className="bulk-distribute-btn hover:brightness-110 active:scale-95 transition-all whitespace-nowrap" onClick={handleDistribute}>⚡ 모든 그룹에 자동 배분</button>
        </div>
      </div>
    </>
  );
};

export default Top;
