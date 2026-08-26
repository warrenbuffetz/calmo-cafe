import Image from "next/image";
import Link from "next/link";
import { isReservationsEnabled } from "@/lib/features";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#menu", label: "Menu" },
  ...(isReservationsEnabled() ? [{ href: "/reservations", label: "Reserve" }] : []),
  { href: "/#visit", label: "Visit" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-calmo-burnt-brown/8 bg-calmo-beige/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" aria-label="Calmo home" className="group relative inline-block">
          <Image
            src="/logo-brown.png"
            alt="Calmo"
            width={1024}
            height={230}
            priority
            unoptimized
            className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-0 sm:h-9"
          />
          <Image
            src="/logo-blue.png"
            alt=""
            aria-hidden
            width={1024}
            height={230}
            unoptimized
            className="absolute inset-0 h-8 w-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-9"
          />
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-6 sm:gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-body text-xs font-medium uppercase tracking-[0.18em] text-calmo-burnt-brown/70 transition-colors hover:text-calmo-blue"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
