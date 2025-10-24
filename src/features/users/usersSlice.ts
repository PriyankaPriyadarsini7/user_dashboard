import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers, fetchUserById } from "./usersThunks";
import type { User } from "./types";

type UsersState = {
  list: User[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error?: string | null;
  selected?: User | null;
  searchTerm: string;     
  
};

const initialState: UsersState = {
  list: [],
  page: 1,
  perPage: 6,
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
  selected: null,
  searchTerm: "",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.data;
        s.page = a.payload.page;
        s.perPage = a.payload.per_page;
        s.total = a.payload.total;
        s.totalPages = a.payload.total_pages;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || "Failed";
      })

      .addCase(fetchUserById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUserById.fulfilled, (s, a) => {
        s.loading = false;
        s.selected = a.payload;
      })
      .addCase(fetchUserById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || "Failed";
      });
  },
});

export const { setPage, setSearchTerm, clearSelected } = usersSlice.actions;
export default usersSlice.reducer;
