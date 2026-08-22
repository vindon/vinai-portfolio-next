import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductsCarousel from '@/components/ProductsCarousel';
import Solutions from '@/components/Solutions';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <ProductsCarousel />
        <Solutions />
      </main>
    </>
  );
}
