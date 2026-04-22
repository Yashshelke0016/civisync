// ─── Smart Suggestion Engine ───
// Analyzes user input and suggests the most likely category

interface SuggestionResult {
  category: 'infrastructure' | 'resource-wastage' | 'public-safety';
  confidence: number;
  message: string;
}

const KEYWORDS: Record<string, { category: SuggestionResult['category']; weight: number }[]> = {
  'pothole': [{ category: 'infrastructure', weight: 3 }],
  'road': [{ category: 'infrastructure', weight: 2 }],
  'crack': [{ category: 'infrastructure', weight: 2 }],
  'bridge': [{ category: 'infrastructure', weight: 3 }],
  'pavement': [{ category: 'infrastructure', weight: 2 }],
  'sewer': [{ category: 'infrastructure', weight: 2 }],
  'drain': [{ category: 'infrastructure', weight: 2 }, { category: 'resource-wastage', weight: 1 }],
  'footpath': [{ category: 'infrastructure', weight: 2 }],
  'construction': [{ category: 'infrastructure', weight: 1 }, { category: 'public-safety', weight: 1 }],
  'collapse': [{ category: 'infrastructure', weight: 3 }],
  'sinking': [{ category: 'infrastructure', weight: 2 }],
  'broken': [{ category: 'infrastructure', weight: 1 }],
  'गड्ढा': [{ category: 'infrastructure', weight: 3 }],
  'सड़क': [{ category: 'infrastructure', weight: 2 }],
  'पुल': [{ category: 'infrastructure', weight: 3 }],
  'रस्ता': [{ category: 'infrastructure', weight: 2 }],
  'खड्डा': [{ category: 'infrastructure', weight: 3 }],

  'water': [{ category: 'resource-wastage', weight: 2 }],
  'leak': [{ category: 'resource-wastage', weight: 3 }],
  'leaking': [{ category: 'resource-wastage', weight: 3 }],
  'waste': [{ category: 'resource-wastage', weight: 2 }],
  'pipe': [{ category: 'resource-wastage', weight: 3 }],
  'hydrant': [{ category: 'resource-wastage', weight: 3 }],
  'irrigation': [{ category: 'resource-wastage', weight: 2 }],
  'overflow': [{ category: 'resource-wastage', weight: 2 }],
  'flooding': [{ category: 'resource-wastage', weight: 2 }, { category: 'infrastructure', weight: 1 }],
  'tap': [{ category: 'resource-wastage', weight: 2 }],
  'पानी': [{ category: 'resource-wastage', weight: 2 }],
  'रिसाव': [{ category: 'resource-wastage', weight: 3 }],
  'नल': [{ category: 'resource-wastage', weight: 2 }],
  'पाणी': [{ category: 'resource-wastage', weight: 2 }],
  'गळती': [{ category: 'resource-wastage', weight: 3 }],

  'unsafe': [{ category: 'public-safety', weight: 3 }],
  'dark': [{ category: 'public-safety', weight: 2 }],
  'streetlight': [{ category: 'public-safety', weight: 3 }],
  'light': [{ category: 'public-safety', weight: 1 }],
  'crime': [{ category: 'public-safety', weight: 3 }],
  'accident': [{ category: 'public-safety', weight: 3 }],
  'guardrail': [{ category: 'public-safety', weight: 3 }],
  'sign': [{ category: 'public-safety', weight: 2 }],
  'danger': [{ category: 'public-safety', weight: 3 }],
  'theft': [{ category: 'public-safety', weight: 3 }],
  'night': [{ category: 'public-safety', weight: 2 }],
  'barricade': [{ category: 'public-safety', weight: 2 }],
  'असुरक्षित': [{ category: 'public-safety', weight: 3 }],
  'अंधेरा': [{ category: 'public-safety', weight: 2 }],
  'खतरा': [{ category: 'public-safety', weight: 3 }],
  'सुरक्षा': [{ category: 'public-safety', weight: 2 }],
  'धोका': [{ category: 'public-safety', weight: 3 }],
};

export function analyzeDescription(text: string): SuggestionResult | null {
  if (!text || text.length < 3) return null;

  const lower = text.toLowerCase();
  const scores: Record<string, number> = {
    'infrastructure': 0,
    'resource-wastage': 0,
    'public-safety': 0,
  };

  let totalWeight = 0;

  for (const [keyword, categories] of Object.entries(KEYWORDS)) {
    if (lower.includes(keyword)) {
      for (const { category, weight } of categories) {
        scores[category] += weight;
        totalWeight += weight;
      }
    }
  }

  if (totalWeight === 0) return null;

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const confidence = Math.min(Math.round((best[1] / totalWeight) * 100), 95);

  if (confidence < 30) return null;

  const categoryNames: Record<string, string> = {
    'infrastructure': 'Infrastructure Intelligence',
    'resource-wastage': 'Resource Wastage',
    'public-safety': 'Public Safety',
  };

  return {
    category: best[0] as SuggestionResult['category'],
    confidence,
    message: `This seems like a ${categoryNames[best[0]]} issue (${confidence}% confidence). Continue?`,
  };
}

// ─── Risk Score Calculator ───
export function calculateRiskScore(params: {
  reportCount: number;
  category: string;
  daysSinceReport: number;
  hasRecurrence: boolean;
}): { score: number; level: 'high' | 'medium' | 'low' } {
  let score = 0;

  // Frequency factor (0-35)
  score += Math.min(params.reportCount * 3, 35);

  // Category weight (0-25)
  const categoryWeights: Record<string, number> = {
    'infrastructure': 20,
    'public-safety': 25,
    'resource-wastage': 18,
  };
  score += categoryWeights[params.category] || 15;

  // Time urgency (0-20)
  if (params.daysSinceReport <= 1) score += 20;
  else if (params.daysSinceReport <= 3) score += 15;
  else if (params.daysSinceReport <= 7) score += 10;
  else score += 5;

  // Recurrence bonus (0-20)
  if (params.hasRecurrence) score += 20;

  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return { score: Math.min(score, 100), level };
}

// ─── Root Cause Generator ───
const ROOT_CAUSES: Record<string, string[]> = {
  'infrastructure': [
    'Poor drainage combined with heavy rainfall causing structural erosion',
    'Repeated infrastructure failure due to substandard materials',
    'Underground utility work causing surface instability',
    'Aging infrastructure exceeding designed lifespan',
    'Excessive heavy vehicle traffic beyond road capacity',
  ],
  'resource-wastage': [
    'Aging pipeline infrastructure past expected service life',
    'Faulty valve mechanism due to lack of preventive maintenance',
    'Underground pipe corrosion from chemical soil composition',
    'Timer/sensor malfunction in automated systems',
    'Joint failure at pipe connections due to ground movement',
  ],
  'public-safety': [
    'Electrical circuit failure from weather damage',
    'Delayed maintenance contractor response',
    'Inadequate safety infrastructure in high-traffic zones',
    'Poor urban planning in rapidly developing areas',
    'Vandalism and lack of surveillance in remote areas',
  ],
};

export function generateRootCause(category: string): string {
  const causes = ROOT_CAUSES[category] || ROOT_CAUSES['infrastructure'];
  return causes[Math.floor(Math.random() * causes.length)];
}

// ─── Predictive Alert Generator ───
export function getPredictiveAlert(category: string, riskScore: number): string | null {
  if (riskScore < 60) return null;

  const alerts: Record<string, string[]> = {
    'infrastructure': [
      '⚠️ This area has 78% probability of further structural damage within 30 days',
      '⚠️ Predictive model indicates adjacent roads may develop similar issues',
      '⚠️ High risk due to rain + repeated damage pattern',
    ],
    'resource-wastage': [
      '⚠️ Adjacent pipeline sections are 85% likely to fail within 3 months',
      '⚠️ Water loss in this zone exceeds sustainable limits',
      '⚠️ Recurring leak pattern detected - systemic replacement recommended',
    ],
    'public-safety': [
      '⚠️ Area classified as unsafe after 9 PM based on historical data',
      '⚠️ Accident probability increases 3x during monsoon in this zone',
      '⚠️ Similar safety deficiencies detected in 4 nearby locations',
    ],
  };

  const categoryAlerts = alerts[category] || alerts['infrastructure'];
  return categoryAlerts[Math.floor(Math.random() * categoryAlerts.length)];
}

// ─── Multilingual Chatbot AI Engine ───
export type ChatLanguage = 'en' | 'hi' | 'mr';

interface ChatResponse {
  text: string;
  action?: 'report' | 'navigate';
  data?: Record<string, unknown>;
}

// Language detection
function detectLanguage(text: string): ChatLanguage {
  const hindiChars = /[\u0900-\u097F]/;
  const marathiKeywords = ['कसे', 'काय', 'मला', 'आहे', 'करा', 'नमस्कार', 'धन्यवाद', 'तक्रार', 'समस्या', 'पाणी', 'रस्ता', 'गळती'];
  const hindiKeywords = ['कैसे', 'क्या', 'मुझे', 'है', 'करो', 'नमस्ते', 'धन्यवाद', 'शिकायत', 'समस्या', 'पानी', 'सड़क', 'रिसाव'];

  if (hindiChars.test(text)) {
    // Check Marathi-specific words
    for (const kw of marathiKeywords) {
      if (text.includes(kw)) return 'mr';
    }
    // Default to Hindi for Devanagari
    for (const kw of hindiKeywords) {
      if (text.includes(kw)) return 'hi';
    }
    return 'hi';
  }
  return 'en';
}

const RESPONSES: Record<ChatLanguage, Record<string, ChatResponse>> = {
  en: {
    greeting: {
      text: "Hello! 👋 I'm **CiviBot AI**. I can help you report civic issues, check area safety scores, or find information about ongoing projects. What would you like to do?",
    },
    report_intent: {
      text: "I'd be happy to help you report an issue! Could you describe the problem? For example:\n• 'There's a pothole on MG Road'\n• 'Water leaking from a pipe'\n• 'Streetlights are broken'",
    },
    status: {
      text: "You can track all your reported issues on the **Dashboard** page. Each issue has a real-time timeline showing its current status. Would you like me to take you there?",
      action: 'navigate',
      data: { path: '/dashboard' },
    },
    safety: {
      text: "Based on our data, I can check area safety scores. The **Public Safety Intelligence** module tracks time-based risk zones. Areas are marked unsafe after 9 PM if they have low lighting. Check the **Map** for details!",
      action: 'navigate',
      data: { path: '/map' },
    },
    score: {
      text: "The **Civic Score System** rates each area on cleanliness, safety, and infrastructure. Currently, **Deccan** leads with 82/100, while **Warje** needs improvement at 55/100. Check the Dashboard!",
    },
    water: {
      text: "This sounds like a **Resource Wastage** issue. Water leaks are classified by severity:\n• 🟢 Low: Minor drip\n• 🟡 Medium: Steady flow\n• 🔴 High: Major pipe burst\n\nWould you like to report this?",
      action: 'report',
      data: { category: 'resource-wastage' },
    },
    road: {
      text: "This falls under **Infrastructure Intelligence**. I'll help you report it. Our AI will analyze the area's history and predict failure risk. Want to proceed?",
      action: 'report',
      data: { category: 'infrastructure' },
    },
    rewards: {
      text: "You can earn **Civipoints** by reporting issues! Here's how:\n• 📝 Report Submitted: +100 pts\n• ✅ Issue Verified: +200 pts\n• 🎉 Issue Resolved: +500 pts\n\nRedeem them for Netflix, Amazon Prime, Spotify & more on the **Rewards** page!",
      action: 'navigate',
      data: { path: '/rewards' },
    },
    default: {
      text: "I'm here to help! You can:\n• 📝 **Report an issue** — describe any civic problem\n• 📊 **Check status** — track your reported issues\n• 🗺️ **View map** — see issue heatmaps\n• 🏆 **Civipoints** — earn & redeem rewards\n\nWhat would you like to do?",
    },
  },
  hi: {
    greeting: {
      text: "नमस्ते! 👋 मैं **CiviBot AI** हूँ। मैं आपकी नागरिक समस्याओं की रिपोर्ट करने, क्षेत्र सुरक्षा स्कोर जांचने, या चल रहे प्रोजेक्ट्स की जानकारी देने में मदद कर सकता हूँ। आप क्या करना चाहेंगे?",
    },
    report_intent: {
      text: "मैं आपकी समस्या रिपोर्ट करने में मदद करूँगा! कृपया समस्या बताएं, जैसे:\n• 'MG रोड पर गड्ढा है'\n• 'पाइप से पानी लीक हो रहा है'\n• 'स्ट्रीटलाइट्स बंद हैं'\n\nआप होमपेज से कैटेगरी चुनकर रिपोर्ट सबमिट कर सकते हैं।",
    },
    status: {
      text: "आप **डैशबोर्ड** पेज पर अपनी सभी रिपोर्ट की गई समस्याओं को ट्रैक कर सकते हैं। प्रत्येक समस्या की वर्तमान स्थिति दिखती है। क्या मैं आपको वहां ले जाऊं?",
      action: 'navigate',
      data: { path: '/dashboard' },
    },
    safety: {
      text: "हमारे डेटा के अनुसार, **सार्वजनिक सुरक्षा** मॉड्यूल समय-आधारित जोखिम क्षेत्रों को ट्रैक करता है। रात 9 बजे के बाद कम रोशनी वाले क्षेत्रों को असुरक्षित चिह्नित किया जाता है। **मैप** पर विवरण देखें!",
      action: 'navigate',
      data: { path: '/map' },
    },
    score: {
      text: "**नागरिक स्कोर प्रणाली** प्रत्येक क्षेत्र को स्वच्छता, सुरक्षा और बुनियादी ढांचे पर रेटिंग देती है। वर्तमान में, **डेक्कन** 82/100 के साथ अग्रणी है, जबकि **वारजे** को 55/100 पर सुधार की आवश्यकता है।",
    },
    water: {
      text: "यह **संसाधन बर्बादी** की समस्या लगती है। पानी के रिसाव को गंभीरता के अनुसार वर्गीकृत किया जाता है:\n• 🟢 कम: मामूली टपकन\n• 🟡 मध्यम: स्थिर बहाव\n• 🔴 उच्च: बड़ा पाइप फटना\n\nक्या आप इसकी रिपोर्ट करना चाहेंगे?",
      action: 'report',
      data: { category: 'resource-wastage' },
    },
    road: {
      text: "यह **इन्फ्रास्ट्रक्चर इंटेलिजेंस** के अंतर्गत आता है। हमारा AI क्षेत्र के इतिहास का विश्लेषण करेगा। क्या आप आगे बढ़ना चाहेंगे?",
      action: 'report',
      data: { category: 'infrastructure' },
    },
    rewards: {
      text: "समस्याओं की रिपोर्ट करके **Civipoints** कमाएं!\n• 📝 रिपोर्ट सबमिट: +100 अंक\n• ✅ सत्यापित: +200 अंक\n• 🎉 हल किया: +500 अंक\n\nNetflix, Amazon Prime, Spotify और अन्य इनामों के लिए **रिवॉर्ड्स** पेज पर रिडीम करें!",
      action: 'navigate',
      data: { path: '/rewards' },
    },
    default: {
      text: "मैं मदद के लिए यहां हूँ! आप:\n• 📝 **समस्या रिपोर्ट करें** — कोई भी नागरिक समस्या बताएं\n• 📊 **स्थिति जांचें** — अपनी रिपोर्ट ट्रैक करें\n• 🗺️ **मैप देखें** — समस्या हीटमैप देखें\n• 🏆 **Civipoints** — रिवॉर्ड्स कमाएं और रिडीम करें\n\nआप क्या करना चाहेंगे?",
    },
  },
  mr: {
    greeting: {
      text: "नमस्कार! 👋 मी **CiviBot AI** आहे. मी तुम्हाला नागरिक समस्यांची तक्रार करणे, क्षेत्र सुरक्षा स्कोर तपासणे किंवा सुरू असलेल्या प्रकल्पांची माहिती देण्यात मदत करू शकतो. तुम्हाला काय करायचे आहे?",
    },
    report_intent: {
      text: "मी तुमची समस्या नोंदवण्यात मदत करतो! कृपया समस्या सांगा, जसे:\n• 'MG रोडवर खड्डा आहे'\n• 'पाइपमधून पाणी गळत आहे'\n• 'स्ट्रीटलाइट्स बंद आहेत'\n\nतुम्ही होमपेजवरून कॅटेगरी निवडून तक्रार सबमिट करू शकता.",
    },
    status: {
      text: "तुम्ही **डॅशबोर्ड** पेजवर तुमच्या सर्व तक्रारी ट्रॅक करू शकता. प्रत्येक समस्येची सध्याची स्थिती दाखवली जाते. मी तुम्हाला तिथे घेऊन जाऊ का?",
      action: 'navigate',
      data: { path: '/dashboard' },
    },
    safety: {
      text: "आमच्या डेटानुसार, **सार्वजनिक सुरक्षा** मॉड्यूल वेळ-आधारित जोखीम क्षेत्रे ट्रॅक करतो. रात्री ९ नंतर कमी प्रकाश असलेली क्षेत्रे असुरक्षित म्हणून चिन्हांकित केली जातात. **नकाशा** वर तपशील पहा!",
      action: 'navigate',
      data: { path: '/map' },
    },
    score: {
      text: "**नागरिक स्कोर प्रणाली** प्रत्येक भागाला स्वच्छता, सुरक्षा आणि पायाभूत सुविधांवर रेटिंग देते. सध्या, **डेक्कन** 82/100 सह आघाडीवर आहे, तर **वारजे** ला 55/100 वर सुधारणा आवश्यक आहे.",
    },
    water: {
      text: "ही **संसाधन अपव्यय** समस्या वाटते. पाण्याच्या गळतीचे तीव्रतेनुसार वर्गीकरण:\n• 🟢 कमी: किरकोळ टपकणे\n• 🟡 मध्यम: सतत वाहणे\n• 🔴 उच्च: मोठी पाइप फुटणे\n\nतुम्हाला याची तक्रार करायची आहे का?",
      action: 'report',
      data: { category: 'resource-wastage' },
    },
    road: {
      text: "हे **पायाभूत सुविधा** अंतर्गत येते. आमचा AI भागाच्या इतिहासाचे विश्लेषण करेल. तुम्हाला पुढे जायचे आहे का?",
      action: 'report',
      data: { category: 'infrastructure' },
    },
    rewards: {
      text: "समस्यांची तक्रार करून **Civipoints** मिळवा!\n• 📝 तक्रार सबमिट: +100 गुण\n• ✅ सत्यापित: +200 गुण\n• 🎉 निराकरण: +500 गुण\n\nNetflix, Amazon Prime, Spotify आणि इतर बक्षिसांसाठी **रिवॉर्ड्स** पेजवर रिडीम करा!",
      action: 'navigate',
      data: { path: '/rewards' },
    },
    default: {
      text: "मी मदतीसाठी येथे आहे! तुम्ही:\n• 📝 **समस्या तक्रार करा** — कोणतीही नागरिक समस्या सांगा\n• 📊 **स्थिती तपासा** — तुमच्या तक्रारी ट्रॅक करा\n• 🗺️ **नकाशा पहा** — समस्या हीटमॅप\n• 🏆 **Civipoints** — बक्षिसे मिळवा\n\nतुम्हाला काय करायचे आहे?",
    },
  },
};

export function getChatbotResponse(message: string, forceLang?: ChatLanguage): ChatResponse {
  const lang = forceLang || detectLanguage(message);
  const lower = message.toLowerCase();
  const responses = RESPONSES[lang];

  // Greetings (multilingual)
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|नमस्ते|नमस्कार|हेलो)/.test(lower)) {
    return responses.greeting;
  }

  // Rewards/points
  if (lower.includes('reward') || lower.includes('redeem') || lower.includes('point') || lower.includes('civipoint') || lower.includes('इनाम') || lower.includes('बक्षिस') || lower.includes('अंक') || lower.includes('गुण')) {
    return responses.rewards;
  }

  // Reporting intent
  if (lower.includes('report') || lower.includes('complain') || lower.includes('issue') || lower.includes('problem') || lower.includes('रिपोर्ट') || lower.includes('शिकायत') || lower.includes('समस्या') || lower.includes('तक्रार')) {
    const suggestion = analyzeDescription(lower);
    if (suggestion) {
      const catName = suggestion.category.replace('-', ' ');
      const actionText = lang === 'hi'
        ? `मैंने पहचाना कि यह **${catName}** समस्या हो सकती है। क्या मैं इस कैटेगरी के साथ रिपोर्ट फॉर्म खोलूं?`
        : lang === 'mr'
        ? `मी ओळखले की ही **${catName}** समस्या असू शकते. मी या कॅटेगरीसह तक्रार फॉर्म उघडू का?`
        : `I detected this might be a **${catName}** issue. Would you like me to open the report form with this category pre-selected?`;
      return { text: actionText, action: 'report', data: { category: suggestion.category } };
    }
    return responses.report_intent;
  }

  // Status check
  if (lower.includes('status') || lower.includes('track') || lower.includes('update') || lower.includes('स्थिति') || lower.includes('स्थिती') || lower.includes('ट्रैक') || lower.includes('ट्रॅक')) {
    return responses.status;
  }

  // Safety query
  if (lower.includes('safe') || lower.includes('danger') || lower.includes('crime') || lower.includes('सुरक्षा') || lower.includes('खतरा') || lower.includes('धोका') || lower.includes('असुरक्षित')) {
    return responses.safety;
  }

  // Score/stats
  if (lower.includes('score') || lower.includes('rating') || lower.includes('civic') || lower.includes('स्कोर') || lower.includes('रेटिंग')) {
    return responses.score;
  }

  // Water/leak
  if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe') || lower.includes('पानी') || lower.includes('पाणी') || lower.includes('रिसाव') || lower.includes('गळती') || lower.includes('नल')) {
    return responses.water;
  }

  // Road/pothole
  if (lower.includes('road') || lower.includes('pothole') || lower.includes('bridge') || lower.includes('सड़क') || lower.includes('रस्ता') || lower.includes('गड्ढा') || lower.includes('खड्डा') || lower.includes('पुल')) {
    return responses.road;
  }

  return responses.default;
}
