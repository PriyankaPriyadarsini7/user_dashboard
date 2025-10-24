import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type ThemeState = { mode: "light" | "dark" };
const stored = localStorage.getItem("theme") as "light" | "dark" | null;
const initialState: ThemeState = { mode: stored ?? "light" };

const slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
      document.documentElement.classList.toggle("dark", state.mode === "dark");
    },
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
      localStorage.setItem("theme", state.mode);
      document.documentElement.classList.toggle("dark", state.mode === "dark");
    },
  },
});

export const { toggleTheme, setTheme } = slice.actions;
export default slice.reducer;
