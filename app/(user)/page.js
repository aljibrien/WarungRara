'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [updatedAt, setUpdatedAt] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [libur, setLibur] = useState(false);
  const [habisSemua, setHabisSemua] = useState(false);
  const [sekarang, setSekarang] = useState(new Date());
  const [menus, setMenus] = useState([]);

  const jamSekarang = sekarang.getHours();
  const menitSekarang = sekarang.getMinutes();  
  
  // Warung buka jam 08:30 dan tutup jam 17:00
  const sebelumBuka = (jamSekarang >= 6 && jamSekarang < 8) || (jamSekarang === 8 && menitSekarang < 30);
  const setelahTutup = jamSekarang >= 17;
  const sedangTutup = jamSekarang < 6 || sebelumBuka || setelahTutup;

  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setInterval(() => {
    const makassarTime = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar' })
      );
      setSekarang(makassarTime);
    }, 60000); // update per menit

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        const aktif = data.items.filter(item => item.tampil);
        setUpdatedAt(data.updatedAt ?? null);
        setLibur(data.libur);
        setHabisSemua(data.habisSemua);
        setMenus(aktif);
      });
  }, []);
    
  function waktuRelatif(updatedAt) {
    if (!updatedAt) return '';

    const updated = new Date(updatedAt); // Sudah UTC (ISO 8601)
    const now = new Date(); // Ini UTC juga di JS backend/frontend modern

    const selisihDetik = Math.floor((now - updated) / 1000);
    const hari = Math.floor(selisihDetik / 86400);
    const jam = Math.floor((selisihDetik % 86400) / 3600);
    const menit = Math.floor((selisihDetik % 3600) / 60);

    console.log('🕒 updatedAt:', updated);
    console.log('🕒 now:', now);
    console.log('⏱️ Selisih:', { hari, jam, menit });

    if (selisihDetik < 60) return 'baru saja';
    if (selisihDetik < 3600) return `${menit} menit yang lalu`;
    if (selisihDetik < 86400) return `${jam} jam yang lalu`;
    if (hari === 1) return 'kemarin';
    return `${hari} hari yang lalu`;
  }



  // ✅ Filter data berdasarkan search term
  const filteredMenus = menus.filter(menu =>
    menu.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const currentMenus = filteredMenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatWaktu = updatedAt ? waktuRelatif(updatedAt) : '';

    let statusWarung = '';
    let warnaStatus = '';

    if (libur) {
      statusWarung = 'Warung Libur (Tidak Buka Hari Ini)';
      warnaStatus = '#6c757d';
    } else if (setelahTutup) {
      statusWarung = 'Warung TUTUP';
      warnaStatus = '#dc3545'; // merah
    } else if (sebelumBuka) {
      statusWarung = 'Warung BELUM BUKA (08:30 - 17:00)';
      warnaStatus = '#ffc107'; // kuning
    } else if (habisSemua) {
      statusWarung = 'Menu Habis Hari Ini';
      warnaStatus = '#0dcaf0'; // biru muda
    } else if (menus.length === 0) {
      statusWarung = 'Warung Buka (Menu Blm di Updated)';
      warnaStatus = '#ff00ddff'; // pink
    } else {
      statusWarung = 'Warung BUKA (08:30 - 17:00)';
      warnaStatus = '#28a745'; // hijau
    }

  return (
    <>
      {/* Info buka/tutup warung */}
      <div className="container mt-3">
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-inline-block rounded-circle"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: warnaStatus,
            }}
          ></span>
          <span className="fw-semibold small">{statusWarung}</span>
        </div>
      </div>

      {/* Hero Section / Deskripsi Warung */}
      <div className="container py-3">
        <div className="row flex-column-reverse flex-md-row align-items-center">
          {/* Kolom Kiri: Teks */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h2 className="fw-bold mb-3 fs-1">Selamat Datang di <span className='text-orange'>Warung Rara</span></h2>
            <p className="mb-2">
              Warung Rara menyediakan aneka makanan rumahan yang lezat dan terjangkau, cocok untuk makan siang, dan sarapan pagi. Nikmati cita rasa masakan khas rumahan dengan harga bersahabat!
            </p>

            {/* Ikon Media Sosial */}
            <div className="mb-3">
              <a href="https://www.instagram.com/warungraraa?igsh=OWd0YWxjNmZrbDIy" target="_blank" className="me-3 text-decoration-none text-secondary fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              {/* Tambah ikon lain kalau perlu */}
            </div>

            {/* Tombol WhatsApp */}
            <a
              href="https://wa.me/6282192974537?text=Halo%20Warung%20Rara%2C%20saya%20mau%20tanya%20menu"
              className="btn btn-danger rounded-pill px-4 py-2"
              target="_blank"
            >
              <i className="bi bi-whatsapp me-2"></i>Contact WA
            </a>
          </div>

          {/* Kolom Kanan: Gambar */}
          <div className="col-md-6 text-center">
            <Image
              src="/ilustrationwarung.png"
              alt="Ilustrasi Warung"
              width={400} // atau ukuran sesuai gambar kamu
              height={300}
              className="img-fluid rounded shadow-sm"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container py-4" id="menu">
        <h3 className="mb-3 fw-bold text-orange">Menu Tersedia Hari Ini</h3>
        <hr className="w-25" />
        <small className="text-info d-flex justify-content-end">Updated : {formatWaktu || 'Tidak Diketahui'}</small>

        {/* ✅ Input pencarian */}
        <div className="row mt-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary custom-placeholder"
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset ke page 1 saat cari
              }}
            />
          </div>
        </div>

        {(libur || sedangTutup || habisSemua || menus.length === 0) ? (
          <div className={`alert text-center mt-4 ${ libur ? 'alert-secondary' : sedangTutup ? 'alert-danger' : habisSemua ? 'alert-info' : 'alert-warning'}`}>
            {libur
              ? 'Warung sedang libur hari ini'
              : sedangTutup
              ? 'Warung saat ini tutup. Silakan kembali lagi sesuai jam operasional.'
              : habisSemua
              ? 'Menu hari ini sudah habis semua.'
              : 'Belum ada menu yang di updated.'}
          </div>
        ) : (
          <>
            <div className="row mt-3">
              {currentMenus.map(menu => (
                <div className="col-md-3 mb-3" key={menu.id}>
                  <div className="card h-100 text-white bg-dark shadow-sm hover-lift">
                    <Image
                      src={menu.gambar}
                      alt={menu.nama}
                      width={300}         // sesuaikan dengan kebutuhan layout kamu
                      height={200}        // pastikan aspect ratio sesuai dengan gambar
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-danger">{menu.nama}</h5>
                      <p className="card-text">{menu.deskripsi}</p>
                      <a className="fw-bold bg-warning text-dark rounded-pill px-2 py-1">
                        Rp {menu.harga.toLocaleString()}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <nav className="mt-4">
              <ul className="pagination justify-content-end">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Lokasi Section */}
      <div className="container py-5" id="lokasi">
        <h3 className="mb-3 fw-bold text-orange">Lokasi Warung</h3>
        <hr className="w-25" />

        <p>
          <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
          Antang, Kec. Manggala, Kota Makassar, Sulawesi Selatan 90234
        </p>

        {/* Google Maps iframe */}
        <div className="d-flex justify-content-center mt-3">
          <div className="rounded shadow-sm overflow-hidden" style={{ maxWidth: '800px', width: '100%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238.64944786378445!2d119.47482803775581!3d-5.166220448705949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee3db8d9934e3%3A0x1c8a52c8c9a13d91!2sWarung%20Rara!5e1!3m2!1sid!2sid!4v1752307225216!5m2!1sid!2sid"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
