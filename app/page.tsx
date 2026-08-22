import ScrollReveal from '@/components/ScrollReveal';
import Nav from '@/components/Nav';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <ScrollReveal />
        <h1 style={{ padding: '40px' }}>vinai</h1>
      </main>
    </>
  );
}
