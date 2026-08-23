export default function ProgressBar({ value, size = 'md', color }) {
  const clampedVal = Math.max(0, Math.min(100, value));
  const colorClass = color || (clampedVal >= 80 ? 'success' : clampedVal >= 40 ? '' : 'warning');
  const height = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-track" style={{ height }}>
        <div
          className={`progress-bar-fill ${colorClass}`}
          style={{ width: `${clampedVal}%` }}
        />
      </div>
      <span className="progress-bar-label">{clampedVal}%</span>
    </div>
  );
}
