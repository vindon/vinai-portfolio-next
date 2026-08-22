import type { Product } from '@/lib/products';
import WorkflowGraph from './WorkflowGraph';

export default function ProductCard({ product }: { product: Product }) {
  const cardStyle = {
    '--tcolor': product.color,
    '--ttint': product.tint,
  } as React.CSSProperties;

  return (
    <div className="product-card" style={cardStyle}>
      <WorkflowGraph nodes={product.pipeline} color={product.color} />
      <div className="product-card-content">
        <div className="icon-chip">{product.icon}</div>
        <span className={`stage-tag${product.isExploration ? ' explore' : ''}`}>{product.stageTag}</span>
        <h3>{product.title}</h3>
        <div className="problem-box">
          <span className="problem-label">The problem</span>
          <p>{product.problem}</p>
        </div>
        <p className="product-desc">{product.description}</p>
        <div className="tech-tags">
          {product.techTags.map((tag) => (
            <span className="tech-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
