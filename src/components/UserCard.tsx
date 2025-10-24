import { Link } from "react-router-dom";
import type { User } from "../features/users/types";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { toggleFavorite } from "../features/favorites/favoritesSlice";

export default function UserCard({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const favs = useAppSelector((s) => s.favorites.list);
  const isFav = favs.some((u) => u.id === user.id);

  return (
    <div
      className="bg-[#FFFDF5] dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700
                 p-5 flex flex-col items-center gap-3
                 shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.06)]
                 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                 hover:border-blue-400 dark:hover:border-cyan-400
                 hover:-translate-y-2 transition-all duration-300 ease-out"
    >
      {/* Avatar */}
      <img
        src={user.avatar}
        alt={`${user.first_name}`}
        className="w-24 h-24 rounded-full object-cover border-2 border-blue-300 dark:border-cyan-400 shadow-md"
      />

      {/* User Info */}
      <div className="text-center">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {user.first_name} {user.last_name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 items-center mt-2">
        <button
          onClick={() => dispatch(toggleFavorite(user))}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          className={`text-2xl transform transition-all duration-200 ${
            isFav
              ? "text-red-500 scale-125 hover:scale-135 drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]"
              : "text-gray-400 hover:text-red-400 hover:scale-125 hover:drop-shadow-[0_0_6px_rgba(255,100,100,0.5)]"
          }`}
        >
          {isFav ? "❤️" : "🤍"}
        </button>

        <Link
          to={`/users/${user.id}`}
          className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium
                     hover:bg-blue-700 dark:hover:bg-cyan-500 shadow-md
                     hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]
                     transition-all duration-300"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
