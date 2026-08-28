import Link from "next/link";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { sectionContent } from "@/lib/section";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminShell({ title, description, children, className }: AdminShellProps) {
  return (
    <section className={sectionContent}>
      <div className={cn("mx-auto max-w-3xl", className)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="font-body text-xs font-medium uppercase tracking-[0.22em] text-calmo-red-brown transition-opacity hover:opacity-70"
            >
              ← Admin
            </Link>
            <h1 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 font-body text-sm text-calmo-burnt-brown/70">{description}</p>
            ) : null}
          </div>
          <AdminSignOut />
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
