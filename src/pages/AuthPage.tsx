import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn, UserPlus, Mail, Lock, User, Phone, MapPin,
  Eye, EyeOff, CheckCircle2, Zap, Shield, Activity,
} from 'lucide-react';
import { useApp } from '../store';
import { PREDEFINED_AREAS } from '../data';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const ok = login(email, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError('Invalid email or password. Please sign up first.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !mobile || !address || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    const ok = signup({ name, email, mobile, address, password });
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError('An account with this email already exists');
    }
  };

  if (success) {
    return (
      <div style={{ paddingTop: 120, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-gradient-hero">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-success), #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
            }}
          >
            <CheckCircle2 size={48} color="white" />
          </motion.div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>
            {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {mode === 'signup' ? '🎉 You\'ve earned 500 welcome Civipoints!' : 'Redirecting you to the homepage...'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }} className="bg-gradient-hero bg-grid">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1100, alignItems: 'center', minHeight: 'calc(100vh - 100px)' }}>
        {/* Left - Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-info"
        >
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Activity size={26} color="white" />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Civic<span className="gradient-text">Sync</span> AI
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
              Join the Civic
              <br />
              <span className="gradient-text">Intelligence Revolution</span>
            </h1>
            <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Report issues, earn Civipoints, redeem rewards, and help make your city smarter with AI-powered civic management.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <Shield size={20} />, title: 'Earn Civipoints', desc: 'Get rewarded for every issue you report and help resolve.' },
              { icon: <Zap size={20} />, title: 'AI-Powered Analysis', desc: 'Our AI instantly analyzes and prioritizes your reports.' },
              { icon: <CheckCircle2 size={20} />, title: 'Track Resolution', desc: 'Follow your issues from submission to resolution in real-time.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99,102,241,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card" style={{ padding: 36, maxWidth: 440, margin: '0 auto' }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              background: 'var(--color-surface-hover)',
              borderRadius: 'var(--radius-md)',
              padding: 4,
              marginBottom: 28,
            }}>
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: mode === m ? 'white' : 'transparent',
                    boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    color: mode === m ? 'var(--color-text)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s',
                  }}
                >
                  {m === 'login' ? <><LogIn size={16} /> Sign In</> : <><UserPlus size={16} /> Sign Up</>}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={mode === 'login' ? handleLogin : handleSignup}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {mode === 'signup' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                        <User size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Full Name
                      </label>
                      <input className="input" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                        <Phone size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Mobile Number
                      </label>
                      <input className="input" placeholder="10-digit mobile number" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                        <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Address
                      </label>
                      <select className="input" value={address} onChange={e => setAddress(e.target.value)}>
                        <option value="">Select your area</option>
                        {PREDEFINED_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                    <Mail size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Email
                  </label>
                  <input className="input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                    <Lock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Enter password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        padding: 4,
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      color: '#dc2626',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px 0', marginTop: 4 }}>
                  {mode === 'login' ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>}
                </button>

                {mode === 'signup' && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    🎁 Get <strong style={{ color: 'var(--color-primary)' }}>500 welcome Civipoints</strong> on signup!
                  </div>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-info { display: none !important; }
          .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
