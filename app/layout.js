import 'bootstrap/dist/css/bootstrap.min.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from '@/components/navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Warung Rara",
  description: "Warung Sederhana, Enak dan Murah",
  icons: {
    icon: "/logo.jpg", // atau "/favicon.png"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* navbar */}
        {/* <Navbar /> */}
        {/* content */}
        <main className="container pb-5">
          {children}
        </main>

      </body>
    </html>
  );
}
