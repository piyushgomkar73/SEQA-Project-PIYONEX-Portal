import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../contexts/AppContext';

export default function Layout() {
  const { sidebarCollapsed } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar onMobileMenuToggle={() => setMobileOpen(o => !o)} />
        <main className="page-content">
          <Outlet />
          
          {/* Global Enterprise Portal Footer */}
          <footer style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gray-500)'
          }}>
            <div>
              © 2026 <strong>PIYONEX Technologies Inc.</strong> All rights reserved.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-full)',
              fontWeight: 600,
              color: 'var(--color-primary-light)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <span>⚡ Developed by</span>
              <strong style={{ color: 'var(--color-accent)' }}>Piyush Gomkar</strong>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
