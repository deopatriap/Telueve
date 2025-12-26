"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-nier-dark text-nier-cream border-t border-nier-accent mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block group mb-4">
              <h2 className="text-2xl font-bold tracking-[0.2em] text-nier-cream group-hover:text-nier-sand transition-colors">
                TELUEVE
              </h2>
              <div className="h-[1px] w-full bg-nier-cream/30 group-hover:bg-nier-cream transition-colors" />
            </Link>
            <p className="text-nier-muted text-sm leading-relaxed">
              Advanced campus event management platform.
              Connecting students with opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-nier-sand">Analysis</h3>
            <ul className="space-y-3 text-sm text-nier-muted">
              <li><Link href="/events" className="hover:text-nier-cream transition-colors">Events</Link></li>
              <li><Link href="/my-registrations" className="hover:text-nier-cream transition-colors">Dashboard</Link></li>
              <li><Link href="/admin/login" className="hover:text-nier-cream transition-colors">Admin Access</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-nier-sand">Support</h3>
            <ul className="space-y-3 text-sm text-nier-muted">
              <li><Link href="#" className="hover:text-nier-cream transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-nier-cream transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-nier-cream transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-nier-sand">Updates</h3>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-nier-accent/30 border border-nier-accent px-4 py-2 text-sm text-nier-cream focus:outline-none focus:border-nier-sand transition-colors"
              />
              <button className="bg-nier-cream text-nier-dark text-xs font-bold uppercase tracking-widest py-2 hover:bg-nier-sand transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-nier-accent/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-nier-muted font-mono">
          <p>© {currentYear} TELUEVE. All systems nominal.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-nier-cream">PRIVACY</Link>
            <Link href="#" className="hover:text-nier-cream">TERMS</Link>
            <Link href="#" className="hover:text-nier-cream">COOKIES</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
