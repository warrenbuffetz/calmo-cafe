export const emailBrand = {
  beige: "#F3EED7",
  brown: "#321B0F",
  blue: "#A2B9DB",
  redBrown: "#923F24",
  white: "#FFFFFF",
  muted: "rgba(50,27,15,0.65)",
  border: "rgba(50,27,15,0.1)",
} as const;

export const emailFonts = {
  title: "'Rubik', 'Helvetica Neue', Arial, sans-serif",
  body: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  accent: "'Libre Baskerville', Georgia, serif",
} as const;

export const emailFontImport = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Libre+Baskerville:ital@0;1&family=Rubik:wght@600;700&display=swap');
`;
