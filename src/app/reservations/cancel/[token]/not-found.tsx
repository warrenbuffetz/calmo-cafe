import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { sectionShell } from "@/lib/section";

export default function CancelNotFound() {
  return (
    <SiteChrome>
      <section className={sectionShell}>
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-title text-3xl font-bold text-calmo-burnt-brown">
            Link not found
          </h1>
          <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/70">
            This cancellation link is invalid or may have expired. If you need help, contact us
            directly.
          </p>
          <p className="mt-8">
            <Link
              href="/"
              className="font-body text-sm uppercase tracking-[0.14em] text-calmo-red-brown hover:text-calmo-blue"
            >
              Back to Calmo
            </Link>
          </p>
        </div>
      </section>
    </SiteChrome>
  );
}
