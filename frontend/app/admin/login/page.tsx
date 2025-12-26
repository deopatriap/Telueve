"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminAPI } from "@/lib/api";
import MagneticButton from "@/components/MagneticButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import ParticleField from "@/components/ParticleField";
import GlitchText from "@/components/GlitchText";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      const result = await adminAPI.login(username, password);

      if (result.token) {
        localStorage.setItem("adminToken", result.token);
        setSuccess("Command Authorization Granted. Accessing System...");

        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Authorization Failed";
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
            text="TELUEVE OPS"
            as="h1"
            className="text-3xl font-bold tracking-[0.2em] text-nier-dark mb-2"
            trigger="mount"
          />
          <p className="text-xs font-mono uppercase tracking-widest text-nier-muted">
            Command Authorization Terminal
          </p>
          <div className="mt-2 text-[10px] text-nier-error font-mono tracking-tighter uppercase opacity-80">
            ⚠ Warning: Restricted Access Area ⚠
          </div>
        </div>

        <Card variant="default" decorative className="bg-nier-cream/90 backdrop-blur-sm">
          {error && (
            <div className="bg-nier-error/10 border border-nier-error text-nier-error px-4 py-3 mb-6 text-xs uppercase tracking-wider font-mono">
              [AUTH_ERROR] {error}
            </div>
          )}

          {success && (
            <div className="bg-nier-success/10 border border-nier-success text-nier-success px-4 py-3 mb-6 text-xs uppercase tracking-wider font-mono">
              [GRANTED] {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Admin ID"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="System Access Code"
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
                System Administrator (Click to Fill)
              </p>
              <div
                onClick={() => { setUsername("admin"); setPassword("admin123"); }}
                className="flex justify-between items-center cursor-pointer hover:bg-nier-dark/5 p-1 -mx-1 rounded transition-colors group"
              >
                <span className="text-nier-muted group-hover:text-nier-dark">ID:</span>
                <span className="text-nier-dark">admin / admin123</span>
              </div>
            </div>

            <MagneticButton
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
            >
              Verify Credentials
            </MagneticButton>
          </form>

          <div className="mt-8 pt-6 border-t border-nier-border/50 text-center">
            <p className="text-xs text-nier-muted uppercase tracking-wider mb-4">
              Return to Standard Interface?
            </p>
            <MagneticButton
              variant="secondary"
              fullWidth
              onClick={() => router.push("/login")}
            >
              Back to User Portal
            </MagneticButton>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-[10px] text-nier-muted hover:text-nier-dark uppercase tracking-widest transition-colors font-mono"
            >
              [ Terminate Session ]
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-nier-muted/50 text-[10px] font-mono mt-6 uppercase tracking-widest">
          Command Terminal v1.0.4 // Auth Protocol Active
        </p>
      </div>
    </div>
  );
}
