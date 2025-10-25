
# User Dashboard — Complete Project Documentation

## Overview

This document explains the full project flow for the **User Dashboard** Assessment project. It covers the architecture, folder structure, development flow, API integration, component flow, state lifecycle, error handling, testing checklist, debugging tips, and deployment notes. This version intentionally omits code snippets and focuses on step-by-step explanations so teammates and reviewers can follow the entire flow.

---

## Goals

- Build a responsive User Directory Dashboard using React and TypeScript.
- Use Tailwind CSS for styling and responsive layout.
- Manage state with Redux Toolkit and async operations with thunks.
- Centralize API calls using Axios with request and response interceptors.
- Use a mock API (Mocki) proxied via the Vite dev server to avoid CORS issues.
- Persist user favorites and theme in localStorage.

---

## Technology Summary

- Frontend: React + TypeScript
- Tooling: Vite
- Styling: Tailwind CSS (utility-first)
- State Management: Redux Toolkit (slices + thunks)
- HTTP Client: Axios (with interceptors)
- Mock Backend: Mocki.io (proxied through Vite during development)
- Persistence: localStorage for favorites and theme

---

---

## 🏗️ Project Setup (Step-by-Step)

### 1️⃣ Create React + TypeScript Project

```bash
# 1. Create Vite + React + TypeScript project
npm create vite@latest user-dashboard -- --template react-ts
cd user-dashboard

# 2. Install runtime libs
npm install axios @reduxjs/toolkit react-redux react-router-dom

# 3. Install Tailwind dev tools
npm install -D tailwindcss@3 postcss autoprefixer

# 4. Init Tailwind
npx tailwindcss init -p

#5. Install Icon Library
npm install lucide-react(For search box icon)
```

---

## 🎨 Tailwind CSS Configuration

### 🔧 `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 🧾 `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ✅ Verify Installation

Run:

```bash
npm run dev
```

---

## 🧰 Vite Configuration 


### ⚙️ `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // ensures relative paths for build files
  build: {
    outDir: "dist", // output folder for production build
  },
  // Proxy configuration is removed because CORS is resolved
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://mocki.io",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
});

```

---

## 🌐 API Integration Setup

Example API Endpoint:

```
http://localhost:5173/api/v1/46161237-0246-4d75-a89d-3b07cf72b257
```

---

## 🧩 Axios Client (Centralized API Layer)

### 📁 `src/api/axiosClient.ts`

```ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data || error.message || "Network error";
    return Promise.reject(message);
  }
);

export default axiosClient;
```

---

## 🧭 API Methods

### 📁 `src/api/userApi.ts`

```ts
import axiosClient from "./axiosClient";
import type { ApiResponse } from "../features/users/types";

export const userApi = {
  getUsers: (page = 1) =>
    axiosClient
      .get<ApiResponse>("/v1/46161237-0246-4d75-a89d-3b07cf72b257")
      .then((res) => {
        const pageData = res.data.users[`page${page}`];
        return pageData;
      }),

  getUserById: (id: number) =>
    axiosClient
      .get<ApiResponse>("/v1/46161237-0246-4d75-a89d-3b07cf72b257")
      .then((res) => {
        const allUsers = Object.values(res.data.users).flatMap((p) => p.data);
        return allUsers.find((u) => u.id === id);
      }),
};
```

---

## Folder Structure (high-level, updated)(Clean Architecture)

```
user-dashboard/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── src/
    ├── api/                  # API layer (Axios client + endpoint methods)
    │   ├── axiosClient.ts
    │   └── userApi.ts
    ├── app/                  # Redux store configuration
    │   └── store.ts
    ├── features/             # State slices and thunks per feature
    │   ├── users/
    │   │   ├── types.ts
    │   │   ├── usersThunks.ts
    │   │   └── usersSlice.ts
    │   ├── theme/
    │   │   └── themeSlice.ts
    │   └── favorites/
    │       └── favoritesSlice.ts
    ├── hooks/                # Typed Redux hooks
    │   ├── useAppDispatch.ts
    │   └── useAppSelector.ts
    ├── components/           # Reusable presentational components
    │   ├── UserCard.tsx
    │   ├── Pagination.tsx
    │   ├── Loader.tsx
    │   ├── ErrorMessage.tsx
    │   ├── ThemeToggle.tsx
    │
    ├── layouts/              # Layout components
    │   └── MainLayout.tsx
    ├── pages/                # Route-level pages
    │   ├── UsersPage.tsx
    │   ├── UserDetailModal.tsx
    │
    ├── styles/               # Global styles (Tailwind + overrides)
    │   └── index.css
    ├── App.tsx               # App bootstrap + router
    └── main.tsx              # Entry point
```

---

## Overall End‑to‑End Flow — Short Version

1. User opens the app (Users page).
2. The Users page dispatches an action to fetch users for the current page.
3. A Redux async thunk calls an API method in the api layer.
4. The api layer uses the Axios client; interceptors may attach headers or normalize errors.
5. Vite dev server proxies the request to the Mocki URL; the mock returns paginated user data.
6. The thunk receives the response and dispatches a fulfilled action to the users slice.
7. The users slice updates the store (list, page, totalPages, loading false).
8. The Users page reads updated state via selectors and re-renders the UserCard grid.
9. User interactions (search, pagination, favorite, details) dispatch actions and repeat the flow.

## Flow Diagram

User Opens App
│
▼
App Startup & Router
│
▼
Theme Initialization (localStorage)
│
▼
UsersPage Mounts ──> Dispatch fetchUsers(page) thunk
│
▼
API Layer (axiosClient) ──> Request Interceptor
│
▼
Vite Proxy ──> Mocki API
│
▼
API Response ──> Response Interceptor
│
▼
Thunk Fulfilled / Rejected
│
▼
Redux Store Updates
(list, page, totalPages, loading, error)
│
▼
UsersPage Re-renders
│ │ │
│ │ └── Filter (client-side)
│ └── Pagination Interaction
└── View User Details ──> UserDetailModal
└── Favorite Toggle ──> Favorites Slice + localStorage
│
▼
UI Updates Complete

Explanation of the Flow

1. User Opens App
   The browser loads index.html and bootstraps React via main.tsx.

2. App Startup & Router

   App.tsx sets up routes.

   MainLayout mounts header, navigation, and outlet for pages.

3. Theme Initialization

   The theme slice reads localStorage.

   Tailwind dark: classes are applied immediately.

4. UsersPage Mounts

   Reads current page from Redux.

   Dispatches fetchUsers(page) thunk.

5. API Layer & Axios

   axiosClient handles HTTP requests.

   Request interceptors can add headers, log requests, or cancel them.

6. Vite Proxy & Mock API

   Dev server proxies /api requests to Mocki.

   Mocki returns paginated user data.

7. API Response Handling

   Response interceptors normalize data or handle errors.

   Thunk resolves with data or error.

8. Redux Store Update

   Users slice updates state: list, page, totalPages, loading, error.

9. UsersPage Re-render

   UI maps list to UserCard components.

   Pagination updates based on totalPages.

   Search filters the list locally.

   Favorites toggle updates favoritesSlice and persists to localStorage.

   UserDetailModal shows details fetched via fetchUserById.

10. UI Updates Complete

    All components reflect the updated store state.

    Loading spinners disappear; errors show if present.

## Detailed Step‑by‑Step Flow Explanation

### 1) App Startup and Router

- When the app starts, routing determines which page to render (by default the Users page).
- MainLayout mounts and renders header, navigation and the outlet area where pages appear.
- Theme initialization: the app reads saved theme from localStorage and applies the appropriate CSS class to the root element so Tailwind's dark mode works immediately.

### 2) Users Page Mounts

- UsersPage component mounts and reads the `page` value from Redux. If `page` is not set, it defaults to 1.
- The component dispatches the `fetchUsers` thunk with the current `page`.
- The UI sets a local or global loading state to show a skeleton or spinner.

### 3) Thunk Execution and API Call

- The `fetchUsers` thunk calls a dedicated API method (e.g., `getUsers(page)`) from the `api` layer.
- The api layer method calls the central Axios client.
- Axios request interceptor runs first. It typically:
  - Adds authorization headers if a token is present.
  - Adds request logging or telemetry.
  - Can cancel or modify requests as needed.
- The Axios request flows to the Vite dev server. Because the dev server is configured to proxy `/api` requests, the request is forwarded to the external Mocki service (or other configured endpoint), so the browser does not encounter a CORS restriction.

### 4) API Response Handling

- The mock backend returns JSON structured for the app. The API method extracts and returns a page object (page metadata and data array).
- Axios response interceptor runs and can:
  - Normalize the response shape.
  - Catch HTTP errors and convert them into a user-friendly message.
  - Retry logic or centralized error logging (optional).
- The resolved data (or rejected error) flows back to the thunk.

### 5) Redux State Update

- On success, the thunk dispatches a `fulfilled` action containing the page object.
- The users slice `extraReducers` handles `pending`, `fulfilled`, and `rejected` states:
  - `pending`: `loading = true`, `error = null`
  - `fulfilled`: `list = payload.data`, `page = payload.page`, `totalPages = payload.total_pages`, `loading = false`
  - `rejected`: `loading = false`, `error = message`
- State updates are immutable and predictable, which makes debugging straightforward.

### 6) UI Re-rendering

- React components subscribe to relevant parts of the Redux store via typed selectors.
- After the store updates, selectors return fresh data and components re-render:
  - UsersList maps over the `list` and renders `UserCard` components.
  - The pagination component shows the current page and enables/disables Next/Prev controls based on `totalPages`.
  - If `loading` is true, the UI shows a loader or skeleton instead of the list.
  - If `error` exists, the UI shows an error message and a retry button.

### 7) Pagination Interaction

- When the user clicks Next or Prev:
  - The pagination component dispatches an action to set the new page in Redux or directly dispatches `fetchUsers(newPage)`.
  - The flow from step 3 repeats for the new page number.
  - Using `setPage` + useEffect to react to `page` changes keeps the separation of concerns clean.

### 8) Search / Filter

- SearchBar updates a `searchTerm` in Redux or component state.
- UsersPage filters the current list client-side using case-insensitive matching on name and email.
- Search is performed on already fetched data; for server-side search, the SearchBar could dispatch a thunk with the query.

### 9) Viewing User Details

- Clicking Details navigates to a URL containing the user id (e.g., `/users/7`) via React Router.
- The UserDetailModal page reads the id from the URL and dispatches `fetchUserById(id)`.
- The thunk can either call a `getUserById` endpoint (if available) or fetch the full dataset and find the user locally.
- The selected user is stored in Redux (or local component state) and rendered in a modal. Closing the modal clears selection state.

### 10) Favorite Users & Persistence

- Clicking the favorite button dispatches `toggleFavorite(user)`.
- The favorites slice updates its list of favorite users (or ids).
- The reducer synchronously writes the updated favorites array to localStorage for persistence.
- The Favorites page reads from the favorites slice to display saved users.
- Storing ids instead of full objects is an optimization — both approaches are supported.

### 11) Theme Toggle & Persistence

- ThemeToggle dispatches an action to flip between 'light' and 'dark' theme.
- The theme slice saves the choice to localStorage and the app applies the corresponding CSS class to the root HTML element.
- Tailwind `dark:` utilities apply the appropriate styles without additional code.

### 12) Error Handling Pattern

- Centralize HTTP error normalization in Axios response interceptor:
  - Convert server error payloads into a consistent error message.
  - Optionally detect authentication errors (401) and dispatch a `logout` or `refresh` flow.
- UI presents friendly error messages and an option to retry the failed action.
- Logging can be added to record error telemetry to a monitoring service.

---

## Testing Checklist (What to test and how)

1. Tailwind smoke test: confirm utility classes apply (change a background color class and see result).
2. API connectivity: verify network requests show in DevTools and responses match expected shape.
3. State updates: use Redux DevTools to confirm `pending/fulfilled/rejected` actions and state updates.
4. Users page:
   - Load initial users (page 1).
   - Click Next/Prev and confirm new data loads.
   - Type in Search bar and confirm client-side filtering.
5. User details:
   - Click Details on a user and check modal content and URL.
   - Close modal and confirm selection cleared.
6. Favorites:
   - Add/remove favorites, reload page, and confirm persistence.
7. Theme:
   - Toggle theme, reload, and confirm persistence.
8. Error scenarios:
   - Simulate API error (temporary wrong URL) and confirm UI error handling and retry.

---

## Debugging Tips

- If requests are failing:
  - Check DevTools Network tab to inspect the request URL. It should point to `localhost:5173/api/...` (Vite proxy).
  - Confirm the Vite proxy configuration is present and the dev server was restarted after changes.
- If Redux state isn't updating:
  - Open Redux DevTools and inspect dispatched actions and state slices.
  - Ensure your `extraReducers` keys match the thunk action lifecycle.
- If Tailwind classes are not working:
  - Ensure `tailwind.config` content paths include your `src` folder and the `index.css` is imported in `main.tsx`.
  - Install Tailwind IntelliSense in VS Code to reduce false positives in CSS validation.
- If modal routing behaves oddly:
  - Use `navigate(-1)` for closing to preserve history; if using a stateful modal, ensure selection is cleared on unmount.

---

## Deployment Notes

- Build with the standard Vite production command.
- For production, remove the local Vite proxy and set the real API base URL in Axios client (or use environment variables).
- Host on platforms like Vercel or Netlify; configure environment variables and any backend endpoints accordingly.

---

## Best Practices and Rationale

- **Separation of Concerns**: API logic is in `api/`, state in `features/`, and UI in `components/` and `pages/`. This makes testing and scaling easier.
- **Predictable Async Flow**: Using Redux Toolkit's `createAsyncThunk` ensures consistent `pending/fulfilled/rejected` patterns.
- **Centralized HTTP Handling**: Axios interceptors allow consistent error handling and token injection.
- **Local Persistence**: Simple localStorage use for favorites and theme keeps UX consistent across reloads without a backend.
- **Responsive-first**: Tailwind's mobile-first utilities make it easy to build responsive UIs quickly.

---

## Author

Priyanka — Frontend Assessment

---
