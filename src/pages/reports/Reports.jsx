import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Download, Calendar, TrendingUp, CheckCircle, Clock, Users, ArrowUpRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useApp } from '../../contexts/AppContext';
import { REPORT_MONTHLY_DATA } from '../../data/mockData';

const TENANT_GROWTH = [
  { month: 'Oct', total: 4, active: 3 },
  { month: 'Nov', total: 5, active: 4 },
  { month: 'Dec', total: 6, active: 4 },
  { month: 'Jan', total: 7, active: 5 },
  { month: 'Feb', total: 8, active: 6 },
  { month: 'Mar', total: 9, active: 7 },
];

export default function Reports() {
  const { addToast } = useToast();
  const { clients, tasks } = useApp();
  const [timeRange, setTimeRange] = useState('6months');

  const totalClients = clients.length;
  const completedClients = clients.filter(c => c.status === 'completed' || c.status === 'active').length;
  const completionRate = Math.round((completedClients / totalClients) * 100);
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = Math.round((completedTasks / tasks.length) * 100);

  const handleExport = (type) => {
    addToast('success', `Exporting ${type}`, `Generating ${type} report... Download will begin shortly.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Reports & Analytics</h1>
          <p className="page-subtitle">Onboarding metrics, throughput, time-to-value, and client retention trends</p>
        </div>
        <div className="page-header-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '4px 10px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            <Calendar size={14} color="var(--color-gray-500)" />
            <select
              style={{ border: 'none', background: 'transparent', fontSize: 'var(--font-size-xs)', outline: 'none', cursor: 'pointer', fontWeight: 500 }}
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
            >
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Past Year</option>
            </select>
          </div>
          <button className="btn btn-secondary" onClick={() => handleExport('CSV')}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => handleExport('PDF')}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid-4">
        <div className="card" style={{ padding: 20 }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Onboarding Completion</div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-success)', marginTop: 8 }}>{completionRate}%</div>
          <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <TrendingUp size={12} color="var(--color-success)" /> +4.2% from prior period
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Avg Time to Go-Live</div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-primary-light)', marginTop: 8 }}>16.4 Days</div>
          <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <TrendingUp size={12} color="var(--color-success)" /> -3.5 days faster than Q3
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Task Throughput</div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-accent)', marginTop: 8 }}>{taskCompletionRate}%</div>
          <div className="text-xs text-muted" style={{ marginTop: 4 }}>{completedTasks} of {tasks.length} total tasks done</div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Active Multi-Tenants</div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-purple)', marginTop: 8 }}>{clients.length} Active</div>
          <div className="text-xs text-muted" style={{ marginTop: 4 }}>99.98% platform uptime</div>
        </div>
      </div>

      {/* Chart Row 1 */}
      <div className="charts-row-2">
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Onboarding Pipeline Velocity</h3>
              <p className="text-sm text-muted mt-1">Completed vs Initiated Tenants by Month</p>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={REPORT_MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="started" name="Initiated" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed Go-Live" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Average Days to Completion</h3>
              <p className="text-sm text-muted mt-1">Cycle duration reduction trend</p>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={REPORT_MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[10, 35]} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="avgDays" name="Avg Days" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Tenant Growth */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title">Cumulative Tenant Growth & Retention</h3>
            <p className="text-sm text-muted mt-1">Platform capacity and active tenant adoption over time</p>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={TENANT_GROWTH}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="total" name="Total Tenants" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="active" name="Fully Active" stroke="#3b82f6" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
