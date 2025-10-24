import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { fetchUserById } from "../features/users/usersThunks";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { clearSelected } from "../features/users/usersSlice";

export default function UserDetailModal() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, loading, error } = useAppSelector((s) => s.users);

  useEffect(() => {
    if (id) dispatch(fetchUserById(Number(id)));
    return () => void dispatch(clearSelected());
  }, [dispatch, id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 z-50 animate-fadeIn backdrop-blur-sm">
      <div
        className="bg-[#FFFDF5] dark:bg-gradient-to-tr dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
                   rounded-2xl p-6 w-[min(600px,95%)]
                   border-2 border-cyan-400
                   shadow-lg dark:shadow-[0_0_25px_rgba(255,255,255,0.08)]
                   transform scale-95 opacity-0 animate-scaleIn
                   transition-all duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            User Detail
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full
                       bg-red-600 dark:bg-red-500 text-white
                       hover:bg-red-700 dark:hover:bg-red-600
                       shadow-sm hover:shadow-md
                       animate-redGlow
                       transition-all duration-300 flex items-center justify-center"
            aria-label="Close Modal"
          >
            {/* Close Icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Error */}
        <ErrorMessage message={error ?? undefined} />

        {/* Content */}
        {loading ? (
          <Loader />
        ) : selected ? (
          <div className="mt-4 text-center flex flex-col items-center gap-3">
            <img
              src={selected.avatar}
              alt={`${selected.first_name}`}
              className="w-28 h-28 rounded-full mx-auto mb-2
                         border-2 border-cyan-400
                         shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                         transition-all duration-300 transform hover:scale-105 hover:animate-pulse-slow"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {selected.first_name} {selected.last_name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{selected.email}</p>
          </div>
        ) : (
          <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
            No user loaded.
          </p>
        )}
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn { animation: scaleIn 0.25s ease-out forwards; }

          @keyframes pulseSlow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-pulse-slow { animation: pulseSlow 1s ease-in-out infinite; }

          @keyframes redGlow {
            0%,100% { box-shadow: 0 0 5px rgba(255,0,0,0.3); }
            50% { box-shadow: 0 0 15px rgba(255,0,0,0.5); }
          }
          .animate-redGlow { animation: redGlow 2s ease-in-out infinite alternate; }
        `}
      </style>
    </div>
  );
}
