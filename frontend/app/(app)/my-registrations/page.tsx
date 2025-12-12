"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registrationAPI } from "@/lib/api";

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
  const [registrations, setRegistrations] = useState<MyRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    } catch (error: any) {
      console.error("Error fetching registrations:", error);
      alert(error.response?.data?.message || "Gagal memuat data registrasi");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: number, eventName: string) => {
    const confirm = window.confirm(
      `Apakah Anda yakin ingin membatalkan pendaftaran di event "${eventName}"?`
    );

    if (!confirm) return;

    try {
      const response = await registrationAPI.cancelRegistration(eventId);
      if (response.success) {
        alert(response.message || "Pendaftaran berhasil dibatalkan");
        // Refresh list
        fetchMyRegistrations();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal membatalkan pendaftaran");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳ Menunggu Konfirmasi";
      case "accepted":
        return "✅ Diterima";
      case "rejected":
        return "❌ Ditolak";
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Pendaftaran Saya</h1>
        <p className="text-gray-600">
          Daftar event yang telah Anda daftarkan
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">
            Anda belum mendaftar di event apapun
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lihat Daftar Event
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {registrations.map((reg) => (
            <div
              key={reg.registration_id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    reg.status
                  )}`}
                >
                  {getStatusText(reg.status)}
                </span>
              </div>

              {/* Event Info */}
              <h3
                className="text-xl font-bold mb-2 cursor-pointer hover:text-blue-600"
                onClick={() => router.push(`/events/${reg.event_id}`)}
              >
                {reg.nama_event}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>📅 {formatDate(reg.tanggal_event)}</p>
                <p>⏰ {reg.jam_mulai}</p>
                <p>📍 {reg.tempat}</p>
                <p className="text-xs text-gray-500">
                  Terdaftar: {new Date(reg.registered_at).toLocaleDateString("id-ID")}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`/events/${reg.event_id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  Lihat Detail
                </button>

                {reg.status === "pending" && (
                  <button
                    onClick={() => handleCancelRegistration(reg.event_id, reg.nama_event)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    Batalkan Pendaftaran
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}