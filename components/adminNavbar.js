'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminNavbar() {
  const router = useRouter();

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
          <Image className="rounded" src="/logo.jpg" alt="Logo Warung Rara" width={30} height={30} />
          <span className="fw-bold text-orange">Warung Rara</span>
        </Link>

        <div className="ms-auto">
          <ul className="navbar-nav dropdown d-flex align-items-center">
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
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
