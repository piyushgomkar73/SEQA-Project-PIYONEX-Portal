import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, CheckSquare, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionMenu from '../../components/ui/ActionMenu';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import './Tasks.css';

const PAGE_SIZE = 10;

const PRIORITY_COLORS = {
  low: 'priority-low', medium: 'priority-medium', high: 'priority-high', critical: 'priority-critical',
};

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, clients } = useApp();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', clientId: '', category: 'Integration', assignedTo: 'Piyush Gomkar', priority: 'medium', dueDate: '', status: 'not-started' });
  const [errors, setErrors] = useState({});

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    return (
      (t.name.toLowerCase().includes(q) || t.clientName?.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || t.status === statusFilter) &&
      (priorityFilter === 'all' || t.priority === priorityFilter)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSubmit = () => {
    const e = {};
    if (!form.name) e.name = 'Task name is required';
    if (!form.clientId) e.clientId = 'Client is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    if (Object.keys(e).length) { setErrors(e); return; }
    const client = clients.find(c => c.id === form.clientId);
    addTask({ ...form, clientName: client?.name, tenantId: client?.tenantId });
    addToast('success', 'Task created', `"${form.name}" has been added.`);
    setShowModal(false);
    setForm({ name: '', clientId: '', category: 'Integration', assignedTo: 'Piyush Gomkar', priority: 'medium', dueDate: '', status: 'not-started' });
    setErrors({});
  };

  const markComplete = (id) => {
    updateTask(id, { status: 'completed' });
    addToast('success', 'Task completed', 'Task marked as completed.');
  };

  const counts = {
    all: tasks.length,
    'not-started': tasks.filter(t => t.status === 'not-started').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Setup Tasks</h1>
          <p className="page-subtitle">Manage and track onboarding setup tasks</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> New Task
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="tasks-stat-row">
        {[
          { label: 'Total', key: 'all', color: '#3b82f6' },
          { label: 'Not Started', key: 'not-started', color: '#f59e0b' },
          { label: 'In Progress', key: 'in-progress', color: '#3b82f6' },
          { label: 'Blocked', key: 'blocked', color: '#ef4444' },
          { label: 'Completed', key: 'completed', color: '#10b981' },
        ].map(s => (
          <div key={s.key} className={`task-stat-card card ${statusFilter === s.key ? 'active' : ''}`}
            onClick={() => { setStatusFilter(s.key); setPage(1); }}
            style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="task-stat-value" style={{ color: s.color }}>{counts[s.key]}</div>
            <div className="task-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-wrapper" style={{ flex: 1, maxWidth: 300 }}>
            <Search size={15} className="search-icon" />
            <input className="form-input search-input" placeholder="Search tasks…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={priorityFilter}
            onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}>
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <span className="text-sm text-muted">{filtered.length} tasks</span>
        </div>

        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Client</th>
                <th>Category</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state">
                  <div className="empty-state-icon"><CheckSquare size={28} /></div>
                  <div className="empty-state-title">No tasks found</div>
                  <div className="empty-state-desc">Create a new task or adjust your filters.</div>
                </div></td></tr>
              ) : paged.map(task => (
                <tr key={task.id}>
                  <td>
                    <div className="td-primary">{task.name}</div>
                    <div className="text-xs text-muted">{task.id}</div>
                  </td>
                  <td className="text-sm">{task.clientName}</td>
                  <td>
                    <span className="badge" style={{ background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}>
                      {task.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div className="avatar-initials" style={{ width: 24, height: 24, background: '#eff6ff', color: '#3b82f6', fontSize: 9, fontWeight: 700 }}>
                        {task.assignedTo?.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span className="text-sm">{task.assignedTo}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span></td>
                  <td className="text-sm">{task.dueDate}</td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>
                    <ActionMenu items={[
                      { label: 'Mark Complete', icon: <CheckSquare size={14} />, onClick: () => markComplete(task.id) },
                      { label: 'Edit', icon: <Edit size={14} />, onClick: () => addToast('info', 'Edit Task', 'Task editor coming soon.') },
                      { divider: true },
                      { label: 'Delete', icon: <Trash2 size={14} />, danger: true, onClick: () => setDeleteTarget(task) },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setErrors({}); }} title="Create New Task" size="md"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Create Task</button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label required">Task Name</label>
            <input className={`form-input ${errors.name ? 'error' : ''}`} placeholder="e.g. Configure SSO Integration"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Client</label>
              <select className={`form-select ${errors.clientId ? 'error' : ''}`} value={form.clientId}
                onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}>
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.clientId && <span className="form-error">{errors.clientId}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Integration', 'Data', 'Configuration', 'Training', 'Testing', 'Compliance', 'Deployment', 'Security'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assigned To</label>
              <select className="form-select" value={form.assignedTo}
                onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
                {['Piyush Gomkar', 'Priya Sharma', 'Daniel Lee', 'Sarah Wilson'].map(u => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label required">Due Date</label>
            <input type="date" className={`form-input ${errors.dueDate ? 'error' : ''}`}
              value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteTask(deleteTarget?.id); addToast('success', 'Task deleted', 'Task removed.'); setDeleteTarget(null); }}
        title="Delete Task" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} confirmLabel="Delete Task" />
    </div>
  );
}
