"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const row1 = [
  { href: "/", label: "Details" },
  { href: "/about", label: "About Shavuot" },
  { href: "/dinner", label: "Dinner" },
  { href: "/tikkun", label: "Tikkun" },
];

const row2 = [
  { href: "/profile", label: "My Profile" },
  { href: "/schedule", label: "Schedule" },
];

export function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <nav className="nav">
      <div className="nav-row">
        {row1.map((t) => (
          <Link key={t.href} href={t.href} className={isActive(t.href) ? "active" : ""}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className="nav-row">
        {row2.map((t) => (
          <Link key={t.href} href={t.href} className={isActive(t.href) ? "active" : ""}>
            {t.label}
          </Link>
        ))}
        <Link
          href="/teesh"
          className={`teesh-pill${isActive("/teesh") ? " active" : ""}`}
        >
          🐾 Pics of Teesh
        </Link>
      </div>
    </nav>
  );
}
