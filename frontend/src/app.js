import '../styles/globals.css';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem('theme') === 'dark';
    setDark(v);
    document.documentElement.dataset.theme = v ? 'dark' : 'light';
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  return <Component {...pageProps} theme={{ dark, toggle }} />;
}
