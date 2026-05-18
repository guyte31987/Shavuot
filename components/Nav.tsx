"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Details" },
  { href: "/about", label: "About Shavuot" },
  { href: "/dinner", label: "Dinner" },
  { href: "/profile", label: "My Profile" },
  { href: "/schedule", label: "Schedule" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={pathname === t.href ? "active" : ""}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
