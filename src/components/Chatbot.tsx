import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles, Globe } from 'lucide-react';
import { getChatbotResponse, ChatLanguage } from '../ai-engine';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  action?: 'report' | 'navigate';
  data?: Record<string, unknown>;
}

const LANG_LABELS: Record<ChatLanguage, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
};

const WELCOME_MSG: Record<ChatLanguage, string> = {
  en: "Hello! 👋 I'm **CiviBot AI**, your civic intelligence assistant. How can I help you today?",
  hi: "नमस्ते! 👋 मैं **CiviBot AI** हूँ, आपका नागरिक बुद्धिमत्ता सहायक। मैं आज आपकी कैसे मदद कर सकता हूँ?",
  mr: "नमस्कार! 👋 मी **CiviBot AI** आहे, तुमचा नागरिक बुद्धिमत्ता सहाय्यक. मी आज तुम्हाला कशी मदत करू शकतो?",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<ChatLanguage>('en');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: WELCOME_MSG.en, sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const switchLanguage = (lang: ChatLanguage) => {
    setLanguage(lang);
    setShowLangPicker(false);
    setMessages([{ id: Date.now(), text: WELCOME_MSG[lang], sender: 'bot' }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getChatbotResponse(input, language);
      const botMsg: Message = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        action: response.action,
        data: response.data,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleAction = (msg: Message) => {
    if (msg.action === 'report') {
      navigate('/report', { state: { category: msg.data?.category } });
      setIsOpen(false);
    } else if (msg.action === 'navigate') {
      navigate(msg.data?.path as string);
      setIsOpen(false);
    }
  };

  const formatText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="chatbot-window"
            style={{ marginBottom: 16 }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 20px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>CiviBot AI</div>
                  <div style={{ fontSize: '0.6875rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="status-dot active" style={{ width: 6, height: 6 }} />
                    Online • {LANG_LABELS[language]}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Language Toggle */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowLangPicker(!showLangPicker)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <Globe size={12} />
                    {language.toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {showLangPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: 4,
                          background: 'white',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: 'var(--shadow-lg)',
                          overflow: 'hidden',
                          zIndex: 10,
                          minWidth: 120,
                        }}
                      >
                        {(Object.entries(LANG_LABELS) as [ChatLanguage, string][]).map(([code, label]) => (
                          <button
                            key={code}
                            onClick={() => switchLanguage(code)}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '8px 14px',
                              border: 'none',
                              background: language === code ? 'rgba(99,102,241,0.08)' : 'transparent',
                              color: language === code ? 'var(--color-primary)' : 'var(--color-text)',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.8125rem',
                              fontWeight: language === code ? 700 : 400,
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages" style={{ background: 'var(--color-bg)' }}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`chat-bubble ${msg.sender}`}>
                    <div dangerouslySetInnerHTML={{ __html: formatText(msg.text).replace(/\n/g, '<br/>') }} />
                    {msg.action && (
                      <button
                        onClick={() => handleAction(msg)}
                        className="btn btn-sm"
                        style={{
                          marginTop: 8,
                          background: msg.sender === 'bot' ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                        }}
                      >
                        {msg.action === 'report' ? '📝 Open Report Form' : '➡️ Go There'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="chat-bubble bot"
                  style={{ display: 'flex', gap: 4, padding: '12px 16px' }}
                >
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              background: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: 8,
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={language === 'hi' ? 'संदेश लिखें...' : language === 'mr' ? 'संदेश टाइप करा...' : 'Type a message...'}
                className="input"
                style={{ borderRadius: 'var(--radius-full)', padding: '10px 16px', fontSize: '0.875rem' }}
              />
              <button
                onClick={handleSend}
                className="btn btn-primary"
                style={{ borderRadius: '50%', width: 42, height: 42, padding: 0, flexShrink: 0 }}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <>
            <motion.div
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid var(--color-primary)' }}
            />
            <div style={{
              position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: '50%',
              background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white',
            }}>
              <Sparkles size={10} color="white" />
            </div>
          </>
        )}
      </motion.button>
    </div>
  );
}
