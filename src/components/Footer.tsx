import Image from "next/image";
import { Clock, Instagram, Mail, MapPin } from "lucide-react";
import { SketchField } from "@/components/SketchField";
import { footerSectionSurface, sectionShell } from "@/lib/section";
import type { VenueHours } from "@/lib/venue";
import { venue } from "@/lib/venue";

const { address } = venue;
const defaultHours = [...venue.hours] as VenueHours[];

const fullAddress = `${address.line1}, ${address.line2}`;

const followLinkClassName =
  "group flex items-center gap-2.5 font-body text-sm leading-relaxed text-calmo-burnt-brown/75 transition-colors hover:text-calmo-blue";

const eyebrowClassName =
  "font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown";

function FooterCopyright() {
  return (
    <p className="text-center font-body text-xs uppercase tracking-[0.2em] text-calmo-burnt-brown/35">
      © {new Date().getFullYear()} Calmo. All rights reserved.
    </p>
  );
}

function FooterMobile({ hours }: { hours: VenueHours[] }) {
  return (
    <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 md:hidden">
      <Image
        src="/footer-logo.png"
        alt={`Calmo — ${venue.category}`}
        width={1024}
        height={1024}
        unoptimized
        className="mx-auto h-auto w-[6.5rem]"
      />

      <div className="flex flex-col gap-3">
        <h2 className={eyebrowClassName}>Location</h2>
        <a
          href={address.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Calmo on Google Maps"
          className="block w-full overflow-hidden rounded-sm transition-opacity hover:opacity-85"
        >
          <Image
            src="/footer-map.png"
            alt="Hand-drawn map of Calmo at Dundas St W and Grove Ave"
            width={1024}
            height={768}
            unoptimized
            className="aspect-[2/1] w-full object-cover"
          />
        </a>
        <address className="not-italic">
          <a
            href={address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-start gap-2 font-body text-sm leading-snug text-calmo-burnt-brown/75 transition-colors hover:text-calmo-blue"
          >
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-calmo-red-brown transition-colors group-hover:text-calmo-blue"
              strokeWidth={1.75}
            />
            <span>{fullAddress}</span>
          </a>
        </address>
        <p className="inline-block w-fit rounded-full bg-calmo-blue/30 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-calmo-burnt-brown/70">
          Walk-ins only
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 border-t border-calmo-burnt-brown/8 pt-5">
        <div className="border-r border-calmo-burnt-brown/8 pr-4">
          <h2 className={eyebrowClassName}>Hours</h2>
          <ul className="mt-3 space-y-2">
            {hours.map(({ days, time, closed }) => (
              <li
                key={days}
                className="flex items-baseline justify-between gap-2 font-body text-xs leading-snug text-calmo-burnt-brown/75 sm:text-sm"
              >
                <span className="shrink-0 font-medium text-calmo-burnt-brown/80">{days}</span>
                <span
                  className={
                    closed
                      ? "text-right font-medium text-calmo-burnt-brown/45"
                      : "text-right font-medium text-calmo-burnt-brown"
                  }
                >
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pl-1">
          <h2 className={eyebrowClassName}>Follow</h2>
          <ul className="mt-3 space-y-2.5">
            <li>
              <a
                href="https://www.instagram.com/calmo.cafebar/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-body text-xs leading-snug text-calmo-burnt-brown/75 transition-colors hover:text-calmo-blue sm:text-sm"
              >
                <Instagram
                  className="h-3.5 w-3.5 shrink-0 text-calmo-red-brown transition-colors group-hover:text-calmo-blue"
                  strokeWidth={1.75}
                />
                <span className="font-medium text-calmo-burnt-brown transition-colors group-hover:text-calmo-blue">
                  @calmo.cafebar
                </span>
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@calmo.ca"
                className="group flex items-center gap-2 font-body text-xs leading-snug text-calmo-burnt-brown/75 transition-colors hover:text-calmo-blue sm:text-sm"
              >
                <Mail
                  className="h-3.5 w-3.5 shrink-0 text-calmo-red-brown transition-colors group-hover:text-calmo-blue"
                  strokeWidth={1.75}
                />
                <span>hello@calmo.ca</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto max-w-[16.5rem] text-center font-accent text-sm italic leading-relaxed text-calmo-burnt-brown/45">
        {venue.description}
      </p>

      <div className="border-t border-calmo-burnt-brown/8 pt-5">
        <FooterCopyright />
      </div>
    </div>
  );
}

function FooterDesktop({ hours }: { hours: VenueHours[] }) {
  return (
    <>
      <div className="relative z-10 mx-auto hidden max-w-6xl gap-12 md:grid md:grid-cols-2 lg:grid-cols-4">
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
          <h2 className={eyebrowClassName}>Location</h2>
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
          <h2 className={eyebrowClassName}>Hours</h2>
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
          <h2 className={eyebrowClassName}>Follow</h2>
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

      <div className="relative z-10 mx-auto mt-16 hidden max-w-6xl border-t border-calmo-burnt-brown/8 pt-8 md:block">
        <FooterCopyright />
      </div>
    </>
  );
}

export function Footer({ hours = defaultHours }: { hours?: VenueHours[] }) {
  return (
    <footer
      id="visit"
      className={`${sectionShell} ${footerSectionSurface} relative max-md:!py-8 overflow-x-clip`}
    >
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
      <FooterMobile hours={hours} />
      <FooterDesktop hours={hours} />
    </footer>
  );
}
