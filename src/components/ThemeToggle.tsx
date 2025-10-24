import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { toggleTheme } from "../features/theme/themeSlice";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  // Trigger rotate + scale animation on theme change
  useEffect(() => {
    setAnimating(true);
    const timeout = setTimeout(() => setAnimating(false), 500); // match duration
    return () => clearTimeout(timeout);
  }, [mode]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="
        px-4 py-2
        rounded-full
        bg-white dark:bg-gray-800
        shadow-md dark:shadow-lg
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      "
      title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
    >
      <span
        className={`
          text-xl
          transition-transform duration-500
          ${animating ? "rotate-180 scale-125" : ""}
        `}
      >
        {mode === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
