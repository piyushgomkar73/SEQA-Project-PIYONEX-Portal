import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, RefreshCw, Plus, Search, Activity, Cpu, HardDrive, MemoryStick } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionMenu from '../../components/ui/ActionMenu';
import './Instances.css';

export default function Instances() {
  const { instances } = useApp();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState('All');
  const [view, setView] = useState('grid');

  const filtered = instances.filter(i => {
    const q = search.toLowerCase();
    return (i.name.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)) &&
      (envFilter === 'All' || i.environment === envFilter);
  });

  const healthColor = (h) => h >= 90 ? 'var(--color-success)' : h >= 70 ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Software Instances</h1>
          <p className="page-subtitle">Monitor and manage deployed software instances</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary" onClick={() => addToast('info', 'Refreshing', 'Instance data refreshed.')}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => addToast('info', 'Coming soon', 'Instance provisioning wizard.')}>
            <Plus size={14} /> New Instance
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Instances', value: instances.length, color: '#3b82f6' },
          { label: 'Running', value: instances.filter(i => i.status === 'running').length, color: '#10b981' },
          { label: 'Provisioning', value: instances.filter(i => i.status === 'provisioning').length, color: '#f59e0b' },
          { label: 'Offline / Failed', value: instances.filter(i => ['offline', 'failed'].includes(i.status)).length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div className="text-xs text-muted" style={{ marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filter-bar">
          <div className="search-wrapper" style={{ flex: 1, maxWidth: 300 }}>
            <Search size={15} className="search-icon" />
            <input className="form-input search-input" placeholder="Search instances…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={envFilter}
            onChange={e => setEnvFilter(e.target.value)}>
            {['All', 'Production', 'Staging', 'Development'].map(e => <option key={e}>{e}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            <button className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('grid')}>
              Grid
            </button>
            <button className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('table')}>
              Table
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="instances-grid card-body">
            {filtered.map(inst => (
              <div key={inst.id} className="instance-card" onClick={() => addToast('info', inst.name, 'Instance details coming soon.')}>
                <div className="instance-card-header">
                  <div>
                    <div className="instance-name">{inst.name}</div>
                    <div className="text-xs text-muted">{inst.clientName}</div>
                  </div>
                  <StatusBadge status={inst.status} />
                </div>

                <div className="instance-meta-row">
                  <span className="instance-meta-item">{inst.environment}</span>
                  <span className="instance-meta-sep">·</span>
                  <span className="instance-meta-item">{inst.region}</span>
                  <span className="instance-meta-sep">·</span>
                  <span className="instance-meta-item">{inst.version}</span>
                </div>

                {inst.status === 'running' && (
                  <div className="instance-metrics">
                    <MetricBar icon={<Cpu size={11} />} label="CPU" value={inst.cpu} />
                    <MetricBar icon={<MemoryStick size={11} />} label="MEM" value={inst.memory} />
                    <MetricBar icon={<HardDrive size={11} />} label="DISK" value={inst.storage} />
                  </div>
                )}

                <div className="instance-card-footer">
                  <div>
                    <div className="text-xs text-muted">Health</div>
                    <div className="instance-health" style={{ color: healthColor(inst.health) }}>
                      {inst.status === 'running' ? `${inst.health}%` : inst.status}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-xs text-muted">Uptime</div>
                    <div className="text-xs font-medium" style={{ color: 'var(--color-gray-700)' }}>{inst.uptime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Instance</th>
                  <th>Tenant</th>
                  <th>Environment</th>
                  <th>Version</th>
                  <th>Region</th>
                  <th>Status</th>
                  <th>Health</th>
                  <th>Last Deploy</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inst => (
                  <tr key={inst.id}>
                    <td><div className="td-primary">{inst.name}</div><div className="text-xs text-muted">{inst.id}</div></td>
                    <td className="text-sm">{inst.clientName}</td>
                    <td>
                      <span className="badge" style={{ background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>{inst.environment}</span>
                    </td>
                    <td><span className="td-mono">{inst.version}</span></td>
                    <td className="text-sm">{inst.region}</td>
                    <td><StatusBadge status={inst.status} /></td>
                    <td>
                      <span style={{ fontWeight: 600, color: healthColor(inst.health) }}>
                        {inst.health > 0 ? inst.health + '%' : '—'}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{new Date(inst.lastDeployment).toLocaleDateString()}</td>
                    <td>
                      <ActionMenu items={[
                        { label: 'View Details', onClick: () => addToast('info', 'Instance Details', 'Coming soon.') },
                        { label: 'Restart', onClick: () => addToast('info', 'Restart', `${inst.name} restart initiated.`) },
                        { divider: true },
                        { label: 'Terminate', danger: true, onClick: () => addToast('warning', 'Terminate', 'Confirmation required.') },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricBar({ icon, label, value }) {
  const color = value > 80 ? 'var(--color-danger)' : value > 60 ? 'var(--color-warning)' : 'var(--color-success)';
  return (
    <div className="metric-bar">
      <div className="metric-bar-header">
        <span className="metric-label">{icon} {label}</span>
        <span className="metric-value" style={{ color }}>{value}%</span>
      </div>
      <div className="progress-bar-track" style={{ height: 4 }}>
        <div className="progress-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
