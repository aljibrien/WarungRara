import Footer from '@/components/footer';
import Navbar from '@/components/navbar';


export const metadata = {
  title: "Warung Rara",
  description: "Warung Sederhana, Enak dan Murah"
};

export default function UserLayout({ children }) {
  return (  
    <>
      {/* navbar */}
      <Navbar />
      {/* content */}
      <main className="container pb-5">
        {children}
      </main>
      <Footer />
   </>
  );
}
