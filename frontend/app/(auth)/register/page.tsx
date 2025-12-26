"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";
import Input from "@/components/Input";
import Card from "@/components/Card";
import ParticleField from "@/components/ParticleField";
import GlitchText from "@/components/GlitchText";
import { authAPI } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  /* ... state ... */
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = (): boolean => {
    /* ... validation ... */
    if (!nama || !email || !password || !confirmPassword) {
      setError("All fields are mandatory");
      return false;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      setError("Password sequence check failed: Minimum 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation mismatch");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* ... submit logic ... */
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(nama, email, password);

      setSuccess("Identity created. Redirecting to authentication...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Registration Failed";
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
        <div className="absolute bottom-0 right-0 w-full h-1 bg-nier-dark/10" />
        <div className="absolute top-0 right-[20%] w-[1px] h-full bg-nier-dark/5" />
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-nier-dark/5" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Nier Header */}
        <div className="text-center mb-8">
          <GlitchText
            text="TELUEVE"
            as="h1"
            className="text-3xl font-bold tracking-[0.2em] text-nier-dark mb-2"
            trigger="mount"
          />
          <p className="text-xs font-mono uppercase tracking-widest text-nier-muted">
            New User Registration Protocol
          </p>
        </div>

        {/* --- QUICK LOGIN HELPER (USER REQUEST) --- */}
        <Card variant="default" decorative className="bg-nier-info/5 border-nier-info/30 mb-6 p-4">
          <h3 className="text-xs font-bold text-nier-dark uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-nier-info rounded-full animate-pulse"></span>
            Looking to Login?
          </h3>
          <div className="text-[10px] font-mono text-nier-muted mb-3 space-y-1">
            <p>This is the <strong>Registration Protocol</strong> (New Users).</p>
            <p>If you already have an identity, use the credentials below at the Login Panel:</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-nier-sand/20 p-2 rounded border border-nier-border/30">
              <div className="text-[10px] uppercase text-nier-muted font-bold">Admin Code</div>
              <div className="text-xs text-nier-dark font-bold">admin</div>
              <div className="text-[10px] text-nier-muted">admin123</div>
            </div>
            <div className="bg-nier-sand/20 p-2 rounded border border-nier-border/30">
              <div className="text-[10px] uppercase text-nier-muted font-bold">User Code</div>
              <div className="text-xs text-nier-dark font-bold">user@telueve.com</div>
              <div className="text-[10px] text-nier-muted">user123</div>
            </div>
          </div>

          <MagneticButton
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => router.push('/login')}
          >
            Go to Login Panel
          </MagneticButton>
        </Card>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Ex: 2B (YoRHa No.2 Type B)"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Contact Frequency (Email)"
                type="email"
                placeholder="android@bunker.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={email && !email.includes("@") ? "border-nier-warning focus:border-nier-warning" : ""}
              />
              {email && !email.includes("@") && (
                <span className="absolute right-0 top-0 text-[10px] text-nier-warning uppercase tracking-widest animate-pulse">
                  Invalid Format
                </span>
              )}
            </div>

            <Input
              label="Secure Code"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Verify Secure Code"
              type="password"
              placeholder="Repeat code"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Password Requirements Checklist */}
            <div className="bg-nier-sand/20 p-3 rounded-sm border border-nier-border/30">
              <p className="text-[10px] uppercase text-nier-muted mb-2 tracking-widest font-bold">Security Protocols:</p>
              <ul className="space-y-1">
                <li className={`text-xs flex items-center gap-2 transition-colors ${password.length >= 6 ? "text-nier-success" : "text-nier-muted"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? "bg-nier-success" : "bg-nier-border"}`} />
                  Minimum 6 characters sequence
                </li>
                <li className={`text-xs flex items-center gap-2 transition-colors ${/\d/.test(password) ? "text-nier-success" : "text-nier-muted"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${/\d/.test(password) ? "bg-nier-success" : "bg-nier-border"}`} />
                  Contains numeric value
                </li>
                <li className={`text-xs flex items-center gap-2 transition-colors ${password && password === confirmPassword ? "text-nier-success" : "text-nier-muted"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${password && password === confirmPassword ? "bg-nier-success" : "bg-nier-border"}`} />
                  Verification matches sequence
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-3 text-xs text-nier-muted mt-4">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-nier-dark cursor-pointer mt-0.5 accent-nier-dark"
                required
              />
              <span>
                I accept the <a href="#" className="text-nier-dark underline decoration-dotted">Protocols</a> and <a href="#" className="text-nier-dark underline decoration-dotted">Directives</a>.
              </span>
            </label>

            <div className="pt-4">
              <MagneticButton
                type="submit"
                variant="primary"
                loading={loading}
                fullWidth
              >
                Register Identity
              </MagneticButton>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-nier-border/50 text-center">
            <p className="text-xs text-nier-muted uppercase tracking-wider mb-4">
              Identity Already Exists?
            </p>
            <MagneticButton
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => router.push("/login")}
            >
              Access Login Panel
            </MagneticButton>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-nier-muted/50 text-[10px] font-mono mt-6 uppercase tracking-widest">
          © {new Date().getFullYear()} Glory to Mankind.
        </p>
      </div>
    </div>
  );
}