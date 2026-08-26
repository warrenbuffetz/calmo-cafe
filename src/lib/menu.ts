export type MenuSection = "coffee" | "specialty" | "pastry";

export type MenuItem = {
  name: string;
  description: string;
  section: MenuSection;
  /** Item name or detail couldn't be fully read from the source menu photo. */
  unclear?: boolean;
};

export const menuDisclaimer =
  "Menu rotates with what's fresh — ask at the counter what's out today. Wine and simple plates coming soon.";

export const menuSectionLabels: Record<MenuSection, string> = {
  coffee: "Coffee",
  specialty: "Specialty",
  pastry: "Pastry",
};

export const menuSectionOrder: MenuSection[] = ["coffee", "specialty", "pastry"];

export const previewMenuItems: MenuItem[] = [
  {
    name: "Passionfruit Vanilla Matcha",
    description: "House matcha with passionfruit and vanilla.",
    section: "specialty",
  },
  {
    name: "Basque Cheesecake",
    description: "Burnt-top cheesecake, rich and creamy.",
    section: "pastry",
  },
  {
    name: "Orange Blossom Americano",
    description: "Espresso with orange blossom notes.",
    section: "specialty",
  },
  {
    name: "Strawberry Matcha Tiramisu",
    description: "Matcha-soaked layers with strawberry.",
    section: "pastry",
  },
];

export const extendedMenuItems: MenuItem[] = [
  {
    name: "Espresso",
    description: "Single shot.",
    section: "coffee",
  },
  {
    name: "Macchiato",
    description: "Espresso marked with steamed milk.",
    section: "coffee",
  },
  {
    name: "Americano",
    description: "Espresso with hot water.",
    section: "coffee",
  },
  {
    name: "Cortado",
    description: "Espresso cut with warm milk.",
    section: "coffee",
  },
  {
    name: "Cappuccino",
    description: "Espresso, steamed milk, and foam.",
    section: "coffee",
  },
  {
    name: "Flat White",
    description: "Velvety microfoam over espresso.",
    section: "coffee",
  },
  {
    name: "Latte",
    description: "Espresso with steamed milk.",
    section: "coffee",
  },
  {
    name: "Coffee drink (name unclear)",
    description:
      "Listed on our menu photo below Latte, but the name was cropped out. Ask at the counter.",
    section: "coffee",
    unclear: true,
  },
  {
    name: "…A Latte (name partially visible)",
    description:
      "Our menu photo only shows the ending «A Latte» — the full name wasn't visible. Ask at the counter.",
    section: "coffee",
    unclear: true,
  },
  {
    name: "Burnt Honey Sea Salt Whip",
    description: "Add-on topping for drinks.",
    section: "specialty",
  },
  {
    name: "Orange Blossom Americano",
    description: "Espresso with orange blossom notes.",
    section: "specialty",
  },
  {
    name: "Apricot Orange Soda",
    description: "House soda.",
    section: "specialty",
  },
  {
    name: "Mint Lemongrass Soda",
    description: "House soda.",
    section: "specialty",
  },
  {
    name: "Tomato Basilade",
    description: "Savory refresher.",
    section: "specialty",
  },
  {
    name: "Passionfruit Vanilla Matcha",
    description: "House matcha with passionfruit and vanilla.",
    section: "specialty",
  },
  {
    name: "Grapefruit Thyme Iced Tea",
    description: "Iced tea with grapefruit and thyme.",
    section: "specialty",
  },
  {
    name: "Tiramisu",
    description: "Classic cocoa-dusted slice.",
    section: "pastry",
  },
  {
    name: "Strawberry Matcha Tiramisu",
    description: "Matcha-soaked layers with strawberry.",
    section: "pastry",
  },
  {
    name: "Orange Marmalade Tiramisu",
    description: "Creamy layers with orange marmalade.",
    section: "pastry",
  },
  {
    name: "Apple Almond Pie",
    description: "Thin-sliced apple topping.",
    section: "pastry",
  },
  {
    name: "Raspberry Rosemary Pie",
    description: "Fresh raspberries on top.",
    section: "pastry",
  },
  {
    name: "Basque Cheesecake",
    description: "Burnt-top cheesecake, rich and creamy.",
    section: "pastry",
  },
  {
    name: "Matcha Brownie",
    description: "Green tea brownie with white icing.",
    section: "pastry",
  },
  {
    name: "O.G. Brownie",
    description: "Classic chocolate brownie.",
    section: "pastry",
  },
  {
    name: "Butter Scone",
    description: "Baked in-house.",
    section: "pastry",
  },
  {
    name: "PB&J Scone",
    description: "Peanut butter and jam.",
    section: "pastry",
  },
  {
    name: "Bacon Cheddar Scone",
    description: "Savory scone.",
    section: "pastry",
  },
  {
    name: "Seasonal slice (unlabeled on menu)",
    description:
      "A dark cake with cream and caramel appeared on our pastry photo with no name tag. Ask what's available today.",
    section: "pastry",
    unclear: true,
  },
];
