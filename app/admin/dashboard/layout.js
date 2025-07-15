
import AdminNavbar from '@/components/adminNavbar';

export const metadata = {
  title: "Admin - Warung Rara",
  description: "Halaman Admin untuk mengelola menu dan status warung"
};

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <main className="container py-4">{children}</main>
    </>
  );
}
