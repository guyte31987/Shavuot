"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const row1 = [
  { href: "/", label: "Details" },
  { href: "/about", label: "About Shavuot" },
  { href: "/dinner", label: "Dinner" },
];

const row2 = [
  { href: "/profile", label: "My Profile" },
  { href: "/schedule", label: "Schedule" },
];

const teesh = { href: "/teesh", label: "Pics of Teesh" };

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
      </div>
      <div className="nav-row nav-row-teesh">
        <Link
          href={teesh.href}
          className={`teesh-pill${isActive(teesh.href) ? " active" : ""}`}
        >
          🐾 {teesh.label}
        </Link>
      </div>
    </nav>
  );
}
