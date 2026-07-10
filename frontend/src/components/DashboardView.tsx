import { motion } from "motion/react";
import { UploadCloud, Clock, HardDrive, ShieldCheck, Cpu, Play, Wifi, ArrowRight } from "lucide-react";
import { UploadedItem, UserSettings } from "../types";

interface DashboardViewProps {
  settings: UserSettings;
  history: UploadedItem[];
  onNavigateToUpload: () => void;
  onNavigateToHistory: () => void;
  onSelectItem: (item: UploadedItem) => void;
}

export default function DashboardView({
  settings,
  history,
  onNavigateToUpload,
  onNavigateToHistory,
  onSelectItem,
}: DashboardViewProps) {
  // Take top 3 items for "Recent Uploads"
  const recentItems = history.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero greeting and statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-bright rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#8083ff]/10 blur-[80px] rounded-full"></div>
          
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {settings.userName}!</h2>
            <p className="text-sm text-[#c7c4d7] max-w-md font-light">
              Your serverless FireWorks models are fully configured and ready. You have {history.filter(i => i.confidence < 95).length || 1} pending reviews.
            </p>
          </div>

          <div className="flex gap-8 mt-6 border-t border-white/5 pt-6">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#c7c4d7] uppercase tracking-widest font-mono">Total Videos</span>
              <span className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#c0c1ff] leading-none mt-1">
                {settings.totalUploads + history.length}
              </span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-8">
              <span className="text-[11px] text-[#c7c4d7] uppercase tracking-widest font-mono">Credits Left</span>
              <span className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#ddb7ff] leading-none mt-1">
                {settings.credits}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Bento upload card */}
        <div 
          onClick={onNavigateToUpload}
          className="glass rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer border border-white/5 hover:border-[#c0c1ff]/30 transition-all duration-300 relative overflow-hidden min-h-[220px]"
        >
          <div className="absolute inset-0 bg-[#8083ff]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#8083ff]/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(128,131,255,0.15)] group-hover:shadow-[0_0_25px_rgba(128,131,255,0.3)]">
            <UploadCloud className="w-8 h-8 text-[#c0c1ff]" />
          </div>
          <h3 className="font-display text-lg font-bold text-white mb-1">New Upload</h3>
          <p className="text-xs text-[#c7c4d7] max-w-[200px] font-light">Drag, drop, or select files to generate multi-style captions instantly.</p>
        </div>
      </div>

      {/* Recent captions queue */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Recent Captions</h2>
          <button 
            onClick={onNavigateToHistory}
            className="text-xs text-[#c0c1ff] hover:text-[#ddb7ff] font-mono tracking-wider transition-colors cursor-pointer"
          >
            SEE ALL ({settings.totalUploads + history.length} ITEMS)
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recentItems.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="glass-panel hover:bg-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer border border-white/5 hover:border-[#c0c1ff]/30 transition-all duration-300"
              whileHover={{ y: -1 }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 relative">
                  <img 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                    src={item.imageUrl} 
                    alt={item.title} 
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-semibold truncate text-sm md:text-base">{item.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-[#c7c4d7]/70">{item.relativeTime}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] border border-[#c0c1ff]/10">
                      Vision Acc: {item.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[#c0c1ff] opacity-0 group-hover:opacity-100 transition-opacity pr-2 hidden md:block">
                <span className="text-xs font-mono tracking-wider flex items-center gap-1">VIEW RESULT <ArrowRight className="w-3 h-3" /></span>
              </div>
            </motion.div>
          ))}

          {recentItems.length === 0 && (
            <div className="glass-panel rounded-2xl p-12 text-center text-[#c7c4d7] font-light">
              <p className="mb-2">No captions analyzed yet.</p>
              <button 
                onClick={onNavigateToUpload}
                className="text-xs text-[#c0c1ff] hover:underline"
              >
                Upload your first image to begin
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Diagnostics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <div className="glass rounded-2xl p-4 flex flex-col justify-between min-h-[100px]">
          <span className="text-xs text-[#c7c4d7] font-mono uppercase tracking-wider">Storage Used</span>
          <div className="mt-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#c0c1ff] rounded-full" style={{ width: "35%" }}></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] text-[#c7c4d7] font-mono">
              <span>1.75 GB / 5 GB</span>
              <span>35%</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 flex items-center justify-between min-h-[100px]">
          <div className="space-y-1">
            <span className="text-xs text-[#c7c4d7] font-mono uppercase tracking-wider block">Avg. Speed</span>
            <span className="font-display text-xl font-bold text-white">1.2s / img</span>
          </div>
          <Clock className="w-6 h-6 text-[#89ceff] opacity-60" />
        </div>

        <div className="glass rounded-2xl p-4 flex items-center justify-between min-h-[100px]">
          <div className="space-y-1">
            <span className="text-xs text-[#c7c4d7] font-mono uppercase tracking-wider block">Vision model</span>
            <span className="font-display text-xl font-bold text-white">99.8%</span>
          </div>
          <ShieldCheck className="w-6 h-6 text-[#ddb7ff] opacity-60" />
        </div>

        <div className="glass rounded-2xl p-4 flex items-center justify-between min-h-[100px]">
          <div className="space-y-1">
            <span className="text-xs text-[#c7c4d7] font-mono uppercase tracking-wider block">Edge Network</span>
            <span className="font-display text-xl font-bold text-white">Stable</span>
          </div>
          <Wifi className="w-6 h-6 text-[#c0c1ff] opacity-60" />
        </div>
      </section>
    </div>
  );
}

