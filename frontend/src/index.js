import api from '../utils/api'; // GANTI dari axios biasa
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (p=1) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/events?page=${p}&limit=${limit}`);
      setEvents(res.data.data || res.data.events || res.data);
      setTotal(res.data.total || (res.data.data || res.data).length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchEvents(page); 
  }, [page]);

  const search = async () => {
    if (!q.trim()) {
      fetchEvents(1);
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.get(`/api/events/search?q=${encodeURIComponent(q)}`);
      const eventData = res.data.data || res.data;
      setEvents(eventData);
      setTotal(eventData.length);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div className="container">
        <header>
          <h1>Jelajahi Event Kampus</h1>
          <p>Temukan dan ikuti event menarik di kampus Anda</p>
          <div className="search-box">
            <input 
              placeholder="Cari event..." 
              value={q} 
              onChange={e => setQ(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && search()}
            />
            <button onClick={search}>Cari</button>
          </div>
        </header>

        <main>
          {loading ? (
            <div className="loading">Memuat event...</div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <p>Tidak ada event tersedia</p>
            </div>
          ) : (
            <div className="grid">
              {events.map(ev => (
                <EventCard key={ev.id} event={ev} onRegister={() => fetchEvents(page)} />
              ))}
            </div>
          )}
        </main>

        {!loading && events.length > 0 && (
          <footer className="pagination">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span>Halaman {page}</span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={events.length < limit}
            >
              Next →
            </button>
          </footer>
        )}
      </div>
    </>
  );
}