import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  LayoutDashboard, Users2, GitMerge, CheckSquare, Server,
  Settings2, Users, ScrollText, BarChart3, Settings,
  HelpCircle, LogOut, ChevronLeft, ChevronRight, Layers
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Clients', icon: Users2, path: '/clients' },
  { label: 'Onboarding', icon: GitMerge, path: '/onboarding' },
  { label: 'Setup Tasks', icon: CheckSquare, path: '/tasks' },
  { label: 'Software Instances', icon: Server, path: '/instances' },
  { label: 'Configuration', icon: Settings2, path: '/configuration' },
  { label: 'Users & Roles', icon: Users, path: '/users' },
  { label: 'Activity Logs', icon: ScrollText, path: '/logs' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('info', 'Logged Out', 'You have been successfully signed out.');
    navigate('/login');
  };

  const displayName = user?.name || 'Piyush Gomkar';
  const displayRole = user?.role || 'Super Admin';
  const displayAvatar = user?.avatar || 'PG';
  const displayColor = user?.avatarColor || '#3b82f6';

  return (
    <>
      {mobileOpen && <div className="sidebar-mobile-overlay" onClick={onMobileClose} />}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Layers size={20} color="white" />
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-brand">PIYONEX</span>
              <span className="sidebar-brand-sub">Admin Portal</span>
            </div>
          )}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            {!sidebarCollapsed && <span className="sidebar-nav-label">Main Menu</span>}
            {NAV_ITEMS.slice(0, 5).map(item => (
              <SidebarItem key={item.path} item={item} collapsed={sidebarCollapsed} onMobileClose={onMobileClose} />
            ))}
          </div>
          <div className="sidebar-nav-section">
            {!sidebarCollapsed && <span className="sidebar-nav-label">Management</span>}
            {NAV_ITEMS.slice(5).map(item => (
              <SidebarItem key={item.path} item={item} collapsed={sidebarCollapsed} onMobileClose={onMobileClose} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-divider" />
          <button
            className="sidebar-footer-item"
            title="Help & Support"
            onClick={() => addToast('info', 'Help & Documentation', 'Visit docs.piyonex.io for tenant setup guides.')}
          >
            <HelpCircle size={18} />
            {!sidebarCollapsed && <span>Help & Support</span>}
          </button>
          <div className="sidebar-user">
            <div
              className="sidebar-user-avatar"
              style={{ background: displayColor }}
            >
              {displayAvatar}
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{displayName}</span>
                <span className="sidebar-user-role">{displayRole}</span>
              </div>
            )}
            {!sidebarCollapsed && (
              <button className="sidebar-logout" title="Logout" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            )}
          </div>
          {!sidebarCollapsed && (
            <div style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#64748b',
              marginTop: '8px',
              padding: '4px 16px',
              letterSpacing: '0.01em'
            }}>
              Developed by <strong style={{ color: '#94a3b8' }}>Piyush Gomkar</strong>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ item, collapsed, onMobileClose }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
      title={collapsed ? item.label : ''}
      onClick={onMobileClose}
    >
      <item.icon size={18} className="sidebar-nav-icon" />
      {!collapsed && <span className="sidebar-nav-text">{item.label}</span>}
    </NavLink>
  );
}
