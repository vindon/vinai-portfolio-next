import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <Hero />
        <div style={{ maxWidth: 520, margin: '40px auto' }}>
          <ProductCard product={products[0]} />
        </div>
      </main>
    </>
  );
}
