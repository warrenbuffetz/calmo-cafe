import { Clock, Instagram, MapPin } from "lucide-react";

const hours = [
  { days: "Mon – Thu", time: "7am – 4pm" },
  { days: "Fri – Sat", time: "7am – 8pm" },
  { days: "Sun", time: "8am – 4pm" },
];

export function Footer() {
  return (
    <footer id="visit" className="border-t border-calmo-burnt-brown/8 px-6 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
        <div>
          <h2 className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Location
          </h2>
          <address className="mt-4 space-y-2 not-italic">
            <p className="flex items-start gap-2.5 font-body text-sm leading-relaxed text-calmo-burnt-brown/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-calmo-red-brown" strokeWidth={1.75} />
              <span>
                1227 Dundas St W
                <br />
                Toronto, ON M6J 1X6
              </span>
            </p>
          </address>
          <p className="mt-4 inline-block rounded-full bg-calmo-blue/30 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-calmo-burnt-brown/70">
            Walk-ins only
          </p>
        </div>

        <div>
          <h2 className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Hours
          </h2>
          <ul className="mt-4 space-y-3">
            {hours.map(({ days, time }) => (
              <li
                key={days}
                className="flex items-center justify-between gap-4 border-b border-calmo-burnt-brown/8 pb-3 font-body text-sm text-calmo-burnt-brown/75 last:border-0"
              >
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-calmo-burnt-brown/35" strokeWidth={1.75} />
                  {days}
                </span>
                <span className="font-medium text-calmo-burnt-brown">{time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Follow
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Calmo on Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-calmo-burnt-brown/12 text-calmo-burnt-brown/60 transition-all hover:border-calmo-red-brown/30 hover:bg-calmo-red-brown/5 hover:text-calmo-red-brown"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
          <p className="mt-6 font-accent text-sm italic leading-relaxed text-calmo-burnt-brown/45">
            Calmo captures the warm moments created together.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl border-t border-calmo-burnt-brown/8 pt-8">
        <p className="text-center font-body text-xs uppercase tracking-[0.2em] text-calmo-burnt-brown/35">
          © {new Date().getFullYear()} Calmo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
