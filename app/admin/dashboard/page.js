'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from './adminNavbar';
import Image from 'next/image';

export default function AdminDashboard() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenus(data.items);
      setUpdatedAt(data.updatedAt);
      setLoading(false);
    };

    fetchMenu();
  }, []);

  const handleChangeTampil = (index, value) => {
    const updatedMenus = [...menus];
    updatedMenus[index].tampil = value === 'true';
    setMenus(updatedMenus);
  };

  const handleHideAll = () => {
    const updatedMenus = menus.map(menu => ({ ...menu, tampil: false }));
    setMenus(updatedMenus);
  };

  const handleSave = async () => {
    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: menus,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setUpdatedAt(updated.updatedAt);
      setShowModal(true);

      // ⏳ Tunggu 2 detik lalu redirect
      setTimeout(() => {
        setShowModal(false);
        router.push('/');
      }, 1000);
    } else {
      alert('Gagal menyimpan!');
    }
  };

  if (loading) return <div className="p-4">Memuat data...</div>;

  return (
    <>
      <AdminNavbar />
      <div className="container py-4">
        <h3>Dashboard Admin</h3>
        <p>Update terakhir: {new Date(updatedAt).toLocaleString('id-ID')}</p>

        <div className="table-responsive">
          <table className="table table-bordered mt-4">
            <thead className="table-dark">
              <tr>
                <th className='text-center'>Gambar</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Tampil</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu, index) => (
                <tr key={menu.id}>
                  <td className='text-center'>
                    <Image
                      src={menu.gambar}
                      alt={menu.nama}
                      width={60}
                      height={60} // tambahkan height agar tidak error
                      style={{ objectFit: 'cover', borderRadius: '4px' }} // opsional: biar rapi
                    />

                  </td>
                  <td>{menu.nama}</td>
                  <td>Rp {menu.harga.toLocaleString()}</td>
                  <td>
                    <select
                      className="form-select"
                      value={menu.tampil ? 'true' : 'false'}
                      onChange={e => handleChangeTampil(index, e.target.value)}
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
            Jangan Tampilkan Semua
          </button>
          <button className="btn btn-success" onClick={handleSave}>
            Simpan Perubahan
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
