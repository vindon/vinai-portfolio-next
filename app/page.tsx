import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductsCarousel from '@/components/ProductsCarousel';
import Solutions from '@/components/Solutions';
import About from '@/components/About';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import ComingSoon from '@/components/ComingSoon';

export default function Home() {
  // Set only on Vercel's Production environment — Preview deployments
  // (plain `vercel`, no --prod) always render the real site underneath,
  // so work stays reviewable in staging while firstbloc.in shows this.
  if (process.env.COMING_SOON === 'true') {
    return <ComingSoon />;
  }

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
