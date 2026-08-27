import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuPreview } from "@/components/MenuPreview";
import { isMenuEnabled } from "@/lib/features";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        {isMenuEnabled() && <MenuPreview />}
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
