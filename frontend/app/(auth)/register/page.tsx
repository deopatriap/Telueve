"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { authAPI } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = (): boolean => {
    if (!nama || !email || !password || !confirmPassword) {
      setError("Semua field harus diisi");
      return false;
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid");
      return false;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Call API register
      const response = await authAPI.register(nama, email, password);
      
      setSuccess("Registrasi berhasil! Redirect ke login...");
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Registrasi gagal";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎓 Event Campus
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buat akun baru untuk bergabung
          </p>
        </div>

        {/* Card Register */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg animate-shake">
              ⚠️ {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg animate-pulse">
              ✅ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />

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
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password Anda"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 cursor-pointer mt-1"
                required
              />
              <span className="text-gray-600 dark:text-gray-400">
                Saya setuju dengan{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg"
            >
              {loading ? "Sedang mendaftar..." : "Daftar"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-6">
          © 2024 Event Campus. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}