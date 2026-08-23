import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users2, CheckCircle2, Clock, AlertCircle, Server, Activity,
  ArrowUpRight, Building2, UserCheck, Zap
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ProgressBar from '../../components/ui/ProgressBar';
import {
  DASHBOARD_CHART_DATA, PIPELINE_DATA, TENANT_STATUS_DATA, ACTIVITY_LOGS
} from '../../data/mockData';
import './Dashboard.css';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { clients, tasks, instances } = useApp();

  const stats = {
    totalClients: clients.length,
    activeTenants: clients.filter(c => c.status === 'active').length,
    pendingOnboarding: clients.filter(c => c.status === 'pending' || c.status === 'onboarding').length,
    completed: clients.filter(c => c.status === 'completed').length,
    setupTasks: tasks.filter(t => t.status !== 'completed').length,
    issues: clients.filter(c => c.status === 'suspended').length + tasks.filter(t => t.status === 'blocked').length,
  };

  const recentClients = [...clients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentActivity = ACTIVITY_LOGS.slice(0, 8);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">Good evening, Admin 👋</h1>
          <p className="page-subtitle">Here's your client onboarding overview for today.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm">
            <Activity size={14} /> View Reports
          </button>
          <button className="btn btn-primary btn-sm">
            <Zap size={14} /> Add Client
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <StatCard
          icon={<Users2 size={20} />}
          label="Total Clients"
          value={stats.totalClients}
          trend={12}
          comparison="vs last month"
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <StatCard
          icon={<Building2 size={20} />}
          label="Active Tenants"
          value={stats.activeTenants}
          trend={8}
          comparison="vs last month"
          iconBg="#ecfdf5"
          iconColor="#10b981"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Pending Onboarding"
          value={stats.pendingOnboarding}
          trend={-5}
          comparison="vs last month"
          iconBg="#fffbeb"
          iconColor="#f59e0b"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          value={stats.completed}
          trend={25}
          comparison="vs last month"
          iconBg="#f5f3ff"
          iconColor="#8b5cf6"
        />
        <StatCard
          icon={<Server size={20} />}
          label="Setup Tasks Open"
          value={stats.setupTasks}
          trend={-3}
          comparison="vs last week"
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <StatCard
          icon={<AlertCircle size={20} />}
          label="Requiring Attention"
          value={stats.issues}
          trend={-2}
          comparison="vs last week"
          iconBg="#fef2f2"
          iconColor="#ef4444"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row-2">
        {/* Onboarding Activity */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Onboarding Activity</h3>
              <p className="text-sm text-muted mt-1">Last 30 days</p>
            </div>
            <select className="form-select" style={{ width: 'auto', fontSize: 'var(--font-size-xs)', padding: '5px 28px 5px 10px' }}>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={DASHBOARD_CHART_DATA}>
                <defs>
                  <linearGradient id="gradOnboarded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="onboarded" name="Onboarded" stroke="#3b82f6" strokeWidth={2} fill="url(#gradOnboarded)" dot={false} />
                <Area type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} fill="url(#gradPending)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tenant Status Donut */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Tenant Status</h3>
              <p className="text-sm text-muted mt-1">Distribution overview</p>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={TENANT_STATUS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {TENANT_STATUS_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-legend">
              {TENANT_STATUS_DATA.map(d => (
                <div key={d.name} className="donut-legend-item">
                  <span className="donut-legend-dot" style={{ background: d.color }} />
                  <span>{d.name}</span>
                  <span className="donut-legend-value">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row-2">
        {/* Pipeline */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Onboarding Pipeline</h3>
              <p className="text-sm text-muted mt-1">Current stage distribution</p>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PIPELINE_DATA} barSize={28} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" name="Clients" radius={[0, 4, 4, 0]}>
                  {PIPELINE_DATA.map((entry, i) => (
                    <Cell key={i} fill={i === 5 ? '#10b981' : '#3b82f6'} fillOpacity={0.7 + (i / PIPELINE_DATA.length) * 0.3} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="section-title">Recent Activity</h3>
              <p className="text-sm text-muted mt-1">Latest system events</p>
            </div>
            <button className="btn btn-ghost btn-sm">View all <ArrowUpRight size={13} /></button>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {recentActivity.map((log, i) => (
              <div key={log.id} className="activity-item">
                <div className={`activity-dot ${log.status}`} />
                <div className="activity-content">
                  <div className="activity-action">{log.action}</div>
                  <div className="activity-meta">
                    <span>{log.user}</span>
                    <span className="activity-sep">·</span>
                    <span>{log.tenant}</span>
                    <span className="activity-sep">·</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Clients Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title">Recent Clients</h3>
            <p className="text-sm text-muted mt-1">Newly added clients and their progress</p>
          </div>
          <button className="btn btn-secondary btn-sm">View all clients</button>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Onboarding Stage</th>
                <th>Progress</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map(client => (
                <tr key={client.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar-initials" style={{
                        width: 34, height: 34, background: client.logoColor + '20',
                        color: client.logoColor, fontSize: 11, fontWeight: 700
                      }}>
                        {client.logo}
                      </div>
                      <div>
                        <div className="td-primary">{client.name}</div>
                        <div className="text-xs text-muted">{client.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                      {client.plan}
                    </span>
                  </td>
                  <td><StatusBadge status={client.status} /></td>
                  <td className="text-sm">{client.onboardingStage}</td>
                  <td style={{ minWidth: 140 }}><ProgressBar value={client.onboardingProgress} size="sm" /></td>
                  <td className="text-sm text-muted">{client.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
