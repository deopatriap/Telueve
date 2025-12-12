"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eventAPI } from "@/lib/api";

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

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAllEvents();
        if (response.success) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching events:", error);
        alert(error.response?.data?.message || "Gagal memuat daftar event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.nama_event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tempat.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Handle view detail (untuk daftar event)
  const handleViewDetail = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Memuat event...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Jelajahi Event Kampus</h1>
        <p className="text-gray-600 text-lg">
          Temukan dan ikuti event menarik di kampus Anda
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Cari event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery ? "Tidak ada event yang sesuai dengan pencarian" : "Belum ada event tersedia"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:underline"
            >
              Tampilkan semua event
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            Menampilkan {filteredEvents.length} dari {events.length} event
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                onClick={() => handleViewDetail(event.id)}
              >
                {/* Event Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                  <h3 className="text-xl font-bold mb-2">{event.nama_event}</h3>
                  <p className="text-blue-100 text-sm">
                    {formatDate(event.tanggal_event)}
                  </p>
                </div>

                {/* Event Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">⏰</span>
                      <span>{event.jam_mulai} - {event.jam_selesai}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">📍</span>
                      <span>{event.tempat}</span>
                    </div>
                    
                    {event.kuota_peserta && (
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">👥</span>
                        <span>Kuota: {event.kuota_peserta} peserta</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {event.deskripsi}
                  </p>

                  {/* Button - Hanya tombol Daftar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(event.id);
                    }}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Daftar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}