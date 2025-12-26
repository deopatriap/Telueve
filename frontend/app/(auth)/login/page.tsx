"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import ParticleField from "@/components/ParticleField";
import GlitchText from "@/components/GlitchText";
import { authAPI, adminAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectParams = searchParams?.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Identity and Access Code required");
      }

      // Check for Admin Login (Username 'admin' or mapped email)
      const isAdminLogin = email.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@telueve.com';

      if (isAdminLogin) {
        // --- ADMIN LOGIN FLOW ---
        // Use 'admin' as username even if they typed the email mapped to it
        const username = 'admin';
        const result = await adminAPI.login(username, password);

        if (result.token) {
          localStorage.setItem("adminToken", result.token);
          setSuccess("Command Authorization Granted. Redirecting to Ops...");
          setTimeout(() => router.push("/admin"), 1000);
        }
      } else {
        // --- USER LOGIN FLOW ---
        if (!email.includes("@")) {
          throw new Error("Invalid email format for standard user");
        }

        const response = await authAPI.login(email, password);

        if (response.token) {
          if (rememberMe) {
            localStorage.setItem("token", response.token);
          } else {
            sessionStorage.setItem("token", response.token);
          }
          setSuccess("Access Granted. Initializing session...");
          setTimeout(() => {
            router.push(redirectParams || "/events");
          }, 1000);
        }
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Access Denied";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nier-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Patterns */}
      <ParticleField />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-nier-dark/10" />
        <div className="absolute top-10 right-0 w-[50vw] h-[1px] bg-nier-dark/10" />
        <div className="absolute bottom-10 left-0 w-[30vw] h-[1px] bg-nier-dark/10" />
        <div className="absolute top-1/2 left-10 w-1 h-20 bg-nier-dark/10" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <GlitchText
            text="TELUEVE"
            as="h1"
            className="text-3xl font-bold tracking-[0.2em] text-nier-dark mb-2"
            trigger="mount"
          />
          <p className="text-xs font-mono uppercase tracking-widest text-nier-muted">
            Unified Access Terminal
          </p>
        </div>

        <Card variant="default" decorative className="bg-nier-cream/90 backdrop-blur-sm">
          {error && (
            <div className="bg-nier-error/10 border border-nier-error text-nier-error px-4 py-3 mb-6 text-xs uppercase tracking-wider font-mono">
              [ERROR] {error}
            </div>
          )}

          {success && (
            <div className="bg-nier-success/10 border border-nier-success text-nier-success px-4 py-3 mb-6 text-xs uppercase tracking-wider font-mono">
              [SUCCESS] {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="User ID / Admin Command"
              type="text"
              placeholder="user@example.com or 'admin'"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Access Code"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-nier-muted hover:text-nier-dark transition-colors uppercase text-[10px] tracking-widest"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Test Credentials Helper */}
            <div className="bg-nier-sand/20 border border-nier-border/50 p-4 rounded-sm text-xs font-mono">
              <p className="uppercase tracking-widest text-nier-dark mb-2 font-bold opacity-70 flex items-center gap-2">
                <span className="w-2 h-2 bg-nier-info rounded-full animate-pulse"></span>
                Quick Access Credentials
              </p>
              <div className="space-y-2">
                <div
                  onClick={() => { setEmail("user@telueve.com"); setPassword("user123"); }}
                  className="flex justify-between items-center cursor-pointer hover:bg-nier-dark/5 p-1 -mx-1 rounded transition-colors group"
                >
                  <span className="text-nier-muted group-hover:text-nier-dark">User:</span>
                  <span className="text-nier-dark">user@telueve.com / user123</span>
                </div>
                <div
                  onClick={() => { setEmail("admin"); setPassword("admin123"); }}
                  className="flex justify-between items-center cursor-pointer hover:bg-nier-dark/5 p-1 -mx-1 rounded transition-colors group"
                >
                  <span className="text-nier-muted group-hover:text-nier-dark">Admin:</span>
                  <span className="text-nier-dark">admin / admin123</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-nier-muted uppercase tracking-wider">
              <label className="flex items-center gap-2 cursor-pointer hover:text-nier-dark transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 rounded border-nier-border cursor-pointer accent-nier-dark"
                />
                <span>Preserve Session</span>
              </label>
              <a href="#" className="hover:text-nier-dark transition-colors underline decoration-dotted">
                Lost Access Code?
              </a>
            </div>

            <MagneticButton
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
            >
              Authenticate
            </MagneticButton>
          </form>

          <div className="mt-8 pt-6 border-t border-nier-border/50 text-center">
            <p className="text-xs text-nier-muted uppercase tracking-wider mb-4">
              New User Not Detected?
            </p>
            <MagneticButton
              variant="secondary"
              fullWidth
              onClick={() => router.push("/register")}
            >
              Create New Identity
            </MagneticButton>
          </div>
        </Card>
      </div>
    </div>
  );
}