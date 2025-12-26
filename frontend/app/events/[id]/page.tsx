"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { eventAPI, registrationAPI } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { EventDetailSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import Badge from "@/components/Badge";

interface Event {
  id: number;
  nama_event: string;
  deskripsi: string;
  tanggal_event: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  kuota_peserta: number | null;
  created_by: number;
  created_at: string;
  organizer_name?: string;
  total_registrations?: number;
}

interface Registration {
  registration_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  registered_at: string;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const eventId = parseInt(params?.id as string);

  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    setIsLoggedIn(!!token || !!adminToken);
  }, []);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await eventAPI.getEventDetail(eventId);
        if (response.success) {
          setEvent(response.data);

          // Fetch related events (simple implementation: get all and shuffle)
          const allEventsRes = await eventAPI.getAllEvents();
          if (Array.isArray(allEventsRes)) {
            const others = allEventsRes.filter((e: Event) => e.id !== eventId);
            setRelatedEvents(others.sort(() => 0.5 - Math.random()).slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        showToast("Failed to load event details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId, showToast]);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!isLoggedIn || !eventId) return;

      try {
        const response = await registrationAPI.checkRegistration(eventId);
        if (response.success) {
          setIsRegistered(response.isRegistered);
          setRegistration(response.registration);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    checkRegistrationStatus();
  }, [eventId, isLoggedIn]);

  const handleRegister = async () => {
    if (!isLoggedIn) {
      showToast("Please login to register", "warning");
      router.push("/login");
      return;
    }

    if (isRegistered) {
      showToast("You are already registered for this event", "warning");
      return;
    }

    setActionLoading(true);
    try {
      const response = await registrationAPI.register(eventId);

      if (response.success) {
        showToast("Registration successful! Awaiting confirmation.", "success");

        const status = await registrationAPI.checkRegistration(eventId);
        setIsRegistered(status.isRegistered);
        setRegistration(status.registration);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("Failed to register", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!isRegistered) return;

    setActionLoading(true);
    try {
      const response = await registrationAPI.cancelRegistration(eventId);

      if (response.success) {
        showToast("Registration cancelled", "success");
        setIsRegistered(false);
        setRegistration(null);
      }
    } catch (error) {
      console.error("Cancel error:", error);
      showToast("Failed to cancel registration", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Awaiting Confirmation";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard", "success");
  };

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-nier-cream flex flex-col items-center justify-center">
        <Card className="max-w-md text-center" decorative>
          <h2 className="text-xl uppercase tracking-widest mb-4">
            Event Not Found
          </h2>
          <Button onClick={() => router.push("/events")}>
            Return to Database
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nier-cream pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] bg-nier-dark overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          {/* Decorative Grid Pattern */}
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, #dad4bb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Animated Circle Decoration */}
        <div className="absolute right-[-100px] top-[-100px] animate-spin-slow opacity-10">
          <svg width="600" height="600" viewBox="0 0 100 100" className="text-nier-cream">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-nier-cream to-transparent" />

        <div className="relative z-10 text-center space-y-4 px-6 max-w-4xl mx-auto">
          <Badge variant="outline" className=" bg-nier-dark text-nier-cream border-nier-cream mb-4">
            Event Protocol: {event.id.toString().padStart(4, '0')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-nier-cream">
            {event.nama_event}
          </h1>
          <div className="flex justify-center gap-6 text-nier-cream/80 font-mono text-sm md:text-base">
            <span>{formatDate(event.tanggal_event)}</span>
            <span>|</span>
            <span>{event.tempat}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 -mt-20 relative z-20 space-y-12 animate-fade-in-up">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left/Top Column: Details & Desc */}
          <div className="md:col-span-2 space-y-8">
            <Card decorative className="bg-nier-cream">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold uppercase tracking-widest text-nier-dark">
                  Mission Brief
                </h2>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  Share Protocol ➦
                </Button>
              </div>
              <p className="text-nier-dark whitespace-pre-wrap leading-relaxed mb-8">
                {event.deskripsi || "No description available."}
              </p>

              <div className="grid grid-cols-2 gap-6 text-sm border-t border-nier-border pt-6">
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-widest text-nier-muted">Organizer</span>
                  <span className="font-bold text-nier-dark">{event.organizer_name || "Central Command"}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-widest text-nier-muted">Time-frame</span>
                  <span className="font-bold text-nier-dark">{event.jam_mulai} - {event.jam_selesai}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Registration */}
          <div className="md:col-span-1">
            <Card className="sticky top-24 border-2 border-nier-dark" decorative>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 text-center border-b border-nier-border pb-4">
                Status
              </h3>

              {isLoggedIn ? (
                isRegistered ? (
                  <div className="space-y-6 text-center">
                    <div className="py-4">
                      <Badge size="md" variant={getStatusVariant(registration?.status || "")}>
                        {getStatusText(registration?.status || "")}
                      </Badge>
                    </div>
                    <p className="text-xs text-nier-muted">
                      Registered: {registration?.registered_at ? new Date(registration.registered_at).toLocaleDateString("id-ID") : "-"}
                    </p>
                    {registration?.status === "pending" && (
                      <Button variant="danger" onClick={handleCancelRegistration} loading={actionLoading} className="w-full">
                        Cancel
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-nier-dark">OPEN</div>
                      <p className="text-xs text-nier-muted uppercase tracking-widest">
                        {event.total_registrations || 0} / {event.kuota_peserta || "∞"} Operatives
                      </p>
                    </div>
                    <Button variant="primary" onClick={handleRegister} loading={actionLoading} className="w-full py-4 text-lg">
                      Join Mission
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm italic text-nier-muted">Authentication required to join mission.</p>
                  <Button onClick={() => router.push("/login")} className="w-full">
                    Login
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="pt-12 border-t border-nier-border/50">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-8 text-nier-dark">
              Related Protocols
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((relEvent) => (
                <div
                  key={relEvent.id}
                  className="border border-nier-border p-4 hover:bg-white transition-all cursor-pointer group"
                  onClick={() => router.push(`/events/${relEvent.id}`)}
                >
                  <div className="h-32 bg-nier-sand/20 mb-4 flex items-center justify-center overflow-hidden">
                    <span className="text-6xl text-nier-muted/20 font-black group-hover:scale-110 transition-transform">
                      {relEvent.nama_event.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-bold text-nier-dark truncate mb-2">{relEvent.nama_event}</h4>
                  <p className="text-xs text-nier-muted mb-1">{formatDate(relEvent.tanggal_event)}</p>
                  <p className="text-xs text-nier-muted truncate">{relEvent.tempat}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}