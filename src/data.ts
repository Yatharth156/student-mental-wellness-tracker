import { Quote, StressTrigger, MoodConfig } from "./types";

export const STRESS_TRIGGERS: StressTrigger[] = [
  "Syllabus pressure",
  "Fear of failure",
  "Comparison with peers",
  "Sleep issues",
  "Family expectations",
  "Result anxiety"
];

export const MOODS_CONFIG: MoodConfig[] = [
  { label: "Overwhelmed", emoji: "😔", color: "text-amber-accent", bgGlow: "glow-amber" },
  { label: "Anxious", emoji: "😟", color: "text-violet-accent", bgGlow: "glow-violet" },
  { label: "Okay", emoji: "😐", color: "text-gray-400", bgGlow: "border-gray-500/40" },
  { label: "Hopeful", emoji: "🙂", color: "text-teal-accent", bgGlow: "glow-teal" },
  { label: "Good", emoji: "😊", color: "text-emerald-400", bgGlow: "glow-teal" }, // soft glow
];

export const INDIAN_ACHIEVERS_QUOTES: Quote[] = [
  {
    text: "Your performance in a few exam papers does not define you. What counts is your perseverance and willingness to adapt and rise.",
    author: "Dr. APJ Abdul Kalam",
    role: "Former President & Scientist"
  },
  {
    text: "Preparation is a marathon, not a sprint. Remember to care for your mind; a calm brain retains twice as much as a stressed one.",
    author: "Ananya Singh",
    role: "UPSC CSE Topper"
  },
  {
    text: "Rest is not wasted time. Downtime is where my brain processed all the tough Physics formulas. Sleep was my secret JEE superpower.",
    author: "Chirag Falor",
    role: "JEE Advanced AIR 1"
  },
  {
    text: "I used to take a 15-minute walk every evening to disconnect from competitive peer chatter. Preserving your peace is key to long-term progress.",
    author: "Akalpa G.",
    role: "NEET Top Ranker"
  },
  {
    text: "Do not view breaks as procrastination. Stepping away is essential code for cognitive rejuvenation. Progress is made in quiet steady steps.",
    author: "Rishabh K.",
    role: "CAT 100 Percentiler & IIMA Alumnus"
  },
  {
    text: "Your well-being is the foundation on which your dreams are built. Keep your health, both mental and physical, at the absolute center.",
    author: "Sudha Murty",
    role: "Author & Chairperson"
  },
  {
    text: "Competitive exam prep teaches you resilience. That resilience is worth infinitely more than any singular test score.",
    author: "Sarthak Agarwal",
    role: "CBSE Class 12 Topper"
  }
];

export const GROUNDING_STEPS = [
  {
    step: 5,
    title: "5 things you can SEE",
    instruction: "Look around you. Notice five things in your immediate room. A pen, a book, your desk, a patch of light, a shadow. Try to notice the fine details of each item.",
    placeholder: "Look carefully..."
  },
  {
    step: 4,
    title: "4 things you can TOUCH",
    instruction: "Physically touch four things. The texture of your shirt, the cool metal on your table, the rough edge of a paper, the firm floor beneath your feet.",
    placeholder: "Experience each texture..."
  },
  {
    step: 3,
    title: "3 things you can HEAR",
    instruction: "Silence your mind and notice three separate sounds. The hum of a fan, birds chirping outside, distant traffic, or your own slow breathing.",
    placeholder: "Listen closely..."
  },
  {
    step: 2,
    title: "2 things you can SMELL",
    instruction: "Focus on smelling two things. Perhaps the smell of rain, book pages, a pencil eraser, tea, or simple fresh air.",
    placeholder: "Inhale slowly..."
  },
  {
    step: 1,
    title: "1 thing you can TASTE",
    instruction: "Focus on one taste. The leftover flavor of your tea/coffee, mint, or simply sit with the neutral state of your tongue.",
    placeholder: "Sit with this taste..."
  }
];

export const EMERGENCY_CONTACTS = [
  {
    name: "iCall India Helpline",
    number: "9152987821",
    info: "Empathetic, free counseling run by TISS Mumbai.",
    timing: "Mon - Sat: 10 AM to 8 PM"
  },
  {
    name: "Vandrevala Foundation",
    number: "18602662345",
    info: "24/7 free, confidential mental health helpline with trained counselors.",
    timing: "Available 24 hours, 7 days a week"
  },
  {
    name: "NIMHANS Mental Health Helpline",
    number: "08046110007",
    info: "National Institute of Mental Health 24/7 toll-free helpline.",
    timing: "Available 24 hours"
  }
];
