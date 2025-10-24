export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-4 justify-center mt-6">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Prev
      </button>
      <div>
        Page {page} / {totalPages}
      </div>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
