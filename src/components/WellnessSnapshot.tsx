import React from "react";
import { JournalEntry, MoodType, StressTrigger } from "../types";
import { INDIAN_ACHIEVERS_QUOTES, MOODS_CONFIG } from "../data";
import { TrendingUp, Flame, Star, Quote as QuoteIcon, Heart } from "lucide-react";

interface WellnessSnapshotProps {
  entries: JournalEntry[];
  selectedTriggers: StressTrigger[];
  selectedMood: MoodType | null;
}

export default function WellnessSnapshot({
  entries,
  selectedTriggers,
  selectedMood,
}: WellnessSnapshotProps) {
  // 1. Get daily motivational quote refreshed based on local day
  const getDailyQuote = () => {
    const day = new Date().getDate();
    const index = day % INDIAN_ACHIEVERS_QUOTES.length;
    return INDIAN_ACHIEVERS_QUOTES[index];
  };

  const quote = getDailyQuote();

  // 2. Calculate streak counter based on journal entries + today's check-in
  const calculateStreak = () => {
    // Collect all unique dates (YYYY-MM-DD format)
    const dates = new Set<string>();
    
    entries.forEach((e) => {
      dates.add(e.date.split("T")[0]);
    });
    
    if (selectedMood) {
      dates.add(new Date().toISOString().split("T")[0]);
    }

    if (dates.size === 0) return 0;

    const sortedDates = Array.from(dates).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;
    let expectedDate = new Date(); // Start checking from today
    
    // If today is not in set, check if yesterday is in set to keep streak alive
    const todayStr = expectedDate.toISOString().split("T")[0];
    let checkDateStr = todayStr;
    
    if (!dates.has(todayStr)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      if (dates.has(yesterdayStr)) {
        checkDateStr = yesterdayStr;
        expectedDate = yesterday;
      } else {
        return 0; // Streak is broken
      }
    }

    // Now count backwards
    while (true) {
      const currentExpectedStr = expectedDate.toISOString().split("T")[0];
      if (dates.has(currentExpectedStr)) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1); // Go back 1 day
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // 3. Calculate most common stress trigger this week
  const getCommonTrigger = () => {
    const counts: Record<string, number> = {};
    
    // Add triggers from home check-in
    selectedTriggers.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1.5; // Weight current trigger slightly more
    });

    // Add triggers from past 7 days of journal entries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    entries.forEach((e) => {
      if (new Date(e.date) >= sevenDaysAgo) {
        // Since original entry doesn't explicitly have triggers array in core prompt, 
        // we saved triggers alongside entry, or we parse from matching words in text.
        // Let's assume entry structure maps the mood. We can associate mood triggers.
        e.triggers?.forEach((t) => {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });

    const entriesList = Object.entries(counts);
    if (entriesList.length === 0) return null;

    entriesList.sort((a, b) => b[1] - a[1]);
    return entriesList[0][0] as StressTrigger;
  };

  const commonTrigger = getCommonTrigger();

  // 4. Mood Mapping to values for Chart
  const moodValues: Record<MoodType, number> = {
    "Overwhelmed": 1,
    "Anxious": 2,
    "Okay": 3,
    "Hopeful": 4,
    "Good": 5,
  };

  const moodColors: Record<MoodType, string> = {
    "Overwhelmed": "bg-amber-accent/80",
    "Anxious": "bg-violet-accent/80",
    "Okay": "bg-gray-500/80",
    "Hopeful": "bg-teal-accent/80",
    "Good": "bg-emerald-400/80",
  };

  const moodEmojis: Record<MoodType, string> = {
    "Overwhelmed": "😔",
    "Anxious": "😟",
    "Okay": "😐",
    "Hopeful": "🙂",
    "Good": "😊",
  };

  // Compile 7 days data for the chart: Monday through Sunday or Last 7 days
  const prepareChartData = () => {
    const data: { label: string; value: number; mood: MoodType | null; emoji: string }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });

      // Find if we have a journal entry or check-in for this date
      let foundMood: MoodType | null = null;
      
      const entryOnDate = entries.find((e) => e.date.split("T")[0] === dateStr);
      if (entryOnDate) {
        foundMood = entryOnDate.mood;
      } else if (i === 0 && selectedMood) {
        foundMood = selectedMood;
      }

      data.push({
        label: dayName,
        value: foundMood ? moodValues[foundMood] : 0,
        mood: foundMood,
        emoji: foundMood ? moodEmojis[foundMood] : "•",
      });
    }
    return data;
  };

  const chartData = prepareChartData();

  return (
    <div className="space-y-6 animate-fadeIn" id="stats-section">
      {/* Header */}
      <div className="text-center md:text-left space-y-1 mt-4">
        <h2 className="text-2xl font-serif text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
          <TrendingUp className="text-violet-accent" size={20} />
          My Wellness Snapshot
        </h2>
        <p className="text-sm text-gray-400">
          A gentle space to reflect on your trends and patterns. No competitive ranks, just steady growth.
        </p>
      </div>

      {/* Streak and Focus Indicators inside two side-by-side micro cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak card */}
        <div className="glass-card p-4 rounded-xl flex flex-col justify-between space-y-2">
          <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
            Consistency
          </span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-serif text-teal-accent">
              {streak}
            </span>
            <span className="text-xs text-gray-400">days</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            {streak > 0 
              ? "You've checked in in a row 🌱" 
              : "No check-in today yet 🌱"}
          </p>
        </div>

        {/* Trigger card */}
        <div className="glass-card p-4 rounded-xl flex flex-col justify-between space-y-2">
          <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
            Main Stressor
          </span>
          <div className="pt-1">
            {commonTrigger ? (
              <span className="inline-block text-[10px] font-semibold bg-violet-accent/15 border border-violet-accent/20 text-violet-accent px-2 py-1 rounded-lg truncate max-w-full">
                {commonTrigger}
              </span>
            ) : (
              <span className="text-xs text-gray-400 italic">No heavy items</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            {commonTrigger ? "Occupying your mind most." : "Your space is calm."}
          </p>
        </div>
      </div>

      {/* Mood Chart (CSS-only column chart) */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            7-Day Mood Trend
          </h3>
          <div className="flex gap-2 items-center text-[9px] text-gray-500">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Good</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-accent rounded-full" /> Heavy</span>
          </div>
        </div>

        {/* CSS Chart Area */}
        <div className="h-40 flex items-end justify-between pt-6 px-1 border-b border-white/5 relative">
          {/* Subtle grid lines background overlay */}
          <div className="absolute inset-x-0 top-6 h-[1px] bg-white/[0.02]" />
          <div className="absolute inset-x-0 top-16 h-[1px] bg-white/[0.02]" />
          <div className="absolute inset-x-0 top-26 h-[1px] bg-white/[0.02]" />

          {chartData.map((d, index) => {
            const hasData = d.value > 0;
            const heightPercent = hasData ? (d.value / 5) * 100 : 8; // min visible block

            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Mood Tag Hover / Emoji */}
                <div className="mb-2 text-sm leading-none transition-transform duration-300 group-hover:scale-125 select-none">
                  {d.emoji}
                </div>

                {/* Animated Chart Bar Column */}
                <div
                  className={`w-4 sm:w-6 rounded-t-md transition-all duration-700 ${
                    hasData 
                      ? `${moodColors[d.mood!]} ${
                          d.mood === "Good" || d.mood === "Hopeful" ? "shadow-[0_0_8px_rgba(56,189,248,0.2)]" : ""
                        }` 
                      : "bg-white/[0.03] border border-dashed border-white/5"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Day label */}
                <span className="text-[10px] text-gray-500 font-mono mt-2 font-medium">
                  {d.label}
                </span>

                {/* Hover Tooltip card detail */}
                {hasData && (
                  <div className="absolute -top-6 bg-dark-bg border border-white/10 rounded px-1.5 py-0.5 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-mono shadow-lg whitespace-nowrap">
                    {d.mood}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Quote refreshed daily from Indian Achievers */}
      <div className="glass-card p-6 rounded-2xl bg-gradient-to-r from-violet-accent/[0.02] to-teal-accent/[0.02] border-violet-accent/10 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-violet-accent/10">
          <QuoteIcon size={36} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart size={12} className="text-violet-accent fill-violet-accent/20" />
            <span className="text-[10px] font-semibold text-violet-accent uppercase tracking-wider">
              Today's Focus Suggestion
            </span>
          </div>
          
          <p className="text-xs text-gray-200 italic leading-relaxed font-serif">
            "{quote.text}"
          </p>

          <div className="pt-1.5 border-t border-white/5 flex flex-col">
            <span className="text-[10px] font-semibold text-white">
              — {quote.author}
            </span>
            <span className="text-[8px] text-gray-400 font-mono">
              {quote.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
