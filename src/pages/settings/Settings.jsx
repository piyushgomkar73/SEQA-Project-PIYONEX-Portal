import { useState } from 'react';
import { User, Building, Shield, Key, CreditCard, Palette, Sliders, Save, Copy, Check, Plus } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const SETTING_TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'org', label: 'Organization', icon: Building },
  { id: 'security', label: 'Security & Auth', icon: Shield },
  { id: 'apikeys', label: 'API Keys & Secrets', icon: Key },
  { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
  { id: 'preferences', label: 'System Preferences', icon: Sliders },
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [copiedKey, setCopiedKey] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Piyush Gomkar',
    email: 'piyush23@gmail.com',
    phone: '+1 (555) 019-2834',
    title: 'Chief Technology Officer & Super Admin',
    timezone: 'America/New_York',
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Production Portal Key', key: 'obx_live_9f8d7c6b5a4e3d2c1', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: 'key-2', name: 'Staging CI/CD Ingestion', key: 'obx_test_4a3b2c1d0e9f8a7b6', created: '2024-02-10', lastUsed: '3 days ago' },
  ]);

  const handleSave = () => {
    addToast('success', 'Changes Saved', 'Settings have been updated.');
  };

  const copyKey = (val) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(true);
    addToast('info', 'Copied', 'API key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: 'Custom Integration Token',
      key: `obx_live_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setApiKeys(prev => [newKey, ...prev]);
    addToast('success', 'API Key Generated', 'Store your new secret token securely.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Settings</h1>
          <p className="page-subtitle">Configure organization parameters, account security, developer API access, and billing</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={14} /> Save Changes
        </button>
      </div>

      <div className="config-layout">
        <div className="card config-tabs-sidebar">
          {SETTING_TABS.map(tab => (
            <button
              key={tab.id}
              className={`config-tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="config-content">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">Administrator Profile</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <div className="avatar-initials" style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #3b82f6, #1e40af)', color: 'white', fontSize: 20, fontWeight: 700 }}>
                    PG
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>{profile.name}</h4>
                    <p className="text-xs text-muted">{profile.title}</p>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => addToast('info', 'Photo Update', 'Avatar upload ready')}>
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-input"
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select
                      className="form-select"
                      value={profile.timezone}
                      onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="UTC">UTC Universal</option>
                      <option value="Europe/London">London, UK</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Org */}
          {activeTab === 'org' && (
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">Organization Overview</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Organization Legal Name</label>
                    <input className="form-input" defaultValue="PIYONEX Technologies Inc." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Root Domain</label>
                    <input className="form-input" defaultValue="piyonex.io" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Billing Contact Email</label>
                    <input className="form-input" defaultValue="finance@piyonex.io" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tax ID / VAT Registration</label>
                    <input className="form-input" defaultValue="US-94827103-K" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">Security & SSO Authentication</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-md)' }}>
                  <div>
                    <div className="font-semibold text-sm">SAML 2.0 / Single Sign-On</div>
                    <div className="text-xs text-muted">Enforce Okta / Google Workspace login for corporate admins</div>
                  </div>
                  <span className="badge badge-active"><span className="badge-dot" /> Configured</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-md)' }}>
                  <div>
                    <div className="font-semibold text-sm">Hardware Token / WebAuthn (FIDO2)</div>
                    <div className="text-xs text-muted">Allow Yubikey and Passkey biometric 2FA</div>
                  </div>
                  <span className="badge badge-active"><span className="badge-dot" /> Enabled</span>
                </div>
              </div>
            </div>
          )}

          {/* API Keys */}
          {activeTab === 'apikeys' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="section-title">API Keys & Tokens</h3>
                  <p className="text-xs text-muted mt-1">Authenticate REST & GraphQL requests to the PIYONEX multi-tenant gateway</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={handleGenerateKey}>
                  <Plus size={14} /> Generate Key
                </button>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {apiKeys.map(k => (
                  <div key={k.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-gray-50)' }}>
                    <div>
                      <div className="font-semibold text-sm">{k.name}</div>
                      <div className="td-mono" style={{ marginTop: 4 }}>{k.key}</div>
                      <div className="text-xs text-muted" style={{ marginTop: 4 }}>Created {k.created} · Last active: {k.lastUsed}</div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => copyKey(k.key)}>
                      <Copy size={13} /> Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">Subscription & Usage</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: '16px', border: '1px solid var(--color-primary-100)', background: 'var(--color-primary-50)', borderRadius: 'var(--border-radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-active">Enterprise Tier</span>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: 6 }}>Unlimited Multi-Tenant License</h3>
                    <p className="text-xs text-muted" style={{ marginTop: 2 }}>Renews automatically on January 15, 2027</p>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => addToast('info', 'Billing Portal', 'Redirecting to Stripe Customer Portal')}>
                    Manage Invoices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System Preferences */}
          {activeTab === 'preferences' && (
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">System Preferences</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Default Landing Page</label>
                    <select className="form-select" defaultValue="dashboard">
                      <option value="dashboard">Dashboard Overview</option>
                      <option value="clients">Clients / Tenants</option>
                      <option value="onboarding">Onboarding Pipeline</option>
                      <option value="tasks">Setup Tasks</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Auto-Refresh Interval</label>
                    <select className="form-select" defaultValue="30">
                      <option value="15">Every 15 seconds</option>
                      <option value="30">Every 30 seconds</option>
                      <option value="60">Every 1 minute</option>
                      <option value="0">Manual Refresh Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
