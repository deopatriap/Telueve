"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { eventAPI, registrationAPI } from "@/lib/api";

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
}

interface Registration {
  registration_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  registered_at: string;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params?.id as string);

  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch event detail
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await eventAPI.getEventDetail(eventId);
        if (response.success) {
          setEvent(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching event:", error);
        alert(error.response?.data?.message || "Gagal memuat detail event");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId]);

  // Check registration status
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!isLoggedIn || !eventId) return;

      try {
        const response = await registrationAPI.checkRegistration(eventId);
        if (response.success) {
          setIsRegistered(response.isRegistered);
          setRegistration(response.registration);
        }
      } catch (error: any) {
        console.error("Error checking registration:", error);
      }
    };

    checkRegistrationStatus();
  }, [eventId, isLoggedIn]);

  // Handle register for event
  const handleRegister = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu!");
      router.push("/login");
      return;
    }

    if (isRegistered) {
      alert("Anda sudah terdaftar di event ini!");
      return;
    }

    const confirm = window.confirm(
      `Apakah Anda yakin ingin mendaftar di event "${event?.nama_event}"?`
    );

    if (!confirm) return;

    setActionLoading(true);
    try {
      const response = await registrationAPI.register(eventId);

      if (response.success) {
        alert(response.message || "Berhasil mendaftar! Menunggu konfirmasi organizer.");
        
        // Refresh registration status
        const status = await registrationAPI.checkRegistration(eventId);
        setIsRegistered(status.isRegistered);
        setRegistration(status.registration);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Gagal mendaftar event";
      alert(errorMsg);
      console.error("Registration error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle cancel registration
  const handleCancelRegistration = async () => {
    if (!isRegistered) {
      alert("Anda belum terdaftar di event ini!");
      return;
    }

    const confirm = window.confirm(
      "Apakah Anda yakin ingin membatalkan pendaftaran?"
    );

    if (!confirm) return;

    setActionLoading(true);
    try {
      const response = await registrationAPI.cancelRegistration(eventId);

      if (response.success) {
        alert(response.message || "Pendaftaran berhasil dibatalkan");
        
        // Reset registration status
        setIsRegistered(false);
        setRegistration(null);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Gagal membatalkan pendaftaran";
      alert(errorMsg);
      console.error("Cancel error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "accepted":
        return "Diterima";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Event tidak ditemukan</h1>
        <button
          onClick={() => router.push("/events")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali ke Daftar Event
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.nama_event}</h1>
        
        <div className="space-y-3 text-gray-700">
          <div className="flex items-center">
            <span className="font-semibold w-32">📅 Tanggal:</span>
            <span>{formatDate(event.tanggal_event)}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-32">⏰ Waktu:</span>
            <span>{event.jam_mulai} - {event.jam_selesai}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-32">📍 Tempat:</span>
            <span>{event.tempat}</span>
          </div>
          
          {event.kuota_peserta && (
            <div className="flex items-center">
              <span className="font-semibold w-32">👥 Kuota:</span>
              <span>{event.kuota_peserta} peserta</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Description */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Deskripsi Event</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{event.deskripsi}</p>
      </div>

      {/* Registration Status & Actions */}
      {isLoggedIn ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isRegistered ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold mb-2">Status Pendaftaran</p>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(
                      registration?.status || ""
                    )}`}
                  >
                    {getStatusText(registration?.status || "")}
                  </span>
                </div>
              </div>

              {/* Registration Info */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Terdaftar pada: {registration?.registered_at ? new Date(registration.registered_at).toLocaleString("id-ID") : "-"}
                </p>
              </div>

              {/* Cancel Button (only if pending) */}
              {registration?.status === "pending" && (
                <button
                  onClick={handleCancelRegistration}
                  disabled={actionLoading}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {actionLoading ? "Membatalkan..." : "Batalkan Pendaftaran"}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-semibold">Daftar Event Ini</p>
              <p className="text-gray-600">
                Klik tombol di bawah untuk mendaftar. Pendaftaran akan menunggu konfirmasi dari organizer.
              </p>
              <button
                onClick={handleRegister}
                disabled={actionLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
              >
                {actionLoading ? "Mendaftar..." : "Daftar Sekarang"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg font-semibold mb-4">Login untuk Mendaftar</p>
          <p className="text-gray-600 mb-4">
            Anda harus login terlebih dahulu untuk mendaftar event ini.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Login Sekarang
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => router.push("/events")}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ← Kembali ke Daftar Event
        </button>
      </div>
    </div>
  );
}