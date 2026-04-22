import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, MapPin, AlertTriangle, Activity,
  Zap, Shield, Building2, Droplets, ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts';
import { useApp } from '../store';
import { TREND_DATA, CIVIC_SCORES, CATEGORY_DISTRIBUTION } from '../data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AnalyticsPage() {
  const { issues, totalIssues, resolvedIssues } = useApp();

  const highRisk = issues.filter(i => i.riskLevel === 'high').length;
  const avgRiskScore = Math.round(issues.reduce((sum, i) => sum + i.riskScore, 0) / issues.length);

  // Monthly resolution data
  const resolutionData = [
    { month: 'Jan', reported: 35, resolved: 28 },
    { month: 'Feb', reported: 37, resolved: 30 },
    { month: 'Mar', reported: 50, resolved: 38 },
    { month: 'Apr', reported: 47, resolved: 40 },
    { month: 'May', reported: 45, resolved: 42 },
    { month: 'Jun', reported: 62, resolved: 48 },
    { month: 'Jul', reported: 70, resolved: 55 },
    { month: 'Aug', reported: 74, resolved: 60 },
    { month: 'Sep', reported: 62, resolved: 52 },
    { month: 'Oct', reported: 48, resolved: 45 },
    { month: 'Nov', reported: 33, resolved: 30 },
    { month: 'Dec', reported: 26, resolved: 24 },
  ];

  // Area comparison radar data
  const radarData = CIVIC_SCORES.slice(0, 5).map(cs => ({
    area: cs.area,
    Cleanliness: cs.cleanliness,
    Safety: cs.safety,
    Infrastructure: cs.infrastructure,
  }));

  // Most affected areas
  const areaIssueCount = issues.reduce<Record<string, number>>((acc, issue) => {
    const area = issue.location.address.split(',')[0].trim();
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});

  const topAreas = Object.entries(areaIssueCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  // Category breakdown
  const categoryBreakdown = [
    { category: 'Infrastructure', active: issues.filter(i => i.category === 'infrastructure' && i.status !== 'completed').length, resolved: issues.filter(i => i.category === 'infrastructure' && i.status === 'completed').length },
    { category: 'Resource', active: issues.filter(i => i.category === 'resource-wastage' && i.status !== 'completed').length, resolved: issues.filter(i => i.category === 'resource-wastage' && i.status === 'completed').length },
    { category: 'Safety', active: issues.filter(i => i.category === 'public-safety' && i.status !== 'completed').length, resolved: issues.filter(i => i.category === 'public-safety' && i.status === 'completed').length },
  ];

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', paddingBottom: 60 }} className="bg-grid">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={28} color="var(--color-primary)" /> Analytics & Insights
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Comprehensive analysis of civic issue patterns and trends</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}
        >
          {[
            { label: 'Average Risk Score', value: avgRiskScore, suffix: '/100', icon: <AlertTriangle size={20} />, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
            { label: 'Resolution Rate', value: `${totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0}%`, icon: <TrendingUp size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.06)' },
            { label: 'High Risk Issues', value: highRisk, icon: <Zap size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
            { label: 'Active Zones', value: Object.keys(areaIssueCount).length, icon: <MapPin size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.06)' },
          ].map((metric, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card"
              style={{ padding: 20, borderLeft: `3px solid ${metric.color}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{metric.label}</div>
                <div style={{ color: metric.color, background: metric.bg, padding: 6, borderRadius: 'var(--radius-sm)' }}>
                  {metric.icon}
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{metric.value}{metric.suffix || ''}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 1: Trends + Category Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="var(--color-primary)" /> Reported vs Resolved
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={resolutionData}>
                <defs>
                  <linearGradient id="gradReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Area type="monotone" dataKey="reported" stroke="#6366f1" fill="url(#gradReported)" strokeWidth={2} name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#gradResolved)" strokeWidth={2} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: '#94a3b8' }} width={90} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Bar dataKey="active" fill="#6366f1" radius={[0, 4, 4, 0]} name="Active" />
                <Bar dataKey="resolved" fill="#10b981" radius={[0, 4, 4, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Row 2: Top Areas + Radar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} color="var(--color-danger)" /> Most Affected Areas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topAreas.map((area, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{area.name}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{area.count} issues</span>
                  </div>
                  <div className="progress-track">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(area.count / Math.max(...topAreas.map(a => a.count))) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Area Quality Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Radar name="Cleanliness" dataKey="Cleanliness" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Safety" dataKey="Safety" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Infrastructure" dataKey="Infrastructure" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} />
                <Legend iconType="circle" iconSize={8} formatter={(value: string) => <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{value}</span>} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
          style={{
            padding: 28,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(6,182,212,0.04))',
            borderColor: 'rgba(99,102,241,0.12)',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={18} color="var(--color-primary)" /> AI-Generated Insights
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              {
                icon: <Building2 size={18} />,
                color: '#6366f1',
                title: 'Infrastructure Pattern',
                text: 'Infrastructure issues spike 2.5x during monsoon season (Jun-Aug). Pre-emptive maintenance recommended in May.',
              },
              {
                icon: <Droplets size={18} />,
                color: '#06b6d4',
                title: 'Resource Wastage Trend',
                text: 'Water leaks correlate with pipeline age. Areas with 10+ year old pipes show 3x higher failure rates.',
              },
              {
                icon: <Shield size={18} />,
                color: '#f59e0b',
                title: 'Safety Correlation',
                text: 'Crime-related safety reports increase 40% in areas with broken streetlights. Lighting upgrades could reduce incidents.',
              },
            ].map((insight, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                style={{
                  padding: 20,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  background: `${insight.color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: insight.color,
                  marginBottom: 12,
                }}>
                  {insight.icon}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 6 }}>{insight.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{insight.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1.5fr 1fr'"],
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
