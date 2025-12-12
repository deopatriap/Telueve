"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { authAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validasi input
      if (!email || !password) {
        setError("Email dan password harus diisi");
        setLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Format email tidak valid");
        setLoading(false);
        return;
      }

      // Call API login
      const response = await authAPI.login(email, password);
      
      // Save token ke localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        setSuccess("Login berhasil! Redirect ke homepage...");
        
        // Redirect ke homepage setelah 1 detik
        setTimeout(() => {
          router.push("/events");
        }, 1000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Login gagal";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎓 Event Campus
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Card Login */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-gray-600 dark:text-gray-400">Ingat saya</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg"
            >
              {loading ? "Sedang login..." : "Masuk"}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 dark:text-gray-400">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>

          {/* Admin Login Link */}
          <div className="text-center mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Masuk sebagai admin?
            </p>
            <Link
              href="/admin/login"
              className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors font-semibold"
            >
              🔐 Admin Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-6">
          © 2024 Event Campus. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}