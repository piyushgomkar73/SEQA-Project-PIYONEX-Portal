import { useState } from 'react';
import { Plus, Search, Shield, UserPlus, Trash2, Edit, Check, Lock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionMenu from '../../components/ui/ActionMenu';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { ROLES } from '../../data/mockData';
import './Users.css';

const PAGE_SIZE = 8;

export default function UsersPage() {
  const { users, setUsers, clients } = useApp();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Client Admin',
    tenant: clients[0]?.name || 'All Tenants',
    department: 'IT',
  });

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.tenant.toLowerCase().includes(q)) &&
      (roleFilter === 'all' || u.role === roleFilter)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email) {
      addToast('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }
    const initials = inviteForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      tenant: inviteForm.tenant,
      department: inviteForm.department,
      status: 'active',
      lastLogin: new Date().toISOString(),
      avatar: initials,
      avatarColor: '#3b82f6',
    };
    setUsers(prev => [newUser, ...prev]);
    addToast('success', 'User Invited', `Invitation sent to ${inviteForm.email}`);
    setShowInviteModal(false);
    setInviteForm({
      name: '',
      email: '',
      role: 'Client Admin',
      tenant: clients[0]?.name || 'All Tenants',
      department: 'IT',
    });
  };

  const handleDeleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addToast('success', 'User Deleted', 'User removed from directory.');
    setDeleteTarget(null);
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users & Roles</h1>
          <p className="page-subtitle">Manage system administrators, client users, and role permissions</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
            <UserPlus size={15} /> Invite User
          </button>
        </div>
      </div>

      <div className="card">
        <div className="tabs-nav">
          <button
            className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            All Users ({users.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles & Permissions ({ROLES.length})
          </button>
        </div>

        {activeTab === 'users' ? (
          <div>
            <div className="filter-bar">
              <div className="search-wrapper" style={{ flex: 1, maxWidth: 320 }}>
                <Search size={15} className="search-icon" />
                <input
                  className="form-input search-input"
                  placeholder="Search by name, email, tenant…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Onboarding Manager">Onboarding Manager</option>
                <option value="Support">Support</option>
                <option value="Client Admin">Client Admin</option>
                <option value="Client User">Client User</option>
              </select>
              <span className="text-sm text-muted">{filteredUsers.length} users</span>
            </div>

            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Tenant / Organization</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state">
                          <div className="empty-state-icon"><Shield size={28} /></div>
                          <div className="empty-state-title">No users found</div>
                          <div className="empty-state-desc">Try clearing search filters or invite new team members.</div>
                        </div>
                      </td>
                    </tr>
                  ) : pagedUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            className="avatar-initials"
                            style={{
                              width: 36,
                              height: 36,
                              background: user.avatarColor + '18',
                              color: user.avatarColor,
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            {user.avatar}
                          </div>
                          <div>
                            <div className="td-primary">{user.name}</div>
                            <div className="text-xs text-muted">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: 'var(--color-primary-50)', color: 'var(--color-accent-dark)' }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-sm font-medium">{user.tenant}</td>
                      <td className="text-sm text-muted">{user.department}</td>
                      <td><StatusBadge status={user.status} /></td>
                      <td className="text-sm text-muted">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td>
                        <ActionMenu items={[
                          { label: 'Edit Permissions', icon: <Edit size={14} />, onClick: () => addToast('info', 'Edit User', 'Permission editor opened') },
                          { divider: true },
                          { label: 'Remove User', icon: <Trash2 size={14} />, danger: true, onClick: () => setDeleteTarget(user) }
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        ) : (
          <div className="roles-container card-body">
            <div className="roles-grid">
              {ROLES.map(role => (
                <div key={role.id} className="role-card">
                  <div className="role-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="role-badge-icon">
                        <Lock size={16} />
                      </div>
                      <div>
                        <h4 className="role-name">{role.name}</h4>
                        <span className="text-xs text-muted">{role.userCount} assigned user(s)</span>
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => addToast('info', 'Configure Role', `Editing permissions for ${role.name}`)}>
                      Edit Matrix
                    </button>
                  </div>
                  <p className="role-desc">{role.description}</p>
                  
                  <div className="permission-summary">
                    <div className="permission-summary-title">Access Privileges</div>
                    <div className="permission-tags">
                      {Object.keys(role.permissions).map(module => (
                        <span key={module} className="permission-tag">
                          <Check size={12} color="var(--color-success)" />
                          <span style={{ textTransform: 'capitalize' }}>{module}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
        size="md"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleInvite}>Send Invitation</button>
        </>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label required">Full Name</label>
            <input
              className="form-input"
              placeholder="e.g. Jordan Miller"
              value={inviteForm.name}
              onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="jordan@company.com"
              value={inviteForm.email}
              onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={inviteForm.role}
                onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Onboarding Manager">Onboarding Manager</option>
                <option value="Support">Support</option>
                <option value="Client Admin">Client Admin</option>
                <option value="Client User">Client User</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Tenant</label>
              <select
                className="form-select"
                value={inviteForm.tenant}
                onChange={e => setInviteForm(f => ({ ...f, tenant: e.target.value }))}
              >
                <option value="All Tenants">All Tenants (Global Access)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              className="form-input"
              placeholder="e.g. Engineering, Operations"
              value={inviteForm.department}
              onChange={e => setInviteForm(f => ({ ...f, department: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDeleteUser(deleteTarget?.id)}
        title="Remove User"
        message={`Are you sure you want to remove ${deleteTarget?.name}? They will immediately lose platform access.`}
        confirmLabel="Remove User"
      />
    </div>
  );
}
