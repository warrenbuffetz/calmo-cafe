import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-calmo-burnt-brown/8 bg-calmo-beige/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#" aria-label="Calmo home" className="text-calmo-burnt-brown transition-colors hover:text-calmo-blue">
          <Logo size="sm" />
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
