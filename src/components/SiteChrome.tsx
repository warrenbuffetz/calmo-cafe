import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <>
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
