"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Check auth status
    const checkAuth = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      setIsLoggedIn(!!token);
      setIsAdmin(!!adminToken);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkAuth); // Listen for storage changes
    checkAuth(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Events", href: "/events", show: true },
    { name: "My Dashboard", href: "/my-registrations", show: isLoggedIn },
    { name: "Admin Ops", href: "/admin/dashboard", show: isAdmin },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? "glass border-b border-nier-dark/5 py-2"
        : "bg-transparent border-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link href="/" className="group relative z-50">
            <h1 className="text-xl font-bold tracking-[0.2em] text-nier-dark group-hover:text-nier-accent transition-colors">
              TELUEVE
            </h1>
            <div className="h-[1px] w-0 group-hover:w-full bg-nier-dark transition-all duration-300" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.filter(l => l.show).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs uppercase tracking-widest hover:text-nier-dark transition-colors relative group ${pathname === link.href ? "text-nier-dark font-bold" : "text-nier-muted"
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-nier-dark transform origin-left transition-transform duration-300 ${pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn || isAdmin ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                LOGOUT
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
              >
                LOGIN
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-nier-dark p-2 hover:bg-nier-dark/5 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-nier-cream z-40 md:hidden transition-transform duration-300 ease-in-out pt-24 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Decoration */}
        <div className="absolute top-20 left-4 right-4 h-[1px] bg-nier-dark/10" />

        <div className="flex flex-col items-center gap-8 p-8">
          {navLinks.filter(l => l.show).map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg uppercase tracking-widest hover:text-nier-dark transition-colors animate-fade-in-up`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}

          <div className="w-12 h-[1px] bg-nier-dark/20 my-2" />

          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            {isLoggedIn || isAdmin ? (
              <Button
                variant="primary"
                onClick={handleLogout}
                className="w-full min-w-[200px]"
              >
                LOGOUT
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  router.push("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full min-w-[200px]"
              >
                LOGIN
              </Button>
            )}
          </div>
        </div>

        {/* Nier Logic Decoration */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-20">
          <div className="flex gap-2 text-[10px] font-mono tracking-widest">
            <span>SYS.NAV.MOBILE</span>
            <span>//</span>
            <span>V1.42</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
