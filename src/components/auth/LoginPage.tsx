import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, LogIn, LogOut, User, Sparkles, Crown, Ticket, Calendar, Mail, Clock, CheckCircle2, Zap } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col transition-colors duration-200">
      {/* 🔝 상단 네비게이션 헤더 */}
      <header className="w-full bg-[var(--bg-card)] border-b border-[var(--border)] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--toss-sub-bg)] hover:bg-[var(--border)] text-[var(--text-dark)] font-bold text-sm transition-all active:scale-95 border border-[var(--border)]"
        >
          <ArrowLeft size={18} className="text-[var(--toss-blue)]" />
          <span>시간표 제작기로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-lg font-black tracking-tight">🎓 시간표 제작기</span>
          <span className="text-xs px-3 py-1 rounded-full bg-[var(--toss-blue-bg)] text-[var(--toss-blue)] font-extrabold flex items-center gap-1.5 border border-blue-200/30">
            <User size={13} /> {isLoggedIn ? '내 프로필' : '로그인'}
          </span>
        </div>
      </header>

      {/* 📄 메인 콘텐츠 */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center my-4">
        {isLoggedIn && user ? (
          /* ─── 1. 로그인 완료 상태: 토스 스타일 프로필 & 계정 관리 카드 ─── */
          <div className="toss-card w-full p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
            {/* 프로필 정보 */}
            <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/25 shrink-0">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[var(--text-dark)]">{user.display_name}</h2>
                  {isPro && (
                    <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                      <Crown size={12} /> PRO
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-gray)] mt-1 font-medium">
                  <Mail size={13} />
                  {user.email}
                </div>
              </div>
            </div>

            {/* 멤버십 상태 정보 카드 */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isPro 
                ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border-amber-300/40' 
                : 'toss-sub-card border-[var(--border)]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={16} /> 서비스 멤버십
                </span>
                {isPro && isVipActive && (
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm">
                    VIP D-{daysRemaining}
                  </span>
                )}
              </div>
              <p className="text-sm font-extrabold text-[var(--text-dark)]">
                {isPro ? '🎉 Pro / VIP 멤버십이 정상 적용되어 있습니다.' : '기본 Free 요금제를 이용 중입니다.'}
              </p>
            </div>

            {/* 보유 혜택 현황 */}
            <div className="toss-sub-card p-5 border border-[var(--border)] flex flex-col gap-3">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Ticket size={14} /> 보유 혜택 및 크레딧
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--text-gray)] flex items-center gap-2 font-medium">
                    <Calendar size={15} className="text-[var(--toss-blue)]" /> VIP 만료 일자
                  </span>
                  <span className="font-bold text-[var(--text-dark)]">
                    {isVipActive ? formatDate(credits.vip_until) : '미적용 (쿠폰 등록 필요)'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--text-gray)] flex items-center gap-2 font-medium">
                    <Sparkles size={15} className="text-purple-500" /> AI v2 추천 잔여
                  </span>
                  <span className="font-bold text-[var(--text-dark)]">
                    {isPro ? '무제한 (Pro)' : `${credits.ai_v2_count}회`}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[var(--text-gray)] flex items-center gap-2 font-medium">
                    <Clock size={15} className="text-emerald-500" /> PDF 내보내기 잔여
                  </span>
                  <span className="font-bold text-[var(--text-dark)]">
                    {isPro ? '무제한 (Pro)' : `${credits.pdf_export_count}회`}
                  </span>
                </div>
              </div>

              {onNavigateToCoupon && (
                <button
                  onClick={onNavigateToCoupon}
                  className="mt-2 w-full py-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Ticket size={14} /> 🎟️ 쿠폰 등록하러 가기
                </button>
              )}
            </div>

            {/* 안전 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              <LogOut size={18} className={isLoggingOut ? 'animate-spin' : ''} />
              {isLoggingOut ? '로그아웃 처리 중...' : '안전하게 로그아웃'}
            </button>

            <p className="text-xs text-center text-[var(--text-muted)]">
              로그아웃하셔도 작성하신 시간표 데이터는 브라우저에 보존됩니다.
            </p>
          </div>
        ) : (
          /* ─── 2. 미로그인 상태: 소셜 로그인 전용 토스 스타일 카드 ─── */
          <div className="toss-card w-full p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
            {/* 타이틀 영역 */}
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-[var(--toss-blue-bg)] text-[var(--toss-blue)] flex items-center justify-center shadow-inner mb-1">
                <LogIn size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-dark)] tracking-tight">
                소셜 로그인 / 회원가입
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-gray)]">
                실명 인증 1인 1계정으로 내 시간표를 안전하게 관리하세요.
              </p>
            </div>

            {/* 보안 안내 뱃지 */}
            <div className="flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800">
              <ShieldCheck size={22} className="shrink-0 text-emerald-500" />
              <span className="font-semibold">실명 인증된 카카오/구글 계정 1개당 단 1개의 프로필이 생성됩니다.</span>
            </div>

            {/* 회원 혜택 리스트 */}
            <div className="toss-sub-card p-5 border border-[var(--border)]">
              <h3 className="text-xs font-bold text-[var(--text-blue)] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap size={14} /> 회원 전용 혜택
              </h3>
              <ul className="text-xs sm:text-sm text-[var(--text-gray)] space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--toss-blue)]" />
                  <span>나만의 시간표 클라우드 안전 저장 & 동기화</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--toss-blue)]" />
                  <span>🎟️ 프로모션 쿠폰 등록 및 VIP 체험권 이용</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--toss-blue)]" />
                  <span>AI 테마별 맞춤 추천 시간표 기능 이용</span>
                </li>
              </ul>
            </div>

            {/* 소셜 로그인 버튼 세트 */}
            <div className="flex flex-col gap-3.5 pt-2">
              {/* 카카오 로그인 */}
              <button
                onClick={() => handleLogin('kakao')}
                className="w-full py-4 px-5 rounded-2xl bg-[#FEE500] text-[#191919] font-extrabold text-base flex items-center justify-center gap-3 hover:bg-[#FADA00] active:scale-[0.98] transition-all shadow-md"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.492.18.486.38.354.157-.104 2.502-1.7 3.516-2.39.52.077 1.058.117 1.614.117 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z"/>
                </svg>
                카카오로 3초 만에 시작하기
              </button>

              {/* 구글 로그인 */}
              <button
                onClick={() => handleLogin('google')}
                className="w-full py-4 px-5 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-extrabold text-base flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all shadow-md"
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

            <p className="text-xs text-center text-[var(--text-muted)] mt-2">
              비회원 상태에서도 시간표 기능은 제한 없이 100% 무료로 사용하실 수 있습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginPage;
