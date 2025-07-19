'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminDashboard() {
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');
  const [showModal, setShowModal] = useState({
    show: false,
    message: '',
    type: '' // atau 'info', 'error', dll
  });
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [libur, setLibur] = useState(false);
  const [habisSemua, setHabisSemua] = useState(false);
  const [originalMenus, setOriginalMenus] = useState([]);

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

    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        
        setMenus(data.items ?? []);
        setOriginalMenus(data.items ?? []);
        setUpdatedAt(data.updatedAt ?? null);
        setLibur(data.libur);
        setHabisSemua(data.habisSemua ?? false);
      } catch (err) {
        console.error("❌ Gagal fetch menu:", err);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
    fetchMenu();
  }, []);

  const hasAutoResetRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const jam = now.getHours();
      const menit = now.getMinutes();

      if (jam === 17 && menit === 0 && habisSemua === true && !hasAutoResetRef.current) {
        hasAutoResetRef.current = true;
        setHabisSemua(false);
        console.log("✅ Auto-reset habisSemua jam 17:00");

        fetch('/api/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [], libur, habisSemua: false }),
        }).then(res => res.json())
          .then(data => console.log("📝 Auto-save berhasil:", data))
          .catch(err => console.error("❌ Auto-save gagal:", err));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [habisSemua, libur]);


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

    const originalMap = Object.fromEntries(originalMenus.map(menu => [menu.id, menu]));

    const menuBerubah = menus.filter(menu => {
      const original = originalMap[menu.id];
      return original && menu.tampil !== original.tampil;
    });

    let liburBerubah = false;
    let habisBerubah = false;
    try {
      const latest = await fetch('/api/menu').then(res => res.json());
      liburBerubah = latest.libur !== libur;
      habisBerubah = latest.habisSemua !== habisSemua;
    } catch (err) {
      console.error("Gagal cek status libur terbaru:", err);
    }

    // ✅ Jika tidak ada yang berubah
    if (menuBerubah.length === 0 && !liburBerubah && !habisBerubah) {
      setShowModal({
        show: true,
        message: "Tidak ada perubahan yang disimpan.",
        type: "info"
      });
      // Tutup modal otomatis setelah 1 detik
      setTimeout(() => {
        setShowModal({ show: false, message: '', type: '' });
        setIsSaving(false);
      }, 2000);
    }

    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: menuBerubah, libur, habisSemua }),
    });

    const result = await res.json();
    console.log("🧾 HASIL RESPONSE:", result);

    if (res.ok) {
      setShowModal({
        show: true,
        message: "Berhasil disimpan! Mengalihkan ke halaman utama...",
        type: "success"
      });

      setTimeout(() => {
        setShowModal({ show: false, message: '', type: '' });
        setIsSaving(false);
        router.refresh();
        router.push('/');
      }, 2000);
    } else {
      setShowModal({
        show: true,
        message: "Gagal menyimpan data!",
        type: "danger"
      });
      setIsSaving(false);
      setTimeout(() => {
        setShowModal({ show: false, message: '', type: '' });
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  };

  if (loading) return <div className="p-4">Memuat data...</div>;

  const itemsPerPage = 30;
  const filteredMenus = menus.filter(menu =>
    menu.nama.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const currentMenus = filteredMenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <>
      <div className="container py-4">
        <h3>Dashboard Admin</h3>
        <p>Update terakhir: {formatWaktu(updatedAt)}</p>

        <div className="row mt-4">
          <div className="col-auto text-center">
            <div className="form-check form-switch d-flex flex-column align-items-center">
              <input
                className={`form-check-input mb-1 ${libur ? 'switch-danger' : ''}`}
                type="checkbox"
                role="switch"
                id="liburSwitch"
                checked={libur}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setLibur(checked);
                  if (checked) setHabisSemua(false); // auto-uncheck habis\
                  handleHideAll();
                }}
              />
              <label
                className={`form-check-label fw-semibold ${libur ? 'text-danger' : 'text-secondary'}`}
                htmlFor="liburSwitch"
              >
                <i className="bi bi-calendar-x me-1"></i>Libur
              </label>
            </div>
          </div>

          <div className="col-auto text-center">
            <div className="form-check form-switch d-flex flex-column align-items-center">
              <input
                className="form-check-input mb-1"
                type="checkbox"
                role="switch"
                id="habisSwitch"
                checked={habisSemua}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setHabisSemua(checked);
                  if (checked) setLibur(false); // auto-uncheck libur
                  handleHideAll();
                }}
              />
              <label
                className={`form-check-label fw-semibold ${habisSemua ? 'text-info' : 'text-secondary'}`}
                htmlFor="habisSwitch"
              >
                <i className="bi bi-emoji-frown me-1"></i>Habis
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary custom-placeholder mt-3"
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // ✅ reset ke halaman pertama saat pencarian berubah
              }}
            />
          </div>
        </div>

        <div className="scroll-x">
          <table className="table table-bordered mt-4">
            <thead className="table-primary">
              <tr>
                <th>Tampil</th>
                <th>Nama</th>
                <th>Harga</th>
                <th className='text-center'>Gambar</th>
              </tr>
            </thead>
            <tbody className='table-dark'>
              {currentMenus.map((menu, index) => (
                <tr key={menu.id}>
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
                  <td>{menu.nama}</td>
                  <td>Rp {menu.harga.toLocaleString()}</td>
                  <td className='text-center'>
                    <Image
                      src={menu.gambar}
                      alt={menu.nama}
                      width={60}
                      height={60} 
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <nav>
          <ul className="pagination justify-content-end mt-3">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)}>First</button>
            </li>

            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
            </li>

            {[
              currentPage - 1,
              currentPage,
              currentPage + 1
            ]
              .filter((page) => page >= 1 && page <= totalPages) // hanya yang valid
              .map((page) => (
                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>Last</button>
            </li>
          </ul>
        </nav>
        <div className="d-flex flex-wrap gap-2 mt-3">
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
      
      
      {/* ✅ Modal Bootstrap dinamis */}
      {showModal.show && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content bg-${showModal.type} text-white`}>
              <div className="modal-body text-center py-4">
                <h5 className="mb-0">{showModal.message}</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
