import api from '../utils/api'; // GANTI DARI axios BIASA
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [msg, setMsg] = useState('');
  const router = useRouter();
  
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', form); // TIDAK PERLU BASEURL LAGI
      const token = res.data.token;
      Cookies.set('token', token);
      router.push('/');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };
  
  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}