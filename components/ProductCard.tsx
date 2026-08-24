import type { Product } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  const hasDemo = Boolean(product.demoUrl) && product.demoUrl !== '#';

  return (
    <div className="product-card">
      <div className="product-card-content">
        <div className="icon-chip">{product.icon}</div>
        <span className={`stage-tag${product.isExploration ? ' explore' : ''}`}>{product.stageTag}</span>
        <h3>{product.title}</h3>
        <div className="problem-box">
          <span className="problem-label">The problem</span>
          <p>{product.problem}</p>
        </div>
        <p className="product-desc">{product.description}</p>
        <div className="card-footer-row">
          <div className="tech-tags">
            {product.techTags.map((tag) => (
              <span className="tech-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          {hasDemo ? (
            <a href={product.demoUrl} className="btn-demo" target="_blank" rel="noopener noreferrer">
              View demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          ) : (
            <span className="btn-demo btn-demo-disabled" aria-disabled="true">
              Demo coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
