import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, LogIn, LogOut, User, Sparkles, Crown, Ticket, Calendar, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface LoginPageProps {
  onBack: () => void;
  onNavigateToCoupon?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onNavigateToCoupon }) => {
  const { loginWithSocial, logout, user, isLoggedIn, isPro, credits } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = (provider: 'kakao' | 'google') => {
    loginWithSocial(provider);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
    }, 400);
  };

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '없음';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '없음';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const isVipActive = typeof credits.vip_until === 'string' && new Date(credits.vip_until) > new Date();
  const daysRemaining = isVipActive 
    ? Math.ceil((new Date(credits.vip_until!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* 🔝 상단 네비게이션 헤더 */}
      <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm transition-all"
        >
          <ArrowLeft size={18} />
          <span>시간표 제작기로 돌아가기</span>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">🎓 시간표 제작기</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">
            {isLoggedIn ? '내 계정' : '로그인'}
          </span>
        </div>
      </header>

      {/* 📄 독립된 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center my-6">
        {isLoggedIn && user ? (
          /* ─── 1. 로그인 상태: 프로필 & 계정 관리 전용 페이지 ─── */
          <div className="w-full bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl flex flex-col gap-6 animate-in fade-in duration-300">
            {/* 프로필 서두 */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.display_name}</h2>
                  {isPro && (
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                      <Crown size={12} /> PRO
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Mail size={13} />
                  {user.email}
                </div>
              </div>
            </div>

            {/* 멤버십 상태 카드 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isPro 
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border-amber-200 dark:border-amber-800' 
                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles size={16} /> 현재 서비스 요금제
                </span>
                {isPro && isVipActive && (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm">
                    VIP D-{daysRemaining}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {isPro ? '🎉 Pro / VIP 멤버십이 정상 활성화되어 있습니다.' : '기본 Free 요금제를 이용 중입니다.'}
              </p>
            </div>

            {/* 보유 혜택 리스트 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket size={14} /> 보유 혜택 현황
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-gray-200/50 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Calendar size={15} className="text-blue-500" /> VIP 만료 일자
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {isVipActive ? formatDate(credits.vip_until) : '미적용 (쿠폰 등록 필요)'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-gray-200/50 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles size={15} className="text-purple-500" /> AI v2 추천 남은 횟수
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {isPro ? '무제한 (Pro)' : `${credits.ai_v2_count}회`}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Clock size={15} className="text-emerald-500" /> PDF 내보내기 남은 횟수
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {isPro ? '무제한 (Pro)' : `${credits.pdf_export_count}회`}
                  </span>
                </div>
              </div>

              {onNavigateToCoupon && (
                <button
                  onClick={onNavigateToCoupon}
                  className="mt-2 w-full py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ticket size={14} /> 🎟️ 쿠폰 등록하러 가기
                </button>
              )}
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              <LogOut size={18} className={isLoggingOut ? 'animate-spin' : ''} />
              {isLoggingOut ? '로그아웃 처리 중...' : '안전하게 로그아웃'}
            </button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              로그아웃하셔도 기존에 작성한 시간표 데이터는 브라우저에 안전하게 보존됩니다.
            </p>
          </div>
        ) : (
          /* ─── 2. 미로그인 상태: 소셜 로그인 전용 페이지 ─── */
          <div className="w-full bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl flex flex-col gap-6 animate-in fade-in duration-300">
            {/* 타이틀 */}
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner mb-1">
                <LogIn size={28} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">소셜 로그인 / 회원가입</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                실명 인증 1인 1계정으로 내 시간표를 클라우드에 안전하게 보관하세요.
              </p>
            </div>

            {/* 보안 안내 */}
            <div className="flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck size={20} className="shrink-0" />
              <span>실명 인증된 카카오/구글 계정 1개당 단 1개의 프로필이 생성됩니다.</span>
            </div>

            {/* 회원 혜택 카드 */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40">
              <h3 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> 회원 전용 혜택
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1.5">
                <li>• 나만의 시간표 무제한 클라우드 저장 & 다중 기기 동기화</li>
                <li>• 🎟️ 이벤트 프로모션 쿠폰 등록 및 VIP 체험권 이용</li>
                <li>• AI 테마별 맞춤 추천 시간표 기능 이용</li>
              </ul>
            </div>

            {/* 소셜 로그인 버튼 */}
            <div className="flex flex-col gap-3.5 pt-2">
              {/* 카카오 로그인 */}
              <button
                onClick={() => handleLogin('kakao')}
                className="w-full py-4 px-5 rounded-2xl bg-[#FEE500] text-[#191919] font-bold text-base flex items-center justify-center gap-3 hover:bg-[#FADA00] active:scale-[0.98] transition-all shadow-md"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.492.18.486.38.354.157-.104 2.502-1.7 3.516-2.39.52.077 1.058.117 1.614.117 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z"/>
                </svg>
                카카오로 3초 만에 시작하기
              </button>

              {/* 구글 로그인 */}
              <button
                onClick={() => handleLogin('google')}
                className="w-full py-4 px-5 rounded-2xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-bold text-base flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-[0.98] transition-all shadow-md"
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Google 계정으로 계속하기
              </button>
            </div>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
              로그인 없이 비회원으로도 모든 시간표 생성 기능을 자유롭게 이용하실 수 있습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginPage;
