import React, { useState, useEffect } from "react";
import { GROUNDING_STEPS, EMERGENCY_CONTACTS } from "../data";
import { Wind, HelpCircle, Hourglass, Phone, Play, Pause, RotateCcw, ChevronRight, PhoneCall, Heart } from "lucide-react";

export default function ReliefToolkit() {
  // --- STATE 1: Box Breathing (4-4-4-4) ---
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "holdFull" | "exhale" | "holdEmpty">("inhale");
  const [breathingSec, setBreathingSec] = useState(4);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathingSec((prev) => {
          if (prev <= 1) {
            // Switch phases
            setBreathingPhase((currentPhase) => {
              switch (currentPhase) {
                case "inhale": return "holdFull";
                case "holdFull": return "exhale";
                case "exhale": return "holdEmpty";
                case "holdEmpty": return "inhale";
              }
            });
            return 4; // reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathingSec(4);
      setBreathingPhase("inhale");
    }
    return () => clearInterval(timer);
  }, [breathingActive]);

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case "inhale": return "Breathe In deeply... fill your lungs";
      case "holdFull": return "Hold and feel the expansion";
      case "exhale": return "Breathe Out slowly... let go";
      case "holdEmpty": return "Rest here before the next breath";
    }
  };

  const getCircleScale = () => {
    if (!breathingActive) return "scale-100";
    switch (breathingPhase) {
      case "inhale":
        // Gradually expands as breathingSec counts down from 4 to 1
        return `scale-${100 + (4 - breathingSec) * 10}`;
      case "holdFull":
        return "scale-140";
      case "exhale":
        // Shrinks as breathingSec counts down
        return `scale-${140 - (4 - breathingSec) * 10}`;
      case "holdEmpty":
        return "scale-100";
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case "inhale": return "border-teal-accent text-teal-accent shadow-[0_0_20px_rgba(56,189,248,0.3)]";
      case "holdFull": return "border-violet-accent text-violet-accent shadow-[0_0_20px_rgba(167,139,250,0.3)]";
      case "exhale": return "border-amber-accent text-amber-accent shadow-[0_0_20px_rgba(251,191,36,0.3)]";
      case "holdEmpty": return "border-gray-500 text-gray-500";
    }
  };

  // --- STATE 2: Grounding (5-4-3-2-1) ---
  const [groundingStep, setGroundingStep] = useState(0);

  // --- STATE 3: Rest Break Timer ---
  const [timerDuration, setTimerDuration] = useState(5); // 5, 10, or 20 min
  const [timeLeft, setTimeLeft] = useState(300); // in seconds
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(timerDuration * 60);
  }, [timerDuration]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerDuration * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="toolkit-section">
      {/* Header Info */}
      <div className="text-center md:text-left space-y-1 mt-4">
        <h2 className="text-2xl font-serif text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
          <Wind className="text-teal-accent" size={20} />
          Quick Relief Toolkit
        </h2>
        <p className="text-sm text-gray-400">
          When stress gets heavy, anchor yourself instantly using these curated physical and cognitive exercises.
        </p>
      </div>

      {/* Grid of 4 Cards */}
      <div className="space-y-6">

        {/* CARD 1: Box Breathing */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden flex flex-col items-center">
          <div className="flex items-center gap-2 self-start mb-4">
            <span className="p-1 rounded-lg bg-teal-accent/10 border border-teal-accent/20">
              <Wind size={14} className="text-teal-accent" />
            </span>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              1. Box Breathing (4-4-4-4)
            </h3>
          </div>

          <div className="py-6 flex flex-col items-center justify-center space-y-6 w-full">
            {/* Circle guide */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Animated Ripple ring */}
              <div 
                className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 transform ${getCircleScale()} ${getPhaseColor()}`}
              />
              
              {/* Inner Circle Content */}
              <div className="text-center z-10 flex flex-col items-center select-none justify-center">
                <span className="text-2xl font-serif font-bold text-white leading-none">
                  {breathingActive ? breathingSec : "4"}
                </span>
                <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider mt-1">
                  {breathingActive ? breathingPhase : "Phase"}
                </span>
              </div>
            </div>

            {/* Instruction Label */}
            <div className="h-8 text-center px-4">
              <p className="text-xs text-gray-300 font-medium">
                {breathingActive ? getBreathingInstruction() : "Relax your shoulders. Tap code to initiate."}
              </p>
            </div>

            {/* Control Button */}
            <button
              id="breathing-trigger-btn"
              type="button"
              onClick={() => setBreathingActive(!breathingActive)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-md ${
                breathingActive 
                  ? "bg-white/10 hover:bg-white/15 text-white" 
                  : "bg-teal-accent text-dark-bg hover:opacity-95"
              }`}
            >
              {breathingActive ? "Stop Breathing Guide" : "Start Box Breathing"}
            </button>
          </div>
        </div>

        {/* CARD 2: Grounding Exercise */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1 rounded-lg bg-violet-accent/10 border border-violet-accent/20">
              <HelpCircle size={14} className="text-violet-accent" />
            </span>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              2. 5-4-3-2-1 Grounding
            </h3>
          </div>

          {/* Senses step flow */}
          <div className="bg-dark-bg/40 p-4 rounded-xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-lg font-serif text-violet-accent font-bold">
                Step {GROUNDING_STEPS[groundingStep].step}
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                {groundingStep + 1} of 5 Senses
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white">
                {GROUNDING_STEPS[groundingStep].title}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {GROUNDING_STEPS[groundingStep].instruction}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-gray-600 italic">
                {GROUNDING_STEPS[groundingStep].placeholder}
              </span>
              <button
                type="button"
                id="next-grounding-step-btn"
                onClick={() => setGroundingStep((prev) => (prev + 1) % 5)}
                className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-violet-accent font-medium text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                Next Step
                <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: Study Break Timer */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1 rounded-lg bg-amber-accent/10 border border-amber-accent/20">
              <Hourglass size={14} className="text-amber-accent" />
            </span>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              3. Study Break Timer
            </h3>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-[11px] text-gray-400 text-center max-w-[280px]">
              "Rest is productive." Stepping back for a few minutes rejuvenates your neural networks for better memory retention.
            </div>

            {/* Selector Options */}
            <div className="flex gap-2">
              {[5, 10, 20].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  id={`timer-option-${mins}`}
                  onClick={() => {
                    setTimerDuration(mins);
                    setTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                    timerDuration === mins
                      ? "bg-amber-accent/10 border-amber-accent text-amber-accent shadow-[0_0_10px_rgba(251,191,36,0.15)]"
                      : "bg-white/5 border-transparent text-gray-400 hover:border-white/10"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Action Frame */}
            <div className="flex items-center gap-4 bg-dark-bg/40 px-5 py-3 rounded-2xl border border-white/5 w-full justify-between max-w-xs">
              <span className={`text-2xl font-mono text-white ${timerRunning ? "animate-pulse" : ""}`}>
                {formatTimer(timeLeft)}
              </span>

              <div className="flex gap-2">
                {/* Play/Pause */}
                <button
                  type="button"
                  id="timer-play-pause-btn"
                  onClick={toggleTimer}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors"
                >
                  {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                {/* Reset */}
                <button
                  type="button"
                  id="timer-reset-btn"
                  onClick={resetTimer}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {timeLeft === 0 && (
              <span className="text-[11px] font-semibold text-emerald-400 animate-pulse text-center">
                ✨ Pause complete. Welcome back, refreshed. Take it slow.
              </span>
            )}
          </div>
        </div>

        {/* CARD 4: Emergency Contacts */}
        <div className="glass-card p-5 rounded-2xl bg-gradient-to-br from-dark-bg to-red-400/[0.01]">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
              <Phone size={14} className="text-emerald-400" />
            </span>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              4. Support Helplines
            </h3>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            If you ever feel overwhelmed to the point of desperation, please remember: **Talking helps. Always.** You carry a heavy load, and people want to support you.
          </p>

          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((c, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center justify-between"
              >
                <div className="space-y-1 pr-2">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {c.info}
                  </p>
                  <span className="block text-[8px] text-gray-500 font-mono">
                    {c.timing}
                  </span>
                </div>

                <a
                  href={`tel:${c.number}`}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-emerald-400/15 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/25 transition-all text-xs"
                  title={`Call ${c.name}`}
                >
                  <PhoneCall size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
