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

        <meta property="og:title" content="Warung Rara - Makanan Rumahan Terjangkau" />
        <meta property="og:description" content="Makanan rumahan khas Makassar, cocok untuk sarapan dan makan siang." />
        <meta property="og:image" content="https://gadderara.vercel.app/logo.jpg" />
        <meta property="og:url" content="https://gadderara.vercel.app" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Warung Rara - Makanan Rumahan Terjangkau" />
        <meta name="twitter:description" content="Aneka lauk dan nasi khas rumahan." />
        <meta name="twitter:image" content="https://gadderara.vercel.app/logo.jpg" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Warung Rara",
              url: "https://gadderara.vercel.app",
              logo: "https://gadderara.vercel.app/logo.jpg",
              sameAs: [
                "https://www.instagram.com/warungraraa"
              ]
            }),
          }}
        />

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
