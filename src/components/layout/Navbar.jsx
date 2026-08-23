import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, Menu, ChevronRight, X, CheckCircle, AlertTriangle, Info, XCircle, LogOut } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './Navbar.css';

const ROUTE_LABELS = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/clients/new': 'Add Client',
  '/onboarding': 'Onboarding',
  '/tasks': 'Setup Tasks',
  '/instances': 'Software Instances',
  '/configuration': 'Configuration',
  '/users': 'Users & Roles',
  '/logs': 'Activity Logs',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const NOTIF_ICONS = {
  success: <CheckCircle size={16} color="var(--color-success)" />,
  error: <XCircle size={16} color="var(--color-danger)" />,
  warning: <AlertTriangle size={16} color="var(--color-warning)" />,
  info: <Info size={16} color="var(--color-info)" />,
};

export default function Navbar({ onMobileMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef(null);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const crumbs = [
    { label: 'Home', path: '/' },
    ...pathParts.map((part, i) => ({
      label: ROUTE_LABELS['/' + pathParts.slice(0, i + 1).join('/')] || part,
      path: '/' + pathParts.slice(0, i + 1).join('/'),
    })),
  ];

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user?.name || 'Piyush Gomkar';
  const displayRole = user?.role || 'Super Admin';
  const displayAvatar = user?.avatar || 'PG';
  const displayColor = user?.avatarColor || '#3b82f6';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-mobile-menu" onClick={onMobileMenuToggle}>
          <Menu size={20} />
        </button>
        <nav className="breadcrumb">
          {crumbs.map((crumb, i) => (
            <span key={crumb.path} className="breadcrumb-item">
              {i < crumbs.length - 1 ? (
                <>
                  <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
                  <ChevronRight size={14} className="breadcrumb-sep" />
                </>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
          <Search size={15} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search clients, tasks…"
            className="navbar-search-input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchFocused && <kbd className="navbar-kbd">⌘K</kbd>}
        </div>

        {/* Help */}
        <button
          className="navbar-icon-btn"
          title="Help"
          onClick={() => addToast('info', 'Help Desk', 'Contact support@piyonex.io or view docs')}
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            className={`navbar-icon-btn ${unreadCount > 0 ? 'has-badge' : ''}`}
            onClick={() => setNotifOpen(!notifOpen)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="notif-panel">
              <div className="notif-panel-header">
                <span className="notif-panel-title">Notifications</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {unreadCount > 0 && (
                    <button className="notif-mark-all" onClick={markAllNotificationsRead}>
                      Mark all read
                    </button>
                  )}
                  <button className="navbar-icon-btn" onClick={() => setNotifOpen(false)}>
                    <X size={15} />
                  </button>
                </div>
              </div>
              <div className="notif-list">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className="notif-item-icon">{NOTIF_ICONS[n.type]}</div>
                    <div className="notif-item-body">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-msg">{n.message}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                    {!n.read && <div className="notif-dot" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div
          className="navbar-user"
          onClick={() => navigate('/settings')}
          title="Click to view profile & settings"
        >
          <div className="navbar-user-avatar" style={{ background: displayColor }}>
            {displayAvatar}
          </div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{displayName}</span>
            <span className="navbar-user-role">{displayRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
