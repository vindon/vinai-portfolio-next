'use client';

import { useEffect, useRef, useState } from 'react';
import { products } from '@/lib/products';
import ProductCard from './ProductCard';

export default function ProductsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, products.length - 1));
    const card = cardRefs.current[clamped];
    const track = trackRef.current;
    if (card && track) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  };

  return (
    <section id="products" className="section-deco">
      <div className="bg-blob -products-a" aria-hidden="true"></div>
      <div className="bg-blob -products-b" aria-hidden="true"></div>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="kicker">Products</p>
          <h2>Six systems. Six real problems. Built to ship.</h2>
          <p>Every product here started from a specific operational gap I saw firsthand in telecom CX or financial services.</p>
        </div>

        <div className="carousel-outer">
          <div
            className="carousel-track"
            ref={trackRef}
            role="region"
            aria-label="Products carousel"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {products.map((product, i) => (
              <div
                className="carousel-card-wrap reveal"
                key={product.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              className="carousel-arrow"
              aria-label="Previous product"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="carousel-dots">
              {products.map((product, i) => (
                <button
                  type="button"
                  key={product.id}
                  className={`carousel-dot${i === activeIndex ? ' active' : ''}`}
                  aria-label={`Go to ${product.title}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="carousel-arrow"
              aria-label="Next product"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === products.length - 1}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
