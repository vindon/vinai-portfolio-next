'use client';

import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" style={{ display: 'block' }}>
          <span className="brand-name">firstbloc</span>
          <span className="brand-tag">AI Strategy &amp; Products</span>
        </a>
        <nav className={`links${open ? ' open' : ''}`}>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#products" onClick={() => setOpen(false)}>Products</a>
          <a href="#solutions" onClick={() => setOpen(false)}>Solutions</a>
          <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>Let&apos;s talk</a>
        </nav>
        <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
