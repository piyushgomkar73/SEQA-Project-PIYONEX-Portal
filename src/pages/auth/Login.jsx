import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import { useAuth, DEFAULT_ADMIN } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './Login.css';

const DEMO_ACCOUNTS = [
  {
    role: 'Super Admin',
    name: 'Piyush Gomkar',
    email: 'piyush23@gmail.com',
    avatar: 'PG',
    avatarColor: '#3b82f6',
    desc: 'Chief Technology Officer · Full multi-tenant control',
  },
  {
    role: 'Onboarding Manager',
    name: 'Priya Sharma',
    email: 'priya.sharma@piyonex.io',
    avatar: 'PS',
    avatarColor: '#8b5cf6',
    desc: 'Client onboarding workflows & setup pipelines',
  },
  {
    role: 'Client Admin',
    name: 'Marcus Hayes',
    email: 'mhayes@acmetech.com',
    avatar: 'MH',
    avatarColor: '#10b981',
    desc: 'Acme Technologies client organization',
  },
];

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('piyush23@gmail.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    if (!email) {
      addToast('error', 'Authentication Error', 'Please enter your email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      let loggedUser = DEFAULT_ADMIN;
      if (email.toLowerCase().includes('priya')) {
        loggedUser = DEMO_ACCOUNTS[1];
      } else if (email.toLowerCase().includes('marcus') || email.toLowerCase().includes('acme')) {
        loggedUser = DEMO_ACCOUNTS[2];
      } else {
        loggedUser = {
          ...DEFAULT_ADMIN,
          name: 'Piyush Gomkar',
          email: email,
        };
      }

      login(loggedUser);
      setIsLoading(false);
      addToast('success', `Welcome back, ${loggedUser.name}!`, `Logged in as ${loggedUser.role} on PIYONEX.`);
      navigate('/');
    }, 400);
  };

  const handleQuickLogin = (demo) => {
    setEmail(demo.email);
    setPassword('password');
    setIsLoading(true);
    setTimeout(() => {
      login(demo);
      setIsLoading(false);
      addToast('success', `Welcome, ${demo.name}!`, `Logged into PIYONEX as ${demo.role}`);
      navigate('/');
    }, 350);
  };

  return (
    <div className="login-container">
      {/* Left side showcase */}
      <div className="login-banner">
        <div className="login-banner-content">
          <div className="login-brand">
            <div className="login-brand-icon">
              <Layers size={24} color="white" />
            </div>
            <div className="login-brand-text">
              <span className="login-brand-name">PIYONEX</span>
              <span className="login-brand-badge">Multi-Tenant Portal</span>
            </div>
          </div>

          <div className="login-banner-hero">
            <div className="login-tag">
              <Sparkles size={13} /> Multi-Tenant Orchestration Platform
            </div>
            <h1 className="login-banner-title">
              Client Onboarding & Tenant Management Portal
            </h1>
            <p className="login-banner-desc">
              All-in-one unified dashboard to configure software instances, monitor clients, manage setup tasks, track live onboarding stages, and inspect audit logs.
            </p>
          </div>

          <div className="login-banner-features">
            <div className="login-feature-item">
              <CheckCircle2 size={18} className="login-feature-icon" />
              <div>
                <strong>Primary Administrator: Piyush Gomkar</strong>
                <p>Full Super Admin controls across all multi-tenant workspaces</p>
              </div>
            </div>
            <div className="login-feature-item">
              <CheckCircle2 size={18} className="login-feature-icon" />
              <div>
                <strong>All 12 Modules Integrated</strong>
                <p>Clients, Tasks, Software Instances, Configuration & Analytics</p>
              </div>
            </div>
            <div className="login-feature-item">
              <CheckCircle2 size={18} className="login-feature-icon" />
              <div>
                <strong>Interactive 8-Stage Pipeline</strong>
                <p>Real-time progress bars, status badges, and deployment tracking</p>
              </div>
            </div>
          </div>

          <div className="login-banner-footer">
            <ShieldCheck size={16} /> 256-bit TLS Encrypted · Developed by <strong>Piyush Gomkar</strong>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="login-form-wrapper">
        <div className="login-form-box">
          <div className="login-form-header">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--color-primary-50)', color: 'var(--color-accent)', borderRadius: 'var(--border-radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: 10 }}>
              <UserCheck size={13} /> Admin Portal Sign In
            </div>
            <h2 className="login-title">Sign In to PIYONEX</h2>
            <p className="login-subtitle">Enter your admin credentials to access the portal</p>
          </div>

          {/* Primary Quick Login Button for Piyush Gomkar */}
          <button
            type="button"
            className="piyush-quick-btn"
            onClick={() => handleQuickLogin(DEFAULT_ADMIN)}
          >
            <div className="avatar-initials" style={{ width: 34, height: 34, background: '#3b82f6', color: 'white', fontSize: 13, fontWeight: 700 }}>
              PG
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: '#0f1f38' }}>
                Sign In as Piyush Gomkar
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                Super Admin (1-Click Instant Access)
              </div>
            </div>
            <ArrowRight size={16} color="#3b82f6" />
          </button>

          {/* Quick Demo Switcher */}
          <div className="demo-accounts-box" style={{ marginTop: 14 }}>
            <div className="demo-accounts-title">
              <Sparkles size={14} color="var(--color-accent)" />
              <span>Or Select Another Role:</span>
            </div>
            <div className="demo-accounts-list">
              {DEMO_ACCOUNTS.slice(1).map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  className="demo-account-btn"
                  onClick={() => handleQuickLogin(demo)}
                >
                  <div
                    className="avatar-initials"
                    style={{
                      width: 26,
                      height: 26,
                      background: demo.avatarColor + '20',
                      color: demo.avatarColor,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {demo.avatar}
                  </div>
                  <div className="demo-account-info">
                    <span className="demo-account-name">{demo.name}</span>
                    <span className="demo-account-role">{demo.role}</span>
                  </div>
                  <ArrowRight size={13} className="demo-arrow" />
                </button>
              ))}
            </div>
          </div>

          <div className="login-divider">
            <span>or sign in with email & password</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="piyush23@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label required">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('info', 'Password Reset', 'Password reset instructions sent.'); }} className="forgot-link">
                  Forgot password?
                </a>
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember session</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="btn-spinner" />
              ) : (
                <>
                  Sign in to PIYONEX Portal <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-100)',
              borderRadius: 'var(--border-radius-full)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              color: 'var(--color-primary-light)'
            }}>
              <span>⚡ Developed by</span>
              <strong style={{ color: 'var(--color-accent)' }}>Piyush Gomkar</strong>
            </div>
            <p className="text-xs text-muted" style={{ marginTop: '8px' }}>
              PIYONEX Multi-Tenant Client Onboarding & Administration Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
