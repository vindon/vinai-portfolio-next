import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductsCarousel from '@/components/ProductsCarousel';
import Solutions from '@/components/Solutions';
import About from '@/components/About';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <ProductsCarousel />
        <Solutions />
        <About />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
