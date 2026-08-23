export default function StatusBadge({ status }) {
  const map = {
    active: 'Active',
    pending: 'Pending',
    onboarding: 'Onboarding',
    suspended: 'Suspended',
    completed: 'Completed',
    running: 'Running',
    provisioning: 'Provisioning',
    maintenance: 'Maintenance',
    failed: 'Failed',
    offline: 'Offline',
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    blocked: 'Blocked',
    inactive: 'Inactive',
  };

  const cls = status === 'not-started' ? 'badge-pending'
    : status === 'in-progress' ? 'badge-onboarding'
    : status === 'blocked' ? 'badge-suspended'
    : status === 'inactive' ? 'badge-offline'
    : `badge-${status}`;

  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {map[status] || status}
    </span>
  );
}
