export default function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-name">vinai</span>
            <p>AI strategy, agentic products, and CX automation — built and advised on by Vinoth Nataraj.</p>
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
          <span className="sig">Thought by Vinoth. Built with Claude.</span>
        </div>
      </div>
    </footer>
  );
}
