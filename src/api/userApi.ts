import axiosClient from "./axiosClient";
import type { ApiResponse } from "../features/users/types";

export const userApi = {
  getUsers: (page = 1) =>
    axiosClient
      .get<ApiResponse>("/v1/46161237-0246-4d75-a89d-3b07cf72b257")
      .then((res) => {
        // Return the full page object, not just data
        const pageData = res.data.users[`page${page}`];
        return pageData; // ✅ has page, per_page, total, total_pages, data
      }),

  getUserById: (id: number) =>
    axiosClient
      .get<ApiResponse>("/v1/46161237-0246-4d75-a89d-3b07cf72b257")
      .then((res) => {
        const allUsers = Object.values(res.data.users).flatMap((p) => p.data);
        const user = allUsers.find((u) => u.id === id);
        return user; // ✅ can be User | undefined
      }),
};
