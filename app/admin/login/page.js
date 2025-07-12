'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json(); // << error di sini jika response kosong

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      
      <h3 className="mb-3 d-flex justify-content-center">Login Admin</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {/* Tombol Login & Kembali di 1 baris */}
        <div className="d-flex justify-content-between gap-2">
          <button type="submit" className="btn btn-dark w-50">
            Login
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary w-50"
            onClick={() => router.back()}
          >
            ← Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
