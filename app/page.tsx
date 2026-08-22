import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
      </main>
    </>
  );
}
