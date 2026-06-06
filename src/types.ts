export type MoodType = "Overwhelmed" | "Anxious" | "Okay" | "Hopeful" | "Good";

export interface MoodConfig {
  label: MoodType;
  emoji: string;
  color: string; // Tailwind color class or hex (e.g. teal-accent)
  bgGlow: string; // Tailwind glow class
}

export type StressTrigger = 
  | "Syllabus pressure"
  | "Fear of failure"
  | "Comparison with peers"
  | "Sleep issues"
  | "Family expectations"
  | "Result anxiety";

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  content: string;
  mood: MoodType;
  triggers: StressTrigger[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string
}

export interface Quote {
  text: string;
  author: string;
  role: string; // e.g. "JEE Topper", "Civil Servant", "Inspiring Leader"
}
