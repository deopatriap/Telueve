import axios from "axios";

// =============================
// API Base URL
// =============================
const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================
// Interceptor - Add token
// =============================
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");
  const token = adminToken || userToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// =============================
// Interceptor - Handle token expiration
// =============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      const msg = error.response?.data?.message || error.response?.data?.error || "";

      if (msg.includes("expired") || msg.includes("tidak valid") || msg.includes("Token")) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");

        const isAdmin = window.location.pathname.includes("/admin");
        window.location.href = isAdmin ? "/admin/login" : "/login";
      }
    }
    return Promise.reject(error);
  }
);

// =============================
// Auth Endpoints
// =============================
export const authAPI = {
  login: async (email: string, password: string) => {
    return (await api.post("/auth/login", { email, password })).data;
  },
  register: async (nama: string, email: string, password: string) => {
    return (await api.post("/auth/register", { nama, email, password })).data;
  },
};

// =============================
// Event Endpoints
// =============================
export const eventAPI = {
  getAllEvents: async () => (await api.get("/events")).data,

  getEventDetail: async (id: number) =>
    (await api.get(`/events/${id}`)).data,

  searchEvents: async (q: string) =>
    (await api.get("/events/search", { params: { q } })).data,

  getEventsPaginated: async (page: number, limit: number) =>
    (await api.get("/events/paginated", { params: { page, limit } })).data,
};

// =============================
// Registration Endpoints (UPDATED - Full CRUD)
// =============================
export const registrationAPI = {
  // POST /api/registrations/:eventId - Register for event
  register: async (eventId: number) =>
    (await api.post(`/registrations/${eventId}`)).data,

  // DELETE /api/registrations/:eventId - Cancel registration
  cancelRegistration: async (eventId: number) =>
    (await api.delete(`/registrations/${eventId}`)).data,

  // GET /api/registrations/my - Get my registrations
  getMyRegistrations: async () =>
    (await api.get(`/registrations/my`)).data,

  // GET /api/registrations/check/:eventId - Check if registered
  checkRegistration: async (eventId: number) =>
    (await api.get(`/registrations/check/${eventId}`)).data,

  // GET /api/registrations/stats - Get registration statistics (organizer/admin)
  getStatistics: async () =>
    (await api.get(`/registrations/stats`)).data,

  // GET /api/registrations/event/:eventId - Get all registrations for event (organizer/admin)
  getEventRegistrations: async (eventId: number) =>
    (await api.get(`/registrations/event/${eventId}`)).data,

  // PUT /api/registrations/:registrationId - Update registration status (organizer/admin)
  updateStatus: async (registrationId: number, status: 'pending' | 'accepted' | 'rejected') =>
    (await api.put(`/registrations/${registrationId}`, { status })).data,

  // DELETE /api/registrations/admin/:registrationId - Delete registration (admin only)
  deleteRegistration: async (registrationId: number) =>
    (await api.delete(`/registrations/admin/${registrationId}`)).data,
};

// =============================
// Admin Endpoints
// =============================
export const adminAPI = {
  login: async (username: string, password: string) =>
    (await api.post("/admin/login", { username, password })).data,

  getAllEvents: async () => (await api.get("/admin/events")).data,

  createEvent: async (
    nama_event: string,
    tanggal_event: string,
    jam_mulai: string,
    jam_selesai: string,
    tempat: string,
    deskripsi: string,
    kuota_peserta?: number
  ) =>
    (
      await api.post("/admin/events", {
        nama_event,
        tanggal_event,
        jam_mulai,
        jam_selesai,
        tempat,
        deskripsi,
        kuota_peserta,
      })
    ).data,

  updateEvent: async (
    event_id: number,
    nama_event: string,
    tanggal_event: string,
    jam_mulai: string,
    jam_selesai: string,
    tempat: string,
    deskripsi: string,
    kuota_peserta?: number
  ) =>
    (
      await api.put(`/admin/events/${event_id}`, {
        nama_event,
        tanggal_event,
        jam_mulai,
        jam_selesai,
        tempat,
        deskripsi,
        kuota_peserta,
      })
    ).data,

  deleteEvent: async (event_id: number) =>
    (await api.delete(`/admin/events/${event_id}`)).data,
};

export default api;