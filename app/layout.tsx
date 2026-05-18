import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { AppGate } from "@/components/AppGate";

export const metadata: Metadata = {
  title: "Shavuot Dinner",
  description: "Celebrating Shavuot together",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee&family=Rubik+Mono+One&family=Frank+Ruhl+Libre:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app">
          <Hero />
          <AppGate>
            <Nav />
            <main className="content">{children}</main>
          </AppGate>
          <footer className="foot">
            <div>
              <span className="heb-small">חג שמח</span>
              <span> · Chag Shavuot Sameach</span>
            </div>
            <a className="admin-link" href="/admin">*admin access</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
