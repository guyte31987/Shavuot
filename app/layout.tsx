import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Shavuot Dinner",
  description: "Celebrating Shavuot together",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <header className="hero">
            <h1>Shavuot Dinner</h1>
            <p className="tagline">Friday, May 22 · 7:30 PM</p>
          </header>
          <Nav />
          <main className="content">{children}</main>
          <footer className="foot">
            <p>Chag Shavuot Sameach · חג שבועות שמח</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
