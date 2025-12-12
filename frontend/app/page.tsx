"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Welcome Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            🎓 Event Campus
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Platform untuk berbagi event kampus Anda
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition-colors"
          >
            ✍️ Daftar Sekarang
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-colors"
          >
            🔓 Masuk
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center max-w-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tentang Event Campus
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Daftar akun untuk mengakses dan mengikuti berbagai event yang diadakan di kampus. 
              Anda bisa melihat jadwal, tempat, dan deskripsi lengkap setiap event.
              Bergabunglah dengan komunitas kami sekarang!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
