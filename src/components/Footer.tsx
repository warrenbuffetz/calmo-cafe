import Image from "next/image";
import { Clock, Instagram, Mail, MapPin } from "lucide-react";
import { SketchField } from "@/components/SketchField";
import { footerSectionSurface, sectionShell } from "@/lib/section";
import { venue } from "@/lib/venue";

const { hours, address } = venue;

const followLinkClassName =
  "group flex items-center gap-2.5 font-body text-sm leading-relaxed text-calmo-burnt-brown/75 transition-colors hover:text-calmo-blue";

export function Footer() {
  return (
    <footer id="visit" className={`${sectionShell} ${footerSectionSurface} relative overflow-x-clip`}>
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
            alt={`Calmo — ${venue.category}`}
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
          <a
            href={address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Calmo on Google Maps"
            className="mt-3 block w-full max-w-[13.5rem] transition-opacity hover:opacity-85"
          >
            <Image
              src="/footer-map.png"
              alt="Hand-drawn map of Calmo at Dundas St W and Grove Ave"
              width={1024}
              height={768}
              unoptimized
              className="h-auto w-full"
            />
          </a>
          <address className="mt-3 not-italic">
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
            {hours.map(({ days, time, closed }) => (
              <li
                key={days}
                className="flex w-fit items-center gap-6 border-b border-calmo-burnt-brown/8 pb-3 font-body text-sm text-calmo-burnt-brown/75 last:border-0"
              >
                <span className="flex w-24 items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-calmo-burnt-brown/35" strokeWidth={1.75} />
                  {days}
                </span>
                <span
                  className={
                    closed
                      ? "font-medium text-calmo-burnt-brown/45"
                      : "font-medium text-calmo-burnt-brown"
                  }
                >
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
            Follow
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="https://www.instagram.com/calmo.cafebar/"
                target="_blank"
                rel="noopener noreferrer"
                className={followLinkClassName}
              >
                <Instagram
                  className="h-4 w-4 shrink-0 text-calmo-red-brown transition-colors group-hover:text-calmo-blue"
                  strokeWidth={1.75}
                />
                <span className="font-medium text-calmo-burnt-brown transition-colors group-hover:text-calmo-blue">
                  @calmo.cafebar
                </span>
              </a>
            </li>
            <li>
              <a href="mailto:hello@calmo.ca" className={followLinkClassName}>
                <Mail
                  className="h-4 w-4 shrink-0 text-calmo-red-brown transition-colors group-hover:text-calmo-blue"
                  strokeWidth={1.75}
                />
                <span>hello@calmo.ca</span>
              </a>
            </li>
          </ul>
          <p className="mt-6 font-accent text-sm italic leading-relaxed text-calmo-burnt-brown/45">
            {venue.description}
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
