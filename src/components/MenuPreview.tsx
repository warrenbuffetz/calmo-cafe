import { MenuBrowse, MenuItemCard } from "@/components/MenuBrowse";
import { SketchField } from "@/components/SketchField";
import { extendedMenuItems, menuDisclaimer, previewMenuItems } from "@/lib/menu";
import { sectionShell } from "@/lib/section";

export function MenuPreview() {
  return (
    <section id="menu" className={`${sectionShell} relative overflow-x-clip bg-white/20`}>
      <SketchField
        items={[
          {
            src: "/sketch-plate.png",
            width: 741,
            height: 1024,
            className: "hidden lg:block -right-24 -bottom-24 w-[22rem] opacity-[0.20]",
          },
          {
            src: "/sketch-dish.png",
            width: 1024,
            height: 964,
            className: "hidden lg:block -left-16 top-16 w-[13rem] -rotate-6 opacity-[0.07]",
          },
          {
            src: "/sketch-brunch.png",
            width: 733,
            height: 1024,
            className: "hidden lg:block right-[6%] top-1/3 w-[11rem] rotate-6 opacity-[0.06]",
          },
          {
            src: "/sketch-cup.png",
            width: 910,
            height: 1024,
            className: "hidden lg:block -left-10 -bottom-16 w-[11rem] -rotate-6 opacity-[0.14]",
          },
        ]}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
              Menu
            </p>
            <h2 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
              Dessert, coffee & counter.
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm leading-relaxed text-calmo-burnt-brown/60">
            {menuDisclaimer}
          </p>
        </div>

        <div className="flex flex-col gap-10 lg:gap-12">
          <div>
            <p className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-calmo-burnt-brown/45">
              Featured
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {previewMenuItems.map((item) => (
                <MenuItemCard key={item.name} item={item} variant="featured" />
              ))}
            </div>
          </div>

          <MenuBrowse items={extendedMenuItems} />
        </div>
      </div>
    </section>
  );
}
