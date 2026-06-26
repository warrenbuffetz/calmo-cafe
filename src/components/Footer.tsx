import Image from "next/image";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SketchField } from "@/components/SketchField";
import { sectionShell } from "@/lib/section";

const hours = [
  { days: "Mon – Thu", time: "7am – 4pm" },
  { days: "Fri – Sat", time: "7am – 8pm" },
  { days: "Sun", time: "8am – 4pm" },
];

const address = {
  line1: "1227 Dundas St W",
  line2: "Toronto, ON M6J 1X6",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1227+Dundas+St+W,+Toronto,+ON+M6J+1X6",
};

const contactLinks = [
  {
    href: "tel:+14165550127",
    label: "Call Calmo",
    icon: Phone,
  },
  {
    href: "mailto:hello@calmo.ca",
    label: "Email Calmo",
    icon: Mail,
  },
  {
    href: "https://instagram.com",
    label: "Calmo on Instagram",
    icon: Instagram,
    external: true,
  },
];

const iconLinkClassName =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-calmo-burnt-brown/12 text-calmo-burnt-brown/60 transition-all hover:border-calmo-blue hover:bg-calmo-blue/20 hover:text-calmo-blue";

export function Footer() {
  return (
    <footer id="visit" className={`${sectionShell} relative overflow-x-clip`}>
      <SketchField
        items={[
          {
            src: "/sketch-dish.png",
            width: 1024,
            height: 964,
            className: "hidden lg:block right-[8%] -bottom-8 w-[12rem] rotate-6 opacity-[0.07]",
          },
        ]}
      />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/footer-logo.png"
            alt="Calmo - Brunch & Coffee"
            width={1024}
            height={1024}
            unoptimized
            className="h-auto w-44 lg:w-48"
          />
        </div>

        <div>
          <h2 className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Location
          </h2>
          <address className="mt-4 not-italic">
            <a
              href={address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2.5 font-body text-sm leading-relaxed text-calmo-burnt-brown/75 transition-colors hover:text-calmo-blue"
            >
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-calmo-red-brown transition-colors group-hover:text-calmo-blue"
                strokeWidth={1.75}
              />
              <span>
                {address.line1}
                <br />
                {address.line2}
              </span>
            </a>
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
                className="flex w-fit items-center gap-6 border-b border-calmo-burnt-brown/8 pb-3 font-body text-sm text-calmo-burnt-brown/75 last:border-0"
              >
                <span className="flex w-24 items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-calmo-burnt-brown/35" strokeWidth={1.75} />
                  {days}
                </span>
                <span className="font-medium text-calmo-burnt-brown">{time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Contact
          </h2>
          <div className="mt-4 flex items-center gap-4">
            {contactLinks.map(({ href, label, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                aria-label={label}
                className={iconLinkClassName}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ))}
          </div>
          <p className="mt-6 font-accent text-sm italic leading-relaxed text-calmo-burnt-brown/45">
            Calmo captures the warm moments created together.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-6xl border-t border-calmo-burnt-brown/8 pt-8">
        <p className="text-center font-body text-xs uppercase tracking-[0.2em] text-calmo-burnt-brown/35">
          © {new Date().getFullYear()} Calmo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
