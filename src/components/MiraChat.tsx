import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, MoodType, StressTrigger } from "../types";
import { Moon, Send, Sparkles, MessageCircle, RefreshCw } from "lucide-react";

interface MiraChatProps {
  selectedMood: MoodType | null;
  selectedTriggers: StressTrigger[];
  messages: ChatMessage[];
  onAddMessage: (content: string, sender: "user" | "assistant") => void;
  onClearChat: () => void;
}

export default function MiraChat({
  selectedMood,
  selectedTriggers,
  messages,
  onAddMessage,
  onClearChat,
}: MiraChatProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMessage = inputText.trim();
    setInputText("");
    setErrorMessage("");

    // 1. Add user message to UI state
    onAddMessage(userMessage, "user");
    
    // 2. Trigger typing indicator
    setIsTyping(true);

    try {
      // 3. Make fetch request to our /api/chat Express proxy
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          mood: selectedMood || "Unspecified",
          triggers: selectedTriggers,
          history: messages, // Array of { role: 'user' | 'assistant', content: string }
        }),
      });

      if (!response.ok) {
        throw new Error("I had a little trouble connecting to my thoughts right now.");
      }

      const data = await response.json();
      
      // 4. Add AI message to state
      onAddMessage(data.reply || "I am here with you. Take a soft breath.", "assistant");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        "I'm feeling a bit distant right now (network connection issue). Let's take a deep breath together, or you can try again shortly."
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl glass-card relative overflow-hidden animate-fadeIn" id="mira-chat-panel">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-dark-bg/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-accent/15 flex items-center justify-center border border-violet-accent/30 shadow-[0_0_10px_rgba(167,139,250,0.15)] animate-pulse">
            <Moon size={18} className="text-violet-accent fill-violet-accent/10" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
              Mira 
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-accent animate-ping" />
            </h3>
            <p className="text-[10px] text-gray-400">Your quiet exam companion</p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button
            type="button"
            id="clear-chat-btn"
            onClick={onClearChat}
            className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded cursor-pointer"
          >
            <RefreshCw size={10} />
            Clean Slate
          </button>
        )}
      </div>

      {/* Context info at top of messages */}
      <div className="px-4 py-2 border-b border-white/5 bg-white/[0.01] flex flex-wrap gap-1.5 items-center">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wide">Context:</span>
        {selectedMood ? (
          <span className="text-[10px] font-medium bg-violet-accent/10 border border-violet-accent/25 text-violet-accent px-2 py-0.5 rounded-full flex items-center gap-1">
            Feeling: {selectedMood}
          </span>
        ) : (
          <span className="text-[10px] font-medium bg-white/5 border border-white/5 text-gray-500 px-2 py-0.5 rounded-full">
            No mood selected
          </span>
        )}
        
        {selectedTriggers.length > 0 ? (
          selectedTriggers.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] font-medium bg-teal-accent/10 border border-teal-accent/25 text-teal-accent px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {t}
            </span>
          ))
        ) : (
          <span className="text-[10px] font-medium bg-white/5 border border-white/5 text-gray-500 px-2 py-0.5 rounded-full">
            No triggers highlighted
          </span>
        )}
        
        {selectedTriggers.length > 2 && (
          <span className="text-[9px] text-gray-500 font-medium">
            +{selectedTriggers.length - 2} more
          </span>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages-container">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <Moon size={36} className="text-violet-accent/40 animate-pulse fill-violet-accent/5" />
            <div className="space-y-1.5 max-w-[280px]">
              <p className="font-serif text-sm text-gray-300">"Welcome back, friend."</p>
              <p className="text-xs text-gray-400">
                I am Mira. I'm here to listen, with no expectations or judgments. How has prep been wearing on you today?
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              <button
                type="button"
                onClick={() => setInputText("Exam pressure is getting a bit much today...")}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg px-2.5 py-1.5 transition-all text-left cursor-pointer"
              >
                "Exam pressure is getting much..."
              </button>
              <button
                type="button"
                onClick={() => setInputText("How do I stay calm before paper solving?")}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg px-2.5 py-1.5 transition-all text-left cursor-pointer"
              >
                "How do I stay calm before physics?"
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-teal-accent/15 border border-teal-accent/20 text-white rounded-tr-none"
                      : "bg-white/5 border border-white/5 text-gray-100 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className="block text-[8px] text-gray-500 text-right mt-1.5 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-accent animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-accent animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-accent animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 bg-amber-accent/10 border border-amber-accent/20 rounded-xl text-[11px] text-amber-accent leading-relaxed">
            {errorMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-dark-bg/20 flex gap-2 items-center">
        <input
          id="mira-message-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isTyping ? "Mira is crafting a reply..." : "Express anything to Mira..."}
          disabled={isTyping}
          className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-accent/40 focus:ring-1 focus:ring-violet-accent/20 transition-all font-sans"
        />
        <button
          id="send-message-btn"
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            inputText.trim() && !isTyping
              ? "bg-violet-accent text-dark-bg shadow-md"
              : "bg-white/5 text-gray-600 border border-transparent cursor-not-allowed"
          }`}
        >
          <Send size={14} className={inputText.trim() && !isTyping ? "fill-dark-bg" : ""} />
        </button>
      </form>
      
      {/* Disclaimer */}
      <div className="bg-dark-bg py-1.5 text-center border-t border-white/5">
        <span className="text-[9px] text-gray-500 tracking-wide font-medium">
          Mira is an AI wellness companion, not a licensed therapist.
        </span>
      </div>
    </div>
  );
}
