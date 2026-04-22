import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, Construction, Droplets, Shield,
  Skull, Car, Zap, Heart, TrendingDown, Users, AlertOctagon,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

interface ImpactCard {
  icon: React.ReactNode;
  title: string;
  stat: string;
  statLabel: string;
  description: string;
  consequences: string[];
  color: string;
  gradient: string;
}

const IMPACT_DATA: { title: string; icon: React.ReactNode; color: string; cards: ImpactCard[] }[] = [
  {
    title: 'Potholes & Road Damage',
    icon: <Construction size={24} />,
    color: '#6366f1',
    cards: [
      {
        icon: <Car size={24} />,
        title: 'Vehicle Accidents',
        stat: '33%',
        statLabel: 'of road accidents caused by potholes',
        description: 'Potholes cause drivers to swerve, leading to collisions, tire blowouts, and fatal accidents especially at night.',
        consequences: [
          'Over 9,300 fatalities in India annually due to pothole-related accidents',
          'Severe vehicle damage costing ₹5,000-₹50,000 per incident',
          'Increased insurance premiums for affected areas',
        ],
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      },
      {
        icon: <TrendingDown size={24} />,
        title: 'Economic Impact',
        stat: '₹3L Cr',
        statLabel: 'annual loss to Indian economy',
        description: 'Poor road infrastructure increases travel time, fuel consumption, and maintenance costs for millions of commuters.',
        consequences: [
          '15-20% increase in fuel consumption on damaged roads',
          'Emergency services delayed by 8-12 minutes on average',
          'Property values decrease 5-15% near damaged infrastructure',
        ],
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      },
    ],
  },
  {
    title: 'Water Wastage',
    icon: <Droplets size={24} />,
    color: '#06b6d4',
    cards: [
      {
        icon: <Droplets size={24} />,
        title: 'Resource Depletion',
        stat: '40%',
        statLabel: 'of treated water lost to leaks',
        description: 'Aging water infrastructure wastes billions of liters daily, threatening water security for future generations.',
        consequences: [
          '600 million Indians face extreme water stress',
          '70% of water supply contaminated due to leaking pipes',
          'Groundwater levels dropping 1-3 meters per year in affected zones',
        ],
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      },
      {
        icon: <Heart size={24} />,
        title: 'Health Crisis',
        stat: '2L+',
        statLabel: 'deaths annually from contaminated water',
        description: 'Leaking sewage pipes contaminate drinking water, causing waterborne diseases that disproportionately affect children.',
        consequences: [
          'Waterborne diseases cause 37.7 million cases annually in India',
          'Children under 5 are most vulnerable to diarrheal diseases',
          'Healthcare costs of ₹12,000-₹35,000 per waterborne illness case',
        ],
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      },
    ],
  },
  {
    title: 'Public Safety Neglect',
    icon: <Shield size={24} />,
    color: '#f59e0b',
    cards: [
      {
        icon: <Skull size={24} />,
        title: 'Crime Risk',
        stat: '40%',
        statLabel: 'increase in crime in unlit areas',
        description: 'Broken streetlights, missing guardrails, and unmarked zones create unsafe environments especially after dark.',
        consequences: [
          'Women and elderly avoid 60% of unlit public spaces',
          'Street crimes increase 2-3x in areas with broken lighting',
          'Missing guardrails linked to 25% of highway fatalities',
        ],
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      },
      {
        icon: <Users size={24} />,
        title: 'Community Impact',
        stat: '70%',
        statLabel: 'residents feel unsafe in neglected areas',
        description: 'Neglected public safety infrastructure erodes community trust and reduces quality of life for residents.',
        consequences: [
          'Property values drop 10-20% in areas perceived as unsafe',
          'Reduced foot traffic affects local businesses by 25-40%',
          'Children restricted from outdoor activities in unsafe zones',
        ],
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      },
    ],
  },
];

export default function ImpactPage() {
  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', paddingBottom: 60 }} className="bg-grid">
      <div className="container">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.06))',
            border: '1px solid rgba(239,68,68,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 32,
          }}
        >
          <AlertOctagon size={24} color="#ef4444" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#dc2626', marginBottom: 2 }}>
              ⚠️ Ignoring small issues leads to major consequences
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Every unresolved pothole, leak, or broken light has real human cost. This page shows why your reports matter.
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <span className="badge badge-high" style={{ marginBottom: 16, padding: '6px 16px', fontSize: '0.8125rem' }}>
            <AlertTriangle size={14} /> Critical Awareness
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: 16 }}>
            The Real Impact of <span className="gradient-text">Ignoring Civic Issues</span>
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-secondary)', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
            Understanding the consequences of neglected infrastructure, water wastage, and public safety issues helps us appreciate why every report counts.
          </p>
        </motion.div>

        {/* Impact Sections */}
        {IMPACT_DATA.map((section, si) => (
          <motion.div
            key={si}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 56 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: `${section.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: section.color,
              }}>
                {section.icon}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{section.title}</h2>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}
            >
              {section.cards.map((card, ci) => (
                <motion.div key={ci} variants={fadeUp}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="card"
                    style={{ padding: 0, overflow: 'hidden' }}
                  >
                    {/* Card Header */}
                    <div style={{
                      padding: '24px',
                      background: card.gradient,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {card.icon}
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{card.title}</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{card.stat}</div>
                        <div style={{ fontSize: '0.6875rem', opacity: 0.85, maxWidth: 120 }}>{card.statLabel}</div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: 24 }}>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                        {card.description}
                      </p>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>
                        Real-World Consequences:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {card.consequences.map((c, i) => (
                          <li key={i} style={{
                            display: 'flex',
                            gap: 8,
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.4,
                          }}>
                            <span style={{ color: card.color, fontWeight: 700, flexShrink: 0 }}>•</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: 40,
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Zap size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 12 }}>
            Your Report Can Save Lives
          </h2>
          <p style={{ fontSize: '1.0625rem', opacity: 0.85, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Every issue you report helps prevent accidents, saves resources, and makes communities safer. Be the change.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary)', fontWeight: 700 }}>
              Report an Issue Now <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              View Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
