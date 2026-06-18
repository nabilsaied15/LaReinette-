import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  resolveChatbotResponse,
  buildGeminiSystemInstruction,
  formatGeminiHistory,
  CHATBOT_QUICK_REPLIES,
  CHATBOT_DISCLAIMER,
  CHATBOT_LOCAL_CONFIDENCE_THRESHOLD,
  isGeminiConfigured,
} from '../utils/chatbotEngine';
import './Chatbot.css';
import mascotImg from '../assets/chatbot-mascot.png';

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest'];

const buildWelcomeMessage = () => ({
  id: 1,
  text: `Bonjour ! Je suis l'assistant automatique de l'ASAD et de La Reinette. Posez-moi vos questions sur les transports, tarifs, inscriptions ou nos services.\n\n${CHATBOT_DISCLAIMER}`,
  sender: 'bot',
  timestamp: new Date(),
  suggestions: CHATBOT_QUICK_REPLIES,
});

async function askGemini(userInput, settings, conversationHistory) {
  if (!isGeminiConfigured()) return null;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const history = formatGeminiHistory(conversationHistory.slice(0, -1));
  const systemInstruction = buildGeminiSystemInstruction(settings);

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userInput);
      const text = result?.response?.text()?.trim();
      if (text) {
        return { text, source: `gemini:${modelName}` };
      }
    } catch (err) {
      console.warn(`Gemini (${modelName}) indisponible :`, err?.message || err);
    }
  }
  return null;
}

const Chatbot = () => {
  const { settings } = useSettings();
  const geminiAvailable = useMemo(() => isGeminiConfigured(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([buildWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }
    const timer = setTimeout(() => setShowTooltip((prev) => !prev), showTooltip ? 30000 : 60000);
    return () => clearTimeout(timer);
  }, [showTooltip, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const findAnswer = useCallback(
    async (userInput, conversationHistory) => {
      const local = resolveChatbotResponse(userInput, settings);

      if (!geminiAvailable || local.confidence >= CHATBOT_LOCAL_CONFIDENCE_THRESHOLD) {
        return local;
      }

      const gemini = await askGemini(userInput, settings, conversationHistory);
      if (gemini?.text) {
        return {
          ...gemini,
          link: local.link,
          linkText: local.linkText,
          suggestions: local.suggestions,
          confidence: 0.85,
        };
      }

      return {
        ...local,
        text:
          local.confidence < 0.5
            ? `${local.text}\n\n(Réponse automatique locale — l'assistant en ligne est momentanément indisponible.)`
            : local.text,
      };
    },
    [settings, geminiAvailable]
  );

  const pushBotMessage = (botResponse) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: botResponse.text,
        link: botResponse.link,
        linkText: botResponse.linkText,
        suggestions: botResponse.suggestions,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    const localPreview = resolveChatbotResponse(trimmed, settings);
    const useLocalOnly = !geminiAvailable || localPreview.confidence >= CHATBOT_LOCAL_CONFIDENCE_THRESHOLD;
    const delay = useLocalOnly ? 350 : 800;

    try {
      await new Promise((r) => setTimeout(r, delay));
      const botResponse = await findAnswer(trimmed, newMessages);
      pushBotMessage(botResponse);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (message) => {
    sendMessage(message);
  };

  return (
    <>
      <motion.div className="chatbot-toggle-container">
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              className="chatbot-tooltip shadow-premium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              Une question ? Assistant automatique La Reinette.
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          className="chatbot-toggle-btn shadow-premium"
          onClick={toggleChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir l’assistant automatique'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div key="open" className="chatbot-icon-container">
                <motion.img
                  src={mascotImg}
                  alt="La Reinette"
                  className="chatbot-toggle-mascot"
                  animate={{ scale: [1, 1.08, 1], y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window shadow-premium glass"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            role="dialog"
            aria-label="Assistant automatique La Reinette"
          >
            <div className="chatbot-header bg-dark">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <img src={mascotImg} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 className="chatbot-title">Assistant La Reinette</h3>
                  <span className="chatbot-status">
                    <span className="status-dot" /> Automatique — pas un humain
                  </span>
                </div>
              </div>
              <button type="button" className="chatbot-close-btn" onClick={toggleChat} aria-label="Fermer">
                <X size={20} />
              </button>
            </div>

            <p className="chatbot-disclaimer" role="note">
              {CHATBOT_DISCLAIMER}
            </p>

            <div className="chatbot-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`chat-bubble-container ${msg.sender}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="chat-bubble-avatar bot">
                      <img src={mascotImg} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div className={`chat-bubble ${msg.sender}`}>
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>

                    {msg.link && (
                      <Link
                        to={msg.link}
                        className="chatbot-search-link"
                        onClick={() => setIsOpen(false)}
                      >
                        {msg.linkText || 'En savoir plus'} →
                      </Link>
                    )}

                    {msg.suggestions?.length > 0 && (
                      <div className="chatbot-quick-replies">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s.label}
                            type="button"
                            className="chatbot-quick-reply-btn"
                            onClick={() => handleQuickReply(s.message)}
                            disabled={isTyping}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="chat-time">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="chat-bubble-avatar user">
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chat-bubble-container bot">
                  <div className="chat-bubble-avatar bot">
                    <img src={mascotImg} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <div className="chat-bubble bot typing-indicator">
                    <span /><span /><span />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
              <form onSubmit={handleSendMessage} className="chatbot-form">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ex : Comment réserver un trajet ?"
                  className="chatbot-input"
                  aria-label="Votre question"
                />
                <button
                  type="submit"
                  className={`chatbot-send-btn ${inputValue.trim() ? 'active' : ''}`}
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Envoyer"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
