import { Coupon } from "../types/auth";

export const PLAN_LIMITS = {
  free: {
    maxGroups: 6,
    maxSchedules: 50,
    aiRecommend: ['v1'],
    cloudSave: false,
    pdfExport: false,
    adFree: false,
    maxCloudTimetables: 0,
  },
  pro: {
    maxGroups: 20,
    maxSchedules: 50,
    aiRecommend: ['v1', 'v2'],
    cloudSave: true,
    pdfExport: true,
    adFree: true,
    maxCloudTimetables: 10,
  },
} as const;

// 기본 등록 가능 쿠폰 목록 (예시 및 테스트용)
export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "coupon-welcome-2026",
    code: "WELCOME2026",
    name: "신학기 웰컴 패키지 (VIP 3일 + AI 5회 + PDF 3회)",
    benefit_type: "hybrid",
    duration_days: 3,
    credits_grant: {
      ai_v2: 5,
      pdf_export: 3,
    },
    max_redemptions: 1000,
    current_redemptions: 12,
    is_active: true,
  },
  {
    id: "coupon-vip-7days",
    code: "VIP7DAYS",
    name: "중간고사 응원 7일 VIP 무제한 패스",
    benefit_type: "period",
    duration_days: 7,
    max_redemptions: 500,
    current_redemptions: 45,
    is_active: true,
  },
  {
    id: "coupon-ai-boost5",
    code: "AIBOOST5",
    name: "AI 테마별 추천 5회 무료 이용권",
    benefit_type: "credit",
    duration_days: 0,
    credits_grant: {
      ai_v2: 5,
    },
    max_redemptions: 2000,
    current_redemptions: 120,
    is_active: true,
  },
  {
    id: "coupon-ad-free14",
    code: "ADFREE14",
    name: "14일간 클린 브라우징 (광고 제거 패스)",
    benefit_type: "ad_free",
    duration_days: 14,
    max_redemptions: 3000,
    current_redemptions: 88,
    is_active: true,
  },
];
