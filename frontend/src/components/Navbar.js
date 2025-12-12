import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Navbar({ onLogout }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => router.push('/')}>
          🎓 Event Campus
        </div>
        
        <div className="nav-menu">
          {isLoggedIn ? (
            <>
              <button className="nav-link" onClick={() => router.push('/')}>
                Event
              </button>
              <button className="nav-link" onClick={() => router.push('/my-events')}>
                Event Saya
              </button>
              <button className="btn-logout" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => router.push('/login')}>
                Login
              </button>
              <button className="btn-primary" onClick={() => router.push('/register')}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}