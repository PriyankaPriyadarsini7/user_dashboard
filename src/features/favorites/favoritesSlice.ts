import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../users/types";

type FavState = { list: User[] };
const stored = localStorage.getItem("favorites");
const initialState: FavState = { list: stored ? JSON.parse(stored) : [] };

const slice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<User>) {
      const user = action.payload;
      const exists = state.list.some((u) => u.id === user.id);
      state.list = exists
        ? state.list.filter((u) => u.id !== user.id)
        : [...state.list, user];
      localStorage.setItem("favorites", JSON.stringify(state.list));
    },
    clearFavorites(state) {
      state.list = [];
      localStorage.removeItem("favorites");
    },
  },
});

export const { toggleFavorite, clearFavorites } = slice.actions;
export default slice.reducer;
