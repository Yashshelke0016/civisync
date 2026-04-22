import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Brain, AlertTriangle, Users,
  CheckCircle2, Circle, Zap, TrendingUp, Shield,
} from 'lucide-react';
import { useApp } from '../store';
import { getIssueTimeline } from '../data';
import { getPredictiveAlert } from '../ai-engine';

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  'submitted': { color: '#94a3b8', label: 'Submitted', icon: <Circle size={16} /> },
  'processing': { color: '#f59e0b', label: 'Under Review', icon: <Clock size={16} /> },
  'in-progress': { color: '#6366f1', label: 'In Progress', icon: <TrendingUp size={16} /> },
  'completed': { color: '#10b981', label: 'Resolved', icon: <CheckCircle2 size={16} /> },
};

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getIssueById } = useApp();
  const issue = getIssueById(id || '');

  if (!issue) {
    return (
      <div style={{ paddingTop: 120, minHeight: '100vh', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Issue not found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>The issue you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const timeline = getIssueTimeline(issue);
  const predictiveAlert = getPredictiveAlert(issue.category, issue.riskScore);
  const status = statusConfig[issue.status];
  const progress =
    issue.status === 'submitted' ? 15 :
    issue.status === 'processing' ? 40 :
    issue.status === 'in-progress' ? 70 : 100;

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', paddingBottom: 60 }} className="bg-grid">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ marginBottom: 24 }}
        >
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: 32, marginBottom: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{issue.id}</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4 }}>{issue.title}</h1>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: `${status.color}15`,
                  color: status.color,
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                }}
              >
                {status.icon} {status.label}
              </span>
              <span className={`badge badge-${issue.riskLevel}`} style={{ fontSize: '0.8125rem', padding: '6px 14px' }}>
                {issue.riskLevel === 'high' ? '🔴' : issue.riskLevel === 'medium' ? '🟡' : '🟢'} {issue.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{issue.description}</p>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
              <MapPin size={16} color="var(--color-primary)" />
              <span style={{ color: 'var(--color-text-secondary)' }}>{issue.location.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
              <Users size={16} color="var(--color-primary)" />
              <span style={{ color: 'var(--color-text-secondary)' }}>{issue.reportCount} reports</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
              <Clock size={16} color="var(--color-primary)" />
              <span style={{ color: 'var(--color-text-secondary)' }}>
                {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
              <Zap size={16} color="var(--color-accent)" />
              <span style={{ color: 'var(--color-text-secondary)' }}>+{issue.reporterPoints} Civipoints earned</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-track" style={{ height: 8 }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
              style={{ padding: 24 }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={18} color="var(--color-primary)" /> AI Analysis
              </h3>

              {/* Risk Score */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-hover)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Risk Score</div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: issue.riskLevel === 'high' ? '#ef4444' : issue.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
                  }}>
                    {issue.riskScore}<span style={{ fontSize: '1rem', opacity: 0.5 }}>/100</span>
                  </div>
                  <div className="risk-meter" style={{ marginTop: 8 }}>
                    <motion.div
                      className={`risk-meter-fill ${issue.riskLevel}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${issue.riskScore}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div style={{
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-hover)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>Impact Level</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
                    {issue.riskLevel === 'high' ? 'Critical Priority' : issue.riskLevel === 'medium' ? 'Moderate Priority' : 'Standard Priority'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    Based on {issue.reportCount} citizen reports and historical data
                  </div>
                </div>
              </div>

              {/* Root Cause */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
                  🔍 Predicted Root Cause
                </div>
                <p style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99,102,241,0.04)',
                  border: '1px solid rgba(99,102,241,0.08)',
                }}>
                  "{issue.predictedCause}"
                </p>
              </div>

              {/* AI Insight */}
              <div style={{
                padding: 16,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.06))',
                border: '1px solid rgba(99,102,241,0.12)',
              }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={14} /> AI Insight
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {issue.aiInsight}
                </p>
              </div>
            </motion.div>

            {/* Predictive Alert */}
            {predictiveAlert && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: 20,
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(239,68,68,0.06))',
                  border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex',
                  gap: 14,
                }}
              >
                <AlertTriangle size={22} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: 4 }}>
                    Predictive Alert
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {predictiveAlert}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
            style={{ padding: 24, height: 'fit-content' }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="var(--color-primary)" /> Issue Timeline
            </h3>

            <div className="timeline">
              {timeline.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className={`timeline-item ${i === timeline.length - 1 && issue.status === 'completed' ? 'completed' : ''} ${i === timeline.length - 1 && issue.status !== 'completed' ? 'pending' : ''}`}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 2 }}>
                    {entry.status}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {entry.description}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/map" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                <MapPin size={14} /> View on Map
              </Link>
              <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ justifyContent: 'center' }}>
                <ArrowLeft size={14} /> All Issues
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 340px'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
