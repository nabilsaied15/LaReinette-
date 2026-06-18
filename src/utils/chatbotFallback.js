import { resolveChatbotResponse, normalizeChatQuery } from './chatbotEngine.js';

export { normalizeChatQuery };

/** @deprecated Utiliser resolveChatbotResponse — conservé pour compatibilité tests */
export function getChatbotFallbackResponse(userInput, settings = {}) {
  const result = resolveChatbotResponse(userInput, settings);
  return {
    text: result.text,
    link: result.link,
    linkText: result.linkText,
  };
}
