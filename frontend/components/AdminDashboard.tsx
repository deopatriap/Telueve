"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";

interface Event {
  event_id: number;
  nama_event: string;
  tanggal_event: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  deskripsi: string;
  created_at?: string;
}

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
}

export default function AdminDashboard({
  adminToken,
  onLogout,
}: AdminDashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nama_event: "",
    tanggal_event: "",
    jam_mulai: "",
    jam_selesai: "",
    tempat: "",
    deskripsi: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
      setError("");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Gagal mengambil events";
      setError(msg);
      console.error("Fetch events error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.nama_event ||
      !formData.tanggal_event ||
      !formData.jam_mulai ||
      !formData.jam_selesai ||
      !formData.tempat
    ) {
      setError("Nama event, tanggal, jam, dan tempat wajib diisi");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await adminAPI.updateEvent(
          editingId,
          formData.nama_event,
          formData.tanggal_event,
          formData.jam_mulai,
          formData.jam_selesai,
          formData.tempat,
          formData.deskripsi
        );
        setSuccess("Event berhasil diperbarui!");
      } else {
        await adminAPI.createEvent(
          formData.nama_event,
          formData.tanggal_event,
          formData.jam_mulai,
          formData.jam_selesai,
          formData.tempat,
          formData.deskripsi
        );
        setSuccess("Event berhasil ditambahkan!");
      }
      setFormData({
        nama_event: "",
        tanggal_event: "",
        jam_mulai: "",
        jam_selesai: "",
        tempat: "",
        deskripsi: "",
      });
      setEditingId(null);
      setShowForm(false);
      await fetchEvents();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Gagal menyimpan event";
      setError(msg);
      console.error("Submit error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      nama_event: event.nama_event,
      tanggal_event: event.tanggal_event,
      jam_mulai: event.jam_mulai,
      jam_selesai: event.jam_selesai,
      tempat: event.tempat,
      deskripsi: event.deskripsi || "",
    });
    setEditingId(event.event_id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (event_id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      try {
        setLoading(true);
        await adminAPI.deleteEvent(event_id);
        setSuccess("Event berhasil dihapus!");
        await fetchEvents();
      } catch (err: any) {
        const msg = err.response?.data?.error || err.response?.data?.message || "Gagal menghapus event";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nama_event: "",
      tanggal_event: "",
      jam_mulai: "",
      jam_selesai: "",
      tempat: "",
      deskripsi: "",
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            📊 Admin Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg mb-4">
            ✅ {success}
          </div>
        )}

        {/* Add Event Button */}
        <div className="mb-8">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              + Tambah Event
            </button>
          )}
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? "Edit Event" : "Tambah Event Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Event*
                  </label>
                  <input
                    type="text"
                    value={formData.nama_event}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_event: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tanggal Event*
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_event}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggal_event: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jam Mulai*
                  </label>
                  <input
                    type="time"
                    value={formData.jam_mulai}
                    onChange={(e) =>
                      setFormData({ ...formData, jam_mulai: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jam Selesai*
                  </label>
                  <input
                    type="time"
                    value={formData.jam_selesai}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jam_selesai: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tempat*
                  </label>
                  <input
                    type="text"
                    value={formData.tempat}
                    onChange={(e) =>
                      setFormData({ ...formData, tempat: e.target.value })
                    }
                    placeholder="Contoh: Aula Kampus, Lab Komputer, dll"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  placeholder="Jelaskan detail event ini..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? "Menyimpan..." : "Simpan Event"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📋 Daftar Events
          </h2>

          {loading && !showForm ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Memuat events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Belum ada event. Klik "Tambah Event" untuk membuat event baru.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      Nama Event
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      Tanggal
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      Waktu
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                      Tempat
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-900 dark:text-white">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {events.map((event) => (
                    <tr
                      key={event.event_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                        {event.nama_event}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(event.tanggal_event).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {event.jam_mulai} - {event.jam_selesai}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {event.tempat}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(event)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded mr-2 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.event_id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}