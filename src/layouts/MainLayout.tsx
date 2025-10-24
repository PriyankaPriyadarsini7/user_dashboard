import { Outlet, NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { setSearchTerm } from "../features/users/usersSlice";
import { Search } from "lucide-react"; 
import { useAppDispatch } from "../hooks/useAppDispatch"; 
import { useAppSelector } from "../hooks/useAppSelector";

export default function MainLayout() {
   
  const dispatch = useAppDispatch();
  const {searchTerm} = useAppSelector ((s)=> s.users);
  const location = useLocation();

  const isUsersPage = location.pathname === "/users"

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* --- Header --- */}
      <header className="bg-[#FFF9F0] dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-[var(--page-max-w)] mx-auto px-4 py-3 flex items-center justify-between">
          {/* App Title */}
          <NavLink
            to="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-300"
          >
            User Dashboard
          </NavLink>

          {/* Only show search input on Users page */}
                  {isUsersPage && (
                    <div className="relative w-full sm:w-80">
                      {/* 🔍 Search icon inside input */}
                      <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                      />
                      <input
                        className="pl-9 pr-3 py-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      />
                    </div>
                  )}

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-6">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `transition font-medium ${
                  isActive
                    ? "text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300 pb-1"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
                }`
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `transition font-medium ${
                  isActive
                    ? "text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300 pb-1"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
                }`
              }
            >
              Favorites
            </NavLink>
          </nav>

          {/* Theme Toggle */}
          <div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* --- Mobile Navigation --- */}
      <div className="sm:hidden bg-[#FFF9F0] dark:bg-gray-800 mt-[56px] border-t dark:border-gray-700 px-4 py-2 flex gap-6 justify-center">
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `transition font-medium ${
              isActive
                ? "text-blue-600 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
            }`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `transition font-medium ${
              isActive
                ? "text-blue-600 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
            }`
          }
        >
          Favorites
        </NavLink>
      </div>

      {/* --- Main Content --- */}
      <main className="flex-1 pt-[80px] pb-8">
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#FFF9F0] dark:bg-gray-800 py-3 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} User Dashboard
      </footer>
    </div>
  );
}
