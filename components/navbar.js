'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);


  return (
    <>
      {/* Navbar Atas */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
            <Image className='rounded' src="/logo.jpg" alt="Logo Warung Rara" width={30} height={30} />
            <span className="fw-bold text-orange">Warung Rara</span>
          </Link>

          <div className="ms-auto ">
            <ul className="navbar-nav dropdown d-flex align-items-center">
              <li className="nav-item d-none d-lg-block">
                <Link className="nav-link" href="/">Beranda</Link>
              </li>
              <li className="nav-item d-none d-lg-block">
                <Link className="nav-link" href="#menu">Menu</Link>
              </li>
              {/* <li className="nav-item d-none d-lg-block">
                <Link className="nav-link" href="/pesanan">Pesanan</Link>
              </li> */}
              <li className="nav-item d-none d-lg-block">
                <Link className="nav-link" href="#lokasi">Lokasi</Link>
              </li>
              <li className="nav-item dropdown position-relative">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-3"></i>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end mt-2 shadow"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 9999,
                    transform: 'translateX(-10%)',
                  }}
                >
                  <li>
                    <Link className="dropdown-item" href="/admin/dashboard">
                      Login Admin
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      {/* Navbar Bawah (Mobile) */}
      <nav className="navbar navbar-dark bg-dark fixed-bottom d-flex d-lg-none border-top">
        <div className="container justify-content-around py-1">

          <Link href="/" className="text-center text-decoration-none text-white small">
            <i className="bi bi-house-door" style={{ fontSize: '20px' }}></i>
            <div>Beranda</div>
          </Link>

          <Link href="#menu" className="text-center text-decoration-none text-white small">
            <i className="bi bi-fork-knife" style={{ fontSize: '20px' }}></i>
            <div>Menu</div>
          </Link>

          {/* <Link href="/pesanan" className="text-center text-decoration-none text-white small">
            <i className="bi bi-cart-check" style={{ fontSize: '20px' }}></i>
            <div>Pesanan</div>
          </Link> */}

          <Link href="#lokasi" className="text-center text-decoration-none text-white small">
            <i className="bi bi-geo-alt" style={{ fontSize: '20px' }}></i>
            <div>Lokasi</div>
          </Link>

        </div>
      </nav>
    </>
  );
}
