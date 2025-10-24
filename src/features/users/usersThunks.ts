import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../api/userApi";
import type { ApiResponse, User } from "./types";

// 🕒 Helper function to enforce a minimum visible delay for the loader
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ✅ Fetch all users (with minimum 3s delay)
export const fetchUsers = createAsyncThunk<
  ApiResponse["users"][string], // Return type: one page object
  number, // Arg type: page number
  { rejectValue: string }
>("users/fetchUsers", async (page, thunkAPI) => {
  try {
    const start = Date.now();

    // Make actual API call
    const pageData = await userApi.getUsers(page);

    // Calculate elapsed time
    const elapsed = Date.now() - start;
    const minDelay = 1000; // 3 seconds

    // Wait if API was too fast
    if (elapsed < minDelay) await delay(minDelay - elapsed);

    return pageData;
  } catch (err) {
    let message: string;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Fetch user by ID (with same minimum delay)
export const fetchUserById = createAsyncThunk<
  User,
  number,
  { rejectValue: string }
>("users/fetchUserById", async (id, thunkAPI) => {
  try {
    const start = Date.now();

    const user = await userApi.getUserById(id);

    const elapsed = Date.now() - start;
    const minDelay = 1000;

    if (elapsed < minDelay) await delay(minDelay - elapsed);

    if (!user) {
      return thunkAPI.rejectWithValue(`User with ID ${id} not found`);
    }

    return user;
  } catch (err) {
    let message: string;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    return thunkAPI.rejectWithValue(message);
  }
});
