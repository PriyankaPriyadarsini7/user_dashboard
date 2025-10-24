import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import UserPage from "./pages/UserPage";
import UserDetailModal from "./pages/UserDetailModal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/users/:id" element={<UserDetailModal />} />
          <Route path="/favorites" element={<UserPage showFavorites />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
