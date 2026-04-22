// ─── User Types ───
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  civipoints: number;
  createdAt: string;
}

// ─── Issue Types ───
export interface Issue {
  id: string;
  userId?: string;
  category: 'infrastructure' | 'resource-wastage' | 'public-safety';
  title: string;
  description: string;
  location: { lat: number; lng: number; address: string };
  status: 'submitted' | 'processing' | 'in-progress' | 'completed';
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number;
  predictedCause: string;
  aiInsight: string;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  reporterPoints: number;
  image?: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterMobile?: string;
}

export interface CivicScore {
  area: string;
  cleanliness: number;
  safety: number;
  infrastructure: number;
  overall: number;
}

export interface TimelineEntry {
  date: string;
  status: string;
  description: string;
}

// ─── Reward Types ───
export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  type: 'subscription' | 'coupon';
  icon: string;
  brand: string;
  color: string;
  gradient: string;
}

// ─── Predefined Areas (Dropdown) ───
export const PREDEFINED_AREAS = [
  'MG Road, Pune',
  'Aundh, Pune',
  'Baner, Pune',
  'Kothrud, Pune',
  'Hinjewadi, Pune',
  'Deccan Gymkhana, Pune',
  'Warje, Pune',
  'Shivajinagar, Pune',
  'Koregaon Park, Pune',
  'Wakad, Pune',
  'Pimpri-Chinchwad, Pune',
  'Hadapsar, Pune',
  'Viman Nagar, Pune',
  'Kalyani Nagar, Pune',
  'Sinhagad Road, Pune',
];

// ─── Civipoints Config ───
export const CIVIPOINTS = {
  REPORT_SUBMITTED: 100,
  ISSUE_VERIFIED: 200,
  ISSUE_RESOLVED: 500,
};

// ─── Rewards Catalog ───
export const REWARDS_CATALOG: Reward[] = [
  {
    id: 'RW-001',
    name: 'Netflix Premium (1 Month)',
    description: 'Enjoy 1 month of Netflix Premium with 4K streaming on up to 4 screens.',
    pointsRequired: 100000,
    type: 'subscription',
    icon: '🎬',
    brand: 'Netflix',
    color: '#e50914',
    gradient: 'linear-gradient(135deg, #e50914, #b20710)',
  },
  {
    id: 'RW-002',
    name: 'Amazon Prime (1 Month)',
    description: 'Access Prime Video, free delivery, and exclusive deals for 1 month.',
    pointsRequired: 50000,
    type: 'subscription',
    icon: '📦',
    brand: 'Amazon Prime',
    color: '#ff9900',
    gradient: 'linear-gradient(135deg, #ff9900, #e88b00)',
  },
  {
    id: 'RW-003',
    name: 'Spotify Premium (1 Month)',
    description: 'Ad-free music streaming with offline downloads and unlimited skips.',
    pointsRequired: 30000,
    type: 'subscription',
    icon: '🎵',
    brand: 'Spotify',
    color: '#1db954',
    gradient: 'linear-gradient(135deg, #1db954, #169c46)',
  },
  {
    id: 'RW-004',
    name: 'Disney+ Hotstar (1 Month)',
    description: 'Stream movies, shows, live sports, and exclusive Disney+ content.',
    pointsRequired: 20000,
    type: 'subscription',
    icon: '🏰',
    brand: 'Disney+ Hotstar',
    color: '#1a73e8',
    gradient: 'linear-gradient(135deg, #1a73e8, #0d5bbd)',
  },
  {
    id: 'RW-005',
    name: 'Flipkart ₹500 Coupon',
    description: 'Get ₹500 off on your next Flipkart order. Valid on purchases above ₹1500.',
    pointsRequired: 15000,
    type: 'coupon',
    icon: '🛒',
    brand: 'Flipkart',
    color: '#2874f0',
    gradient: 'linear-gradient(135deg, #2874f0, #1a5dc8)',
  },
  {
    id: 'RW-006',
    name: 'Amazon ₹300 Cashback',
    description: 'Flat ₹300 cashback on any Amazon.in purchase above ₹999.',
    pointsRequired: 10000,
    type: 'coupon',
    icon: '💳',
    brand: 'Amazon',
    color: '#ff9900',
    gradient: 'linear-gradient(135deg, #ff9900, #cc7a00)',
  },
  {
    id: 'RW-007',
    name: 'Zomato ₹200 Voucher',
    description: 'Get ₹200 off on your next 2 Zomato orders (₹100 each).',
    pointsRequired: 5000,
    type: 'coupon',
    icon: '🍕',
    brand: 'Zomato',
    color: '#e23744',
    gradient: 'linear-gradient(135deg, #e23744, #c42f3a)',
  },
  {
    id: 'RW-008',
    name: 'Swiggy ₹150 Voucher',
    description: 'Flat ₹150 off on your next Swiggy order above ₹499.',
    pointsRequired: 3000,
    type: 'coupon',
    icon: '🍔',
    brand: 'Swiggy',
    color: '#fc8019',
    gradient: 'linear-gradient(135deg, #fc8019, #e07015)',
  },
];

// ─── Categories ───
export const CATEGORIES = [
  {
    id: 'infrastructure',
    title: 'Infrastructure Intelligence',
    icon: '🏗️',
    description: 'Track road lifecycle, predict failure risk, and monitor structural integrity across the city.',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    stats: { active: 23, resolved: 87, predicted: 12 },
  },
  {
    id: 'resource-wastage',
    title: 'Resource Wastage Engine',
    icon: '💧',
    description: 'Detect severity of water leaks, estimate resource loss levels, and highlight recurring waste zones.',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    stats: { active: 15, resolved: 64, predicted: 8 },
  },
  {
    id: 'public-safety',
    title: 'Public Safety Intelligence',
    icon: '🛡️',
    description: 'Time-based risk zones, unsafe area detection, and safer route suggestions for citizens.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    stats: { active: 18, resolved: 52, predicted: 15 },
  },
] as const;

// ─── Mock Issues ───
export const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISS-001',
    category: 'infrastructure',
    title: 'Major Pothole on MG Road',
    description: 'Large pothole near the intersection causing traffic disruption and vehicle damage. Multiple complaints received.',
    location: { lat: 18.5204, lng: 73.8567, address: 'MG Road, Pune' },
    status: 'in-progress',
    riskLevel: 'high',
    riskScore: 87,
    predictedCause: 'Poor drainage combined with heavy monsoon rainfall causing asphalt erosion',
    aiInsight: 'This area has seen 3 similar failures in the past 6 months. Root cause: inadequate sub-surface drainage. Recommend full road resurfacing.',
    reportCount: 24,
    createdAt: '2026-04-15T08:30:00Z',
    updatedAt: '2026-04-20T14:15:00Z',
    reporterPoints: 100,
  },
  {
    id: 'ISS-002',
    category: 'resource-wastage',
    title: 'Water Main Leak - Sector 7',
    description: 'Continuous water leak from underground main pipe. Estimated 500 liters/hour wastage.',
    location: { lat: 18.5314, lng: 73.8446, address: 'Sector 7, Aundh, Pune' },
    status: 'processing',
    riskLevel: 'high',
    riskScore: 92,
    predictedCause: 'Aging pipeline infrastructure (installed 2008) exceeding expected lifespan',
    aiInsight: 'Critical leak detected. Adjacent pipes in same zone are 85% likely to fail within 3 months. Preventive replacement recommended.',
    reportCount: 18,
    createdAt: '2026-04-18T10:00:00Z',
    updatedAt: '2026-04-21T09:45:00Z',
    reporterPoints: 100,
  },
  {
    id: 'ISS-003',
    category: 'public-safety',
    title: 'Broken Streetlights - Park Lane',
    description: 'Multiple streetlights non-functional creating dark zones. Residents report feeling unsafe after dark.',
    location: { lat: 18.5074, lng: 73.8077, address: 'Park Lane, Kothrud, Pune' },
    status: 'submitted',
    riskLevel: 'high',
    riskScore: 78,
    predictedCause: 'Electrical circuit failure likely due to recent storm damage',
    aiInsight: '⚠️ Area unsafe after 9 PM. Crime reports increased 40% in unlit zones. Priority fix recommended. Suggest solar backup installation.',
    reportCount: 31,
    createdAt: '2026-04-20T18:00:00Z',
    updatedAt: '2026-04-21T06:30:00Z',
    reporterPoints: 100,
  },
  {
    id: 'ISS-004',
    category: 'infrastructure',
    title: 'Bridge Crack - NH Highway',
    description: 'Visible cracks appearing on the overpass bridge. Structural assessment needed urgently.',
    location: { lat: 18.5642, lng: 73.7769, address: 'NH Highway Overpass, Hinjewadi' },
    status: 'in-progress',
    riskLevel: 'high',
    riskScore: 95,
    predictedCause: 'Structural fatigue from excessive heavy vehicle traffic exceeding design load',
    aiInsight: 'CRITICAL: Structural integrity at risk. Historical data shows bridge was built for 40-ton load, current average exceeds 55 tons. Immediate weight restriction recommended.',
    reportCount: 12,
    createdAt: '2026-04-12T07:00:00Z',
    updatedAt: '2026-04-21T10:00:00Z',
    reporterPoints: 100,
  },
  {
    id: 'ISS-005',
    category: 'resource-wastage',
    title: 'Fire Hydrant Leak - Commercial Area',
    description: 'Fire hydrant leaking steadily. Water pooling on sidewalk creating slip hazard.',
    location: { lat: 18.5362, lng: 73.8950, address: 'FC Road Commercial Zone, Pune' },
    status: 'completed',
    riskLevel: 'medium',
    riskScore: 45,
    predictedCause: 'Worn valve seal due to standard wear and infrequent maintenance',
    aiInsight: 'Resolved. Valve replacement completed. Similar hydrants in zone should be inspected within 60 days.',
    reportCount: 6,
    createdAt: '2026-04-10T12:00:00Z',
    updatedAt: '2026-04-19T16:00:00Z',
    reporterPoints: 500,
  },
  {
    id: 'ISS-006',
    category: 'public-safety',
    title: 'Missing Guardrail - Hilltop Road',
    description: 'Guardrail missing on sharp curve. High accident risk especially during rain.',
    location: { lat: 18.4925, lng: 73.8364, address: 'Sinhagad Road Curve, Pune' },
    status: 'processing',
    riskLevel: 'high',
    riskScore: 88,
    predictedCause: 'Previous vehicle collision destroyed guardrail; not replaced due to contractor delay',
    aiInsight: '⚠️ High probability of accident during monsoon. 3 near-misses reported this week. Temporary barriers should be installed within 24 hours.',
    reportCount: 15,
    createdAt: '2026-04-17T09:30:00Z',
    updatedAt: '2026-04-21T08:00:00Z',
    reporterPoints: 100,
  },
  {
    id: 'ISS-007',
    category: 'infrastructure',
    title: 'Sewer Overflow - Residential Block',
    description: 'Sewage overflowing onto residential street. Health hazard and foul odor reported.',
    location: { lat: 18.5513, lng: 73.8498, address: 'Baner Road, Residential Block C' },
    status: 'submitted',
    riskLevel: 'medium',
    riskScore: 67,
    predictedCause: 'Blockage from construction debris entering drainage system',
    aiInsight: 'Recurring issue in this zone. Last 3 incidents traced to nearby construction site. Recommend mandatory debris screens at construction sites.',
    reportCount: 9,
    createdAt: '2026-04-21T05:00:00Z',
    updatedAt: '2026-04-21T05:00:00Z',
    reporterPoints: 100,
  },
  {
    id: 'ISS-008',
    category: 'resource-wastage',
    title: 'Irrigation System Malfunction',
    description: 'Public park irrigation running 24/7 due to timer malfunction. Significant water waste.',
    location: { lat: 18.5196, lng: 73.8553, address: 'Aga Khan Palace Gardens, Pune' },
    status: 'in-progress',
    riskLevel: 'low',
    riskScore: 32,
    predictedCause: 'Faulty timer relay; common issue in systems older than 5 years',
    aiInsight: 'Estimated 2000 liters/day wasted. Quick fix available. Recommend IoT-enabled timer upgrade for all public parks.',
    reportCount: 4,
    createdAt: '2026-04-19T14:00:00Z',
    updatedAt: '2026-04-20T11:00:00Z',
    reporterPoints: 100,
  },
  {
    id: 'ISS-009',
    category: 'public-safety',
    title: 'Unmarked Construction Zone',
    description: 'Road construction with no warning signs or barricades. Vehicles entering at full speed.',
    location: { lat: 18.4873, lng: 73.8129, address: 'Warje Bridge Approach' },
    status: 'completed',
    riskLevel: 'medium',
    riskScore: 58,
    predictedCause: 'Contractor negligence in placing safety markers',
    aiInsight: 'Issue resolved. Contractor penalized. Automated compliance monitoring suggested for future projects.',
    reportCount: 11,
    createdAt: '2026-04-14T07:30:00Z',
    updatedAt: '2026-04-18T16:00:00Z',
    reporterPoints: 500,
  },
  {
    id: 'ISS-010',
    category: 'infrastructure',
    title: 'Footpath Subsidence',
    description: 'Footpath sinking near metro construction site. Pedestrians forced onto road.',
    location: { lat: 18.5089, lng: 73.8259, address: 'Deccan Gymkhana Metro Site' },
    status: 'processing',
    riskLevel: 'medium',
    riskScore: 62,
    predictedCause: 'Underground metro tunneling causing soil displacement',
    aiInsight: 'Related to metro construction phase 3. Similar subsidence expected 200m ahead. Pre-emptive reinforcement recommended.',
    reportCount: 7,
    createdAt: '2026-04-16T11:00:00Z',
    updatedAt: '2026-04-20T09:00:00Z',
    reporterPoints: 100,
  },
];

// ─── Civic Scores ───
export const CIVIC_SCORES: CivicScore[] = [
  { area: 'Kothrud', cleanliness: 82, safety: 68, infrastructure: 75, overall: 75 },
  { area: 'Aundh', cleanliness: 70, safety: 74, infrastructure: 65, overall: 70 },
  { area: 'Hinjewadi', cleanliness: 65, safety: 60, infrastructure: 55, overall: 60 },
  { area: 'Baner', cleanliness: 78, safety: 72, infrastructure: 70, overall: 73 },
  { area: 'Deccan', cleanliness: 85, safety: 80, infrastructure: 82, overall: 82 },
  { area: 'Warje', cleanliness: 60, safety: 55, infrastructure: 50, overall: 55 },
];

// ─── Chart Data ───
export const TREND_DATA = [
  { month: 'Jan', infrastructure: 12, resource: 8, safety: 15 },
  { month: 'Feb', infrastructure: 15, resource: 10, safety: 12 },
  { month: 'Mar', infrastructure: 18, resource: 14, safety: 18 },
  { month: 'Apr', infrastructure: 22, resource: 11, safety: 14 },
  { month: 'May', infrastructure: 16, resource: 9, safety: 20 },
  { month: 'Jun', infrastructure: 28, resource: 18, safety: 16 },
  { month: 'Jul', infrastructure: 35, resource: 22, safety: 13 },
  { month: 'Aug', infrastructure: 30, resource: 25, safety: 19 },
  { month: 'Sep', infrastructure: 24, resource: 16, safety: 22 },
  { month: 'Oct', infrastructure: 19, resource: 12, safety: 17 },
  { month: 'Nov', infrastructure: 14, resource: 8, safety: 11 },
  { month: 'Dec', infrastructure: 11, resource: 6, safety: 9 },
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Infrastructure', value: 42, color: '#6366f1' },
  { name: 'Resource Wastage', value: 28, color: '#06b6d4' },
  { name: 'Public Safety', value: 30, color: '#f59e0b' },
];

// ─── Leaderboard ───
export const LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma', points: 24500, badge: '🏆', issues: 48 },
  { rank: 2, name: 'Rahul Desai', points: 21800, badge: '🥈', issues: 42 },
  { rank: 3, name: 'Anita Kulkarni', points: 19500, badge: '🥉', issues: 38 },
  { rank: 4, name: 'Vikram Patel', points: 17200, badge: '⭐', issues: 34 },
  { rank: 5, name: 'Sneha Joshi', points: 15400, badge: '⭐', issues: 29 },
];

// ─── Timeline for Issues ───
export function getIssueTimeline(issue: Issue): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    { date: issue.createdAt, status: 'Submitted', description: 'Issue reported by citizen. +100 Civipoints earned.' },
  ];

  if (issue.status !== 'submitted') {
    entries.push({
      date: new Date(new Date(issue.createdAt).getTime() + 86400000).toISOString(),
      status: 'Verified & Under Review',
      description: 'AI analysis complete. Risk score assigned. +200 Civipoints earned.',
    });
  }

  if (issue.status === 'in-progress' || issue.status === 'completed') {
    entries.push({
      date: new Date(new Date(issue.createdAt).getTime() + 172800000).toISOString(),
      status: 'In Progress',
      description: 'Field team dispatched to location.',
    });
  }

  if (issue.status === 'completed') {
    entries.push({
      date: issue.updatedAt,
      status: 'Resolved',
      description: 'Issue has been resolved and verified. +500 Civipoints earned!',
    });
  }

  return entries;
}

// ─── Email Templates (for UI display) ───
export function generateSubmissionEmail(issue: Issue, userName: string): { subject: string; body: string } {
  return {
    subject: `CivicSync AI - Issue ${issue.id} Submitted Successfully`,
    body: `Dear ${userName},

Thank you for reporting a civic issue. Your report has been submitted and is being analyzed by our AI system.

📋 Report Details:
━━━━━━━━━━━━━━━━━━
Issue ID: ${issue.id}
Category: ${issue.category.replace('-', ' ').toUpperCase()}
Title: ${issue.title}
Location: ${issue.location.address}
Status: ⏳ Pending Review
Risk Score: ${issue.riskScore}/100

🏆 Civipoints Earned: +100 points

📊 AI Analysis:
${issue.predictedCause}

We will notify you once the issue status is updated.

Best regards,
CivicSync AI Team`,
  };
}

export function generateResolutionEmail(issue: Issue, userName: string, totalPoints: number): { subject: string; body: string } {
  return {
    subject: `CivicSync AI - Issue ${issue.id} Resolved! 🎉`,
    body: `Dear ${userName},

Great news! The civic issue you reported has been resolved.

✅ Resolution Details:
━━━━━━━━━━━━━━━━━━
Issue ID: ${issue.id}
Title: ${issue.title}
Location: ${issue.location.address}
Status: ✅ COMPLETED

🏆 Civipoints Earned:
  • Report Submitted: +100
  • Issue Verified: +200
  • Issue Resolved: +500
  • Total for this issue: +800 Civipoints

💰 Your total balance: ${totalPoints.toLocaleString()} Civipoints
🎁 Visit the Rewards page to redeem exciting rewards!

Thank you for making your city better!

Best regards,
CivicSync AI Team`,
  };
}
