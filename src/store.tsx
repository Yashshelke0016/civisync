import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Issue, User, MOCK_ISSUES, CIVIPOINTS } from './data';
import { calculateRiskScore, generateRootCause, getPredictiveAlert } from './ai-engine';

interface EmailNotification {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'submission' | 'resolution';
  issueId: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (data: { name: string; email: string; mobile: string; address: string; password: string }) => boolean;
  logout: () => void;

  // Issues
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'riskScore' | 'riskLevel' | 'predictedCause' | 'aiInsight' | 'createdAt' | 'updatedAt' | 'reporterPoints' | 'reportCount'>) => Issue;
  getIssueById: (id: string) => Issue | undefined;
  resolveIssue: (id: string) => void;

  // Stats
  totalIssues: number;
  resolvedIssues: number;

  // Emails
  emails: EmailNotification[];
  addEmail: (email: Omit<EmailNotification, 'id' | 'sentAt'>) => void;

  // Rewards
  redeemReward: (pointsRequired: number, rewardName: string) => boolean;
  redemptionHistory: Array<{ rewardName: string; points: number; date: string }>;
}

const AppContext = createContext<AppState | null>(null);

// ─── LocalStorage helpers ───
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`civicsync_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key: string, value: unknown) {
  localStorage.setItem(`civicsync_${key}`, JSON.stringify(value));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage('user', null));
  const [issues, setIssues] = useState<Issue[]>(() => loadFromStorage('issues', MOCK_ISSUES));
  const [emails, setEmails] = useState<EmailNotification[]>(() => loadFromStorage('emails', []));
  const [registeredUsers, setRegisteredUsers] = useState<Array<User & { password: string }>>(() =>
    loadFromStorage('users', [])
  );
  const [redemptionHistory, setRedemptionHistory] = useState<Array<{ rewardName: string; points: number; date: string }>>(() =>
    loadFromStorage('redemptions', [])
  );

  // Persist state changes
  useEffect(() => { saveToStorage('user', user); }, [user]);
  useEffect(() => { saveToStorage('issues', issues); }, [issues]);
  useEffect(() => { saveToStorage('emails', emails); }, [emails]);
  useEffect(() => { saveToStorage('users', registeredUsers); }, [registeredUsers]);
  useEffect(() => { saveToStorage('redemptions', redemptionHistory); }, [redemptionHistory]);

  // ─── Auth ───
  const login = useCallback((email: string, password: string): boolean => {
    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  }, [registeredUsers]);

  const signup = useCallback((data: { name: string; email: string; mobile: string; address: string; password: string }): boolean => {
    if (registeredUsers.some(u => u.email === data.email)) return false;

    const newUser: User & { password: string } = {
      id: `USR-${String(registeredUsers.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      civipoints: 500, // Welcome bonus
      password: data.password,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
  }, [registeredUsers]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // ─── Issues ───
  const addIssue = useCallback((partial: Omit<Issue, 'id' | 'riskScore' | 'riskLevel' | 'predictedCause' | 'aiInsight' | 'createdAt' | 'updatedAt' | 'reporterPoints' | 'reportCount'>) => {
    const { score, level } = calculateRiskScore({
      reportCount: 1,
      category: partial.category,
      daysSinceReport: 0,
      hasRecurrence: false,
    });

    const now = new Date().toISOString();
    const predictedCause = generateRootCause(partial.category);
    const alert = getPredictiveAlert(partial.category, score);

    const newIssue: Issue = {
      ...partial,
      id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      userId: user?.id,
      riskScore: score,
      riskLevel: level,
      predictedCause,
      aiInsight: alert || `Issue analyzed. Risk level: ${level}. Monitoring for patterns.`,
      createdAt: now,
      updatedAt: now,
      reporterPoints: CIVIPOINTS.REPORT_SUBMITTED,
      reportCount: 1,
      reporterName: user?.name,
      reporterEmail: user?.email,
      reporterMobile: user?.mobile,
    };

    setIssues(prev => [newIssue, ...prev]);

    // Award civipoints
    if (user) {
      setUser(prev => prev ? { ...prev, civipoints: prev.civipoints + CIVIPOINTS.REPORT_SUBMITTED } : null);
      // Update in registered users too
      setRegisteredUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, civipoints: u.civipoints + CIVIPOINTS.REPORT_SUBMITTED } : u)
      );
    }

    return newIssue;
  }, [issues.length, user]);

  const resolveIssue = useCallback((id: string) => {
    setIssues(prev =>
      prev.map(i => i.id === id ? { ...i, status: 'completed' as const, updatedAt: new Date().toISOString() } : i)
    );

    // Award resolution points
    if (user) {
      const bonus = CIVIPOINTS.ISSUE_RESOLVED;
      setUser(prev => prev ? { ...prev, civipoints: prev.civipoints + bonus } : null);
      setRegisteredUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, civipoints: u.civipoints + bonus } : u)
      );
    }
  }, [user]);

  const getIssueById = useCallback((id: string) => {
    return issues.find(i => i.id === id);
  }, [issues]);

  // ─── Emails ───
  const addEmail = useCallback((email: Omit<EmailNotification, 'id' | 'sentAt'>) => {
    const newEmail: EmailNotification = {
      ...email,
      id: `EM-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    setEmails(prev => [newEmail, ...prev]);
  }, []);

  // ─── Rewards ───
  const redeemReward = useCallback((pointsRequired: number, rewardName: string): boolean => {
    if (!user || user.civipoints < pointsRequired) return false;

    setUser(prev => prev ? { ...prev, civipoints: prev.civipoints - pointsRequired } : null);
    setRegisteredUsers(prev =>
      prev.map(u => u.id === user.id ? { ...u, civipoints: u.civipoints - pointsRequired } : u)
    );
    setRedemptionHistory(prev => [
      { rewardName, points: pointsRequired, date: new Date().toISOString() },
      ...prev,
    ]);
    return true;
  }, [user]);

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'completed').length;
  const isAuthenticated = !!user;

  return (
    <AppContext.Provider value={{
      user, isAuthenticated, login, signup, logout,
      issues, addIssue, getIssueById, resolveIssue,
      totalIssues, resolvedIssues,
      emails, addEmail,
      redeemReward, redemptionHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
