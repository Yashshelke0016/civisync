import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, MapPin, AlertTriangle, CheckCircle2,
  Building2, Droplets, Shield, ArrowRight, Brain, Upload,
  Mail, FileText, LogIn, Image, X,
} from 'lucide-react';
import { CATEGORIES, PREDEFINED_AREAS, generateSubmissionEmail, CIVIPOINTS } from '../data';
import { analyzeDescription } from '../ai-engine';
import { useApp } from '../store';

const categoryIcons: Record<string, React.ReactNode> = {
  'infrastructure': <Building2 size={22} />,
  'resource-wastage': <Droplets size={22} />,
  'public-safety': <Shield size={22} />,
};

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, addIssue, addEmail } = useApp();
  const presetCategory = (location.state as { category?: string })?.category || '';

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(presetCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [suggestion, setSuggestion] = useState<{ category: string; confidence: number; message: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<any>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showReportCopy, setShowReportCopy] = useState(false);

  useEffect(() => {
    if (description.length < 10) { setSuggestion(null); return; }
    const timer = setTimeout(() => {
      const result = analyzeDescription(description);
      if (result && !category) setSuggestion(result);
      else setSuggestion(null);
    }, 500);
    return () => clearTimeout(timer);
  }, [description, category]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setImageError('Image must be under 1MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: 120, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-gradient-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 420 }}>
          <LogIn size={48} color="var(--color-primary)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Sign in to Report Issues</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>You need an account to submit civic issue reports and earn Civipoints.</p>
          <Link to="/auth" className="btn btn-primary">Sign In / Sign Up <ArrowRight size={16} /></Link>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = () => {
    const issue = addIssue({
      category: category as 'infrastructure' | 'resource-wastage' | 'public-safety',
      title, description,
      location: { lat: 18.52 + Math.random() * 0.06, lng: 73.8 + Math.random() * 0.1, address },
      status: 'submitted',
      image: imagePreview || undefined,
    });
    const emailData = generateSubmissionEmail(issue, user!.name);
    addEmail({ subject: emailData.subject, body: emailData.body, type: 'submission', issueId: issue.id });
    setSubmittedIssue(issue);
    setSubmitted(true);
  };

  const canProceed = () => {
    if (step === 1) return !!category;
    if (step === 2) return title.length >= 5 && description.length >= 10;
    if (step === 3) return address.length >= 3;
    return false;
  };

  // ─── Success View ───
  if (submitted && submittedIssue) {
    return (
      <div style={{ paddingTop: 120, minHeight: '100vh', paddingBottom: 60 }} className="bg-gradient-hero">
        <div className="container" style={{ maxWidth: 640, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ padding: 40, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-success), #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={40} color="white" />
            </motion.div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Issue Reported Successfully!</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 6 }}>Report <strong>{submittedIssue.id}</strong> submitted & analyzed by AI.</p>
            <p style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '0.9375rem', marginBottom: 24 }}>🏆 +{CIVIPOINTS.REPORT_SUBMITTED} Civipoints earned!</p>

            {/* Email Sent Confirmation */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <Mail size={18} color="var(--color-success)" />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Confirmation email sent to <strong>{user!.email}</strong>
              </span>
              <button onClick={() => setShowEmailPreview(!showEmailPreview)} className="btn btn-sm btn-ghost" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                {showEmailPreview ? 'Hide' : 'Preview'}
              </button>
            </motion.div>

            <AnimatePresence>
              {showEmailPreview && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: 20, textAlign: 'left' }}>
                  <pre style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)', fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', maxHeight: 240, overflow: 'auto' }}>
                    {generateSubmissionEmail(submittedIssue, user!.name).body}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Analysis Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-glass" style={{ padding: 20, textAlign: 'left', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Brain size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>AI Analysis</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Risk Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: submittedIssue.riskLevel === 'high' ? '#ef4444' : submittedIssue.riskLevel === 'medium' ? '#f59e0b' : '#10b981' }}>
                    {submittedIssue.riskScore}/100
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Risk Level</div>
                  <span className={`badge badge-${submittedIssue.riskLevel}`}>{submittedIssue.riskLevel.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', padding: 10, borderRadius: 'var(--radius-sm)', background: 'rgba(99,102,241,0.04)' }}>
                💡 {submittedIssue.aiInsight}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setShowReportCopy(!showReportCopy)} className="btn btn-secondary btn-sm">
                <FileText size={14} /> {showReportCopy ? 'Hide' : 'View'} Report Copy
              </button>
              <button onClick={() => navigate(`/issue/${submittedIssue.id}`)} className="btn btn-primary btn-sm">
                Track Issue <ArrowRight size={14} />
              </button>
              <button onClick={() => { setSubmitted(false); setSubmittedIssue(null); setStep(1); setCategory(''); setTitle(''); setDescription(''); setAddress(user?.address || ''); setImagePreview(null); }}
                className="btn btn-ghost btn-sm">Report Another</button>
            </div>

            {/* Report Copy */}
            <AnimatePresence>
              {showReportCopy && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: 20 }}>
                  <div style={{ padding: 20, borderRadius: 'var(--radius-md)', background: 'white', border: '2px solid var(--color-border)', textAlign: 'left', fontSize: '0.8125rem', lineHeight: 1.6 }}>
                    <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--color-primary)' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.125rem', color: 'var(--color-primary)' }}>CivicSync AI</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Issue Report Copy</div>
                    </div>
                    <table style={{ width: '100%', fontSize: '0.8125rem' }}>
                      <tbody>
                        {[
                          ['Issue ID', submittedIssue.id],
                          ['Reporter', user!.name],
                          ['Email', user!.email],
                          ['Mobile', user!.mobile],
                          ['Category', CATEGORIES.find(c => c.id === submittedIssue.category)?.title],
                          ['Title', submittedIssue.title],
                          ['Location', submittedIssue.location.address],
                          ['Status', 'Pending Review'],
                          ['Risk Score', `${submittedIssue.riskScore}/100 (${submittedIssue.riskLevel})`],
                          ['Timestamp', new Date(submittedIssue.createdAt).toLocaleString()],
                        ].map(([label, val], i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '8px 0', fontWeight: 600, color: 'var(--color-text)', width: 120 }}>{label}</td>
                            <td style={{ padding: '8px 0', color: 'var(--color-text-secondary)' }}>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: 12, padding: 10, background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Description:</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>{submittedIssue.description}</div>
                    </div>
                    <div style={{ marginTop: 12, padding: 10, background: 'rgba(99,102,241,0.04)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>AI Root Cause:</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>{submittedIssue.predictedCause}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Form View ───
  return (
    <div style={{ paddingTop: 120, minHeight: '100vh' }} className="bg-gradient-hero bg-grid">
      <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Report a Civic Issue</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Reporting as <strong>{user!.name}</strong> • Our AI will analyze your report instantly</p>
        </motion.div>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.div animate={{ background: s <= step ? 'var(--color-primary)' : 'var(--color-border)', color: s <= step ? 'white' : 'var(--color-text-muted)' }}
                style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>{s}</motion.div>
              {s < 3 && <div style={{ width: 60, height: 2, background: s < step ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: 'var(--radius-full)' }} />}
            </div>
          ))}
        </div>

        <motion.div className="card" style={{ padding: 32 }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20 }}>Select Category</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {CATEGORIES.map(cat => (
                    <motion.button key={cat.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setCategory(cat.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 'var(--radius-md)', border: `2px solid ${category === cat.id ? cat.color : 'var(--color-border)'}`, background: category === cat.id ? `${cat.color}08` : 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'var(--font-sans)' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: cat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>{categoryIcons[cat.id]}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{cat.title}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>{cat.description.slice(0, 80)}...</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20 }}>Describe the Issue</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Auto-filled user info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                      <input className="input" value={user!.name} disabled style={{ opacity: 0.7 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>Email</label>
                      <input className="input" value={user!.email} disabled style={{ opacity: 0.7 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>Issue Title</label>
                    <input type="text" className="input" placeholder="e.g., Major Pothole on Main Street" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>Description</label>
                    <textarea className="input" placeholder="Describe the issue in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={4} />
                  </div>
                  {/* Image Upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}><Image size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Upload Image (Max 1MB)</label>
                    {imagePreview ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, maxHeight: 150, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                        <button onClick={() => setImagePreview(null)} style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: 'var(--color-danger)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
                      </div>
                    ) : (
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20, borderRadius: 'var(--radius-md)', border: '2px dashed var(--color-border)', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        <Upload size={18} /> Click to upload image
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </label>
                    )}
                    {imageError && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4 }}>{imageError}</div>}
                  </div>
                  {/* Smart Suggestion */}
                  <AnimatePresence>
                    {suggestion && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.06))', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Sparkles size={20} color="var(--color-primary)" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>AI Suggestion</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{suggestion.message}</div>
                        </div>
                        <button className="btn btn-sm btn-primary" onClick={() => { setCategory(suggestion.category); setSuggestion(null); }}>Accept</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20 }}>Issue Location</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                      <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Address / Area
                    </label>
                    <select className="input" value={address} onChange={e => setAddress(e.target.value)}>
                      <option value="">Select area</option>
                      {PREDEFINED_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  {category && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', gap: 12 }}>
                      <AlertTriangle size={20} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 2 }}>Predictive Alert</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>⚠️ This area has high probability of future issues based on historical data.</div>
                      </div>
                    </motion.div>
                  )}
                  <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-hover)', fontSize: '0.8125rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Summary</div>
                    <div>Reporter: <strong>{user!.name}</strong> ({user!.email})</div>
                    <div>Category: <strong>{CATEGORIES.find(c => c.id === category)?.title}</strong></div>
                    <div>Title: <strong>{title}</strong></div>
                    <div>Location: <strong>{address || 'Not selected'}</strong></div>
                    {imagePreview && <div>Image: <strong>✅ Attached</strong></div>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(1, s - 1))} style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>Back</button>
            {step < 3 ? (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.5 }}>Continue <ArrowRight size={16} /></button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.5 }}><Send size={16} /> Submit & Analyze</button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
