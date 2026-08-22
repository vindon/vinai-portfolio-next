type WorkflowGraphProps = {
  nodes: string[];
  color: string;
};

export default function WorkflowGraph({ nodes, color }: WorkflowGraphProps) {
  const width = 400;
  const height = 280;
  const marginX = 40;
  const usableWidth = width - marginX * 2;

  const points = nodes.map((_, i) => {
    const t = nodes.length === 1 ? 0.5 : i / (nodes.length - 1);
    const x = marginX + t * usableWidth;
    const y = height / 2 + Math.sin(t * Math.PI) * -50;
    return { x, y };
  });

  return (
    <svg
      className="workflow-graph"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {points.slice(1).map((p, i) => {
        const prev = points[i];
        return (
          <path
            key={`line-${i}`}
            className="wf-line"
            d={`M ${prev.x} ${prev.y} L ${p.x} ${p.y}`}
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        );
      })}
      {points.map((p, i) => (
        <circle
          key={`node-${i}`}
          className="wf-node"
          cx={p.x}
          cy={p.y}
          r={7}
          fill={color}
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </svg>
  );
}
