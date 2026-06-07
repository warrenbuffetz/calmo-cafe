import { MenuFullAccordion, MenuItemCard, type MenuItem } from "@/components/MenuFullAccordion";
import { sectionShell } from "@/lib/section";

const previewMenuItems: MenuItem[] = [
  {
    name: "The Calmo Breakfast Sando",
    description: "Soft scrambled eggs, smoked gouda, house sauce",
    category: "diner",
    tag: "Signature",
  },
  {
    name: "Stuffed Madeleines",
    description: "Fresh baked daily",
    category: "cafe",
    tag: "Pastry",
  },
  {
    name: "Classic Cheeseburger",
    description: "Simple, perfect crust",
    category: "diner",
  },
  {
    name: "Bulgogi Croque Madame",
    description: "Korean-spiced beef, gruyère, fried egg, béchamel",
    category: "cafe",
    tag: "Fusion",
  },
];

const extendedMenuItems: MenuItem[] = [
  {
    name: "Avocado Toast",
    description: "Sourdough, chili crisp, herb salad, soft egg",
    category: "cafe",
  },
  {
    name: "Patty Melt",
    description: "Swiss, caramelized onions, rye, comeback sauce",
    category: "diner",
  },
  {
    name: "Rose Latté",
    description: "House rose syrup, espresso, steamed oat milk",
    category: "cafe",
    tag: "Drink",
  },
  {
    name: "Chicken & Waffles",
    description: "Buttermilk waffle, maple hot honey, pickles",
    category: "diner",
  },
  {
    name: "Lemon Poppy Scone",
    description: "Glazed, baked every morning",
    category: "cafe",
    tag: "Pastry",
  },
  {
    name: "Kimchi Grilled Cheese",
    description: "Aged cheddar, sourdough, house kimchi butter",
    category: "diner",
    tag: "Fusion",
  },
  {
    name: "Calmo Drip Coffee",
    description: "Rotating single-origin, served hot or iced",
    category: "cafe",
    tag: "Drink",
  },
  {
    name: "Mushroom Reuben",
    description: "Marinated portobello, sauerkraut, swiss, rye",
    category: "diner",
  },
];

export function MenuPreview() {
  return (
    <section id="menu" className={`${sectionShell} bg-white/20`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[0.28em] text-calmo-red-brown">
              Menu preview
            </p>
            <h2 className="mt-4 font-title text-3xl font-bold tracking-tight text-calmo-burnt-brown sm:text-4xl md:text-5xl">
              Two sides of the same counter.
            </h2>
          </div>
          <p className="max-w-xs font-body text-sm leading-relaxed text-calmo-burnt-brown/60">
            Retro diner classics on the left. Modern café creations on the right. All made in-house,
            all day.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
            {previewMenuItems.map((item) => (
              <MenuItemCard key={item.name} item={item} />
            ))}
          </div>

          <MenuFullAccordion items={extendedMenuItems} />
        </div>
      </div>
    </section>
  );
}
