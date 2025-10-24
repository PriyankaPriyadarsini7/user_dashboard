import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { fetchUsers } from "../features/users/usersThunks";
import { setPage } from "../features/users/usersSlice";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";


export default function UsersPage({
  showFavorites = false,
}: {
  showFavorites?: boolean;
}) {
  const dispatch = useAppDispatch();

  // Redux state for Users and Favorites
  const { list, loading, error, page, totalPages, searchTerm } = useAppSelector(
    (s) => s.users
  );
  const favorites = useAppSelector((s) => s.favorites.list);

  // Local state to control loader for Favorites page
  const [localLoading, setLocalLoading] = useState(true);

  /**
   * Fetch Users from API only when on the "Users" page.
   * - dispatch(fetchUsers(page)) updates Redux store
   * - Favorites page does not require API fetch
   */
  useEffect(() => {
    if (!showFavorites) {
      dispatch(fetchUsers(page));
    }
  }, [dispatch, page, showFavorites]);

  /**
   * Loader logic for Favorites page:
   * - Only show loader if there are favorite users
   * - Minimum duration: 0.8 seconds
   * - No loader if Favorites is empty
   */
  useEffect(() => {
    if (showFavorites) {
      // Always trigger loader briefly on any favorites change
      setLocalLoading(true);
      const timer = setTimeout(() => setLocalLoading(false), 500); // 0.5s spinner
      return () => clearTimeout(timer);
    }
  }, [showFavorites, favorites]);

  /**
   * Decide which data to show:
   * - Favorites page: show favorites
   * - Users page: filter API list by search term
   */
  const dataToShow = showFavorites
    ? favorites
    : list.filter((u) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return `${u.first_name} ${u.last_name} ${u.email}`
          .toLowerCase()
          .includes(q);
      });

  /**
   * Determine overall loading state.
   * - Favorites page → controlled by local loader
   * - Users page → Redux-based API loader
   */
  const isLoading = showFavorites ? localLoading : loading;

  return (
    <div className="max-w-[var(--page-max-w)] mx-auto p-4 animate-fadeIn">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          {showFavorites ? (
            <>
              <span className="text-amber-500 dark:text-amber-400 dark:drop-shadow-lg transition-colors duration-300 hover:scale-110">
                ⭐
              </span>
              <span>Favorite Users</span>
            </>
          ) : (
            <>
              <span className="text-sky-500 dark:text-white dark:drop-shadow-lg transition-colors duration-300 hover:scale-110">
                👥
              </span>
              <span>User Directory</span>
            </>
          )}
        </h1>

        
      </header>

      {/* Error message */}
      <ErrorMessage message={error ?? undefined} />

      {/* Content */}
      {isLoading ? (
        <Loader />
      ) : dataToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-300">
          {dataToShow.map((u) => (
            <UserCard key={u.id} user={u} />
          ))}
        </div>
      ) : showFavorites ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">💔 No favorite users yet</p>
          <p className="text-sm mt-1">
            Go to <span className="text-blue-600">Users</span> and add some!
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No users found...</p>
      )}

      {/* Pagination (only for Users) */}
      {!showFavorites && !isLoading && (
        <div className="mt-8 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => dispatch(setPage(Math.max(1, page - 1)))}
            onNext={() => dispatch(setPage(Math.min(totalPages, page + 1)))}
          />
        </div>
      )}
    </div>
  );
}
