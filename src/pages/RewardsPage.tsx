import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Gift, Zap, Star, Trophy, ShoppingBag, CheckCircle2,
  ArrowRight, Sparkles, Clock, Filter,
} from 'lucide-react';
import { useApp } from '../store';
import { REWARDS_CATALOG, CIVIPOINTS } from '../data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function RewardsPage() {
  const { user, isAuthenticated, redeemReward, redemptionHistory } = useApp();
  const [filter, setFilter] = useState<'all' | 'subscription' | 'coupon'>('all');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: 120, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-gradient-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 420 }}>
          <Gift size={48} color="var(--color-primary)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Sign in to access Rewards</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
            Earn Civipoints by reporting civic issues and redeem exciting rewards!
          </p>
          <Link to="/auth" className="btn btn-primary">Sign In <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    );
  }

  const filteredRewards = filter === 'all'
    ? REWARDS_CATALOG
    : REWARDS_CATALOG.filter(r => r.type === filter);

  const handleRedeem = (rewardId: string, points: number, name: string) => {
    setRedeemingId(rewardId);
    setTimeout(() => {
      const ok = redeemReward(points, name);
      if (ok) {
        setShowSuccess(rewardId);
        setTimeout(() => setShowSuccess(null), 3000);
      }
      setRedeemingId(null);
    }, 1200);
  };

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
            <Gift size={28} color="var(--color-primary)" /> Redeem Civipoints
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Turn your civic contributions into exciting rewards
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: 32,
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: 'white',
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -30, top: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', right: 40, bottom: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: 4 }}>Your Civipoints Balance</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Zap size={32} />
                  {user!.civipoints.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8125rem', opacity: 0.7, marginTop: 4 }}>
                  Keep reporting to earn more!
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  { label: 'Report', points: `+${CIVIPOINTS.REPORT_SUBMITTED}`, icon: '📝' },
                  { label: 'Verified', points: `+${CIVIPOINTS.ISSUE_VERIFIED}`, icon: '✅' },
                  { label: 'Resolved', points: `+${CIVIPOINTS.ISSUE_RESOLVED}`, icon: '🎉' },
                ].map((tier, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '1.25rem' }}>{tier.icon}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: 2 }}>{tier.points}</div>
                    <div style={{ fontSize: '0.6875rem', opacity: 0.7 }}>{tier.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['all', 'subscription', 'coupon'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            >
              {f === 'all' ? 'All Rewards' : f === 'subscription' ? '📺 Subscriptions' : '🎫 Coupons'}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
          {filteredRewards.map((reward, i) => {
            const canAfford = user!.civipoints >= reward.pointsRequired;
            const isRedeeming = redeemingId === reward.id;
            const justRedeemed = showSuccess === reward.id;

            return (
              <motion.div
                key={reward.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: i * 0.05 }}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden', position: 'relative' }}
                >
                  {/* Brand Header */}
                  <div style={{
                    padding: '20px 24px',
                    background: reward.gradient,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                    <div style={{ fontSize: '2rem' }}>{reward.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{reward.brand}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{reward.type === 'subscription' ? 'Subscription' : 'Coupon'}</div>
                    </div>
                  </div>

                  <div style={{ padding: 24 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{reward.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                      {reward.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={16} color="var(--color-accent)" />
                        <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-text)' }}>
                          {reward.pointsRequired.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>CP</span>
                      </div>

                      <AnimatePresence mode="wait">
                        {justRedeemed ? (
                          <motion.div
                            key="success"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              color: 'var(--color-success)',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                            }}
                          >
                            <CheckCircle2 size={18} /> Redeemed!
                          </motion.div>
                        ) : (
                          <motion.button
                            key="btn"
                            whileHover={canAfford ? { scale: 1.05 } : {}}
                            whileTap={canAfford ? { scale: 0.95 } : {}}
                            onClick={() => canAfford && !isRedeeming && handleRedeem(reward.id, reward.pointsRequired, reward.name)}
                            className="btn btn-sm"
                            disabled={!canAfford || isRedeeming}
                            style={{
                              background: canAfford ? reward.gradient : 'var(--color-border)',
                              color: canAfford ? 'white' : 'var(--color-text-muted)',
                              opacity: canAfford ? 1 : 0.6,
                              cursor: canAfford ? 'pointer' : 'not-allowed',
                              minWidth: 80,
                            }}
                          >
                            {isRedeeming ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              >
                                <Sparkles size={14} />
                              </motion.div>
                            ) : canAfford ? (
                              <>Redeem</>
                            ) : (
                              <>Need {(reward.pointsRequired - user!.civipoints).toLocaleString()} more</>
                            )}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Redemption History */}
        {redemptionHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: 24 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="var(--color-primary)" /> Redemption History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {redemptionHistory.slice(0, 5).map((r, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-hover)',
                  fontSize: '0.875rem',
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.rewardName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-danger)' }}>
                    −{r.points.toLocaleString()} CP
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
