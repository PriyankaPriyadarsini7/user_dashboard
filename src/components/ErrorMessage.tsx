export default function ErrorMessage({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    
    <div className="bg-red-50 text-red-700 px-4 py-2 rounded">{message}</div>
  );
}
