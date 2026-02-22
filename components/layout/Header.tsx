"use client";

import { Moon, Sun, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <header className="flex items-center justify-between py-6 px-4 mb-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500 rounded-lg shadow-blue-200 shadow-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            시간표 <span className="text-blue-500">생성기</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            당신에게 가장 적합한 시간표를 찾아드립니다
          </p>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-transparent dark:border-gray-700"
        aria-label="테마 전환"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}
