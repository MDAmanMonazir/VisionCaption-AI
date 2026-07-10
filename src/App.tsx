import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, UploadCloud, History, Settings, 
  Terminal, Shield, BrainCircuit, Bell, AlertCircle, X, Compass 
} from "lucide-react";
import { ScreenType, UploadedItem, UserSettings, CaptionStyle } from "./types";

// Import modular sub-views
import LoginView from "./components/LoginView";
import LandingView from "./components/LandingView";
import DashboardView from "./components/DashboardView";
import UploadView from "./components/UploadView";
import ProcessingView from "./components/ProcessingView";
import ResultsView from "./components/ResultsView";
import HistoryView from "./components/HistoryView";
import SettingsView from "./components/SettingsView";
import AnimatedBackground from "./components/AnimatedBackground";

// Initial Seed Data to make the dashboard look gorgeous on first boot
const INITIAL_SEED_HISTORY: UploadedItem[] = [
  {
    id: "seed-cyberpunk",
    title: "Cyberpunk Dusk City Street Still.png",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASmRQbqzWAskzb25AK_kdISWdbd0lLKJPOQ5KBUo9sivswBeWqDAlvH8GcNbyYEHRhSavcJw3Gjft4I6Jws4bqQHZi9A1MWuIX-C1mhSatAb83LbxTgb6fJH3_ZGua87tnqjae58vpL3D8EEdBXM1OoZ5rp-AxkABiAVQ4d40nj21FhRHYhZh4amHQxzzm68voniZ2BM9UwPvrh8EB3x13rXo49zO36BGM2RHfYyrhldRGscxDk2E",
    timestamp: "2026-07-09 14:22:15",
    relativeTime: "2 hours ago",
    confidence: 98.6,
    fileSize: "2.4 MB",
    format: "PNG Image",
    captions: {
      formal: {
        style: "formal",
        title: "Professional Description",
        text: "A highly detailed cinematic dusk captures of a futuristic urban cyberpunk street, showcasing architectural complexity, neon reflection, and volumetric fog aesthetics.",
        wordCount: 20,
        charCount: 154
      },
      sarcastic: {
        style: "sarcastic",
        title: "Witty Analysis",
        text: "Oh look, another wet rainy night in a futuristic neon city street. How highly original. I am absolutely sure wet asphalt was never used to flex graphics rendering before.",
        wordCount: 28,
        charCount: 172
      },
      "humorous-tech": {
        style: "humorous-tech",
        title: "Dev Humor",
        text: "POV: Your nested Tailwind CSS utility classes finally compile correctly and now the entire street looks like it's running on a high-end RTX 4090.",
        wordCount: 24,
        charCount: 158
      },
      humorous: {
        style: "humorous",
        title: "General Fun",
        text: "When you order Cyberpunk 2077 on a discount but it ends up running as an incredibly beautiful, premium screen saver on your smart refrigerator.",
        wordCount: 23,
        charCount: 155
      }
    }
  },
  {
    id: "seed-silk",
    title: "Holographic Fluid Silk Waves.png",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEiF0Y8-SwRV_8kNcYCDZ2q8ADGEsuqHYSyTV7BqsnR-TOEq99keVfVczwyQmV4Igw48r4uOerEkMLZE7O_1e3GWh-afte4e1jrVAjmSSSVJT1B0Y0HW0eIaxvYUozQPoC-kavqbMCvYiFpxcen6CgWysUZCJpJO5wrrI5Ypy9jTppMYD4lxeSWI0qeFU7cREJqDNMp1rvsR8qp-ngj4JPy0bV6Hu_oanr3bO84OKDgu9SPV6ooX0",
    timestamp: "2026-07-09 10:05:30",
    relativeTime: "6 hours ago",
    confidence: 99.2,
    fileSize: "1.8 MB",
    format: "PNG Image",
    captions: {
      formal: {
        style: "formal",
        title: "Professional Description",
        text: "Macro digital rendering showcasing organic curves and fluid silk-like ribbons in violet, pink, and orange spectrums under highly ambient backlighting.",
        wordCount: 19,
        charCount: 151
      },
      sarcastic: {
        style: "sarcastic",
        title: "Witty Analysis",
        text: "Extremely detailed digital abstract lines. It's beautiful, but I am still not entirely sure whether this is an artistic screensaver or a corporate tech logo from 2026.",
        wordCount: 26,
        charCount: 172
      },
      "humorous-tech": {
        style: "humorous-tech",
        title: "Dev Humor",
        text: "POV: Visualizing the database query executing a massive three-way table join in under 3 milliseconds without crashing the dev container.",
        wordCount: 21,
        charCount: 147
      },
      humorous: {
        style: "humorous",
        title: "General Fun",
        text: "This is what my headphones cords look like in my pocket after sitting completely still for precisely forty-five seconds.",
        wordCount: 19,
        charCount: 116
      }
    }
  },
  {
    id: "seed-space",
    title: "Deep Space Nebula Supercluster Still.png",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbnqtHryiu2B310GP0YqhLbJTmiWNDqPHESjEGHYhlw9_1naXV0JskQ5wFD94Ol4HIji0kr55W5zxNarNKUgDu8cZLjOG9MxojUDQmqu--0llFrihiCxdkGpjwuJiuL1u8aaIOjEpsYyNhjyPkEnkFnVzO9sg_fmOtJQC7afsKd7dMXgDEP5dMevFVCZTdI3HNZFzedbSozyFOiuPCAnAmgS5IxxuvaYb8ljx7K06VsyFAC0TA2W8",
    timestamp: "2026-07-08 17:40:00",
    relativeTime: "Yesterday",
    confidence: 97.4,
    fileSize: "4.1 MB",
    format: "PNG Image",
    captions: {
      formal: {
        style: "formal",
        title: "Professional Description",
        text: "A vertical atmospheric composite view showcasing vibrant stellar nursery clusters and massive hot gas dust clouds in deep space orbits.",
        wordCount: 18,
        charCount: 139
      },
      sarcastic: {
        style: "sarcastic",
        title: "Witty Analysis",
        text: "Ah yes, space nebula. Because nothing makes you appreciate your daily mortal struggles quite like staring into a massive radioactive cosmic explosion.",
        wordCount: 21,
        charCount: 153
      },
      "humorous-tech": {
        style: "humorous-tech",
        title: "Dev Humor",
        text: "POV: Staring into the server console logs when the Kubernetes cluster starts auto-healing after a critical pod memory leak.",
        wordCount: 18,
        charCount: 130
      },
      humorous: {
        style: "humorous",
        title: "General Fun",
        text: "This is exactly what happens to my kitchen microwave when I accidentally try to heat up frozen burritos with the aluminum foil wrapper still attached.",
        wordCount: 23,
        charCount: 152
      }
    }
  }
];

const DEFAULT_SETTINGS: UserSettings = {
  analyticsEnabled: true,
  language: "English",
  notificationsEnabled: true,
  userName: "Visionary User",
  userEmail: "pro_visionary_2024@visionai.io",
  tier: "PRO",
  totalUploads: 128,
  credits: 42
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    return localStorage.getItem("vc_logged_in") === "true" ? "landing" : "login";
  });
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (userName: string, userEmail: string) => {
    setSettings(prev => ({
      ...prev,
      userName: userName,
      userEmail: userEmail,
    }));
    localStorage.setItem("vc_logged_in", "true");
    setCurrentScreen("landing");
  };

  const handleLogout = () => {
    localStorage.removeItem("vc_logged_in");
    setCurrentScreen("login");
  };
  
  // Load State from LocalStorage
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("vc_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [history, setHistory] = useState<UploadedItem[]>(() => {
    const saved = localStorage.getItem("vc_history");
    return saved ? JSON.parse(saved) : INITIAL_SEED_HISTORY;
  });

  const [selectedItem, setSelectedItem] = useState<UploadedItem | null>(null);
  const [processingFile, setProcessingFile] = useState<{ name: string; size: string } | null>(null);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("vc_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("vc_history", JSON.stringify(history));
  }, [history]);

  // Audio completion sound (Web Audio API synthesis for zero-external asset reliance)
  const playSuccessChime = () => {
    if (!settings.notificationsEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.30); // C6

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio notification synthesis bypassed:", e);
    }
  };

  // Image Selection & Caption Generation API orchestration
  const handleImageSelected = async (base64Data: string, filename: string, fileSize: string) => {
    setProcessingFile({ name: filename, size: fileSize });
    setIsProcessingComplete(false);
    setCurrentScreen("processing");

    try {
      const response = await fetch("/api/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Data,
          title: filename,
        }),
      });

      if (!response.ok) {
        throw new Error("API failed to generate caption response.");
      }

      const result = await response.json();

      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

      const newItem: UploadedItem = {
        id: "img-" + Date.now(),
        title: filename,
        imageUrl: base64Data,
        timestamp: timestamp,
        relativeTime: "Just now",
        confidence: result.confidence || 98.5,
        fileSize: fileSize,
        format: filename.split(".").pop()?.toUpperCase() + " Image",
        captions: result.captions,
        isFallback: !!result.isFallback,
      };

      // Update States
      setHistory(prev => [newItem, ...prev]);
      setSelectedItem(newItem);
      
      // Deduct credits as premium transaction
      setSettings(prev => ({
        ...prev,
        credits: Math.max(0, prev.credits - 1),
        totalUploads: prev.totalUploads + 1,
      }));

      // Finish Processing
      setIsProcessingComplete(true);
      playSuccessChime();

      // Delay transition briefly so user sees 100% completion
      setTimeout(() => {
        setCurrentScreen("results");
      }, 600);

    } catch (err: any) {
      console.error("Captioning error:", err);
      setError("AI generation failed or server was unreachable. Please verify your internet connection or check server logs.");
      setCurrentScreen("upload");
    }
  };

  const handleUpdateItem = (updated: UploadedItem) => {
    setHistory(prev => prev.map(item => item.id === updated.id ? updated : item));
    if (selectedItem?.id === updated.id) {
      setSelectedItem(updated);
    }
  };

  const handleDeleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleResetDatabase = () => {
    setHistory([]);
    setSelectedItem(null);
    setSettings(prev => ({
      ...prev,
      credits: 50,
      totalUploads: 0
    }));
  };

  const handleSelectItem = (item: UploadedItem) => {
    setSelectedItem(item);
    setCurrentScreen("results");
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-x-hidden selection:bg-[#c0c1ff]/30 selection:text-white">
      {/* Dynamic ambient backdrops */}
      <AnimatedBackground />

      {/* Top Banner Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0b1326]/60 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div 
          onClick={() => { if (currentScreen !== "login") setCurrentScreen("landing"); }}
          className={`flex items-center gap-3 group ${currentScreen !== "login" ? "cursor-pointer" : ""}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#ddb7ff] p-0.5 flex items-center justify-center shadow-lg shadow-[#8083ff]/10">
            <div className="w-full h-full bg-[#0b1326] rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5.5 h-5.5 text-[#c0c1ff] group-hover:scale-105 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white block">VisionCaption <span className="text-xs font-mono text-[#c0c1ff] uppercase">AI</span></span>
            <span className="text-[9px] font-mono tracking-widest text-[#c7c4d7]/60 block uppercase">Neural Transcription Core</span>
          </div>
        </div>

        {/* Global Action items */}
        {currentScreen !== "login" && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/3 border border-white/5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#89ceff] animate-pulse"></div>
              <span className="text-[10px] font-mono text-[#c7c4d7] font-semibold uppercase">{settings.tier} ACCOUNT</span>
            </div>

            <button 
              onClick={() => setCurrentScreen("settings")}
              className="flex items-center gap-2 group text-left cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8083ff] to-[#ddb7ff] border border-white/20 overflow-hidden flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white drop-shadow-md">
                  {settings.userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          </div>
        )}
      </header>

      {/* Global Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto mt-4 px-4"
          >
            <div className="bg-red-500/10 border border-red-500/25 text-red-200 p-4 rounded-xl flex items-start gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">AI Generation Alert</p>
                <p className="opacity-90 font-light mt-0.5">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-white transition-colors cursor-pointer p-1">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Screen Layout Containers */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen + (selectedItem?.id || "")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {currentScreen === "login" && (
              <LoginView onLoginSuccess={handleLoginSuccess} />
            )}

            {currentScreen === "landing" && (
              <LandingView onGetStarted={() => setCurrentScreen("dashboard")} />
            )}

            {currentScreen === "dashboard" && (
              <DashboardView
                settings={settings}
                history={history}
                onNavigateToUpload={() => setCurrentScreen("upload")}
                onNavigateToHistory={() => setCurrentScreen("history")}
                onSelectItem={handleSelectItem}
              />
            )}

            {currentScreen === "upload" && (
              <UploadView
                onImageSelected={handleImageSelected}
                onError={(msg) => setError(msg)}
              />
            )}

            {currentScreen === "processing" && processingFile && (
              <ProcessingView
                filename={processingFile.name}
                isComplete={isProcessingComplete}
              />
            )}

            {currentScreen === "results" && selectedItem && (
              <ResultsView
                item={selectedItem}
                onUpdateItem={handleUpdateItem}
                onNavigateToUpload={() => setCurrentScreen("upload")}
              />
            )}

            {currentScreen === "history" && (
              <HistoryView
                history={history}
                onSelectItem={handleSelectItem}
                onDeleteItem={handleDeleteItem}
                onNavigateToUpload={() => setCurrentScreen("upload")}
              />
            )}

            {currentScreen === "settings" && (
              <SettingsView
                settings={settings}
                onUpdateSettings={setSettings}
                onResetDatabase={handleResetDatabase}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Futuristic Floating Navigation Dock Taskbar at Bottom */}
      {currentScreen !== "landing" && currentScreen !== "login" && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.nav 
            className="glass-bright rounded-2xl px-6 py-3 flex items-center gap-2 md:gap-4 shadow-2xl pointer-events-auto border border-white/10 shadow-[#000]/60 max-w-md w-full justify-between"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                currentScreen === "dashboard" 
                  ? "text-[#c0c1ff] bg-white/5 border border-white/5 font-semibold" 
                  : "text-[#c7c4d7]/70 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span className="text-[10px] tracking-wide">Hub</span>
            </button>

            <button
              onClick={() => setCurrentScreen("upload")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                currentScreen === "upload" || currentScreen === "processing"
                  ? "text-[#c0c1ff] bg-white/5 border border-white/5 font-semibold" 
                  : "text-[#c7c4d7]/70 hover:text-white"
              }`}
            >
              <UploadCloud className="w-4.5 h-4.5" />
              <span className="text-[10px] tracking-wide">Upload</span>
            </button>

            <button
              onClick={() => setCurrentScreen("history")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                currentScreen === "history" || currentScreen === "results"
                  ? "text-[#c0c1ff] bg-white/5 border border-white/5 font-semibold" 
                  : "text-[#c7c4d7]/70 hover:text-white"
              }`}
            >
              <History className="w-4.5 h-4.5" />
              <span className="text-[10px] tracking-wide">History</span>
            </button>

            <button
              onClick={() => setCurrentScreen("settings")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                currentScreen === "settings" 
                  ? "text-[#c0c1ff] bg-white/5 border border-white/5 font-semibold" 
                  : "text-[#c7c4d7]/70 hover:text-white"
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span className="text-[10px] tracking-wide">Settings</span>
            </button>
          </motion.nav>
        </div>
      )}
    </div>
  );
}

