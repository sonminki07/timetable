import React, { useState, useEffect } from 'react';
import Top from './components/map/Top';
import Middle from './components/map/Middle';
import Bottom from './components/map/Bottom';
import Settings from './components/panel/Settings';
import LoginPage from './components/auth/LoginPage';
import CouponPage from './components/coupon/CouponPage';
import UserGuidePage from './components/guide/UserGuidePage';
import LZString from 'lz-string';
import { useTimetableStore } from './store/useTimetableStore';
import { useAuthStore } from './store/useAuthStore';

type PageType = 'main' | 'login' | 'coupon' | 'guide';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 앱 마운트 시 VIP 만료 여부 자동 검증 (Nielsen: Visibility of System Status)
    useAuthStore.getState().checkVipStatus();

    // 초기 로딩 애니메이션 상태 제어
    const timer = setTimeout(() => setIsLoaded(true), 150);
    
    // URL 데이터 파싱 및 복원
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(data);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.groups || parsed.settings) {
            useTimetableStore.setState((state) => ({
              ...state,
              groups: parsed.groups || state.groups,
              settings: parsed.settings || state.settings,
              hasRun: false
            }));
            // URL 정리 (새로고침 시 다시 덮어씌워지지 않도록)
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch(e) {
        console.error("Failed to parse shared data:", e);
      }
    }
    
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ─── 1. 독립된 로그인 / 프로필 전용 페이지 ───
  if (currentPage === 'login') {
    return (
      <LoginPage 
        onBack={() => setCurrentPage('main')} 
        onNavigateToCoupon={() => setCurrentPage('coupon')}
      />
    );
  }

  // ─── 2. 독립된 쿠폰 등록 전용 페이지 ───
  if (currentPage === 'coupon') {
    return (
      <CouponPage 
        onBack={() => setCurrentPage('main')} 
      />
    );
  }

  // ─── 3. 독립된 이용 가이드 전용 페이지 ───
  if (currentPage === 'guide') {
    return (
      <UserGuidePage 
        onBack={() => setCurrentPage('main')} 
      />
    );
  }

  // ─── 4. 메인 시간표 생성기 페이지 ───
  return (
    <div className={`main-container analog-fade ${isLoaded ? 'loaded' : ''}`}>
      {/* ⚙️ 사이드바 패널 */}
      <Settings isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      {/* 🎓 헤더 및 그룹 컨트롤 (페이지 전환 함수 전달) */}
      <Top onOpenSettings={toggleSidebar} onNavigate={(page) => setCurrentPage(page)} />

      {/* 📝 그룹 입력 영역 */}
      <Middle />

      {/* ⚙️ 필터 및 📊 결과 출력 */}
      <Bottom />
    </div>
  );
};

export default App;

