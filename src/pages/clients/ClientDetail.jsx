import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Edit, Globe, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, AlertCircle, UserPlus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import StatusBadge from '../../components/ui/StatusBadge';
import ProgressBar from '../../components/ui/ProgressBar';
import { ONBOARDING_STAGES } from '../../data/mockData';
import './ClientDetail.css';

const TABS = ['Overview', 'Onboarding', 'Configuration', 'Users', 'Activity'];

const STAGE_STATUS = {
  'Client Created': 'completed',
  'Tenant Configured': 'completed',
  'Software Setup': 'completed',
  'Data Import': 'in-progress',
  'Testing': 'pending',
  'User Setup': 'pending',
  'Training': 'pending',
  'Go Live': 'pending',
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, users } = useApp();
  const [tab, setTab] = useState('Overview');

  const client = clients.find(c => c.id === id);
  if (!client) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><AlertCircle size={28} /></div>
        <div className="empty-state-title">Client not found</div>
        <div className="empty-state-desc">The client you're looking for doesn't exist.</div>
        <Link to="/clients" className="btn btn-primary">Back to Clients</Link>
      </div>
    );
  }

  const clientUsers = users.filter(u => u.tenant === client.name || u.tenant === 'All Tenants');
  const stageIndex = ONBOARDING_STAGES.indexOf(client.onboardingStage);

  return (
    <div className="client-detail">
      {/* Back button */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/clients')} style={{ marginBottom: 16, alignSelf: 'flex-start' }}>
        <ArrowLeft size={15} /> Back to Clients
      </button>

      {/* Header Card */}
      <div className="card client-header-card">
        <div className="client-header-left">
          <div className="client-logo-large" style={{ background: client.logoColor + '18', color: client.logoColor }}>
            {client.logo}
          </div>
          <div className="client-header-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 className="client-detail-name">{client.name}</h1>
              <StatusBadge status={client.status} />
            </div>
            <div className="client-header-meta">
              <span><span className="td-mono">{client.id}</span></span>
              <span className="meta-sep">·</span>
              <span>{client.industry}</span>
              <span className="meta-sep">·</span>
              <span className="badge" style={{ background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                {client.plan}
              </span>
              <span className="meta-sep">·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} color="var(--color-gray-400)" />
                <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
                  Created {client.createdAt}
                </span>
              </span>
            </div>
            <div className="client-header-contact">
              {client.email && <span><Mail size={13} /> {client.email}</span>}
              {client.phone && <span><Phone size={13} /> {client.phone}</span>}
              {client.website && <span><Globe size={13} /> {client.website}</span>}
            </div>
          </div>
        </div>
        <div className="client-header-right">
          <button className="btn btn-secondary"><Edit size={14} /> Edit</button>
          <div className="client-progress-mini">
            <span className="text-sm text-muted">Onboarding Progress</span>
            <ProgressBar value={client.onboardingProgress} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs-nav">
          {TABS.map(t => (
            <button key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="card-body">
          {/* Overview Tab */}
          {tab === 'Overview' && (
            <div className="tab-overview">
              <div className="overview-grid">
                <div className="overview-section">
                  <h4 className="overview-section-title">Client Information</h4>
                  <div className="info-rows">
                    <InfoRow label="Company" value={client.name} />
                    <InfoRow label="Tenant ID" value={<span className="td-mono">{client.tenantId}</span>} />
                    <InfoRow label="Instance ID" value={<span className="td-mono">{client.instanceId}</span>} />
                    <InfoRow label="Industry" value={client.industry} />
                    <InfoRow label="Country" value={client.country} />
                    <InfoRow label="Address" value={client.address} />
                    <InfoRow label="Phone" value={client.phone} />
                  </div>
                </div>
                <div className="overview-section">
                  <h4 className="overview-section-title">Subscription Details</h4>
                  <div className="info-rows">
                    <InfoRow label="Plan" value={
                      <span className="badge" style={{ background: 'var(--color-info-bg)', color: '#1e40af' }}>{client.plan}</span>
                    } />
                    <InfoRow label="Status" value={<StatusBadge status={client.status} />} />
                    <InfoRow label="Stage" value={client.onboardingStage} />
                    <InfoRow label="Progress" value={`${client.onboardingProgress}%`} />
                    <InfoRow label="Created" value={client.createdAt} />
                    <InfoRow label="Last Updated" value={client.updatedAt} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onboarding Tab */}
          {tab === 'Onboarding' && (
            <div>
              <div className="onboarding-progress-header">
                <div>
                  <h4 className="section-title">Onboarding Progress</h4>
                  <p className="text-sm text-muted mt-1">
                    {ONBOARDING_STAGES.filter((_, i) => i <= stageIndex).length} of {ONBOARDING_STAGES.length} stages completed
                  </p>
                </div>
                <div style={{ minWidth: 200 }}>
                  <ProgressBar value={client.onboardingProgress} />
                </div>
              </div>
              <div className="onboarding-stages-list">
                {ONBOARDING_STAGES.map((stage, i) => {
                  const isDone = i < stageIndex;
                  const isCurrent = i === stageIndex;
                  const isPending = i > stageIndex;
                  return (
                    <div key={stage} className={`stage-item ${isDone ? 'done' : isCurrent ? 'current' : 'pending'}`}>
                      <div className="stage-icon">
                        {isDone ? <CheckCircle size={18} color="var(--color-success)" />
                          : isCurrent ? <Clock size={18} color="var(--color-accent)" />
                            : <div className="stage-icon-empty" />}
                      </div>
                      <div className="stage-content">
                        <div className="stage-name">{stage}</div>
                        <div className="stage-meta">
                          {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                          {isDone && ' · ' + new Date(Date.now() - Math.random() * 30 * 86400000).toLocaleDateString()}
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="badge badge-onboarding" style={{ marginLeft: 'auto' }}>Current</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Configuration Tab */}
          {tab === 'Configuration' && (
            <div className="config-sections">
              <ConfigSection title="General Settings">
                <ConfigRow label="Tenant Name" value={client.name + ' Workspace'} />
                <ConfigRow label="Subdomain" value={client.name.toLowerCase().replace(/\s+/g, '-') + '.piyonex.io'} />
                <ConfigRow label="Region" value="US East" />
                <ConfigRow label="Timezone" value="America/New_York" />
              </ConfigSection>
              <ConfigSection title="Localization">
                <ConfigRow label="Language" value="English" />
                <ConfigRow label="Currency" value="USD" />
                <ConfigRow label="Date Format" value="MM/DD/YYYY" />
              </ConfigSection>
              <ConfigSection title="Security">
                <ConfigRow label="Two-Factor Auth" value={<span className="badge badge-active">Enabled</span>} />
                <ConfigRow label="Session Timeout" value="30 minutes" />
                <ConfigRow label="Password Policy" value="Strong" />
              </ConfigSection>
            </div>
          )}

          {/* Users Tab */}
          {tab === 'Users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button className="btn btn-primary btn-sm"><UserPlus size={14} /> Invite User</button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th></tr></thead>
                  <tbody>
                    {clientUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div className="avatar-initials" style={{
                              width: 30, height: 30, background: u.avatarColor + '20',
                              color: u.avatarColor, fontSize: 10, fontWeight: 700
                            }}>{u.avatar}</div>
                            <span className="td-primary">{u.name}</span>
                          </div>
                        </td>
                        <td className="text-sm">{u.email}</td>
                        <td>
                          <span className="badge" style={{ background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                            {u.role}
                          </span>
                        </td>
                        <td><StatusBadge status={u.status} /></td>
                        <td className="text-sm text-muted">{new Date(u.lastLogin).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {tab === 'Activity' && (
            <div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="activity-item" style={{ padding: '12px 0', borderBottom: i < 5 ? '1px solid var(--color-gray-100)' : 'none' }}>
                  <div className={`activity-dot ${['success', 'success', 'warning', 'success', 'success', 'error'][i]}`}
                    style={{ marginTop: 5 }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-gray-700)' }}>
                      {['Configuration updated', 'User invited', 'Onboarding stage advanced', 'Setup task completed', 'Instance deployed', 'Health check alert'][i]}
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: 2 }}>
                      Piyush Gomkar · {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

function ConfigSection({ title, children }) {
  return (
    <div className="config-section">
      <h5 className="config-section-title">{title}</h5>
      {children}
    </div>
  );
}

function ConfigRow({ label, value }) {
  return (
    <div className="config-row">
      <span className="config-label">{label}</span>
      <span className="config-value">{value}</span>
    </div>
  );
}
