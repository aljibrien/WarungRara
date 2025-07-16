import 'bootstrap/dist/css/bootstrap.min.css';
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
const geistSans = Geist({ 
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  icons: {
    icon: [
      {
        url: "/logo.jpg",
        type: "image/jpg",
        sizes: "32x32"
      }
    ]
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta name="google-site-verification" content="mKXBFWNAmhRB3S8oABrdK5hvziyKnF3nrSurRGan70U" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main className="container-fluid px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
