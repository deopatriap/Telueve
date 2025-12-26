"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import MagneticButton from "@/components/MagneticButton";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import GlitchText from "@/components/GlitchText";
import StatsCounter from "@/components/StatsCounter";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import GridFloor from "@/components/GridFloor"; // Only if we want grid at bottom

export default function Home() {
  const router = useRouter();

  const stats = [
    { label: "Active Events", value: 50, suffix: "+" },
    { label: "Registered Users", value: 1200, suffix: "+" },
    { label: "Campuses", value: 3, suffix: "" },
  ];

  /* ... features array ... */
  const features = [
    {
      title: "Real-time Updates",
      description: "Instant notifications for event changes and registrations.",
      icon: "⚡",
    },
    {
      title: "Secure Access",
      description: "Encrypted data transmission and secure authentication protocols.",
      icon: "🔒",
    },
    {
      title: "Smart Analytics",
      description: "Comprehensive dashboard for tracking engagement and participation.",
      icon: "📊",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-nier-cream">
        {/* Background Decorative Elements */}

        {/* 3D Particle Field */}
        <ParticleField />

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 border border-nier-dark/20 rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 border border-nier-dark/20 rounded-full animation-delay-500 animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center pointer-events-none">
          <Badge variant="outline" className="mb-6 animate-fade-in-up bg-nier-cream/80 backdrop-blur-sm pointer-events-auto">
            SYSTEM VERSION 2.0
          </Badge>

          <div className="mb-6 flex justify-center pointer-events-auto">
            <GlitchText
              text="TELUEVE"
              as="h1"
              className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-nier-dark"
              trigger="mount"
            />
          </div>

          <p className="text-xl md:text-2xl text-nier-muted italic mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200 bg-nier-cream/50 backdrop-blur-sm rounded p-2 pointer-events-auto">
            Advanced Campus Event Management Protocol.
            <br />
            Connecting students with future opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300 pointer-events-auto">
            <MagneticButton
              onClick={() => router.push("/register")}
              variant="primary"
              size="lg"
            >
              Initialize Registration
            </MagneticButton>
            <MagneticButton
              onClick={() => router.push("/events")}
              variant="outline"
              size="lg"
            >
              Browse Database
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
          <span className="text-nier-muted text-xs uppercase tracking-widest">Scroll to scan</span>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-nier-dark text-nier-cream border-y border-nier-accent relative overflow-hidden">
        {/* Grid Floor integration if visible here? Maybe keep stats separate. */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
              <ScrollReveal key={idx} animation="scale-up" delay={idx * 100}>
                <div className="p-4 border border-nier-accent/30 bg-nier-accent/10 hover:bg-nier-accent/20 transition-colors duration-300">
                  <StatsCounter
                    value={stat.value}
                    label={stat.label}
                    suffix={stat.suffix}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-nier-cream relative">
        <GridFloor /> {/* Add Grid Floor at bottom of features? Or maybe full page bottom. Let's put here for tech feel */}

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl font-bold uppercase tracking-widest text-nier-dark mb-4">
                System Capabilities
              </h2>
              <div className="w-24 h-1 bg-nier-dark mx-auto" />
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 150} className="h-full">
                <Card
                  variant="elevated"
                  decorative
                  className="h-full flex flex-col items-center text-center p-8 group hover:-translate-y-2 transition-transform duration-300 bg-nier-cream/80 backdrop-blur-sm"
                >
                  <div className="text-4xl mb-6 bg-nier-sand/30 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-3 group-hover:text-nier-success transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-nier-muted leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-nier-sand/20 border-t border-nier-border relative z-10">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="scale-up">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-nier-dark mb-8">
              Ready to Join the Network?
            </h2>
            <p className="text-nier-muted max-w-2xl mx-auto mb-10 text-lg">
              Create your profile today and start exploring events tailored to your academic journey.
            </p>
            <div className="inline-block">
              <MagneticButton
                onClick={() => router.push("/register")}
                variant="primary"
                size="lg"
                className="min-w-[200px]"
              >
                Start Now
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
