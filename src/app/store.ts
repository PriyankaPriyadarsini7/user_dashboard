import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import themeReducer from "../features/theme/themeSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    theme: themeReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
