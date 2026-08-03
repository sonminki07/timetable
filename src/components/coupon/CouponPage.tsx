import React, { useState } from 'react';
import { ArrowLeft, Ticket, CheckCircle2, AlertCircle, Gift, Sparkles, Crown, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { DEFAULT_COUPONS } from '../../config/plans';

interface CouponPageProps {
  onBack: () => void;
}

const CouponPage: React.FC<CouponPageProps> = ({ onBack }) => {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { redeemCoupon, usedCouponCodes, isPro, credits } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: '쿠폰 코드를 입력해 주세요.' });
      return;
    }

    const res = redeemCoupon(couponCode);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setCouponCode('');
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleQuickApply = (code: string) => {
    setCouponCode(code);
    const res = redeemCoupon(code);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col transition-colors duration-200">
      {/* 🔝 토스 스타일 상단 네비게이션 헤더 */}
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
          <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1.5 border border-amber-200/40">
            <Ticket size={13} /> 쿠폰 센터
          </span>
        </div>
      </header>

      {/* 📄 메인 콘텐츠 */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-4 gap-6">
        <div className="toss-card w-full p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* 타이틀 히어로 */}
          <div className="flex items-center gap-4 pb-5 border-b border-[var(--border)]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Ticket size={32} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-bold mb-1">
                <Zap size={11} /> 프로모션 & VIP
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-dark)] tracking-tight">
                쿠폰 등록
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-gray)]">
                쿠폰 코드를 입력하고 VIP 체험권 및 무료 혜택을 받으세요.
              </p>
            </div>
          </div>

          {/* 회원 혜택 상태 카드 */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 p-5 rounded-2xl border border-amber-300/40">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={16} /> 현재 내 혜택 잔액
              </span>
              {isPro && (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm flex items-center gap-1">
                  <Crown size={12} /> Pro/VIP 적용 중
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--text-gray)] flex flex-col gap-1.5 font-medium">
              <div>
                • <strong>VIP 만료 일자:</strong> {credits.vip_until ? new Date(credits.vip_until).toLocaleDateString() + ' 까지' : '적용된 기간제 패스 없음'}
              </div>
              <div>
                • <strong>AI v2 추천 잔여:</strong> <span className="font-extrabold text-amber-600 dark:text-amber-400">{isPro ? '무제한 (Pro)' : `${credits.ai_v2_count}회`}</span>
              </div>
              <div>
                • <strong>PDF 내보내기 잔여:</strong> <span className="font-extrabold text-amber-600 dark:text-amber-400">{isPro ? '무제한 (Pro)' : `${credits.pdf_export_count}회`}</span>
              </div>
            </div>
          </div>

          {/* 쿠폰 입력 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs font-extrabold text-[var(--text-dark)] uppercase tracking-wider">쿠폰 코드 입력</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="예: WELCOME2026, VIP7DAYS"
                className="flex-1 px-4 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-dark)] font-mono uppercase font-black text-base focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm transition-all active:scale-[0.98] shadow-md shadow-amber-500/25 whitespace-nowrap"
              >
                등록하기
              </button>
            </div>
          </form>

          {/* 결과 메시지 노출 */}
          {message && (
            <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* 이벤트 쿠폰 라이브러리 */}
          <div className="border-t border-[var(--border)] pt-5 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-[var(--text-muted)] flex items-center gap-1.5 uppercase tracking-wider">
              <Gift size={15} /> 즉시 적용 가능한 이벤트 쿠폰
            </span>
            <div className="flex flex-col gap-3">
              {DEFAULT_COUPONS.map((c) => {
                const isUsed = usedCouponCodes.includes(c.code.toUpperCase());
                return (
                  <div 
                    key={c.id} 
                    className={`toss-sub-card p-4 border flex justify-between items-center transition-all ${
                      isUsed 
                        ? 'border-[var(--border)] opacity-60' 
                        : 'border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-xs text-[var(--text-dark)] flex items-center gap-2">
                        <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-black">
                          {c.code}
                        </span>
                        {c.name}
                      </span>
                    </div>
                    <button
                      disabled={isUsed}
                      onClick={() => handleQuickApply(c.code)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                        isUsed 
                          ? 'bg-gray-200 dark:bg-gray-700 text-[var(--text-muted)] cursor-not-allowed' 
                          : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200 shadow-sm'
                      }`}
                    >
                      {isUsed ? '등록 완료' : '바로 등록'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CouponPage;
