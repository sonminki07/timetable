import React, { useState } from 'react';
import { ArrowLeft, Ticket, CheckCircle2, AlertCircle, Gift, Sparkles, Crown } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* 🔝 상단 헤더 */}
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
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
            <Ticket size={13} /> 쿠폰 센터
          </span>
        </div>
      </header>

      {/* 📄 메인 콘텐츠 */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-6 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl flex flex-col gap-6 animate-in fade-in duration-300">
          
          {/* 헤더 타이틀 */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shadow-inner">
              <Ticket size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">프로모션 쿠폰 등록</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">쿠폰 코드를 입력하고 VIP 체험권 및 무료 혜택을 등록하세요.</p>
            </div>
          </div>

          {/* 회원 상태 요약 카드 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/40">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={16} /> 현재 회원 혜택 현황
              </span>
              {isPro && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm flex items-center gap-1">
                  <Crown size={12} /> Pro/VIP 패스 적용 중
                </span>
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 flex flex-col gap-1.5">
              <div>
                • <strong>VIP 만료일:</strong> {credits.vip_until ? new Date(credits.vip_until).toLocaleDateString() + ' 까지' : '적용된 기간제 패스 없음'}
              </div>
              <div>
                • <strong>AI v2 추천 남은 횟수:</strong> <span className="font-bold text-amber-600 dark:text-amber-400">{isPro ? '무제한 (Pro)' : `${credits.ai_v2_count}회`}</span>
              </div>
              <div>
                • <strong>PDF 내보내기 남은 횟수:</strong> <span className="font-bold text-amber-600 dark:text-amber-400">{isPro ? '무제한 (Pro)' : `${credits.pdf_export_count}회`}</span>
              </div>
            </div>
          </div>

          {/* 쿠폰 입력 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">쿠폰 코드 입력</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="예: WELCOME2026, VIP7DAYS"
                className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono uppercase font-bold text-base focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all active:scale-[0.98] shadow-md shadow-amber-500/20 whitespace-nowrap"
              >
                등록하기
              </button>
            </div>
          </form>

          {/* 메시지 처리 */}
          {message && (
            <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* 추천 이벤트 쿠폰 리스트 */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-5 flex flex-col gap-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Gift size={15} /> 바로 등록 가능한 이벤트 쿠폰
            </span>
            <div className="flex flex-col gap-2.5">
              {DEFAULT_COUPONS.map((c) => {
                const isUsed = usedCouponCodes.includes(c.code.toUpperCase());
                return (
                  <div 
                    key={c.id} 
                    className={`p-3.5 rounded-2xl border flex justify-between items-center transition-all ${
                      isUsed 
                        ? 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-60' 
                        : 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-900/50 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-mono text-[11px]">
                          {c.code}
                        </span>
                        {c.name}
                      </span>
                    </div>
                    <button
                      disabled={isUsed}
                      onClick={() => handleQuickApply(c.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isUsed 
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                          : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
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
