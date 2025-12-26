"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eventAPI } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { EventCardSkeleton } from "@/components/Skeleton";

interface Event {
  id: number;
  nama_event: string;
  deskripsi: string;
  tanggal_event: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  kuota_peserta: number | null;
  created_at: string;
}

export default function EventsListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAllEvents();
        if (response.success) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.nama_event?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tempat?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

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

  const handleViewDetail = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-nier-cream">
      {/* Header */}
      <header className="border-b border-nier-border bg-nier-cream/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-xl uppercase tracking-widest cursor-pointer hover:text-nier-accent transition-colors"
            onClick={() => router.push("/")}
          >
            Telueve
          </h1>
          <nav className="flex items-center gap-6">
            <button
              onClick={() => router.push("/my-registrations")}
              className="text-sm uppercase tracking-widest text-nier-muted hover:text-nier-dark transition-colors"
            >
              My Registrations
            </button>
            <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
              Login
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl uppercase tracking-widest mb-4">
            Discover Events
          </h2>
          <p className="text-nier-muted italic max-w-xl mx-auto">
            Find and join exciting events happening at your campus
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 text-nier-dark bg-transparent border border-nier-border focus:outline-none focus:border-nier-dark transition-colors placeholder:text-nier-muted placeholder:italic"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-nier-muted">
              ⌕
            </span>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-center text-sm text-nier-muted uppercase tracking-widest">
            {filteredEvents.length} of {events.length} events
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-12" decorative>
            <p className="text-nier-muted italic mb-6">
              {searchQuery ? "No events match your search" : "No events available"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card
                  onClick={() => handleViewDetail(event.id)}
                  className="h-full flex flex-col group"
                  decorative
                >
                  {/* Event Title */}
                  <h3 className="text-lg uppercase tracking-wide mb-4 group-hover:text-nier-accent transition-colors">
                    {event.nama_event}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4 text-sm text-nier-muted">
                    <div className="flex items-center gap-2">
                      <span className="w-4">📅</span>
                      <span>{formatDate(event.tanggal_event)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4">⏰</span>
                      <span>{event.jam_mulai || "TBA"} - {event.jam_selesai || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4">📍</span>
                      <span>{event.tempat}</span>
                    </div>
                    {event.kuota_peserta && (
                      <div className="flex items-center gap-2">
                        <span className="w-4">👥</span>
                        <span>Kuota: {event.kuota_peserta}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-nier-muted line-clamp-3 mb-6 flex-grow italic">
                    {event.deskripsi}
                  </p>

                  {/* CTA Button */}
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(event.id);
                    }}
                  >
                    Register
                  </Button>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-nier-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-nier-muted uppercase tracking-widest">
            Telueve — Event Campus Platform
          </p>
        </div>
      </footer>
    </div>
  );
}