"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { adminAPI, registrationAPI } from "@/lib/api";
import RegistrationsChart from "@/components/RegistrationsChart";
import Card from "./Card";
import Button from "./Button";
import Input from "./Input";
import Badge from "./Badge";

interface Event {
  id: number;
  nama_event: string;
  tanggal_event: string;
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  deskripsi: string;
  created_at?: string;
  total_registrations?: number;
  accepted_registrations?: number;
  kuota_peserta?: number;
}

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
}

export default function AdminDashboard({
  adminToken,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nama_event: "",
    tanggal_event: "",
    jam_mulai: "",
    jam_selesai: "",
    tempat: "",
    deskripsi: "",
  });

  /* State for Registrations View */
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);

  // Stats State
  const [dashboardStats, setDashboardStats] = useState({
    users: 0,
    events: 0,
    registrations: 0,
    pending_registrations: 0 // corrected key based on typical backend response
  });

  // Users Management State
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userEditForm, setUserEditForm] = useState({ nama: "", email: "" });

  // Global Registrations State
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [selectedRegistrationIds, setSelectedRegistrationIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");

  // Announcements State
  const [allAnnouncements, setAllAnnouncements] = useState<any[]>([]);
  const [announcementForm, setAnnouncementForm] = useState<any>(null); // null = close, object = open

  // Settings State
  const [settings, setSettings] = useState<any>({});

  // Memoize filtered registrations/stats if needed, but for now just fetching efficiently.
  // We can optimize the lists display.

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, []);

  // Fetch Logic based on Tab
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "registrations") fetchAllRegistrations();
    if (activeTab === "announcements") fetchAnnouncements();
    if (activeTab === "settings") fetchSettings();
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const data = await adminAPI.getSettings();
      setSettings(data);
    } catch (err) { }
  };

  const saveSettings = async () => {
    try {
      await adminAPI.updateSettings(settings);
      setSuccess("Configuration updated.");
    } catch (err) { setError("Save failed."); }
  };

  const fetchAnnouncements = async () => {
    try {
      const data = await adminAPI.getAllAnnouncements();
      setAllAnnouncements(data);
    } catch (err) { }
  };

  const createAnnouncement = async () => {
    try {
      if (!announcementForm.title || !announcementForm.content) return setError("Missing fields.");
      await adminAPI.createAnnouncement({ ...announcementForm, active: true });
      setSuccess("Broadcast transmitted.");
      setAnnouncementForm(null);
      fetchAnnouncements();
    } catch (err) { setError("Transmission failed."); }
  };

  const toggleAnnouncement = async (id: number, active: boolean) => {
    try {
      await adminAPI.toggleAnnouncement(id, active);
      fetchAnnouncements();
    } catch (err) { setError("Update failed."); }
  };

  const deleteAnnouncement = async (id: number) => {
    if (!confirm("Terminate broadcast?")) return;
    try {
      await adminAPI.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) { setError("Delete failed."); }
  };

  const fetchAllRegistrations = async () => {
    try {
      setRegistrationsLoading(true);
      const data = await adminAPI.getAllRegistrations();
      setAllRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to sync registry.");
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleBulkUpdate = async (status: string) => {
    try {
      setRegistrationsLoading(true);
      await adminAPI.bulkUpdateRegistrationStatus(selectedRegistrationIds, status);
      setSuccess(`Registrations updated to ${status}.`);
      setSelectedRegistrationIds([]);
      fetchAllRegistrations();
      fetchStats();
    } catch (err) {
      setError("Bulk update failed.");
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID,User Name,User Email,Event,Status,Date"];
    const rows = allRegistrations.map(r =>
      `${r.id},"${r.user_name}","${r.user_email}","${r.event_name}",${r.status},${new Date(r.registered_at).toISOString()}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registrations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch user database.");
    } finally {
      setUsersLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (confirm("CRITICAL WARNING: This will permanently purge the user and ALL associated registrations. Proceed?")) {
      try {
        await adminAPI.deleteUser(id);
        setSuccess("User record purged.");
        fetchUsers();
        fetchStats(); // Update stats cards
      } catch (err) {
        setError("Purge failed.");
      }
    }
  };

  const startUserEdit = (user: any) => {
    setEditingUserId(user.id);
    setUserEditForm({ nama: user.nama, email: user.email });
  };

  const cancelUserEdit = () => {
    setEditingUserId(null);
    setUserEditForm({ nama: "", email: "" });
  };

  const submitUserEdit = async () => {
    if (!editingUserId) return;
    try {
      await adminAPI.updateUser(editingUserId, userEditForm);
      setSuccess("User identity updated.");
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      setError("Update failed.");
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllEvents();
      if (data.data && Array.isArray(data.data)) {
        setEvents(data.data);
      } else if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
      setError("");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to fetch events";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
        setSuccess("Event protocol updated successfully.");
      } else {
        await adminAPI.createEvent(
          formData.nama_event,
          formData.tanggal_event,
          formData.jam_mulai,
          formData.jam_selesai,
          formData.tempat,
          formData.deskripsi
        );
        setSuccess("New event protocol initialized.");
      }
      resetForm();
      await fetchEvents();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Operation failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setEditingId(event.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: number) => {
    if (!id) {
      console.error("Invalid Event ID for deletion");
      setError("Cannot delete: Invalid Event ID");
      return;
    }
    if (confirm("WARNING: Database deletion is permanent. Confirm deletion?")) {
      try {
        setLoading(true);
        await adminAPI.deleteEvent(id);
        setSuccess("Event protocol deleted.");
        await fetchEvents();
      } catch (err: any) {
        setError("Deletion failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewRegistrations = async (event: Event) => {
    try {
      setLoading(true);
      console.log("Viewing registrations for event:", event);
      if (!event.id) {
        console.error("Event ID is missing!", event);
        setError("Invalid event data.");
        setLoading(false);
        return;
      }

      setError("");
      setSelectedEventName(event.nama_event);

      const data = await registrationAPI.getEventRegistrations(event.id);

      setRegistrations(Array.isArray(data) ? data : []);
      setShowRegistrations(true);
    } catch (err: any) {
      setError("Failed to retrieve user data.");
    } finally {
      setLoading(false);
    }
  };

  const closeRegistrations = () => {
    setShowRegistrations(false);
    setRegistrations([]);
    setSelectedEventName("");
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "events", label: "Events" },
    { id: "users", label: "Users" },
    { id: "registrations", label: "Registrations" },
    { id: "announcements", label: "Announcements" },
    { id: "settings", label: "Settings" },
  ];

  // Memoize filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.nama_event.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  // Memoize stats (dashboardStats takes precedence if available)
  const statsDisplay = useMemo(() => {
    return {
      totalUsers: dashboardStats?.users || users.length,
      totalEvents: events.length,
      totalRegistrations: dashboardStats?.registrations || registrations.length
    };
  }, [dashboardStats, users.length, events.length, registrations.length]);

  return (
    <div className="min-h-screen bg-nier-cream p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 border-b border-nier-dark/20 pb-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-[0.2em] text-nier-dark mb-2">
              COMMAND CENTER
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-nier-muted">
              Admin Operations Interface // V.2.1
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onLogout}
              className="hover:bg-nier-error hover:text-white hover:border-nier-error"
            >
              Terminating Session
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300
                border border-nier-dark/20
                ${activeTab === tab.id
                  ? "bg-nier-dark text-nier-cream shadow-md scale-105"
                  : "bg-transparent text-nier-dark hover:bg-nier-dark/5 hover:scale-105"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* System Notifications */}
        {error && (
          <div className="mb-6 animate-shake">
            <Badge variant="error" size="md" className="w-full justify-start py-3">
              ⚠ SYSTEM ERROR: {error}
            </Badge>
          </div>
        )}
        {success && (
          <div className="mb-6 animate-pulse">
            <Badge variant="success" size="md" className="w-full justify-start py-3">
              ✓ SYSTEM CONFIRMED: {success}
            </Badge>
          </div>
        )}

        {/* VIEW: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <Card decorative className="p-6 border-l-4 border-l-nier-dark">
                <div className="text-xs uppercase tracking-widest text-nier-muted mb-2">Total Users</div>
                <div className="text-4xl font-bold text-nier-dark">{statsDisplay.totalUsers}</div>
              </Card>
              <Card decorative className="p-6 border-l-4 border-l-nier-dark">
                <div className="text-xs uppercase tracking-widest text-nier-muted mb-2">Total Events</div>
                <div className="text-4xl font-bold text-nier-dark">{statsDisplay.totalEvents}</div>
              </Card>
              <Card decorative className="p-6 border-l-4 border-l-nier-dark">
                <div className="text-xs uppercase tracking-widest text-nier-muted mb-2">Registrations</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-nier-dark">{statsDisplay.totalRegistrations}</span>
                  {dashboardStats.pending_registrations > 0 && (
                    <span className="text-xs font-bold text-nier-warning bg-nier-warning/10 px-2 py-0.5 rounded-full">
                      {dashboardStats.pending_registrations} pending
                    </span>
                  )}
                </div>
              </Card>
              <Card decorative className="p-6 border-l-4 border-l-nier-success">
                <div className="text-xs uppercase tracking-widest text-nier-muted mb-2">System Status</div>
                <div className="text-lg font-bold text-nier-success animate-pulse">ONLINE</div>
              </Card>
            </div>

            {/* Charts */}
            {events.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold uppercase tracking-wide text-nier-dark mb-4 pl-4 border-l-4 border-nier-dark">Registration Analytics</h3>
                <RegistrationsChart events={events as any} />
              </div>
            )}
          </div>
        )}

        {/* VIEW: EVENTS */}
        {activeTab === "events" && (
          <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-nier-dark uppercase tracking-wide">
                Event Protocols
              </h2>
              {!showForm && !showRegistrations && (
                <Button
                  variant="primary"
                  onClick={() => setShowForm(true)}
                >
                  + Init Event
                </Button>
              )}
            </div>

            {/* Event Form */}
            {showForm && (
              <Card decorative className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6 border-b border-nier-border pb-4">
                  <h2 className="text-xl font-bold text-nier-dark uppercase tracking-wide">
                    {editingId ? "Modify Protocol" : "Initialize New Protocol"}
                  </h2>
                  <button onClick={resetForm} className="text-nier-muted hover:text-nier-dark">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Event Designation"
                      value={formData.nama_event}
                      onChange={(e) => setFormData({ ...formData, nama_event: e.target.value })}
                      required
                    />
                    <Input
                      label="Date"
                      type="date"
                      value={formData.tanggal_event}
                      onChange={(e) => setFormData({ ...formData, tanggal_event: e.target.value })}
                      required
                    />
                    <Input
                      label="Start Sequence"
                      type="time"
                      value={formData.jam_mulai}
                      onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                      required
                    />
                    <Input
                      label="End Sequence"
                      type="time"
                      value={formData.jam_selesai}
                      onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                      required
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Location Coordinates"
                        value={formData.tempat}
                        onChange={(e) => setFormData({ ...formData, tempat: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-nier-muted mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-nier-border focus:border-nier-dark outline-none transition-colors text-nier-dark placeholder-nier-muted/50"
                        placeholder="Enter mission details..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" variant="primary" loading={loading} className="flex-1">
                      {editingId ? "Update Protocol" : "Execute"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Registrations View (Within Events Tab for now) */}
            {showRegistrations && (
              <Card decorative className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-nier-dark uppercase tracking-wide">
                      User Data Stream
                    </h2>
                    <p className="text-xs text-nier-muted uppercase tracking-widest mt-1">
                      Source: {selectedEventName}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={closeRegistrations}>Close Stream</Button>
                </div>

                {registrations.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-nier-border">
                    <p className="text-nier-muted italic">No data packets received.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-mono text-left">
                      <thead className="bg-nier-sand/20 text-nier-dark uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Subject Name</th>
                          <th className="px-4 py-3">Contact</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-nier-border/50">
                        {registrations.map((reg, index) => (
                          <tr key={reg.id || index} className="hover:bg-nier-sand/10 transition-colors">
                            <td className="px-4 py-3 text-nier-muted">{reg.user_id}</td>
                            <td className="px-4 py-3 font-bold text-nier-dark">{reg.nama}</td>
                            <td className="px-4 py-3 text-nier-dark">{reg.email}</td>
                            <td className="px-4 py-3">
                              <Badge variant={
                                reg.status === 'accepted' ? 'success' :
                                  reg.status === 'rejected' ? 'error' : 'warning'
                              } size="sm">
                                {reg.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-nier-muted">{new Date(reg.registered_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {/* Events List */}
            {!showForm && !showRegistrations && (
              <Card decorative className="animate-fade-in">
                {loading ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="inline-block w-8 h-8 border-2 border-nier-dark border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs uppercase tracking-widest text-nier-muted">Syncing...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-nier-border">
                    <p className="text-nier-muted italic">Database empty.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-mono text-left">
                      <thead className="bg-nier-sand/20 text-nier-dark uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Event</th>
                          <th className="px-4 py-3">Timeline</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-nier-border/50">
                        {filteredEvents.map((event, index) => (
                          <tr key={event.id || index} className="group hover:bg-nier-sand/10 transition-colors">
                            <td className="px-4 py-4">
                              <div className="font-bold text-nier-dark text-base">{event.nama_event}</div>
                            </td>
                            <td className="px-4 py-4 text-nier-muted">
                              <div className="flex flex-col gap-1">
                                <span>{new Date(event.tanggal_event).toLocaleDateString("id-ID")}</span>
                                <span className="text-xs opacity-75">{event.jam_mulai} - {event.jam_selesai}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-nier-dark">
                              {event.tempat}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex gap-2 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" onClick={() => handleViewRegistrations(event)}>
                                  Users
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                                  Edit
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(event.id)}>
                                  Del
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* VIEW: USERS */}
        {activeTab === "users" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-bold text-nier-dark uppercase tracking-wide">User Database</h2>
                <div className="text-xs text-nier-muted uppercase tracking-widest">Total Records: {users.length}</div>
              </div>
              {/* Search could go here */}
            </div>

            <Card decorative>
              {usersLoading ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-block w-8 h-8 border-2 border-nier-dark border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs uppercase tracking-widest text-nier-muted">Decrypting User Data...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-nier-border">
                  <p className="text-nier-muted italic">No subjects found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-mono text-left">
                    <thead className="bg-nier-sand/20 text-nier-dark uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Identity</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Registered</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nier-border/50">
                      {users.map((user: any, index) => (
                        <tr key={user.id || index} className="hover:bg-nier-sand/10 transition-colors group">
                          <td className="px-4 py-3 text-nier-muted opacity-50">#{user.id}</td>
                          <td className="px-4 py-3 font-bold text-nier-dark">
                            {editingUserId === user.id ? (
                              <Input
                                value={userEditForm.nama}
                                onChange={(e) => setUserEditForm({ ...userEditForm, nama: e.target.value })}
                                className="h-8 text-xs"
                              />
                            ) : user.nama}
                          </td>
                          <td className="px-4 py-3 text-nier-dark">
                            {editingUserId === user.id ? (
                              <Input
                                value={userEditForm.email}
                                onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })}
                                className="h-8 text-xs"
                              />
                            ) : user.email}
                          </td>
                          <td className="px-4 py-3 text-nier-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            {editingUserId === user.id ? (
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="success" onClick={submitUserEdit}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={cancelUserEdit}>Cancel</Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" onClick={() => startUserEdit(user)}>Edit</Button>
                                <Button size="sm" variant="danger" onClick={() => deleteUser(user.id)}>Del</Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* VIEW: REGISTRATIONS */}
        {activeTab === "registrations" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-bold text-nier-dark uppercase tracking-wide">Global Registry</h2>
                <div className="text-xs text-nier-muted uppercase tracking-widest">Total Records: {allRegistrations.length}</div>
              </div>
              <div className="flex gap-2">
                {selectedRegistrationIds.length > 0 && (
                  <>
                    <Button size="sm" variant="success" onClick={() => handleBulkUpdate('accepted')}>
                      Approve ({selectedRegistrationIds.length})
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleBulkUpdate('rejected')}>
                      Reject ({selectedRegistrationIds.length})
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={handleExportCSV}>Export CSV</Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <select
                className="bg-transparent border border-nier-dark/20 text-xs uppercase p-2 focus:border-nier-dark outline-none"
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
              >
                <option value="all"> All Status </option>
                <option value="pending"> Pending </option>
                <option value="accepted"> Accepted </option>
                <option value="rejected"> Rejected </option>
              </select>
            </div>

            <Card decorative>
              {registrationsLoading ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-block w-8 h-8 border-2 border-nier-dark border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs uppercase tracking-widest text-nier-muted">Syncing Registry...</p>
                </div>
              ) : allRegistrations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-nier-border">
                  <p className="text-nier-muted italic">Registry complete. No records.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-mono text-left">
                    <thead className="bg-nier-sand/20 text-nier-dark uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-4 py-3">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                const filtered = allRegistrations.filter(r => filterStatus === 'all' || r.status === filterStatus);
                                setSelectedRegistrationIds(filtered.map(r => r.id));
                              } else {
                                setSelectedRegistrationIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Mission (Event)</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nier-border/50">
                      {allRegistrations
                        .filter(r => filterStatus === 'all' || r.status === filterStatus)
                        .map((reg) => (
                          <tr key={reg.id} className="hover:bg-nier-sand/10 transition-colors">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedRegistrationIds.includes(reg.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRegistrationIds([...selectedRegistrationIds, reg.id]);
                                  } else {
                                    setSelectedRegistrationIds(selectedRegistrationIds.filter(id => id !== reg.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-nier-dark">{reg.user_name}</div>
                              <div className="text-xs text-nier-muted">{reg.user_email}</div>
                            </td>
                            <td className="px-4 py-3 text-nier-dark">{reg.event_name}</td>
                            <td className="px-4 py-3">
                              <Badge variant={
                                reg.status === 'accepted' ? 'success' :
                                  reg.status === 'rejected' ? 'error' : 'warning'
                              } size="sm">
                                {reg.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-nier-muted">{new Date(reg.registered_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* VIEW: ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-nier-dark uppercase tracking-wide">Public Broadcasts</h2>
              <Button size="sm" onClick={() => setAnnouncementForm({ title: "", content: "", type: "info" })}>
                + New Broadcast
              </Button>
            </div>

            {/* Form (Toggled) */}
            {announcementForm && (
              <Card decorative className="p-6 mb-6">
                <h3 className="text-lg font-bold text-nier-dark mb-4">Compose Broadcast</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Content"
                    className="w-full bg-nier-light/50 border border-nier-dark/20 p-2 text-nier-dark focus:border-nier-dark outline-none transition-colors min-h-[100px]"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  />
                  <div className="flex gap-4">
                    <select
                      className="bg-transparent border border-nier-dark/20 p-2 text-sm uppercase"
                      value={announcementForm.type}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value })}
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                    </select>
                    <div className="flex-1"></div>
                    <Button variant="ghost" onClick={() => setAnnouncementForm(null)}>Cancel</Button>
                    <Button variant="primary" onClick={createAnnouncement}>Broadcast</Button>
                  </div>
                </div>
              </Card>
            )}

            <Card decorative>
              {/* List */}
              <div className="space-y-4">
                {allAnnouncements.length === 0 ? (
                  <div className="text-center py-8 text-nier-muted italic">No active broadcasts.</div>
                ) : (
                  allAnnouncements.map((ann) => (
                    <div key={ann.id} className="flex justify-between items-center p-4 border-b border-nier-dark/10 last:border-0 hover:bg-nier-sand/10 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge size="sm" variant={ann.type === 'error' ? 'error' : ann.type === 'warning' ? 'warning' : 'outline'}>
                            {ann.type}
                          </Badge>
                          <span className="font-bold text-nier-dark">{ann.title}</span>
                          {!ann.active && <span className="text-xs text-nier-muted">(OFFLINE)</span>}
                        </div>
                        <p className="text-sm text-nier-dark/80">{ann.content}</p>
                        <div className="text-xs text-nier-muted mt-1">{new Date(ann.created_at).toLocaleString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={ann.active ? "secondary" : "success"}
                          onClick={() => toggleAnnouncement(ann.id, !ann.active)}
                        >
                          {ann.active ? "Disable" : "Enable"}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => deleteAnnouncement(ann.id)}>Kill</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* VIEW: SETTINGS */}
        {activeTab === "settings" && (
          <div className="animate-fade-in space-y-6">
            <Card decorative className="p-8">
              <h2 className="text-xl font-bold text-nier-dark uppercase tracking-wide mb-6 pb-4 border-b border-nier-dark/20">System Configuration</h2>

              <div className="space-y-6 max-w-2xl">
                {/* Site Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-nier-dark font-bold">System Identity (Site Name)</label>
                  <Input
                    value={settings.site_name || ""}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  />
                  <p className="text-xs text-nier-muted">Visible on public headers and meta tags.</p>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border border-nier-dark/10 bg-nier-sand/10">
                    <div>
                      <div className="font-bold text-nier-dark uppercase text-sm">Registration Protocol</div>
                      <div className="text-xs text-nier-muted">Allow new users to join events</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, registration_open: !settings.registration_open })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.registration_open ? 'bg-nier-success' : 'bg-nier-muted'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.registration_open ? 'translate-x-6' : ''}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-nier-dark/10 bg-nier-sand/10">
                    <div>
                      <div className="font-bold text-nier-dark uppercase text-sm">Maintenance Mode</div>
                      <div className="text-xs text-nier-muted">Restrict access to administrators only</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.maintenance_mode ? 'bg-nier-warning' : 'bg-nier-muted'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenance_mode ? 'translate-x-6' : ''}`}></div>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-nier-dark/10">
                  <Button size="lg" variant="primary" className="w-full md:w-auto" onClick={saveSettings}>
                    Update Configuration
                  </Button>
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card decorative className="p-8 border-red-900/20 bg-red-900/5">
              <h3 className="text-lg font-bold text-red-900 uppercase tracking-wide mb-4">Danger Zone</h3>
              <p className="text-sm text-red-800/70 mb-4">Irreversible actions. Proceed with extreme caution.</p>
              <Button variant="danger" onClick={() => alert("Feature disabled for safety protocols.")}>
                Hard Reset Database
              </Button>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}