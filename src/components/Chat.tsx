import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { geminiService } from '../services/gemini';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      const starter = await geminiService.getStarterMessage();
      setMessages([
        {
          id: '1',
          role: 'bot',
          text: starter,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const response = await geminiService.sendMessage(input);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100" dir="rtl">
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">مستشار المدونات الذكي</h1>
            <p className="text-slate-400 text-sm">خبيرك في بناء المحتوى والربح من أدسنس</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="إعادة بدء المحادثة"
        >
          <RefreshCcw className="w-5 h-5 text-slate-300" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-slate-200" : "bg-emerald-100"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl shadow-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
              )}>
                <div className="markdown-body prose prose-slate max-w-none prose-sm md:prose-base dark:prose-invert">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span className={cn(
                  "text-[10px] mt-2 block opacity-50",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {msg.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 ml-auto"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span className="text-slate-400 text-sm">المستشار يفكر...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-14 max-h-32 text-slate-800"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isTyping}
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-lg",
              !input.trim() || isLoading || isTyping
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-emerald-500/20"
            )}
          >
            <Send className="w-6 h-6 rotate-180" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4">
          هذا المستشار يستخدم الذكاء الاصطناعي لمساعدتك. يرجى مراجعة الخطط النهائية بعناية.
        </p>
      </div>
    </div>
  );
};
