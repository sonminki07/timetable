import React from 'react';
import { ArrowLeft, BookOpen, Copy, Sparkles, Sliders, PlayCircle, Share2, Check, Zap } from 'lucide-react';

interface UserGuidePageProps {
  onBack: () => void;
}

const UserGuidePage: React.FC<UserGuidePageProps> = ({ onBack }) => {
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
          <span className="text-xs px-3 py-1 rounded-full bg-[var(--toss-blue-bg)] text-[var(--toss-blue)] font-extrabold flex items-center gap-1.5 border border-blue-200/30">
            <BookOpen size={13} /> 이용 가이드
          </span>
        </div>
      </header>

      {/* 📄 토스 스타일 메인 콘텐츠 */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6 my-4">
        {/* 히어로 헤더 카드 */}
        <div className="toss-card p-6 sm:p-8 flex items-center gap-5 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 border-blue-200/30">
          <div className="w-16 h-16 rounded-2xl bg-[var(--toss-blue)] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <BookOpen size={32} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--toss-blue-bg)] text-[var(--toss-blue)] text-xs font-bold mb-2">
              <Zap size={12} /> 초스피드 사용 설명서
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-dark)] tracking-tight">
              시간표 100% 가이드
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-gray)] mt-1">
              에브리타임 복사부터 AI 맞춤 추천, 📌 핀 고정까지 단 5단계로 시간표를 완성해 보세요.
            </p>
          </div>
        </div>

        {/* 5단계 가이드 카드 목록 */}
        <div className="flex flex-col gap-5">
          
          {/* Step 1 */}
          <div className="toss-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[var(--toss-blue)] font-black text-sm flex items-center justify-center">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-dark)] flex items-center gap-2">
                  <Copy size={18} className="text-blue-500" /> 강의 데이터 복사 & 일괄 자동 배분
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">Step 1</span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-gray)] leading-relaxed pl-12">
              에브리타임 수강신청 장바구니 페이지에서 과목 목록 전체를 복사(<code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-mono px-2 py-0.5 rounded-md font-bold text-xs">Ctrl + C</code>)합니다. 
              상단 우측 <strong>'⚡ 모든 그룹에 자동 배분'</strong> 창에 붙여넣으면 그룹 1~6에 과목별로 자동 분류됩니다.
            </p>
          </div>

          {/* Step 2 */}
          <div className="toss-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-black text-sm flex items-center justify-center">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-dark)] flex items-center gap-2">
                  <Sliders size={18} className="text-emerald-500" /> ↕ 드래그 우선순위 & 📌 핀 고정
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">Step 2</span>
            </div>

            <div className="pl-12 flex flex-col gap-2 text-xs sm:text-sm text-[var(--text-gray)]">
              <div className="toss-sub-card p-3.5 flex items-start gap-2.5">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-dark)]">📊 전체 표로 보기:</strong> 정갈한 표 모드로 전환되어 각 과목의 시간대와 강의실을 한눈에 파악할 수 있습니다.
                </div>
              </div>

              <div className="toss-sub-card p-3.5 flex items-start gap-2.5">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-dark)]">↕ 우선순위 정렬:</strong> 과목 왼쪽의 ↕ 핸들을 잡고 위로 올릴수록 선호 점수(+100점 등)가 더 높게 계산됩니다.
                </div>
              </div>

              <div className="toss-sub-card p-3.5 flex items-start gap-2.5">
                <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-dark)]">📌 강의 핀 고정:</strong> 반드시 듣고 싶은 필수 과목 분반은 우측 📌 핀 아이콘을 눌러 고정하세요.
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="toss-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 font-black text-sm flex items-center justify-center">
                  3
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-dark)] flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> 나만의 맞춤 필터 설정
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">Step 3</span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-gray)] pl-12 mb-1">
              하단 ⚙️ 필터 설정 영역에서 나의 라이프스타일에 맞춘 조건들을 자유롭게 적용할 수 있습니다.
            </p>

            <div className="pl-12 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
              <div className="toss-sub-card p-3.5 flex items-center gap-2 border border-[var(--border)]">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> 🚫 필수 공강 요일 지정 (월~금)
              </div>
              <div className="toss-sub-card p-3.5 flex items-center gap-2 border border-[var(--border)]">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> ⏰ 연강/우주공강 시간 제한
              </div>
              <div className="toss-sub-card p-3.5 flex items-center gap-2 border border-[var(--border)]">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> 🔥 무조건 최대 공강 우선 확보
              </div>
              <div className="toss-sub-card p-3.5 flex items-center gap-2 border border-[var(--border)]">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> 🍱 내맘대로 쉬는시간/점심시간
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="toss-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 font-black text-sm flex items-center justify-center">
                  4
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-dark)] flex items-center gap-2">
                  <PlayCircle size={18} className="text-purple-500" /> 시간표 생성 & AI 테마별 추천
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">Step 4</span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-gray)] leading-relaxed pl-12">
              하단 <strong>'시간표 생성'</strong> 버튼을 클릭하면 조합 가능한 알고리즘 중 가장 점수가 높은 <strong>Top 50개 시간표</strong>가 자동 정렬됩니다.
              <br />
              <span className="text-xs text-purple-600 dark:text-purple-400 font-extrabold mt-2 inline-block">
                🏆 뒹굴뒹굴(최대 공강), ⚖️ 황금 밸런스, 🍱 프로 밥러 3가지 테마별 맞춤 추천도 활용해 보세요!
              </span>
            </p>
          </div>

          {/* Step 5 */}
          <div className="toss-card p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 font-black text-sm flex items-center justify-center">
                  5
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-dark)] flex items-center gap-2">
                  <Share2 size={18} className="text-pink-500" /> URL 상태 공유 & 🎟️ 쿠폰 등록
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950 text-pink-600">Step 5</span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-gray)] leading-relaxed pl-12">
              설정(⚙️) 메뉴의 <strong>'URL로 내 설정 공유하기'</strong>를 눌러 친구에게 현재 내 입력값을 원클릭 공유할 수 있으며, 🎟️ <strong>쿠폰 등록</strong> 메뉴에서 혜택 코드를 입력하면 VIP 체험권이 적용됩니다.
            </p>
          </div>
        </div>

        {/* 하단 고 대비 토스 스타일 CTA 버튼 */}
        <button
          onClick={onBack}
          className="toss-btn-primary w-full py-4 text-base shadow-lg shadow-blue-500/25 mt-2"
        >
          확인했습니다! 시간표 만들러 가기
        </button>
      </main>
    </div>
  );
};

export default UserGuidePage;
