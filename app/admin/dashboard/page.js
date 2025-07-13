'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from './adminNavbar';
import Image from 'next/image';

export default function AdminDashboard() {
  const [menus, setMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const formatWaktu = (waktuString) =>
    waktuString
      ? new Intl.DateTimeFormat('id-ID', {
          dateStyle: 'long',
          timeStyle: 'short',
          timeZone: 'Asia/Makassar',
        }).format(new Date(waktuString))
      : '-';

  useEffect(() => {
      const checkLogin = async () => {
      const res = await fetch('/api/auth/check');
      const data = await res.json();

      if (!data.loggedIn) {
        router.push('/admin/login'); 
      }
    };

    checkLogin();
    
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        console.log("👉 DATA FETCHED:", data);

        setMenus(data.items ?? []);    
        setUpdatedAt(data.updatedAt ?? null); 
      } catch (err) {
        console.error("❌ Gagal fetch menu:", err);
      } finally {
        setLoading(false); 
      }
    };


    fetchMenu();
  }, []);

  const handleChangeTampil = (id, value) => {
    const updatedMenus = menus.map(menu =>
      menu.id === id ? { ...menu, tampil: value === 'true' } : menu
    );
    setMenus(updatedMenus);
  };

  const handleHideAll = () => {
    const updatedMenus = menus.map(menu => ({ ...menu, tampil: false }));
    setMenus(updatedMenus);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: menus }),
    });

    const result = await res.json();
    console.log("🧾 HASIL RESPONSE:", result);

    if (res.ok) {
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        setIsSaving(false);
        router.refresh();
        router.push('/')
      }, 1000);
    } else {
      setIsSaving(false);
      alert('Gagal menyimpan!');
    }
  };

  


  if (loading) return <div className="p-4">Memuat data...</div>;

  

  const filteredMenus = menus.filter(menu =>
    menu.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <AdminNavbar />
      <div className="container py-4">
        <h3>Dashboard Admin</h3>
        <p>Update terakhir: {formatWaktu(updatedAt)}</p>

        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary custom-placeholder mt-3"
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="scroll-x">
          <table className="table table-bordered mt-4">
            <thead className="table-primary">
              <tr>
                <th className='text-center'>Gambar</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Tampil</th>
              </tr>
            </thead>
            <tbody className='table-dark'>
              {filteredMenus.map((menu, index) => (
                <tr key={menu.id}>
                  <td className='text-center'>
                    <Image
                      src={menu.gambar}
                      alt={menu.nama}
                      width={60}
                      height={60} 
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />

                  </td>
                  <td>{menu.nama}</td>
                  <td>Rp {menu.harga.toLocaleString()}</td>
                  <td>
                    <select
                      className="form-select"
                      value={menu.tampil ? 'true' : 'false'}
                      onChange={e => handleChangeTampil(menu.id, e.target.value)}
                    >
                      <option value="true">Ya</option>
                      <option value="false">Tidak</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-warning" onClick={handleHideAll}>
            Jgn Tampilkan Semua
          </button>
          <button className="btn btn-success" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => router.push('/')}>
            ← Kembali
          </button>
        </div>
      </div>
        {/* ✅ Modal Bootstrap */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-success text-white">
                <div className="modal-body text-center py-4">
                  <h5 className="mb-0">Berhasil disimpan!</h5>
                  <p className="mb-0">Mengalihkan ke halaman utama...</p>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
