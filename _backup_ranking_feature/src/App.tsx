import React, { useState, useEffect } from 'react';
import Top from './components/map/Top';
import Middle from './components/map/Middle';
import Bottom from './components/map/Bottom';
import Settings from './components/panel/Settings';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 초기 로딩 애니메이션 상태 제어
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`main-container analog-fade ${isLoaded ? 'loaded' : ''}`}>
      {/* ⚙️ 사이드바 패널 */}
      <Settings isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      {/* 🎓 헤더 및 그룹 컨트롤 */}
      <Top onOpenSettings={toggleSidebar} />

      {/* 📝 그룹 입력 영역 */}
      <Middle />

      {/* ⚙️ 필터 및 📊 결과 출력 */}
      <Bottom />
    </div>
  );
};

export default App;
