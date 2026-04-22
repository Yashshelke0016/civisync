import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Shield, Droplets, Building2, TrendingUp,
  CheckCircle2, BarChart3, MapPin, Users, Zap, Brain, Eye, LogIn,
} from 'lucide-react';
import { CATEGORIES, MOCK_ISSUES } from '../data';
import { useApp } from '../store';

// ─── Animated Counter ───
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Floating Particles ───
function FloatingParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 3,
          }}
          style={{
            position: 'absolute',
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: '50%',
            background: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const categoryIcons: Record<string, React.ReactNode> = {
  'infrastructure': <Building2 size={28} />,
  'resource-wastage': <Droplets size={28} />,
  'public-safety': <Shield size={28} />,
};

export default function HomePage() {
  const { totalIssues, resolvedIssues, isAuthenticated, user } = useApp();
  const resolveRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-hero bg-grid" style={{ position: 'relative', paddingTop: 140, paddingBottom: 100, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <FloatingParticles />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center' }}
          >
            <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
              <span className="badge badge-info" style={{ padding: '6px 16px', fontSize: '0.8125rem' }}>
                <Zap size={14} /> AI-Powered Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-balance"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}
            >
              Predictive Urban
              <br />
              <span className="gradient-text">Intelligence Platform</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{ fontSize: '1.1875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}
            >
              Transform city problem management from reactive reporting to proactive decision-making. 
              AI-powered analysis, predictive alerts, and real-time civic intelligence.
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              {isAuthenticated ? (
                <Link to="/report" className="btn btn-primary btn-lg">
                  Report an Issue <ArrowRight size={18} />
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-primary btn-lg">
                  <LogIn size={18} /> Sign In / Sign Up
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                <BarChart3 size={18} /> View Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section style={{ position: 'relative', marginTop: -60, zIndex: 2, paddingBottom: 40 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-strong"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 1,
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}
          >
            {[
              { icon: <BarChart3 size={24} />, value: totalIssues, suffix: '+', label: 'Issues Reported', color: 'var(--color-primary)' },
              { icon: <CheckCircle2 size={24} />, value: resolveRate, suffix: '%', label: 'Resolution Rate', color: 'var(--color-success)' },
              { icon: <MapPin size={24} />, value: 12, suffix: '', label: 'Active Zones', color: 'var(--color-secondary)' },
              { icon: <Users size={24} />, value: 1240, suffix: '+', label: 'Active Citizens', color: 'var(--color-accent)' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '32px 24px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.6)',
                }}
              >
                <div style={{ color: stat.color, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Domain Cards ─── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <span className="badge badge-info" style={{ marginBottom: 16 }}>
              <Brain size={14} /> Intelligence Modules
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: 16 }}>
              Three Pillars of <span className="gradient-text">Urban Intelligence</span>
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-secondary)', maxWidth: 560, margin: '0 auto' }}>
              Our AI analyzes city issues across three critical domains, providing insights and predictions for each.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.id} variants={fadeUp}>
                <Link to="/report" state={{ category: cat.id }} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="card"
                    style={{ padding: 32, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                  >
                    {/* Glow effect on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: cat.gradient,
                        opacity: 0.08,
                        filter: 'blur(40px)',
                      }}
                    />

                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 'var(--radius-md)',
                      background: cat.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      marginBottom: 20,
                    }}>
                      {categoryIcons[cat.id]}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
                      {cat.title}
                    </h3>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                      {cat.description}
                    </p>

                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: cat.color }}>{cat.stats.active}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Active</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)' }}>{cat.stats.resolved}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Resolved</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>{cat.stats.predicted}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Predicted</div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 20,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: cat.color,
                    }}>
                      Report Issue <ArrowRight size={16} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── AI Features Section ─── */}
      <section className="section" style={{ background: 'linear-gradient(180deg, var(--color-bg) 0%, rgba(99,102,241,0.03) 100%)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <span className="badge badge-info" style={{ marginBottom: 16 }}>
              <Zap size={14} /> AI Capabilities
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: 16 }}>
              Powered by <span className="gradient-text">Artificial Intelligence</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}
          >
            {[
              {
                icon: <TrendingUp size={24} />,
                title: 'Risk Scoring Engine',
                desc: 'AI calculates risk scores using report frequency, category severity, and time-based analysis. Issues are prioritized automatically.',
                gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
              },
              {
                icon: <Eye size={24} />,
                title: 'Root Cause Analysis',
                desc: 'Intelligent analysis identifies probable causes: "Likely caused by poor drainage" or "Repeated infrastructure failure detected."',
                gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              },
              {
                icon: <Brain size={24} />,
                title: 'Predictive Alerts',
                desc: 'Proactive warnings like "This area has 78% probability of future issues" help prevent problems before they occur.',
                gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              },
              {
                icon: <Zap size={24} />,
                title: 'Smart Suggestions',
                desc: 'As you type, our AI detects issue categories and suggests the right classification: "This seems like Resource Wastage. Continue?"',
                gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="card-glass"
                  style={{ padding: 28, height: '100%' }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: feature.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    marginBottom: 16,
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{feature.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Recent Issues Preview ─── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}
          >
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Recent Issues</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>Latest reported civic issues with AI analysis</p>
            </div>
            <Link to="/dashboard" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}
          >
            {MOCK_ISSUES.slice(0, 4).map((issue) => (
              <motion.div key={issue.id} variants={fadeUp}>
                <Link to={`/issue/${issue.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="card"
                    style={{ padding: 24 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span className={`badge badge-${issue.riskLevel}`}>
                        {issue.riskLevel === 'high' ? '🔴' : issue.riskLevel === 'medium' ? '🟡' : '🟢'} {issue.riskLevel} risk
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{issue.id}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>{issue.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {issue.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        <MapPin size={14} /> {issue.location.address.split(',')[0]}
                      </div>
                      <div className="risk-meter" style={{ width: 60 }}>
                        <div className={`risk-meter-fill ${issue.riskLevel}`} style={{ width: `${issue.riskScore}%` }} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', marginBottom: 16 }}>
              Ready to Make Your City Smarter?
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>
              Join thousands of citizens using AI-powered reporting to transform urban management.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to={isAuthenticated ? '/report' : '/auth'}
                className="btn btn-lg"
                style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 700 }}
              >
                {isAuthenticated ? 'Start Reporting' : 'Sign In to Report'} <ArrowRight size={18} />
              </Link>
              <Link
                to="/map"
                className="btn btn-lg"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <MapPin size={18} /> Explore Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ padding: '40px 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>CivicSync AI</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            © 2026 CivicSync AI. Transforming cities with intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
