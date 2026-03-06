import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Warung Rara",
  description: "Warung Sederhana, Enak dan Murah",
};

export default function UserLayout({ children }) {
  return (
    <CartProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1 container py-4">{children}</main>

        <Footer />
      </div>
    </CartProvider>
  );
}
