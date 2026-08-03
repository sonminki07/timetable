import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Profile, UserCredit } from "../types/auth";
import { DEFAULT_COUPONS } from "../config/plans";

interface AuthState {
  user: Profile | null;
  isLoggedIn: boolean;
  isPro: boolean;
  credits: UserCredit;
  usedCouponCodes: string[];

  // Actions
  loginWithSocial: (provider: 'kakao' | 'google') => void;
  logout: () => void;
  redeemCoupon: (code: string) => { success: boolean; message: string };
  useAiV2Credit: () => boolean;
  usePdfCredit: () => boolean;
  checkVipStatus: () => void;
}

const defaultCredits: UserCredit = {
  user_id: "guest",
  ai_v2_count: 0,
  pdf_export_count: 0,
  ad_free_until: null,
  vip_until: null,
  updated_at: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isPro: false,
      credits: defaultCredits,
      usedCouponCodes: [],

      loginWithSocial: (provider) => {
        const mockUser: Profile = {
          id: `user-${provider}-${Date.now()}`,
          email: `${provider}_user@example.com`,
          display_name: provider === 'kakao' ? '카카오 유저' : '구글 유저',
          avatar_url: '',
          role: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set({
          user: mockUser,
          isLoggedIn: true,
          isPro: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          isPro: false,
          credits: defaultCredits,
        });
      },

      redeemCoupon: (inputCode: string) => {
        const normalized = inputCode.trim().toUpperCase();
        const state = get();

        // 1. 이미 등록한 쿠폰인지 체크
        if (state.usedCouponCodes.includes(normalized)) {
          return { success: false, message: "이미 등록하신 쿠폰입니다." };
        }

        // 2. 존재하는 쿠폰인지 체크 (대소문자 무관)
        const coupon = DEFAULT_COUPONS.find(c => c.code.toUpperCase() === normalized);
        if (!coupon || !coupon.is_active) {
          return { success: false, message: "유효하지 않은 쿠폰 코드입니다. 코드를 다시 확인해 주세요." };
        }

        // 3. 선착순 마감 체크
        if (coupon.max_redemptions !== null && coupon.max_redemptions !== undefined) {
          if ((coupon.current_redemptions || 0) >= coupon.max_redemptions) {
            return { success: false, message: "아쉽게도 선착순 마감된 쿠폰입니다." };
          }
        }

        // 4. VIP 만료일 누적 연장 (피드백 반영)
        const currentVipUntil = state.credits.vip_until;
        let baseDate = new Date();
        if (typeof currentVipUntil === 'string' && new Date(currentVipUntil) > new Date()) {
          baseDate = new Date(currentVipUntil);
        }

        let newVipUntil = state.credits.vip_until;
        if (coupon.duration_days && coupon.duration_days > 0) {
          baseDate.setDate(baseDate.getDate() + coupon.duration_days);
          newVipUntil = baseDate.toISOString();
        }

        // 크레딧 합산
        const addedAi = coupon.credits_grant?.ai_v2 || 0;
        const addedPdf = coupon.credits_grant?.pdf_export || 0;

        const newCredits: UserCredit = {
          ...state.credits,
          vip_until: newVipUntil,
          ai_v2_count: state.credits.ai_v2_count + addedAi,
          pdf_export_count: state.credits.pdf_export_count + addedPdf,
          updated_at: new Date().toISOString(),
        };

        const isNowPro = typeof newVipUntil === 'string' && new Date(newVipUntil) > new Date();

        set({
          usedCouponCodes: [...state.usedCouponCodes, normalized],
          credits: newCredits,
          isPro: isNowPro || (state.user?.role === 'pro'),
        });

        return {
          success: true,
          message: `🎉 '${coupon.name}' 혜택이 성공적으로 등록되었습니다!`,
        };
      },

      useAiV2Credit: () => {
        const { isPro, credits } = get();
        if (isPro) return true; // VIP는 무제한
        if (credits.ai_v2_count > 0) {
          set({
            credits: {
              ...credits,
              ai_v2_count: credits.ai_v2_count - 1,
            },
          });
          return true;
        }
        return false;
      },

      usePdfCredit: () => {
        const { isPro, credits } = get();
        if (isPro) return true; // VIP는 무제한
        if (credits.pdf_export_count > 0) {
          set({
            credits: {
              ...credits,
              pdf_export_count: credits.pdf_export_count - 1,
            },
          });
          return true;
        }
        return false;
      },

      checkVipStatus: () => {
        const { credits, user } = get();
        if (user?.role === 'pro') {
          set({ isPro: true });
          return;
        }
        if (typeof credits.vip_until === 'string' && new Date(credits.vip_until) > new Date()) {
          set({ isPro: true });
        } else {
          set({ isPro: false });
        }
      },
    }),
    {
      name: "timetable-auth-storage",
    }
  )
);
