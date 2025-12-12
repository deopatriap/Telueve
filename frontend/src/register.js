import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({ nama:'', email:'', password:'' });
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/auth/register', form);
      setMsg(res.data.message || 'Berhasil');
      router.push('/login');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input placeholder="Nama" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
        <button type="submit">Daftar</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
