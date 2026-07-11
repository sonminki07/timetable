import React, { useEffect, useState } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { ChevronDown, Trash2, Share2, FileText, X } from 'lucide-react';
import LZString from 'lz-string';
import { changelog } from '../../config/changelog';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { resetAll, settings, updateSettings, groups } = useTimetableStore();
  const [theme, setTheme] = useState('light');
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay open" onClick={onClose}></div>
      <div className="sidebar open">
        <h2 className="flex items-center gap-2">
          ⚙️ 환경 설정
        </h2>

        <div className="sidebar-item">
          <p className="font-bold mb-3">학교 선택</p>
          <select 
            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.university || 'catholic'}
            onChange={(e) => updateSettings({ university: e.target.value as 'catholic' | 'hanshin' })}
          >
            <option value="catholic">가톨릭대학교 (기본)</option>
            <option value="hanshin">한신대학교</option>
          </select>
          <p className="text-[11px] text-gray-400 mt-2">
            * 학교를 변경하면 입력된 텍스트 파싱 방식이 달라집니다.
          </p>
        </div>
        
        <div className="sidebar-item border-t border-gray-100 dark:border-gray-700 pt-5 mt-5">
          <p className="font-bold mb-3">테마 설정</p>
          <button 
            className={`sidebar-btn-primary ${theme === 'light' ? 'theme-btn-light' : 'theme-btn-dark'}`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙 다크 모드 전환' : '☀️ 라이트 모드 전환'}
          </button>
        </div>

        <div className="sidebar-item border-t border-gray-100 dark:border-gray-700 pt-5 mt-5">
          <p className="font-bold mb-3 text-blue-600 dark:text-blue-400">네트워크</p>
          <button 
            className="w-full py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors flex items-center justify-center gap-2"
            onClick={() => {
              const dataToShare = {
                groups: groups.map(g => ({ id: g.id, text: g.text, useRank: g.useRank })),
                settings: settings
              };
              const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(dataToShare));
              const url = `${window.location.origin}${window.location.pathname}?data=${compressed}`;
              navigator.clipboard.writeText(url).then(() => {
                alert('현재 설정과 강의 데이터가 포함된 공유 링크가 클립보드에 복사되었습니다!\n친구에게 이 링크를 보내면 현재 상태 그대로 복원됩니다.');
              }).catch(() => {
                alert('링크 복사에 실패했습니다. 권한을 확인해주세요.');
              });
            }}
          >
            <Share2 size={16} /> URL로 내 설정 공유하기
          </button>
        </div>

        <div className="sidebar-item border-t border-gray-100 dark:border-gray-700 pt-5 mt-5">
          <p className="font-bold mb-3 text-emerald-600 dark:text-emerald-400">업데이트 내역</p>
          <button 
            className="w-full py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors flex items-center justify-center gap-2"
            onClick={() => setIsChangelogOpen(true)}
          >
            <FileText size={16} /> 📜 패치 노트 보기
          </button>
        </div>

        <div className="sidebar-item border-t border-gray-100 dark:border-gray-700 pt-5 mt-10">
          <p className="font-bold mb-3 text-red-500">위험 구역</p>
          <button 
            className="sidebar-btn-danger flex items-center justify-center gap-2" 
            onClick={() => { if(confirm('모든 데이터를 초기화하시겠습니까?')) resetAll(); }}
          >
            <Trash2 size={16} /> 데이터 전체 초기화
          </button>
        </div>

        <button 
          onClick={onClose} 
          className="mt-10 border border-gray-200 dark:border-gray-700 w-full py-3 text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-bold"
        >
          <ChevronDown size={18} /> 설정 닫기
        </button>
      </div>

      {/* 패치 노트 모달 */}
      {isChangelogOpen && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4" onClick={() => setIsChangelogOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><FileText className="text-emerald-500" /> 패치 노트</h2>
              <button onClick={() => setIsChangelogOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {changelog.map((note, idx) => (
                <div key={idx} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{note.version}</h3>
                    <span className="text-sm text-gray-400 font-medium">{note.date}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{note.title}</h4>
                  <ul className="list-disc pl-5 flex flex-col gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    {note.changes.map((change, cIdx) => (
                      <li key={cIdx} className="leading-relaxed">{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
