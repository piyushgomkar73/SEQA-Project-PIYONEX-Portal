import { useState } from 'react';
import { Save, Lock, Globe, Bell, Link2, Shield, Building } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import './Configuration.css';

const TABS = [
  { id: 'general', label: 'General', icon: Building },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
];

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="config-toggle-row">
      <div>
        <div className="config-toggle-label">{label}</div>
        {description && <div className="config-toggle-desc">{description}</div>}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-track" />
      </label>
    </div>
  );
}

export default function Configuration() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    companyName: 'PIYONEX Technologies Inc.',
    supportEmail: 'support@piyonex.io',
    maxTenants: '500',
    defaultPlan: 'Professional',
    language: 'English',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    twoFactor: true,
    sessionTimeout: '30',
    passwordPolicy: 'Strong',
    ipRestriction: false,
    emailOnboarding: true,
    emailTasks: true,
    emailAlerts: true,
    slackIntegration: false,
    webhooksEnabled: true,
    apiRateLimit: '1000',
  });

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const save = () => {
    addToast('success', 'Settings saved', 'Configuration has been updated.');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuration</h1>
          <p className="page-subtitle">Manage platform and tenant settings</p>
        </div>
        <button className="btn btn-primary" onClick={save}>
          <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="config-layout">
        {/* Sidebar tabs */}
        <div className="card config-tabs-sidebar">
          {TABS.map(t => (
            <button key={t.id}
              className={`config-tab-item ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>
              <t.icon size={16} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="config-content">
          {tab === 'general' && (
            <ConfigCard title="Company Information">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className="form-input" value={settings.companyName} onChange={e => set('companyName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Support Email</label>
                  <input className="form-input" value={settings.supportEmail} onChange={e => set('supportEmail', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Max Tenants</label>
                  <input className="form-input" type="number" value={settings.maxTenants} onChange={e => set('maxTenants', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Default Plan</label>
                  <select className="form-select" value={settings.defaultPlan} onChange={e => set('defaultPlan', e.target.value)}>
                    {['Starter', 'Professional', 'Enterprise'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </ConfigCard>
          )}

          {tab === 'localization' && (
            <ConfigCard title="Localization Settings">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Default Language</label>
                  <select className="form-select" value={settings.language} onChange={e => set('language', e.target.value)}>
                    {['English', 'French', 'German', 'Spanish', 'Japanese', 'Chinese'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Default Currency</label>
                  <select className="form-select" value={settings.currency} onChange={e => set('currency', e.target.value)}>
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select className="form-select" value={settings.timezone} onChange={e => set('timezone', e.target.value)}>
                    {['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date Format</label>
                  <select className="form-select" value={settings.dateFormat} onChange={e => set('dateFormat', e.target.value)}>
                    {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </ConfigCard>
          )}

          {tab === 'security' && (
            <ConfigCard title="Security Settings">
              <Toggle checked={settings.twoFactor} onChange={v => set('twoFactor', v)}
                label="Two-Factor Authentication"
                description="Require 2FA for all admin users" />
              <Toggle checked={settings.ipRestriction} onChange={v => set('ipRestriction', v)}
                label="IP Restriction"
                description="Restrict access to specific IP ranges" />
              <div className="divider" />
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Session Timeout (minutes)</label>
                  <input className="form-input" type="number" value={settings.sessionTimeout}
                    onChange={e => set('sessionTimeout', e.target.value)} />
                  <span className="form-hint">Users will be logged out after this period of inactivity</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Password Policy</label>
                  <select className="form-select" value={settings.passwordPolicy}
                    onChange={e => set('passwordPolicy', e.target.value)}>
                    {['Basic', 'Moderate', 'Strong', 'Very Strong'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </ConfigCard>
          )}

          {tab === 'notifications' && (
            <ConfigCard title="Notification Settings">
              <Toggle checked={settings.emailOnboarding} onChange={v => set('emailOnboarding', v)}
                label="Onboarding Alerts"
                description="Email notifications for onboarding stage changes" />
              <Toggle checked={settings.emailTasks} onChange={v => set('emailTasks', v)}
                label="Task Reminders"
                description="Daily digest of overdue and upcoming tasks" />
              <Toggle checked={settings.emailAlerts} onChange={v => set('emailAlerts', v)}
                label="System Alerts"
                description="Critical system and instance alerts" />
              <Toggle checked={settings.slackIntegration} onChange={v => set('slackIntegration', v)}
                label="Slack Integration"
                description="Send notifications to a Slack channel" />
            </ConfigCard>
          )}

          {tab === 'integrations' && (
            <ConfigCard title="Integrations">
              <div className="form-group">
                <label className="form-label">API Rate Limit (requests/min)</label>
                <input className="form-input" type="number" value={settings.apiRateLimit}
                  onChange={e => set('apiRateLimit', e.target.value)} style={{ maxWidth: 200 }} />
              </div>
              <Toggle checked={settings.webhooksEnabled} onChange={v => set('webhooksEnabled', v)}
                label="Webhooks"
                description="Send event data to external endpoints" />
              <div className="integration-cards">
                {[
                  { name: 'Slack', status: 'Not Connected', color: '#4A154B' },
                  { name: 'Jira', status: 'Connected', color: '#0052CC' },
                  { name: 'GitHub', status: 'Not Connected', color: '#24292e' },
                  { name: 'Datadog', status: 'Connected', color: '#774AA4' },
                ].map(int => (
                  <div key={int.name} className="integration-card">
                    <div className="integration-info">
                      <div className="integration-name">{int.name}</div>
                      <div className="integration-status" style={{
                        color: int.status === 'Connected' ? 'var(--color-success)' : 'var(--color-gray-400)'
                      }}>{int.status}</div>
                    </div>
                    <button className="btn btn-secondary btn-sm">
                      {int.status === 'Connected' ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </ConfigCard>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfigCard({ title, children }) {
  return (
    <div className="card">
      <div className="card-header"><h3 className="section-title">{title}</h3></div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
}
