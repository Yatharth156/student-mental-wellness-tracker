import React, { useState, useEffect } from "react";
import { MoodType, StressTrigger, JournalEntry, ChatMessage } from "./types";
import MoodCheckIn from "./components/MoodCheckIn";
import MiraChat from "./components/MiraChat";
import ReflectionJournal from "./components/ReflectionJournal";
import WellnessSnapshot from "./components/WellnessSnapshot";
import ReliefToolkit from "./components/ReliefToolkit";
import { Smile, MessageCircle, BookOpen, TrendingUp, Wind, Sparkles } from "lucide-react";

const INITIAL_MOCK_ENTRIES: JournalEntry[] = [
  {
    id: "mock-1",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    content: "Syllabus backtracking was triggering intense comparison with peer ranks today during library discussions. Decided to take a quiet tea break, list my formulas step-by-step, and remember preparation is a personal journey.",
    mood: "Anxious",
    triggers: ["Syllabus pressure", "Comparison with peers"]
  },
  {
    id: "mock-2",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    content: "Conducted mock MCQ solvers. Realized that fear of failure was causing silly calculation bugs on Physics sections. Taking small breathes between questions helps clear blockages.",
    mood: "Overwhelmed",
    triggers: ["Fear of failure", "Result anxiety"]
  },
  {
    id: "mock-3",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    content: "Discussed backlog charts with a kind senior. They assured me everyone experiences the mid-year slump. Realized family expectations come from a supportive place. Felt relieved.",
    mood: "Hopeful",
    triggers: ["Family expectations", "Syllabus pressure"]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "journal" | "snapshot" | "toolkit">("home");

  // State local states with persistence
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
    const saved = localStorage.getItem("mira_selected_mood");
    return saved ? (saved as MoodType) : null;
  });

  const [selectedTriggers, setSelectedTriggers] = useState<StressTrigger[]>(() => {
    const saved = localStorage.getItem("mira_selected_triggers");
    return saved ? JSON.parse(saved) : [];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("mira_journal_entries");
    return saved ? JSON.parse(saved) : INITIAL_MOCK_ENTRIES;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("mira_chat_messages");
    return saved ? JSON.parse(saved) : [];
  });

  // Client-side Hash Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let target: "home" | "chat" | "journal" | "snapshot" | "toolkit" = "home";
      
      if (hash === "#chat") target = "chat";
      else if (hash === "#journal") target = "journal";
      else if (hash === "#snapshot") target = "snapshot";
      else if (hash === "#toolkit") target = "toolkit";
      
      setActiveTab(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Run on boot
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabClick = (tab: "home" | "chat" | "journal" | "snapshot" | "toolkit") => {
    window.location.hash = `#${tab}`;
  };

  // Sync to local storage
  useEffect(() => {
    if (selectedMood) {
      localStorage.setItem("mira_selected_mood", selectedMood);
    } else {
      localStorage.removeItem("mira_selected_mood");
    }
  }, [selectedMood]);

  useEffect(() => {
    localStorage.setItem("mira_selected_triggers", JSON.stringify(selectedTriggers));
  }, [selectedTriggers]);

  useEffect(() => {
    localStorage.setItem("mira_journal_entries", JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem("mira_chat_messages", JSON.stringify(messages));
  }, [messages]);

  // Handlers
  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    // Add a check-in record in journal if it doesn't exist for today, or update mood
    const todayStr = new Date().toISOString().split("T")[0];
    const existingIndex = journalEntries.findIndex(e => e.date.split("T")[0] === todayStr);
    
    if (existingIndex !== -1) {
      const updated = [...journalEntries];
      updated[existingIndex].mood = mood;
      setJournalEntries(updated);
    }
  };

  const handleToggleTrigger = (trigger: StressTrigger) => {
    setSelectedTriggers((prev) => {
      if (prev.includes(trigger)) {
        return prev.filter((t) => t !== trigger);
      } else {
        return [...prev, trigger];
      }
    });

    // Mirror to today's entry triggers if editable
    const todayStr = new Date().toISOString().split("T")[0];
    const existingIndex = journalEntries.findIndex(e => e.date.split("T")[0] === todayStr);
    if (existingIndex !== -1) {
      const updated = [...journalEntries];
      const triggersSet = new Set(updated[existingIndex].triggers || []);
      if (triggersSet.has(trigger)) {
        triggersSet.delete(trigger);
      } else {
        triggersSet.add(trigger);
      }
      updated[existingIndex].triggers = Array.from(triggersSet) as StressTrigger[];
      setJournalEntries(updated);
    }
  };

  const handleSaveJournalEntry = (content: string, mood: MoodType) => {
    const newEntry: JournalEntry = {
      id: "entry_" + Date.now(),
      date: new Date().toISOString(),
      content,
      mood,
      triggers: [...selectedTriggers]
    };
    
    // Check if we have an entry for today already. If so, overwrite/append, else add.
    const todayStr = new Date().toISOString().split("T")[0];
    const existingIndex = journalEntries.findIndex(e => e.date.split("T")[0] === todayStr);

    if (existingIndex !== -1) {
      const updated = [...journalEntries];
      updated[existingIndex] = {
        ...updated[existingIndex],
        content: content,
        mood: mood,
        triggers: Array.from(new Set([...updated[existingIndex].triggers, ...selectedTriggers])) as StressTrigger[]
      };
      setJournalEntries(updated);
    } else {
      setJournalEntries([newEntry, ...journalEntries]);
    }
    
    // Automatically make sure the home check-in aligns with the journal check-in mood
    setSelectedMood(mood);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: ChatMessage = {
      id: "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      role,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-[#06060A] text-[#DFE4EC] font-sans flex flex-col items-center justify-center p-0 sm:py-6">
      
      {/* Centered Smartphone-style Screen Wrapper */}
      <div className="w-full min-h-screen sm:min-h-[850px] flex flex-col justify-between bg-dark-bg sm:rounded-3xl relative pt-2 shadow-2xl border border-white/5 overflow-hidden">
        
        {/* Ambient bioluminescent glow backgrounds built in */}
        <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-teal-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[100px] right-[-100px] w-64 h-64 bg-violet-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Static Header */}
        <header className="px-6 py-4 border-b border-white/5 bg-[#0A0A0F]/50 backdrop-blur-md flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <Sparkles className="text-teal-accent animate-pulse" size={16} />
            <span className="font-serif text-base font-semibold tracking-wide text-white">
              QuietSpace
            </span>
          </div>
          <span className="text-[9px] uppercase font-mono tracking-wider text-gray-500 bg-white/5 px-2.5 py-1 rounded-full font-semibold border border-white/5">
            MIRA AI ACTIVE
          </span>
        </header>

        {/* Dynamic Navigated Content */}
        <main className="flex-1 overflow-y-auto px-6 py-4 pb-[80px] z-10">
          
          <section id="home" className={activeTab === "home" ? "block animate-fadeIn" : "hidden"}>
            <MoodCheckIn
              selectedMood={selectedMood}
              onSelectMood={handleSelectMood}
              selectedTriggers={selectedTriggers}
              onToggleTrigger={handleToggleTrigger}
              onStartChat={() => { window.location.hash = "#chat"; }}
            />
          </section>

          <section id="chat" className={activeTab === "chat" ? "block animate-fadeIn" : "hidden"}>
            <MiraChat
              selectedMood={selectedMood}
              selectedTriggers={selectedTriggers}
              messages={messages}
              onAddMessage={handleAddMessage}
              onClearChat={handleClearChat}
            />
          </section>

          <section id="journal" className={activeTab === "journal" ? "block animate-fadeIn" : "hidden"}>
            <ReflectionJournal
              entries={journalEntries}
              currentMood={selectedMood}
              onSaveEntry={handleSaveJournalEntry}
              onDeleteEntry={handleDeleteJournalEntry}
            />
          </section>

          <section id="snapshot" className={activeTab === "snapshot" ? "block animate-fadeIn" : "hidden"}>
            <WellnessSnapshot
              entries={journalEntries}
              selectedTriggers={selectedTriggers}
              selectedMood={selectedMood}
            />
          </section>

          <section id="toolkit" className={activeTab === "toolkit" ? "block animate-fadeIn" : "hidden"}>
            <ReliefToolkit />
          </section>

        </main>

        {/* Glassmorphic Bottom Navigation Tabs */}
        <nav className="absolute bottom-0 inset-x-0 h-[64px] bg-[#0A0A0F]/95 border-t border-white/[0.08] backdrop-blur-[12.00px] flex items-center justify-around px-2 z-20 rounded-b-none sm:rounded-b-3xl">
          
          {/* Tab: Home */}
          <button
            type="button"
            id="tab-btn-home"
            onClick={() => handleTabClick("home")}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 relative cursor-pointer ${
              activeTab === "home" 
                ? "text-teal-accent drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] font-semibold scale-105" 
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <span className="text-sm">🏠</span>
            <span className="text-[9px] tracking-wide">Home</span>
            {activeTab === "home" && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-teal-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          {/* Tab: Mira */}
          <button
            type="button"
            id="tab-btn-chat"
            onClick={() => handleTabClick("chat")}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 relative cursor-pointer ${
              activeTab === "chat" 
                ? "text-teal-accent drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] font-semibold scale-105" 
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <span className="text-sm">💬</span>
            <span className="text-[9px] tracking-wide">Mira</span>
            {activeTab === "chat" && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-teal-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          {/* Tab: Journal */}
          <button
            type="button"
            id="tab-btn-journal"
            onClick={() => handleTabClick("journal")}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 relative cursor-pointer ${
              activeTab === "journal" 
                ? "text-teal-accent drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] font-semibold scale-105" 
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <span className="text-sm">📓</span>
            <span className="text-[9px] tracking-wide">Journal</span>
            {activeTab === "journal" && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-teal-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          {/* Tab: Snapshot */}
          <button
            type="button"
            id="tab-btn-snapshot"
            onClick={() => handleTabClick("snapshot")}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 relative cursor-pointer ${
              activeTab === "snapshot" 
                ? "text-teal-accent drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] font-semibold scale-105" 
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <span className="text-sm">📊</span>
            <span className="text-[9px] tracking-wide">Snapshot</span>
            {activeTab === "snapshot" && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-teal-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

          {/* Tab: Toolkit */}
          <button
            type="button"
            id="tab-btn-toolkit"
            onClick={() => handleTabClick("toolkit")}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 relative cursor-pointer ${
              activeTab === "toolkit" 
                ? "text-teal-accent drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] font-semibold scale-105" 
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <span className="text-sm">🧘</span>
            <span className="text-[9px] tracking-wide">Toolkit</span>
            {activeTab === "toolkit" && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-teal-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            )}
          </button>

        </nav>

      </div>
    </div>
  );
}
