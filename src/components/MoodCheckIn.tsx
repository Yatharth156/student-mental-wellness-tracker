import React from "react";
import { MoodType, StressTrigger } from "../types";
import { MOODS_CONFIG, STRESS_TRIGGERS } from "../data";
import { Sparkles, MessageCircle } from "lucide-react";

interface MoodCheckInProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
  selectedTriggers: StressTrigger[];
  onToggleTrigger: (trigger: StressTrigger) => void;
  onStartChat: () => void;
}

export default function MoodCheckIn({
  selectedMood,
  onSelectMood,
  selectedTriggers,
  onToggleTrigger,
  onStartChat,
}: MoodCheckInProps) {
  // Determine time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Good night, hope you are finding rest";
    if (hour < 12) return "Good morning, take a gentle breath";
    if (hour < 17) return "Good afternoon, hope your prep is peaceful";
    return "Good evening, let us take a moment to unwind";
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="mood-check-in-section">
      {/* Header Greeting */}
      <div className="text-center md:text-left space-y-2 mt-4">
        <h2 className="text-2xl font-serif text-white tracking-tight">
          {getGreeting()}
        </h2>
        <p className="text-sm text-gray-400">
          Your mind deserves a quiet space today. How is your heart doing?
        </p>
      </div>

      {/* Mood Selector card */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-medium text-gray-400 tracking-wider uppercase text-center md:text-left">
          Today's Mood Check-In
        </h3>
        <div className="grid grid-cols-5 gap-2 items-center justify-center">
          {MOODS_CONFIG.map((m) => {
            const isSelected = selectedMood === m.label;
            return (
              <button
                key={m.label}
                id={`mood-btn-${m.label.toLowerCase()}`}
                type="button"
                onClick={() => onSelectMood(m.label)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 relative cursor-pointer ${
                  isSelected 
                    ? `bg-white/5 border border-white/10 ${m.bgGlow}` 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <span className="text-3xl leading-none mb-2" role="img" aria-label={m.label}>
                  {m.emoji}
                </span>
                <span className={`text-[10px] md:text-xs font-medium ${isSelected ? "text-white" : "text-gray-400"}`}>
                  {m.label}
                </span>
                {isSelected && (
                  <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-teal-accent animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stress Triggers section */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-400 tracking-wider uppercase">
            What's weighing on you?
          </h3>
          <p className="text-xs text-gray-400">
            Select factors that are adding noise to your prep (multi-select)
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {STRESS_TRIGGERS.map((trigger) => {
            const isSelected = selectedTriggers.includes(trigger);
            return (
              <button
                key={trigger}
                id={`trigger-btn-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => onToggleTrigger(trigger)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? "bg-teal-accent/10 border-teal-accent text-teal-accent glow-teal"
                    : "bg-white/5 border-transparent text-gray-400 hover:border-white/10 hover:text-white"
                }`}
              >
                {trigger}
              </button>
            );
          })}
        </div>
      </div>

      {/* Central CTA - Talk to Mira */}
      <div className="flex flex-col items-center justify-center pt-2 space-y-3">
        <button
          id="talk-to-mira-cta-btn"
          type="button"
          onClick={onStartChat}
          className="w-full max-w-xs flex items-center justify-center gap-2 px-6 py-4 rounded-xl breathing-cta text-black font-semibold text-sm shadow-xl transition-all duration-500 hover:opacity-95 focus:outline-none animate-breath cursor-pointer"
        >
          <MessageCircle size={18} className="fill-dark-bg text-dark-bg" />
          Talk to Mira 💬
        </button>
        <p className="text-[11px] text-gray-500 text-center max-w-[280px]">
          Mira is our quiet, warm conversational AI who can offer simple, calming exam coping suggestions.
        </p>
      </div>
    </div>
  );
}
