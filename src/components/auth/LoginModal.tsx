import React from 'react';
import { X, ShieldCheck, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithSocial } = useAuthStore();

  if (!isOpen) return null;

  const handleLogin = (provider: 'kakao' | 'google') => {
    loginWithSocial(provider);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <LogIn size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">소셜 로그인</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">1인 1계정 인증 후 클라우드 저장</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="flex flex-col gap-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={18} />
            <span>실명 인증 계정당 1개만 생성됩니다.</span>
          </div>
          <p className="leading-relaxed">
            로그인하시면 나만의 시간표를 클라우드에 안전하게 저장하고, 친구와 공유하거나 프리미엄 기능을 사용할 수 있습니다.
          </p>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="flex flex-col gap-3">
          {/* 카카오 로그인 */}
          <button
            onClick={() => handleLogin('kakao')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FEE500] text-[#191919] font-bold flex items-center justify-center gap-3 hover:bg-[#FADA00] transition-colors shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.492.18.486.38.354.157-.104 2.502-1.7 3.516-2.39.52.077 1.058.117 1.614.117 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z"/>
            </svg>
            카카오로 3초 만에 시작하기
          </button>

          {/* 구글 로그인 */}
          <button
            onClick={() => handleLogin('google')}
            className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-bold flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Google 계정으로 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
