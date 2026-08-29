import React, { useState, useRef, useEffect } from 'react';
import { MediaItem, AppSettings } from '../types';
import { localAi } from '../services/localAiEngine';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Image as ImageIcon, 
  ArrowRight, 
  Loader2, 
  Trash2, 
  Key, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Receipt 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'luma';
  text: string;
  timestamp: string;
  matchedItems?: MediaItem[];
  keyEntities?: Record<string, string>;
  suggestedFollowUps?: string[];
}

interface AiChatViewProps {
  gallery: MediaItem[];
  settings: AppSettings;
  onSelectMediaItem: (item: MediaItem) => void;
}

const PRESET_PROMPTS = [
  'Where did I park my motorcycle?',
  'Find the screenshot where I saved the WiFi password',
  'What was the restaurant I visited in Hyderabad?',
  'When did I last change my motorcycle battery?',
  'Find my vehicle insurance document',
  'Show me receipts from Amazon',
  'Show documents containing passport'
];

export const AiChatView: React.FC<AiChatViewProps> = ({
  gallery,
  settings,
  onSelectMediaItem
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'luma',
      text: "Hello! I'm Luma, your visual memory intelligence. Ask me anything about photos you've taken, receipts you've saved, WiFi passwords, documents, or places you've visited.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Where did I park my motorcycle?',
        'Find the screenshot with WiFi password',
        'When did I last replace my motorcycle battery?'
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    setInputQuery('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. If user asks a visual recall question
      const recallResult = await localAi.visualRecall(query, gallery);

      // Check if cloud endpoint provides deeper synthesis
      let replyText = recallResult.answer;
      let matchedItems = recallResult.matchingItems;
      let entities = recallResult.keyEntities;
      let followUps = [
        'Show related receipts',
        'Show all photos from this location',
        'Find similar documents'
      ];

      try {
        const response = await fetch('/api/chat/ask-luma', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            conversationHistory: messages.slice(-4),
            gallerySnapshot: gallery.slice(0, 15)
          })
        });

        if (response.ok) {
          const cloudData = await response.json();
          if (cloudData.reply) {
            replyText = cloudData.reply;
            if (cloudData.suggestedFollowUps) followUps = cloudData.suggestedFollowUps;
            if (cloudData.referencedItemIds?.length) {
              const cloudItems = cloudData.referencedItemIds
                .map((id: string) => gallery.find(g => g.id === id))
                .filter(Boolean) as MediaItem[];
              if (cloudItems.length) matchedItems = cloudItems;
            }
          }
        }
      } catch {
        // Fall back to recallResult
      }

      const lumaMsg: ChatMessage = {
        id: `luma-${Date.now()}`,
        sender: 'luma',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedItems,
        keyEntities: entities,
        suggestedFollowUps: followUps
      };

      setMessages(prev => [...prev, lumaMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `luma-${Date.now()}`,
        sender: 'luma',
        text: "I couldn't recall that specific memory right now, but I indexed your latest gallery items.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'luma',
        text: "Visual memory chat cleared. Ask me anything about your photos, receipts, or documents.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: PRESET_PROMPTS.slice(0, 3)
      }
    ]);
  };

  return (
    <div id="lumafind-ai-chat-view" className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto px-4 pb-20">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Ask Luma
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-1.5 py-0.2 rounded-full border border-cyan-500/30">
                Visual OS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Natural language visual memory reasoning
            </p>
          </div>
        </div>

        <button
          id="clear-chat-history-btn"
          onClick={handleClearChat}
          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender bubble */}
            <div
              className={`max-w-[85%] rounded-3xl p-4 space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-br-none shadow-lg shadow-cyan-500/20'
                  : 'glass-panel border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-xl bg-slate-950/80'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                  {msg.sender === 'user' ? (
                    <>
                      <User className="w-3 h-3" /> You
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-cyan-400" /> Luma Intelligence
                    </>
                  )}
                </span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>

              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </p>

              {/* Extracted Key Facts Card (if any) */}
              {msg.keyEntities && Object.keys(msg.keyEntities).length > 0 && (
                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Extracted Facts:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {Object.entries(msg.keyEntities).map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between p-1.5 rounded-lg bg-white/[0.04] text-[11px] font-mono">
                        <span className="text-slate-400">{k}:</span>
                        <span className="font-bold text-cyan-300 ml-2">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Photos in response */}
              {msg.matchedItems && msg.matchedItems.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                    Referenced Visual Memories ({msg.matchedItems.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {msg.matchedItems.slice(0, 3).map(item => (
                      <div
                        key={item.id}
                        onClick={() => onSelectMediaItem(item)}
                        className="rounded-xl overflow-hidden glass-panel border border-white/10 hover:border-cyan-400 cursor-pointer group aspect-[4/3] relative bg-slate-900"
                      >
                        <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-1 left-1.5 right-1.5">
                          <p className="text-[10px] font-bold text-white truncate">{item.title}</p>
                          <span className="text-[8px] font-mono text-cyan-300 block">{item.location?.city || item.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested follow-up chips */}
            {msg.suggestedFollowUps && (
              <div className="flex flex-wrap gap-1.5 mt-2 pl-2">
                {msg.suggestedFollowUps.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-xl glass-pill text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors text-left flex items-center gap-1"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-3 rounded-2xl glass-panel w-fit border border-cyan-500/20">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Scanning visual memory database...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 3. Preset prompt suggestions if message count is low */}
      {messages.length <= 2 && (
        <div className="py-2">
          <p className="text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            Quick Visual Inquiries:
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-xl glass-pill text-xs text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-2"
      >
        <div className="relative flex items-center rounded-2xl glass-panel-glow border border-cyan-500/30 bg-slate-950/90 shadow-xl">
          <input
            id="ask-luma-input"
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask your visual memory anything..."
            className="w-full py-3.5 pl-4 pr-12 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-xs font-medium"
          />

          <button
            type="submit"
            id="ask-luma-submit-btn"
            disabled={!inputQuery.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-xl transition-all duration-200 ${
              inputQuery.trim() && !isLoading
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 hover:scale-105'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
