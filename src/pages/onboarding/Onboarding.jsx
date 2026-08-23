import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ONBOARDING_STAGES } from '../../data/mockData';
import ProgressBar from '../../components/ui/ProgressBar';
import StatusBadge from '../../components/ui/StatusBadge';
import './Onboarding.css';

const STAGE_ASSIGNEES = ['Priya Sharma', 'Piyush Gomkar', 'Daniel Lee', 'Sarah Wilson'];

function getStageStatus(clientStage, stage) {
  const stageIdx = ONBOARDING_STAGES.indexOf(stage);
  const clientIdx = ONBOARDING_STAGES.indexOf(clientStage);
  if (stageIdx < clientIdx) return 'completed';
  if (stageIdx === clientIdx) return 'in-progress';
  return 'pending';
}

export default function Onboarding() {
  const { clients } = useApp();
  const activeClients = clients.filter(c => c.status !== 'completed' && c.status !== 'suspended');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Onboarding</h1>
          <p className="page-subtitle">Track and manage client onboarding pipelines</p>
        </div>
        <div className="page-header-right">
          <div className="onboarding-legend">
            <span className="legend-item"><CheckCircle size={13} color="var(--color-success)" /> Completed</span>
            <span className="legend-item"><Clock size={13} color="var(--color-accent)" /> In Progress</span>
            <span className="legend-item"><AlertCircle size={13} color="var(--color-gray-300)" /> Pending</span>
          </div>
        </div>
      </div>

      {/* Stage Header */}
      <div className="card" style={{ overflow: 'auto' }}>
        <div className="onboarding-pipeline-header">
          <div className="pipeline-client-col">Client</div>
          {ONBOARDING_STAGES.map(stage => (
            <div key={stage} className="pipeline-stage-col">{stage}</div>
          ))}
          <div className="pipeline-progress-col">Progress</div>
        </div>

        {activeClients.map(client => (
          <div key={client.id} className="pipeline-row">
            <div className="pipeline-client-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar-initials" style={{
                  width: 32, height: 32, background: client.logoColor + '18',
                  color: client.logoColor, fontSize: 10, fontWeight: 700
                }}>{client.logo}</div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-gray-800)' }}>{client.name}</div>
                  <StatusBadge status={client.status} />
                </div>
              </div>
            </div>
            {ONBOARDING_STAGES.map((stage, i) => {
              const st = getStageStatus(client.onboardingStage, stage);
              return (
                <div key={stage} className="pipeline-stage-col">
                  <div className={`stage-cell stage-cell-${st}`}>
                    {st === 'completed' && <CheckCircle size={16} color="var(--color-success)" />}
                    {st === 'in-progress' && <Clock size={16} color="var(--color-accent)" />}
                    {st === 'pending' && <div className="stage-pending-dot" />}
                  </div>
                </div>
              );
            })}
            <div className="pipeline-progress-col">
              <ProgressBar value={client.onboardingProgress} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Stage Cards */}
      <div style={{ marginTop: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 14 }}>Stage Details</h3>
        <div className="stage-cards-grid">
          {ONBOARDING_STAGES.map((stage, i) => {
            const clientsInStage = clients.filter(c => c.onboardingStage === stage);
            const completed = clients.filter(c => ONBOARDING_STAGES.indexOf(c.onboardingStage) > i).length;
            return (
              <div key={stage} className="stage-detail-card card">
                <div className="stage-detail-header">
                  <div className="stage-step-num">{i + 1}</div>
                  <div>
                    <div className="stage-detail-name">{stage}</div>
                    <div className="text-xs text-muted">{completed} completed · {clientsInStage.length} active</div>
                  </div>
                </div>
                {clientsInStage.length > 0 ? clientsInStage.map(c => (
                  <div key={c.id} className="stage-client-chip">
                    <div className="avatar-initials" style={{
                      width: 20, height: 20, background: c.logoColor + '20',
                      color: c.logoColor, fontSize: 8, fontWeight: 700
                    }}>{c.logo}</div>
                    <span className="text-xs">{c.name}</span>
                  </div>
                )) : (
                  <div className="text-xs text-muted" style={{ marginTop: 8 }}>No active clients</div>
                )}
                <div className="stage-detail-footer">
                  <span className="text-xs text-muted">Assigned: {STAGE_ASSIGNEES[i % 4]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
