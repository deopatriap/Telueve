"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-nier-cream">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl uppercase tracking-widest mb-4 text-nier-dark">
            Telueve
          </h1>
          <p className="text-lg text-nier-muted italic">
            Event Campus Platform
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/register")}
            variant="primary"
          >
            Register
          </Button>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
          >
            Login
          </Button>
        </div>

        {/* Event Link */}
        <div className="mt-16">
          <button
            onClick={() => router.push("/events")}
            className="text-sm uppercase tracking-widest text-nier-muted hover:text-nier-dark transition-colors underline underline-offset-4"
          >
            Browse Events →
          </button>
        </div>
      </div>
    </div>
  );
}
