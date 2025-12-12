import { useState, useEffect } from 'react';
import api from '../utils/api';
import Cookies from 'js-cookie';

export default function EventCard({ event, onRegister }) {
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [regStatus, setRegStatus] = useState(null);
  const [message, setMessage] = useState('');

  // Check if user already registered
  useEffect(() => {
    checkRegistration();
  }, [event.id]);

  const checkRegistration = async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      const res = await api.get(`/api/registrations/check/${event.id}`);
      setRegistered(res.data.isRegistered);
      setRegStatus(res.data.registration?.status);
    } catch (err) {
      console.error('Check registration error:', err);
    }
  };

  const handleRegister = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setMessage('Anda harus login terlebih dahulu');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    try {
      setRegistering(true);
      setMessage('');
      
      const res = await api.post(`/api/registrations/15`);
      
      setMessage(res.data.message || 'Berhasil mendaftar!');
      setRegistered(true);
      setRegStatus('pending');
      
      if (onRegister) onRegister();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal mendaftar';
      setMessage(errorMsg);
      console.error('Register error:', err);
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Belum ditentukan';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = () => {
    if (!registered) return null;
    
    const badges = {
      pending: { text: 'Menunggu Konfirmasi', color: 'orange' },
      accepted: { text: 'Terdaftar', color: 'green' },
      rejected: { text: 'Ditolak', color: 'red' }
    };
    
    const badge = badges[regStatus] || badges.pending;
    
    return (
      <span className={`badge badge-${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <h3>{event.nama_event || event.name}</h3>
        {getStatusBadge()}
      </div>
      
      <div className="event-body">
        <p className="event-desc">
          {event.deskripsi || event.description || 'Tidak ada deskripsi'}
        </p>
        
        <div className="event-details">
          <div className="detail-item">
            <span className="icon">📅</span>
            <span>{formatDate(event.tanggal_event || event.waktu_event)}</span>
          </div>
          
          {event.jam_mulai && (
            <div className="detail-item">
              <span className="icon">🕐</span>
              <span>{event.jam_mulai}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="icon">📍</span>
            <span>{event.tempat || 'Lokasi belum ditentukan'}</span>
          </div>
          
          {event.organizer_name && (
            <div className="detail-item">
              <span className="icon">👤</span>
              <span>{event.organizer_name}</span>
            </div>
          )}
          
          {event.kuota_peserta && (
            <div className="detail-item">
              <span className="icon">👥</span>
              <span>
                {event.accepted_registrations || 0} / {event.kuota_peserta} peserta
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="event-footer">
        {message && (
          <p className={`message ${message.includes('Gagal') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
        
        {!registered ? (
          <button 
            className="btn-primary" 
            onClick={handleRegister}
            disabled={registering}
          >
            {registering ? 'Mendaftar...' : 'Daftar'}
          </button>
        ) : (
          <button className="btn-secondary" disabled>
            Lihat Detail
          </button>
        )}
      </div>
    </div>
  );
}