import React, { useState } from "react";
import { JournalEntry, MoodType } from "../types";
import { MOODS_CONFIG } from "../data";
import { BookOpen, Calendar, Edit2, Trash2, MoreHorizontal } from "lucide-react";

interface ReflectionJournalProps {
  entries: JournalEntry[];
  currentMood: MoodType | null;
  onSaveEntry: (content: string, mood: MoodType) => void;
  onDeleteEntry: (id: string) => void;
}

export default function ReflectionJournal({
  entries,
  currentMood,
  onSaveEntry,
  onDeleteEntry,
}: ReflectionJournalProps) {
  const [content, setContent] = useState("");
  const [selectedMoodForEntry, setSelectedMoodForEntry] = useState<MoodType | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [errorMess, setErrorMess] = useState("");

  const activeMood = selectedMoodForEntry || currentMood || "Okay";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMess("Your journal is empty. Write down even a single word to unburden.");
      return;
    }
    setErrorMess("");
    onSaveEntry(content.trim(), activeMood);
    setContent("");
    setSelectedMoodForEntry(null);
  };

  const getMoodDotColor = (mood: MoodType) => {
    switch (mood) {
      case "Overwhelmed": return "bg-amber-accent shadow-[0_0_8px_rgba(251,191,36,0.5)]";
      case "Anxious": return "bg-violet-accent shadow-[0_0_8px_rgba(167,139,250,0.5)]";
      case "Okay": return "bg-gray-400 shadow-[0_0_6px_rgba(156,163,175,0.3)]";
      case "Hopeful": return "bg-teal-accent shadow-[0_0_8px_rgba(56,189,248,0.5)]";
      case "Good": return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="journal-section">
      {/* Header Info */}
      <div className="text-center md:text-left space-y-1 mt-4">
        <h2 className="text-2xl font-serif text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
          <BookOpen className="text-teal-accent" size={20} />
          Reflection Journal
        </h2>
        <p className="text-sm text-gray-400">
          Pen down your fears, small successes, or syllabus frustrations. Putting it into words makes it lighter.
        </p>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="glass-card p-5 rounded-2xl space-y-4">
        <div>
          <label htmlFor="journal-textarea" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            What happened today? How did it make you feel?
          </label>
          <textarea
            id="journal-textarea"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="No ranks, no exam marks, just you and your peace. Write freely..."
            className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-accent/40 focus:ring-1 focus:ring-teal-accent/20 transition-all resize-none font-sans"
          />
        </div>

        {/* Selected Mood verification */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">Associate Mood:</span>
            <div className="flex gap-1 bg-dark-bg/40 p-1 rounded-lg border border-white/5">
              {MOODS_CONFIG.map((m) => {
                const isSelected = activeMood === m.label;
                return (
                  <button
                    key={m.label}
                    type="button"
                    title={m.label}
                    onClick={() => setSelectedMoodForEntry(m.label)}
                    className={`w-6 h-6 flex items-center justify-center rounded-md text-xs cursor-pointer transition-all ${
                      isSelected ? "bg-white/10" : "hover:bg-white/5 opacity-40"
                    }`}
                  >
                    {m.emoji}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            id="save-journal-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-accent text-dark-bg font-semibold text-xs transition-all shadow-md hover:opacity-90 active:scale-95 cursor-pointer self-end sm:self-auto"
          >
            Save Entry
          </button>
        </div>

        {errorMess && (
          <p className="text-[11px] text-amber-accent">{errorMess}</p>
        )}
      </form>

      {/* Historical Entries */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
          Past Reflections ({entries.length})
        </h3>

        {entries.length === 0 ? (
          <div className="text-center p-8 rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
            <p className="text-xs text-gray-500">Your journal is waiting. Feel free to draft your first reflection. 🌱</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 5).map((entry) => {
              const isMenuOpen = activeMenuId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="glass-card glass-card-hover p-4 rounded-xl relative transition-all duration-300 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getMoodDotColor(entry.mood)}`} />
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 font-mono">
                        <Calendar size={10} />
                        {formatDate(entry.date)}
                      </span>
                      <span className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded uppercase font-medium tracking-wider">
                        {entry.mood}
                      </span>
                    </div>

                    {/* Subtle Menu Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(entry.id, e)}
                        className="p-1 rounded text-gray-500 hover:text-white transition-colors cursor-pointer hover:bg-white/5"
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveMenuId(null)} 
                          />
                          <div className="absolute right-0 top-6 z-20 bg-[#0F0F16] border border-white/10 rounded-lg shadow-xl py-1 w-28 overflow-hidden animate-fadeIn">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteEntry(entry.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[10px] text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 size={10} />
                              Delete Entry
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed truncate-2-lines pr-2">
                    {entry.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
