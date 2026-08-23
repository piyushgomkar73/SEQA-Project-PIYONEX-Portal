import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, User, Building, Server, Users, ClipboardCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import './AddClient.css';

const STEPS = [
  { id: 1, label: 'Client', title: 'Client Information', icon: User },
  { id: 2, label: 'Tenant', title: 'Tenant Configuration', icon: Building },
  { id: 3, label: 'Software', title: 'Software Instance', icon: Server },
  { id: 4, label: 'Users', title: 'Users & Roles', icon: Users },
  { id: 5, label: 'Review', title: 'Review & Create', icon: ClipboardCheck },
];

const INDUSTRIES = ['Technology', 'Healthcare', 'Retail', 'Logistics', 'Agriculture', 'Finance', 'Media', 'Education', 'Real Estate', 'Manufacturing'];
const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Singapore'];
const REGIONS = ['US East', 'US West', 'EU West', 'EU Central', 'AP Southeast', 'AP Northeast'];
const TIMEZONES = ['UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Singapore'];
const PRODUCTS = ['PIYONEX Platform', 'PIYONEX Lite', 'PIYONEX Enterprise'];
const PLANS = ['Starter', 'Professional', 'Enterprise'];
const ENVIRONMENTS = ['Production', 'Staging', 'Development'];

const defaultForm = {
  // Step 1
  companyName: '', clientId: '', industry: '', email: '', phone: '', address: '', country: 'United States', website: '',
  // Step 2
  tenantName: '', tenantId: '', subdomain: '', region: 'US East', timezone: 'America/New_York', currency: 'USD', language: 'English',
  // Step 3
  product: 'PIYONEX Platform', plan: 'Professional', environment: 'Production', instanceName: '', version: 'v4.2.1', dbConfig: 'Managed PostgreSQL',
  // Step 4
  adminName: '', adminEmail: '', adminRole: 'Client Admin', additionalUsers: '',
};

export default function AddClient() {
  const { addClient } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
    // Auto-generate tenant/subdomain/instance
    if (k === 'companyName') {
      const slug = v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const id = 'CLT-' + Math.floor(Math.random() * 900 + 100);
      setForm(f => ({
        ...f, companyName: v,
        clientId: f.clientId || id,
        tenantName: f.tenantName || v + ' Workspace',
        tenantId: f.tenantId || 'TNT-' + Math.floor(Math.random() * 900 + 100),
        subdomain: f.subdomain || slug,
        instanceName: f.instanceName || (slug + '-prod-01'),
      }));
    }
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.companyName) e.companyName = 'Company name is required';
      if (!form.email) e.email = 'Email is required';
      if (!form.industry) e.industry = 'Industry is required';
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    }
    if (step === 2) {
      if (!form.tenantName) e.tenantName = 'Tenant name is required';
      if (!form.subdomain) e.subdomain = 'Subdomain is required';
    }
    if (step === 4) {
      if (!form.adminName) e.adminName = 'Admin name is required';
      if (!form.adminEmail) e.adminEmail = 'Admin email is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 5));
  };

  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleCreate = async () => {
    setCreating(true);
    await new Promise(r => setTimeout(r, 1200));
    addClient({
      name: form.companyName,
      industry: form.industry,
      plan: form.plan,
      email: form.email,
      phone: form.phone,
      website: form.website,
      address: form.address,
      country: form.country,
      logo: form.companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      logoColor: '#3b82f6',
      status: 'pending',
      tenantId: form.tenantId,
      instanceId: 'INS-NEW',
    });
    addToast('success', 'Client created!', `${form.companyName} has been onboarded successfully.`);
    navigate('/clients');
  };


  return (
    <div className="add-client">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Client</h1>
          <p className="page-subtitle">Complete the setup wizard to onboard a new client</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="wizard-steps">
        {STEPS.map((s, i) => (
          <div key={s.id} className="wizard-step" style={{ flex: i < STEPS.length - 1 ? '1' : '0' }}>
            <div className={`wizard-step ${step > s.id ? 'completed' : step === s.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: step > s.id ? 'pointer' : 'default' }}
              onClick={() => step > s.id && setStep(s.id)}>
              <div className={`wizard-step-circle ${step > s.id ? 'completed' : step === s.id ? 'active' : ''}`}
                style={{
                  background: step > s.id ? 'var(--color-success)' : step === s.id ? 'var(--color-accent)' : '',
                  borderColor: step > s.id ? 'var(--color-success)' : step === s.id ? 'var(--color-accent)' : '',
                  color: (step >= s.id) ? 'white' : '',
                }}>
                {step > s.id ? <Check size={14} /> : s.id}
              </div>
              <div className="wizard-step-info">
                <span className="wizard-step-label" style={{ color: step >= s.id ? 'var(--color-gray-700)' : '' }}>
                  Step {s.id}
                </span>
                <span className="wizard-step-title" style={{ color: step === s.id ? 'var(--color-gray-800)' : '' }}>
                  {s.label}
                </span>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`wizard-connector ${step > s.id ? 'completed' : ''}`} style={{ flex: 1 }} />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="section-title">{STEPS[step - 1].title}</h3>
            <p className="text-sm text-muted mt-1">Step {step} of {STEPS.length}</p>
          </div>
        </div>
        <div className="card-body">
          {/* Step 1 */}
          {step === 1 && (
            <div className="wizard-form">
              <div className="form-row">
                <FormGroup label="Company Name" required error={errors.companyName}>
                  <input className={`form-input ${errors.companyName ? 'error' : ''}`}
                    placeholder="e.g. Acme Technologies" value={form.companyName}
                    onChange={e => set('companyName', e.target.value)} />
                </FormGroup>
                <FormGroup label="Client ID">
                  <input className="form-input" placeholder="Auto-generated" value={form.clientId}
                    onChange={e => set('clientId', e.target.value)} />
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label="Industry" required error={errors.industry}>
                  <select className={`form-select ${errors.industry ? 'error' : ''}`}
                    value={form.industry} onChange={e => set('industry', e.target.value)}>
                    <option value="">Select industry…</option>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Company Email" required error={errors.email}>
                  <input className={`form-input ${errors.email ? 'error' : ''}`}
                    type="email" placeholder="admin@company.com" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label="Phone Number">
                  <input className="form-input" placeholder="+1 (555) 000-0000" value={form.phone}
                    onChange={e => set('phone', e.target.value)} />
                </FormGroup>
                <FormGroup label="Website">
                  <input className="form-input" placeholder="https://company.com" value={form.website}
                    onChange={e => set('website', e.target.value)} />
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label="Address">
                  <input className="form-input" placeholder="123 Main St, City, State" value={form.address}
                    onChange={e => set('address', e.target.value)} />
                </FormGroup>
                <FormGroup label="Country">
                  <select className="form-select" value={form.country}
                    onChange={e => set('country', e.target.value)}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormGroup>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="wizard-form">
              <div className="form-row">
                <FormGroup label="Tenant Name" required error={errors.tenantName}>
                  <input className={`form-input ${errors.tenantName ? 'error' : ''}`}
                    value={form.tenantName} onChange={e => set('tenantName', e.target.value)} />
                </FormGroup>
                <FormGroup label="Tenant ID">
                  <input className="form-input" value={form.tenantId}
                    onChange={e => set('tenantId', e.target.value)} />
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label="Subdomain" required error={errors.subdomain}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
                    <input className="form-input" style={{ border: 'none', borderRadius: 0 }}
                      value={form.subdomain} onChange={e => set('subdomain', e.target.value)} />
                    <span style={{ padding: '9px 12px', background: 'var(--color-gray-50)', borderLeft: '1px solid var(--border-color)', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap' }}>
                      .piyonex.io
                    </span>
                  </div>
                </FormGroup>
                <FormGroup label="Region">
                  <select className="form-select" value={form.region}
                    onChange={e => set('region', e.target.value)}>
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </FormGroup>
              </div>
              <div className="form-row-3">
                <FormGroup label="Time Zone">
                  <select className="form-select" value={form.timezone}
                    onChange={e => set('timezone', e.target.value)}>
                    {TIMEZONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Currency">
                  <select className="form-select" value={form.currency}
                    onChange={e => set('currency', e.target.value)}>
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Language">
                  <select className="form-select" value={form.language}
                    onChange={e => set('language', e.target.value)}>
                    {['English', 'French', 'German', 'Spanish', 'Japanese'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </FormGroup>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="wizard-form">
              <div className="form-row">
                <FormGroup label="Software Product">
                  <select className="form-select" value={form.product}
                    onChange={e => set('product', e.target.value)}>
                    {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Plan">
                  <select className="form-select" value={form.plan}
                    onChange={e => set('plan', e.target.value)}>
                    {PLANS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label="Environment">
                  <select className="form-select" value={form.environment}
                    onChange={e => set('environment', e.target.value)}>
                    {ENVIRONMENTS.map(e => <option key={e}>{e}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Instance Name">
                  <input className="form-input" value={form.instanceName}
                    onChange={e => set('instanceName', e.target.value)} />
                </FormGroup>
              </div>
              <div className="form-row">
                <FormGroup label="Version">
                  <select className="form-select" value={form.version}
                    onChange={e => set('version', e.target.value)}>
                    {['v4.2.1', 'v4.1.9', 'v4.0.5'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Database Configuration">
                  <select className="form-select" value={form.dbConfig}
                    onChange={e => set('dbConfig', e.target.value)}>
                    {['Managed PostgreSQL', 'Managed MySQL', 'Bring Your Own DB'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </FormGroup>
              </div>
              <div className="instance-preview">
                <div className="instance-preview-label">Instance Preview</div>
                <div className="instance-preview-box">
                  <div className="instance-preview-row"><span>URL</span><span>{form.subdomain}.piyonex.io</span></div>
                  <div className="instance-preview-row"><span>Region</span><span>{form.region}</span></div>
                  <div className="instance-preview-row"><span>Plan</span><span>{form.plan}</span></div>
                  <div className="instance-preview-row"><span>Database</span><span>{form.dbConfig}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="wizard-form">
              <div className="step-section-title">Primary Administrator</div>
              <div className="form-row">
                <FormGroup label="Admin Full Name" required error={errors.adminName}>
                  <input className={`form-input ${errors.adminName ? 'error' : ''}`}
                    placeholder="Jane Smith" value={form.adminName}
                    onChange={e => set('adminName', e.target.value)} />
                </FormGroup>
                <FormGroup label="Admin Email" required error={errors.adminEmail}>
                  <input className={`form-input ${errors.adminEmail ? 'error' : ''}`}
                    type="email" placeholder="admin@company.com" value={form.adminEmail}
                    onChange={e => set('adminEmail', e.target.value)} />
                </FormGroup>
              </div>
              <FormGroup label="Role">
                <select className="form-select" style={{ maxWidth: 300 }} value={form.adminRole}
                  onChange={e => set('adminRole', e.target.value)}>
                  {['Client Admin', 'Client User', 'Support'].map(r => <option key={r}>{r}</option>)}
                </select>
              </FormGroup>
              <div style={{ marginTop: 24, padding: '16px', background: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
                <div className="form-hint" style={{ marginBottom: 8, fontWeight: 500, color: 'var(--color-gray-600)' }}>
                  Invite Additional Users (optional)
                </div>
                <textarea
                  className="form-textarea"
                  placeholder="Enter emails separated by commas&#10;e.g. user1@company.com, user2@company.com"
                  value={form.additionalUsers}
                  onChange={e => set('additionalUsers', e.target.value)}
                  rows={3}
                />
                <p className="form-hint">Additional users will receive an email invitation to join the tenant.</p>
              </div>
            </div>
          )}

          {/* Step 5 - Review */}
          {step === 5 && (
            <div className="review-grid">
              <ReviewSection title="Client Information" color="#3b82f6">
                <ReviewRow label="Company" value={form.companyName} />
                <ReviewRow label="Industry" value={form.industry} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Phone" value={form.phone || '—'} />
                <ReviewRow label="Country" value={form.country} />
                <ReviewRow label="Website" value={form.website || '—'} />
              </ReviewSection>
              <ReviewSection title="Tenant Configuration" color="#10b981">
                <ReviewRow label="Tenant Name" value={form.tenantName} />
                <ReviewRow label="Subdomain" value={form.subdomain + '.piyonex.io'} />
                <ReviewRow label="Region" value={form.region} />
                <ReviewRow label="Timezone" value={form.timezone} />
                <ReviewRow label="Currency" value={form.currency} />
                <ReviewRow label="Language" value={form.language} />
              </ReviewSection>
              <ReviewSection title="Software Instance" color="#8b5cf6">
                <ReviewRow label="Product" value={form.product} />
                <ReviewRow label="Plan" value={form.plan} />
                <ReviewRow label="Environment" value={form.environment} />
                <ReviewRow label="Instance Name" value={form.instanceName} />
                <ReviewRow label="Version" value={form.version} />
                <ReviewRow label="Database" value={form.dbConfig} />
              </ReviewSection>
              <ReviewSection title="Administrator" color="#f59e0b">
                <ReviewRow label="Name" value={form.adminName} />
                <ReviewRow label="Email" value={form.adminEmail} />
                <ReviewRow label="Role" value={form.adminRole} />
                <ReviewRow label="Add. Users" value={form.additionalUsers || 'None'} />
              </ReviewSection>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={back}>Back</button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/clients')}>Cancel</button>
          {step < 5 ? (
            <button className="btn btn-primary" onClick={next}>
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating…' : '✓ Create Client'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children, color }) {
  return (
    <div className="review-section" style={{ borderTop: `3px solid ${color}` }}>
      <div className="review-section-title">{title}</div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="review-row">
      <span className="review-row-label">{label}</span>
      <span className="review-row-value">{value}</span>
    </div>
  );
}

function FormGroup({ label, required, error, children }) {
  return (
    <div className="form-group">
      <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
