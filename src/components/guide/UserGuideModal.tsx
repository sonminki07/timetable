import React from 'react';
import { X, BookOpen } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">📖 서비스 사용 설명서</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">시간표 자동 생성기 완전 100% 활용 가이드</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 안내 단계별 아코디언/카드 */}
        <div className="flex flex-col gap-5 text-sm text-gray-600 dark:text-gray-300">
          {/* Step 1 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-2 text-base">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs flex items-center justify-center">1</span>
              강의 데이터 복사 & 붙여넣기
            </div>
            <p className="leading-relaxed">
              에브리타임 수강신청 장바구니 페이지에서 과목 목록을 전체 드래그하여 복사(<code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">Ctrl+C</code>)한 뒤 각 그룹 박스에 붙여넣습니다. 상단 우측 <strong>'일괄 자동 배분'</strong>에 전체 텍스트를 넣으면 자동으로 그룹 1~6에 분할됩니다.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2 text-base">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 text-xs flex items-center justify-center">2</span>
              드래그 우선순위 & 📌 핀 고정
            </div>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 leading-relaxed">
              <li><strong>리스트 보기 (표 모드)</strong>: 상단 버튼을 누르면 정갈한 표 UI로 전환됩니다.</li>
              <li><strong>↕ 순서 변경</strong>: ↕ 아이콘을 잡고 드래그하여 상단에 배치할수록 우선순위 가점(+100점 등)이 부여됩니다.</li>
              <li><strong>📌 강의 고정</strong>: 꼭 듣고 싶은 분반 우측의 핀 버튼을 누르면, 해당 그룹에서는 고정된 수업만 조합 탐색합니다.</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-2 text-base">
              <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 text-xs flex items-center justify-center">3</span>
              맞춤형 추천 필터 설정
            </div>
            <p className="leading-relaxed mb-2">
              하단 ⚙️ 필터 설정에서 나만의 맞춤 조건을 세팅하세요:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">🚫 필수 공강 요일 지정</div>
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">⏰ 우주공강/연강 제한</div>
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">🔥 무조건 최대 공강 확보</div>
              <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">🍱 내맘대로 점심/쉬는시간</div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold mb-2 text-base">
              <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 text-xs flex items-center justify-center">4</span>
              시간표 생성 & AI 추천 모드
            </div>
            <p className="leading-relaxed">
              <strong>시간표 생성</strong> 클릭 시 점수가 가장 높은 <strong>Top 50개 시간표</strong>를 정렬해 줍니다. 
              <br />
              <span className="text-xs text-purple-500 font-semibold">🏆 뒹굴뒹굴(최대 공강), ⚖️ 황금 밸런스, 🍱 프로 밥러</span> 테마별 추천 기능을 활용해 가장 마음에 드는 시간표를 선택하세요.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60">
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold mb-2 text-base">
              <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 text-xs flex items-center justify-center">5</span>
              공유 & 쿠폰 등록 🎟️
            </div>
            <p className="leading-relaxed">
              설정(⚙️) 메뉴의 <strong>'URL로 내 설정 공유하기'</strong>로 친구에게 공유할 수 있으며, 🎟️ <strong>쿠폰 등록</strong> 메뉴에서 이벤트 코드를 입력하면 VIP 체험권 및 무료 혜택이 적용됩니다!
            </p>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
        >
          확인했습니다! 바로 시간표 만들기
        </button>
      </div>
    </div>
  );
};

export default UserGuideModal;
