export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full"></div>
      </div>
    </div>
  );
}
