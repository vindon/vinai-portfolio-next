import BrandBlockIcon from './BrandBlockIcon';

export default function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-name">firstbloc<BrandBlockIcon size={30} /></span>
            <p>AI strategy, agentic products, and CX automation.</p>
            <div className="social-icons">
              <a
                href="https://x.com/vinothnataraj"
                className="social-icon"
                aria-label="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.24 3H21l-6.6 7.54L22 21h-6.32l-4.95-6.47L4.98 21H2.2l7.06-8.07L2 3h6.48l4.48 5.92L18.24 3Zm-1.11 16.2h1.48L7.94 4.72H6.35L17.13 19.2Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/vinothnataraj"
                className="social-icon"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3>Navigate</h3>
            <ul className="flinks">
              <li><a href="#about">About</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#solutions">Solutions</a></li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul className="flinks">
              <li><a href="mailto:vinoth.n@outlook.com">vinoth.n@outlook.com</a></li>
              <li>
                <a href="https://linkedin.com/in/vinothnataraj" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/vinothnataraj
                </a>
              </li>
              <li><span>Chennai, India</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Vinoth Nataraj.</span>
        </div>
      </div>
    </footer>
  );
}
