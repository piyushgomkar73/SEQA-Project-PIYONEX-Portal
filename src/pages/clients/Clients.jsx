import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Filter, Eye, Edit, Settings, GitMerge, Ban, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';
import ProgressBar from '../../components/ui/ProgressBar';
import ActionMenu from '../../components/ui/ActionMenu';
import Pagination from '../../components/ui/Pagination';
import { ConfirmModal } from '../../components/ui/Modal';
import './Clients.css';

const PAGE_SIZE = 8;

const INDUSTRIES = ['All Industries', 'Technology', 'Healthcare', 'Retail', 'Logistics', 'Agriculture', 'Finance', 'Media'];
const STATUSES = ['All Statuses', 'active', 'pending', 'onboarding', 'suspended', 'completed'];
const PLANS = ['All Plans', 'Starter', 'Professional', 'Enterprise'];

export default function Clients() {
  const { clients, updateClient, deleteClient } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All Industries');
  const [status, setStatus] = useState('All Statuses');
  const [plan, setPlan] = useState('All Plans');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = clients
    .filter(c => {
      const q = search.toLowerCase();
      return (
        (c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) &&
        (industry === 'All Industries' || c.industry === industry) &&
        (status === 'All Statuses' || c.status === status) &&
        (plan === 'All Plans' || c.plan === plan)
      );
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sortIcon = (field) => sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const handleDelete = (id) => {
    deleteClient(id);
    addToast('success', 'Client deleted', 'The client has been removed successfully.');
    setDeleteTarget(null);
  };

  const handleSuspend = (client) => {
    updateClient(client.id, { status: client.status === 'suspended' ? 'active' : 'suspended' });
    addToast('info', 'Status updated', `${client.name} status has been updated.`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients & Tenants</h1>
          <p className="page-subtitle">Manage all client tenants and their onboarding status</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary" onClick={() => addToast('info', 'Exporting…', 'CSV export started.')}>
            <Download size={15} /> Export
          </button>
          <Link to="/clients/new" className="btn btn-primary">
            <Plus size={15} /> Add Client
          </Link>
        </div>
      </div>

      <div className="card">
        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-wrapper" style={{ flex: 1, maxWidth: 320 }}>
            <Search size={15} className="search-icon" />
            <input
              className="form-input search-input"
              placeholder="Search clients…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select className="form-select" style={{ width: 'auto' }}
            value={industry} onChange={e => { setIndustry(e.target.value); setPage(1); }}>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
          <select className="form-select" style={{ width: 'auto' }}
            value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map(s => <option key={s}>{s === 'All Statuses' ? s : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className="form-select" style={{ width: 'auto' }}
            value={plan} onChange={e => { setPlan(e.target.value); setPage(1); }}>
            {PLANS.map(p => <option key={p}>{p}</option>)}
          </select>
          <span className="text-sm text-muted">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('name')}>Client Name{sortIcon('name')}</th>
                <th>Tenant ID</th>
                <th className="sortable" onClick={() => toggleSort('industry')}>Industry{sortIcon('industry')}</th>
                <th>Plan</th>
                <th>Instance</th>
                <th>Progress</th>
                <th className="sortable" onClick={() => toggleSort('status')}>Status{sortIcon('status')}</th>
                <th className="sortable" onClick={() => toggleSort('createdAt')}>Created{sortIcon('createdAt')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 0 }}>
                    <div className="empty-state">
                      <div className="empty-state-icon"><Search size={28} /></div>
                      <div className="empty-state-title">No clients found</div>
                      <div className="empty-state-desc">Try adjusting your search or filter criteria.</div>
                    </div>
                  </td>
                </tr>
              ) : paged.map(client => (
                <tr key={client.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/clients/${client.id}`)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar-initials" style={{
                        width: 36, height: 36, background: client.logoColor + '18',
                        color: client.logoColor, fontSize: 11, fontWeight: 700
                      }}>{client.logo}</div>
                      <div>
                        <div className="td-primary">{client.name}</div>
                        <div className="text-xs text-muted">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="td-mono">{client.tenantId}</span></td>
                  <td className="text-sm">{client.industry}</td>
                  <td>
                    <span className="badge" style={{ background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                      {client.plan}
                    </span>
                  </td>
                  <td><span className="td-mono">{client.instanceId}</span></td>
                  <td style={{ minWidth: 140 }}><ProgressBar value={client.onboardingProgress} size="sm" /></td>
                  <td><StatusBadge status={client.status} /></td>
                  <td className="text-sm text-muted">{client.createdAt}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <ActionMenu items={[
                      { label: 'View details', icon: <Eye size={14} />, onClick: () => navigate(`/clients/${client.id}`) },
                      { label: 'Edit', icon: <Edit size={14} />, onClick: () => addToast('info', 'Edit', 'Edit client coming soon.') },
                      { label: 'Configure', icon: <Settings size={14} />, onClick: () => navigate('/configuration') },
                      { label: 'Onboarding', icon: <GitMerge size={14} />, onClick: () => navigate('/onboarding') },
                      { divider: true },
                      { label: client.status === 'suspended' ? 'Unsuspend' : 'Suspend', icon: <Ban size={14} />, onClick: () => handleSuspend(client) },
                      { label: 'Delete', icon: <Trash2 size={14} />, danger: true, onClick: () => setDeleteTarget(client) },
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
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Client"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete Client"
      />
    </div>
  );
}
