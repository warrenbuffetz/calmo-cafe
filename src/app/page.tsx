import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuPreview } from "@/components/MenuPreview";
import { getCounterFavorites, getSiteCopy } from "@/lib/cms/queries";
import { isMenuEnabled } from "@/lib/features";

export default async function Home() {
  const [counterFavorites, siteCopy] = await Promise.all([
    getCounterFavorites(),
    getSiteCopy(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero hero={siteCopy.hero} hours={siteCopy.hours} />
        <About about={siteCopy.about} />
        {isMenuEnabled() && <MenuPreview counterFavorites={counterFavorites} />}
        <Gallery />
      </main>
      <Footer hours={siteCopy.hours} />
    </>
  );
}
