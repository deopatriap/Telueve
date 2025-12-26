"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { eventAPI } from "@/lib/api";
import { staggerFadeUp } from "@/lib/animations";
import { useAnimation } from "@/components/AnimationProvider";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Input from "@/components/Input";
import RefreshIndicator from "@/components/RefreshIndicator";
import { EventCardSkeleton } from "@/components/Skeleton";
import ScrollReveal from "@/components/ScrollReveal";

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
  kategori?: string; // Future proofing
  total_registrations?: number; // Backend returns this
  accepted_registrations?: number;
}

export default function EventsListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Sorting state
  const [sortOption, setSortOption] = useState("newest");

  // Pagination state
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const gridRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useAnimation();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, sortOption]);

  // Categories mock
  const categories = ["All", "Academic", "Social", "Technology", "Seminar"];

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      // Only show skeleton on initial load or manual refresh
      if (events.length === 0 && loading) setLoading(true);

      try {
        const categoryParam = activeCategory !== "All" ? activeCategory : undefined;
        const response = await eventAPI.getAllEvents(categoryParam);

        if (response.success && isMounted) {
          setEvents(response.data);
          setLastRefreshed(new Date());
          // Filtered events updating is handled by the other useEffect
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();

    // Poll every 30 seconds
    const intervalId = setInterval(fetchEvents, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [activeCategory, refreshTrigger]);

  // Filter and Sort Effect
  useEffect(() => {
    let result = [...events];

    // 1. Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) =>
        event.nama_event?.toLowerCase().includes(query) ||
        event.deskripsi?.toLowerCase().includes(query) ||
        event.tempat?.toLowerCase().includes(query)
      );
    }

    // 2. Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.tanggal_event).getTime() - new Date(a.tanggal_event).getTime();
        case "oldest":
          return new Date(a.tanggal_event).getTime() - new Date(b.tanggal_event).getTime();
        case "name_asc":
          return a.nama_event.localeCompare(b.nama_event);
        case "name_desc":
          return b.nama_event.localeCompare(a.nama_event);
        default:
          return 0;
      }
    });

    setFilteredEvents(result);
  }, [searchQuery, events, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    <div className="min-h-screen bg-nier-cream pt-20"> {/* Added pt-20 to clear navbar */}
      {/* Decorative Header Background */}
      <div className="bg-nier-sand/20 py-16 border-b border-nier-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-nier-dark">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Badge variant="outline" className="mb-4">Database Access</Badge>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-nier-dark mb-4">
            Active Protocols
          </h1>
          <p className="text-nier-muted italic max-w-xl text-lg">
            Accessing campus event database.
            Authorization level: Public.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Controls Section */}
        <div className="grid md:grid-cols-12 gap-6 mb-12 items-end bg-white/50 p-6 rounded-sm border border-nier-border/30 backdrop-blur-sm">
          {/* Search */}
          <div className="md:col-span-4">
            <Input
              label="Search Queries"
              placeholder="Find by name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="md:col-span-4">
            <label className="block text-xs uppercase tracking-widest text-nier-muted mb-2">
              Classifications
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                     px-3 py-2 text-[10px] uppercase tracking-wider border transition-all duration-200
                     ${activeCategory === cat
                      ? "bg-nier-dark text-nier-cream border-nier-dark"
                      : "bg-transparent text-nier-dark border-nier-border hover:border-nier-dark hover:bg-nier-sand/20"
                    }
                   `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="md:col-span-4">
            <label className="block text-xs uppercase tracking-widest text-nier-muted mb-2">
              Sort Sequence
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-nier-border text-nier-dark text-xs uppercase tracking-wider focus:outline-none focus:border-nier-dark transition-colors cursor-pointer hover:bg-nier-sand/10"
            >
              <option value="newest">Date: Newest First</option>
              <option value="oldest">Date: Oldest First</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </div>
        </div>

        {/* Results Bar */}
        {!loading && (
          <div className="flex items-center justify-between mb-8 border-b border-nier-border/50 pb-4">
            <div className="flex gap-4 items-center">
              <span className="text-sm uppercase tracking-widest text-nier-dark font-bold">
                {filteredEvents.length} records found
                {totalPages > 1 && ` (Page ${currentPage}/${totalPages})`}
              </span>
              <RefreshIndicator
                lastUpdated={lastRefreshed}
                onRefresh={() => {
                  setLoading(true);
                  setRefreshTrigger(prev => prev + 1);
                }}
                isLoading={loading}
              />
            </div>
            <div className="flex gap-2 items-center bg-nier-success/10 px-3 py-1 rounded-full border border-nier-success/20">
              <span className="w-2 h-2 rounded-full bg-nier-success animate-pulse"></span>
              <span className="text-[10px] uppercase text-nier-success font-bold tracking-wider">Live Connection</span>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-16 bg-nier-cream border-dashed" decorative>
            <div className="text-4xl mb-4 opacity-50">∅</div>
            <h3 className="text-lg uppercase tracking-widest text-nier-dark mb-2">No Data Found</h3>
            <p className="text-nier-muted italic mb-6">
              Query returned zero results. Adjust search parameters.
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Reset Search parameters
              </Button>
            )}
          </Card>
        ) : (
          <>
            <div ref={gridRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 opacity-0 animate-fade-in-up">
              {paginatedEvents.map((event, index) => (
                <ScrollReveal
                  key={event.id}
                  animation="fade-up"
                  delay={index * 50}
                  className="event-card-item h-full"
                >
                  <Card
                    variant="interactive"
                    onClick={() => handleViewDetail(event.id)}
                    className="h-full flex flex-col group bg-nier-cream hover:bg-white hover-lift p-8 relative overflow-hidden"
                    decorative
                  >
                    {/* Status Line */}
                    <div className="absolute top-4 right-4 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-nier-dark rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-nier-dark rounded-full opacity-50"></div>
                      <div className="w-1.5 h-1.5 bg-nier-dark rounded-full opacity-25"></div>
                    </div>

                    {/* Quota Indicator */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-nier-sand/30 px-3 py-1 rounded-full backdrop-blur-sm border border-nier-dark/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-nier-success"></span>
                      <span className="text-[10px] uppercase font-mono text-nier-dark font-bold">
                        {event.total_registrations || 0} / {event.kuota_peserta || "∞"} Spots
                      </span>
                    </div>

                    {/* Event Title */}
                    <div className="mt-8 mb-4 min-h-[4rem]">
                      <h3 className="text-2xl font-bold uppercase tracking-wide leading-tight group-hover:text-nier-accent transition-colors">
                        {event.nama_event}
                      </h3>
                    </div>

                    {/* Divider */}
                    <div className="h-[2px] w-12 bg-nier-dark/30 mb-6 group-hover:w-full group-hover:bg-nier-warning transition-all duration-500 ease-out" />

                    {/* Event Details */}
                    <div className="space-y-4 mb-6 text-sm text-nier-dark/80 font-mono bg-nier-sand/10 p-4 rounded-sm border border-nier-border/20">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📅</span>
                        <span className="font-bold uppercase text-xs tracking-wider">{formatDate(event.tanggal_event)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">⏰</span>
                        <span className="font-bold uppercase text-xs tracking-wider">{event.jam_mulai || "TBA"} - {event.jam_selesai || "TBA"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📍</span>
                        <span className="font-bold uppercase text-xs tracking-wider line-clamp-1">{event.tempat}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-nier-dark/70 line-clamp-3 mb-8 flex-grow italic leading-relaxed pl-4 border-l-2 border-nier-border/50">
                      {event.deskripsi}
                    </p>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-4 border-t border-nier-border/30 flex justify-between items-center group/btn">
                      <span className="text-[10px] uppercase tracking-widest text-nier-muted font-mono">
                        Ref.ID: {event.id.toString().padStart(4, '0')}
                      </span>
                      <span className="flex items-center gap-2 text-xs uppercase font-bold text-nier-dark bg-nier-dark/5 px-4 py-2 rounded-sm group-hover/btn:bg-nier-dark group-hover/btn:text-nier-cream transition-all duration-300">
                        View Details
                        <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-6 bg-white/50 py-4 rounded-full border border-nier-border/20 backdrop-blur-sm max-w-md mx-auto shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-transparent"
                >
                  ← Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`
                        w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full transition-all duration-300 transform hover:scale-110
                        ${currentPage === i + 1
                          ? "bg-nier-dark text-nier-cream shadow-md scale-110"
                          : "bg-transparent text-nier-dark hover:bg-nier-sand/30"
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="hover:bg-transparent"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}