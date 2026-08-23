import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon, label, value, trend, trendLabel, comparison, iconBg, iconColor }) {
  const isUp = trend >= 0;
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: iconBg }}>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className={`stat-card-trend ${isUp ? 'up' : 'down'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
      <div className="stat-card-comparison">{trendLabel || comparison}</div>
    </div>
  );
}
