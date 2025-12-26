"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registrationAPI } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { EventCardSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import Badge from "@/components/Badge";

interface MyRegistration {
  registration_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  registered_at: string;
  event_id: number;
  nama_event: string;
  deskripsi: string;
  tanggal_event: string;
  waktu_event: string;
  jam_mulai: string;
  tempat: string;
  kuota_peserta: number | null;
}

export default function MyRegistrationsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState<MyRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRegistrations = registrations.filter(reg =>
    filterStatus === "all" ? true : reg.status === filterStatus
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoggedIn(true);
    fetchMyRegistrations();
  }, [router]);

  const fetchMyRegistrations = async () => {
    try {
      const response = await registrationAPI.getMyRegistrations();
      if (response.success) {
        setRegistrations(response.data);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      showToast("Failed to load registrations", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: number, eventName: string) => {
    try {
      const response = await registrationAPI.cancelRegistration(eventId);
      if (response.success) {
        showToast(`Registration for "${eventName}" cancelled`, "success");
        fetchMyRegistrations();
      }
    } catch (error) {
      console.error("Cancel error:", error);
      showToast("Failed to cancel registration", "error");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
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
        return "Pending";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nier-cream">
        <header className="border-b border-nier-border">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <EventCardSkeleton />
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-nier-cream">
      {/* Header */}
      <header className="border-b border-nier-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/events")}
            className="text-sm uppercase tracking-widest text-nier-muted hover:text-nier-dark transition-colors"
          >
            ← Back to Events
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl uppercase tracking-widest mb-2">
            My Registrations
          </h1>
          <p className="text-nier-muted italic">
            Events you have registered for
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-nier-sand/20 p-1 rounded-full border border-nier-border">
            {["all", "pending", "accepted", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300
                  ${filterStatus === status
                    ? "bg-nier-dark text-nier-cream shadow-md"
                    : "bg-transparent text-nier-muted hover:text-nier-dark"
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredRegistrations.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-12" decorative>
            <p className="text-nier-muted italic mb-6">
              {filterStatus === "all"
                ? "You have not registered for any events yet"
                : `No registrations found with status: ${filterStatus}`
              }
            </p>
            <Button onClick={() => router.push("/events")}>
              Browse Events
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRegistrations.map((reg, index) => (
              <div
                key={reg.registration_id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="h-full flex flex-col hover-lift" decorative variant="interactive">
                  {/* Status Badge */}
                  <div className="mb-4 flex justify-between items-start">
                    <Badge variant={getStatusVariant(reg.status)}>
                      {getStatusText(reg.status)}
                    </Badge>
                    <span className="text-[10px] font-mono text-nier-muted">
                      #{reg.registration_id}
                    </span>
                  </div>

                  {/* Event Info */}
                  <h3
                    className="text-lg uppercase tracking-wide mb-4 cursor-pointer hover:text-nier-accent transition-colors"
                    onClick={() => router.push(`/events/${reg.event_id}`)}
                  >
                    {reg.nama_event}
                  </h3>

                  <div className="space-y-2 text-sm text-nier-muted mb-4 flex-grow">
                    <p className="flex items-center gap-2">
                      <span>📅</span> {formatDate(reg.tanggal_event)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>⏰</span> {reg.jam_mulai || "TBA"}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📍</span> {reg.tempat}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mt-auto pt-4 border-t border-nier-border/30">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/events/${reg.event_id}`)}
                      className="w-full"
                    >
                      View Details
                    </Button>

                    {reg.status === "pending" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelRegistration(reg.event_id, reg.nama_event)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}