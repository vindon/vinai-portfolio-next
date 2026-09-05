export default function BrandBlockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg className="brand-block-icon" width={size} height={size} viewBox="0 0 46 46" aria-hidden="true">
      <polygon points="23,2 43,13 23,24 3,13" fill="var(--accent-light)" />
      <polygon points="3,13 23,24 23,44 3,33" fill="var(--accent-deep)" />
      <polygon points="43,13 23,24 23,44 43,33" fill="var(--accent)" />
    </svg>
  );
}
