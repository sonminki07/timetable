import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "가톨릭대 시간표 분석기 V8",
  description: "최적의 시간표를 자동으로 생성해주는 프로그램입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 테마 깜빡임 방지용 즉시 실행 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
