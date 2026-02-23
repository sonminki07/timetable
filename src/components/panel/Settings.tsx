import React, { useEffect, useState } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';
import { ChevronDown, Trash2 } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { resetAll, settings, updateSettings } = useTimetableStore();
  const [theme, setTheme] = useState('light');

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
    </>
  );
};

export default Settings;
