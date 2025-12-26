"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { eventAPI, registrationAPI } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { EventDetailSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";

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
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await eventAPI.getEventDetail(eventId);
        if (response.success) {
          setEvent(response.data);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "badge badge-pending";
      case "accepted":
        return "badge badge-accepted";
      case "rejected":
        return "badge badge-rejected";
      default:
        return "badge";
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
          <p className="text-nier-muted italic mb-6">
            The event you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => router.push("/events")}>
            Back to Events
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nier-cream">
      {/* Header */}
      <header className="border-b border-nier-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/events")}
            className="text-sm uppercase tracking-widest text-nier-muted hover:text-nier-dark transition-colors"
          >
            ← Back to Events
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Event Header Card */}
        <Card decorative>
          <h1 className="text-2xl uppercase tracking-widest mb-6">
            {event.nama_event}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-nier-muted w-6">📅</span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-nier-muted">Date</div>
                  <div>{formatDate(event.tanggal_event)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-nier-muted w-6">⏰</span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-nier-muted">Time</div>
                  <div>{event.jam_mulai || "TBA"} - {event.jam_selesai || "TBA"}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-nier-muted w-6">📍</span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-nier-muted">Location</div>
                  <div>{event.tempat}</div>
                </div>
              </div>

              {event.kuota_peserta && (
                <div className="flex items-center gap-3">
                  <span className="text-nier-muted w-6">👥</span>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-nier-muted">Capacity</div>
                    <div>{event.total_registrations || 0} / {event.kuota_peserta}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Description Card */}
        <Card>
          <h2 className="text-lg uppercase tracking-widest mb-4">
            Description
          </h2>
          <p className="text-nier-dark whitespace-pre-wrap leading-relaxed">
            {event.deskripsi || "No description available."}
          </p>
        </Card>

        {/* Registration Card */}
        <Card decorative>
          {isLoggedIn ? (
            isRegistered ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg uppercase tracking-widest mb-2">
                      Registration Status
                    </h3>
                    <span className={getStatusBadge(registration?.status || "")}>
                      {getStatusText(registration?.status || "")}
                    </span>
                  </div>
                </div>

                <div className="border-t border-nier-border pt-4">
                  <p className="text-xs text-nier-muted">
                    Registered on: {registration?.registered_at ? new Date(registration.registered_at).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>

                {registration?.status === "pending" && (
                  <Button
                    variant="danger"
                    onClick={handleCancelRegistration}
                    loading={actionLoading}
                    className="w-full"
                  >
                    Cancel Registration
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg uppercase tracking-widest mb-2">
                    Register for This Event
                  </h3>
                  <p className="text-sm text-nier-muted italic">
                    Click the button below to register. Your registration will await organizer confirmation.
                  </p>
                </div>
                <Button
                  onClick={handleRegister}
                  loading={actionLoading}
                  className="w-full"
                >
                  Register Now
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg uppercase tracking-widest mb-2">
                  Login Required
                </h3>
                <p className="text-sm text-nier-muted italic">
                  Please login to register for this event.
                </p>
              </div>
              <Button onClick={() => router.push("/login")} className="w-full">
                Login to Register
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}