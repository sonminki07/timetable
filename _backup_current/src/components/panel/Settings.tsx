import React, { useEffect, useState } from 'react';
import { useTimetableStore } from '../../store/useTimetableStore';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { resetAll } = useTimetableStore();
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
          <button 
            className="sidebar-btn-danger" 
            onClick={() => { if(confirm('모든 데이터를 초기화하시겠습니까?')) resetAll(); }}
          >
            🧨 데이터 전체 초기화
          </button>
        </div>
        <button 
          onClick={onClose} 
          style={{ marginTop: '50px', background: 'none', border: '1px solid var(--border)', width: '100%', padding: '10px', color: 'var(--text-gray)', borderRadius: '5px', cursor: 'pointer' }}
        >
          닫기
        </button>
      </div>
    </>
  );
};

export default Settings;
