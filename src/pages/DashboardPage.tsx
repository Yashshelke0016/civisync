import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Filter, Search, MapPin, Clock,
  ArrowUpRight, Trophy, Award, Star, Users,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApp } from '../store';
import { TREND_DATA, CATEGORY_DISTRIBUTION, LEADERBOARD, CIVIC_SCORES } from '../data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const statusColors: Record<string, string> = {
  'submitted': '#94a3b8',
  'processing': '#f59e0b',
  'in-progress': '#6366f1',
  'completed': '#10b981',
};

const statusLabels: Record<string, string> = {
  'submitted': 'Submitted',
  'processing': 'Processing',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

export default function DashboardPage() {
  const { issues, totalIssues, resolvedIssues } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = issues
    .filter(i => filter === 'all' || i.category === filter || i.status === filter || i.riskLevel === filter)
    .filter(i =>
      searchQuery === '' ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const highRiskCount = issues.filter(i => i.riskLevel === 'high').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', paddingBottom: 60 }} className="bg-grid">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>
            <BarChart3 size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--color-primary)' }} />
            Intelligence Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Real-time civic issue monitoring and AI-powered analytics</p>
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}
        >
          {[
            { label: 'Total Issues', value: totalIssues, icon: <BarChart3 size={20} />, color: 'var(--color-primary)', change: '+12%' },
            { label: 'Resolved', value: resolvedIssues, icon: <TrendingUp size={20} />, color: 'var(--color-success)', change: '+8%' },
            { label: 'High Risk', value: highRiskCount, icon: <ArrowUpRight size={20} />, color: 'var(--color-danger)', change: '-5%' },
            { label: 'In Progress', value: inProgressCount, icon: <Clock size={20} />, color: 'var(--color-accent)', change: '+3%' },
          ].map((metric, i) => (
            <motion.div key={i} variants={fadeUp} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ color: metric.color }}>{metric.icon}</div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: metric.change.startsWith('+') ? 'var(--color-success)' : 'var(--color-danger)',
                  background: metric.change.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {metric.change}
                </span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{metric.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 32 }}>
          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="var(--color-primary)" /> Issue Trends (12 Months)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResource" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '0.8125rem',
                  }}
                />
                <Area type="monotone" dataKey="infrastructure" stroke="#6366f1" fill="url(#colorInfra)" strokeWidth={2} name="Infrastructure" />
                <Area type="monotone" dataKey="resource" stroke="#06b6d4" fill="url(#colorResource)" strokeWidth={2} name="Resource" />
                <Area type="monotone" dataKey="safety" stroke="#f59e0b" fill="url(#colorSafety)" strokeWidth={2} name="Safety" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Category Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.8125rem' }} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Civic Scores + Leaderboard Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 32 }}>
          {/* Civic Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={18} color="var(--color-accent)" /> Civic Score System
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Area</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Cleanliness</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Safety</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Infrastructure</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {CIVIC_SCORES.map((cs, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{cs.area}</td>
                      {[cs.cleanliness, cs.safety, cs.infrastructure, cs.overall].map((val, j) => (
                        <td key={j} style={{ textAlign: 'center', padding: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontWeight: 700, color: val >= 75 ? 'var(--color-success)' : val >= 60 ? 'var(--color-accent)' : 'var(--color-danger)' }}>
                              {val}
                            </span>
                            <div className="progress-track" style={{ width: 48 }}>
                              <div className="progress-fill" style={{ width: `${val}%` }} />
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={18} color="var(--color-accent)" /> Top Contributors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LEADERBOARD.map((user) => (
                <motion.div
                  key={user.rank}
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: user.rank <= 3 ? 'rgba(245,158,11,0.04)' : 'transparent',
                    border: user.rank <= 3 ? '1px solid rgba(245,158,11,0.1)' : '1px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '1.25rem', width: 28, textAlign: 'center' }}>{user.badge}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.issues} issues reported</div>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: 'var(--color-primary)',
                    background: 'rgba(99,102,241,0.08)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {user.points.toLocaleString()} CP
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                className="input"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
            <select
              className="input"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ width: 180 }}
            >
              <option value="all">All Issues</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="resource-wastage">Resource Wastage</option>
              <option value="public-safety">Public Safety</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
              <option value="submitted">Submitted</option>
              <option value="processing">Processing</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Issues Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
            {filteredIssues.map((issue, i) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/issue/${issue.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ y: -4 }} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: statusColors[issue.status],
                          display: 'inline-block',
                        }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColors[issue.status] }}>
                          {statusLabels[issue.status]}
                        </span>
                      </div>
                      <span className={`badge badge-${issue.riskLevel}`} style={{ fontSize: '0.6875rem' }}>
                        {issue.riskLevel === 'high' ? '🔴' : issue.riskLevel === 'medium' ? '🟡' : '🟢'} {issue.riskScore}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>{issue.title}</h3>
                    <p style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: 12,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {issue.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <MapPin size={12} /> {issue.location.address.split(',')[0]}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <Users size={12} /> {issue.reportCount}
                      </div>
                    </div>

                    <div className="risk-meter" style={{ marginTop: 10 }}>
                      <div className={`risk-meter-fill ${issue.riskLevel}`} style={{ width: `${issue.riskScore}%` }} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}>
              <Filter size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>No issues match your filter criteria.</p>
            </div>
          )}
        </motion.div>
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
