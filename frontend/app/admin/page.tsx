"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin has token
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    
    if (!token) {
      // No token, redirect to admin login
      console.log("No admin token found, redirecting to login...");
      router.push("/admin/login");
      setIsLoading(false);
    } else {
      console.log("Admin token found:", token.substring(0, 20) + "...");
      setAdminToken(token);
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    console.log("Admin logging out...");
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated || !adminToken) {
    return null;
  }

  // Show admin dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard
        adminToken={adminToken}
        onLogout={handleLogout}
      />
    </div>
  );
}