import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface UserGuidePageProps {
  onBack: () => void;
}

const UserGuidePage: React.FC<UserGuidePageProps> = ({ onBack }) => {
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
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
            <BookOpen size={13} /> 이용 가이드
          </span>
        </div>
      </header>

      {/* 📄 메인 가이드 콘텐츠 */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6 my-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10 shadow-xl flex flex-col gap-8 animate-in fade-in duration-300">
          
          {/* 헤더 */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-inner">
              <BookOpen size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">📖 서비스 사용 설명서</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">시간표 자동 생성기 완전 100% 활용 가이드</p>
            </div>
          </div>

          {/* 가이드 카드 목록 */}
          <div className="flex flex-col gap-6 text-sm text-gray-600 dark:text-gray-300">
            
            {/* Step 1 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs flex items-center justify-center font-black">1</span>
                강의 데이터 복사 & 붙여넣기
              </div>
              <p className="leading-relaxed text-sm">
                에브리타임 수강신청 장바구니 페이지에서 과목 목록을 전체 드래그하여 복사(<code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl+C</code>)한 뒤 각 그룹 박스에 붙여넣습니다. 상단 우측 <strong>'일괄 자동 배분'</strong>에 전체 텍스트를 넣으면 자동으로 그룹 1~6에 분할됩니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 text-xs flex items-center justify-center font-black">2</span>
                드래그 우선순위 & 📌 핀 고정
              </div>
              <ul className="list-disc pl-5 flex flex-col gap-2 leading-relaxed text-sm">
                <li><strong>리스트 보기 (표 모드)</strong>: 상단 버튼을 누르면 정갈한 표 UI로 전환됩니다.</li>
                <li><strong>↕ 순서 변경</strong>: ↕ 아이콘을 잡고 드래그하여 상단에 배치할수록 우선순위 가점(+100점 등)이 부여됩니다.</li>
                <li><strong>📌 강의 고정</strong>: 꼭 듣고 싶은 분반 우측의 핀 버튼을 누르면, 해당 그룹에서는 고정된 수업만 조합 탐색합니다.</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 text-xs flex items-center justify-center font-black">3</span>
                맞춤형 추천 필터 설정
              </div>
              <p className="leading-relaxed text-sm">
                하단 ⚙️ 필터 설정에서 나만의 맞춤 조건을 세팅하세요:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">🚫 필수 공강 요일 지정</div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">⏰ 우주공강/연강 제한</div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">🔥 무조건 최대 공강 확보</div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">🍱 내맘대로 점심/쉬는시간</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 text-xs flex items-center justify-center font-black">4</span>
                시간표 생성 & AI 추천 모드
              </div>
              <p className="leading-relaxed text-sm">
                <strong>시간표 생성</strong> 클릭 시 점수가 가장 높은 <strong>Top 50개 시간표</strong>를 정렬해 줍니다. 
                <br />
                <span className="text-xs text-purple-500 font-semibold">🏆 뒹굴뒹굴(최대 공강), ⚖️ 황금 밸런스, 🍱 프로 밥러</span> 테마별 추천 기능을 활용해 가장 마음에 드는 시간표를 선택하세요.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-pink-600 dark:text-pink-400 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 text-xs flex items-center justify-center font-black">5</span>
                공유 & 쿠폰 등록 🎟️
              </div>
              <p className="leading-relaxed text-sm">
                설정(⚙️) 메뉴의 <strong>'URL로 내 설정 공유하기'</strong>로 친구에게 공유할 수 있으며, 🎟️ <strong>쿠폰 등록</strong> 메뉴에서 이벤트 코드를 입력하면 VIP 체험권 및 무료 혜택이 적용됩니다!
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 mt-2"
          >
            확인했습니다! 바로 시간표 만들기
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserGuidePage;
