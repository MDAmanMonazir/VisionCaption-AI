import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

interface ProcessingViewProps {
  filename: string;
  isComplete: boolean;
}

export default function ProcessingView({ filename, isComplete }: ProcessingViewProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Extracting Frame Pixels",
    "Detecting Objects and Spatial Depth",
    "Analyzing Atmospheric Mood & Lighting",
    "Running Serverless Gemini Transformer",
    "Generating Custom Stylized Personas"
  ];

  useEffect(() => {
    // Animate progress up to 98% during processing
    let timer: any;
    if (!isComplete) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            clearInterval(timer);
            return 98;
          }
          const increment = Math.random() * 4 + 1;
          const next = Math.min(prev + increment, 98);
          
          // Map progress to steps
          const stepIndex = Math.floor((next / 100) * steps.length);
          setCurrentStep(Math.min(stepIndex, steps.length - 1));
          
          return next;
        });
      }, 100);
    } else {
      setProgress(100);
      setCurrentStep(steps.length - 1);
    }

    return () => clearInterval(timer);
  }, [isComplete]);

  return (
    <div className="max-w-xl mx-auto py-12 flex flex-col items-center text-center space-y-10">
      
      {/* Hologram Pulse Circle */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glowing orbit circles */}
        <div className="absolute inset-0 bg-[#8083ff]/5 rounded-full blur-2xl scale-125 animate-pulse"></div>
        <div className="absolute inset-1 border border-dashed border-[#c0c1ff]/20 rounded-full animate-spin [animation-duration:15s]"></div>
        <div className="absolute inset-4 border border-dashed border-[#ddb7ff]/30 rounded-full animate-spin [animation-duration:10s] [animation-direction:reverse]"></div>
        
        {/* Pulsing ring */}
        <div className="absolute inset-8 rounded-full border-2 border-[#8083ff]/30 glow-active animate-ping opacity-30"></div>
        
        {/* Inner glass orb */}
        <div className="relative w-36 h-36 rounded-full glass-bright flex flex-col items-center justify-center border border-[#c0c1ff]/30">
          <span className="font-display text-4xl md:text-5xl font-extrabold text-white leading-none tracking-tighter">
            {Math.floor(progress)}%
          </span>
          <span className="text-[10px] font-mono text-[#c0c1ff] uppercase tracking-widest mt-2">PROCESSING</span>
        </div>
      </div>

      {/* Progress details */}
      <div className="w-full space-y-3 px-4">
        <div className="flex justify-between items-center text-xs font-mono text-[#c7c4d7]">
          <span className="truncate max-w-[250px]">{filename}</span>
          <span className="text-[#c0c1ff]">VISION SHIELD ACTIVE</span>
        </div>
        
        {/* High-contrast Glow Progress Bar */}
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full bg-gradient-to-r from-[#8083ff] to-[#ddb7ff] rounded-full transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute -right-1 top-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
          </div>
        </div>
      </div>

      {/* Checklist list */}
      <div className="w-full glass-panel rounded-2xl p-6 text-left border border-white/5 space-y-4 max-w-md">
        <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-2">Analysis Steps</h3>
        
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isDone = progress >= ((idx + 1) / steps.length) * 100 || isComplete;
            const isCurrent = currentStep === idx && !isDone;

            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isDone ? "text-[#c7c4d7]/50" : isCurrent ? "text-white font-medium" : "text-[#c7c4d7]/30"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#89ceff] flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4.5 h-4.5 text-[#c0c1ff] animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4.5 h-4.5 flex-shrink-0" />
                )}
                <span className="text-xs font-sans truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-[#908fa0] font-mono">
        Estimated remaining time: {Math.max(0, Math.ceil((100 - progress) * 0.05))}s
      </div>
    </div>
  );
}
