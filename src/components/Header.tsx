import Image from "next/image";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-calmo-burnt-brown/8 bg-calmo-beige/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#" aria-label="Calmo home" className="group relative inline-block">
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
        </a>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-6 sm:gap-8">
            {[
              { href: "#about", label: "About" },
              { href: "#menu", label: "Menu" },
              { href: "#visit", label: "Visit" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-body text-xs font-medium uppercase tracking-[0.18em] text-calmo-burnt-brown/70 transition-colors hover:text-calmo-blue"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
