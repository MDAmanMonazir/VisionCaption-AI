import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Shield, Sliders, Bell, Sparkles, Check, CheckCircle2, RefreshCw, LogOut } from "lucide-react";
import { UserSettings } from "../types";

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (updated: UserSettings) => void;
  onResetDatabase: () => void;
  onLogout: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetDatabase,
  onLogout,
}: SettingsViewProps) {
  const [userName, setUserName] = useState(settings.userName);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleToggleNotify = () => {
    onUpdateSettings({
      ...settings,
      notificationsEnabled: !settings.notificationsEnabled,
    });
  };

  const handleToggleAnalytics = () => {
    onUpdateSettings({
      ...settings,
      analyticsEnabled: !settings.analyticsEnabled,
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({
      ...settings,
      language: e.target.value,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    onUpdateSettings({
      ...settings,
      userName: userName.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const triggerReset = () => {
    if (confirm("Are you sure you want to clear your local database? This will remove all your processed image captions.")) {
      setIsResetting(true);
      setTimeout(() => {
        onResetDatabase();
        setIsResetting(false);
      }, 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">System Settings</h1>
        <p className="text-xs text-[#c7c4d7] font-light mt-1">Configure profile, active language models, and storage rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left side: Profile and preferences form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* User Profile Form */}
          <form onSubmit={handleSaveProfile} className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-2">
              <User className="w-5 h-5 text-[#c0c1ff]" />
              <h2 className="font-display text-base font-bold text-white">Profile Identity</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-[#c7c4d7]/70 uppercase tracking-wider block mb-1.5">User Handle</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white/3 border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#c0c1ff]"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#c7c4d7]/70 uppercase tracking-wider block mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={settings.userEmail}
                  className="w-full bg-white/1 border border-white/5 opacity-50 rounded-xl py-2.5 px-3.5 text-sm text-[#c7c4d7] cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="gradient-btn px-6 py-2.5 rounded-xl font-semibold text-xs text-white flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    {saveSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                    {saveSuccess ? "Profile Updated!" : "Update Identity"}
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/20 text-[#c7c4d7] hover:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
                <span className="text-[10px] font-mono text-[#c7c4d7]/50">ACCOUNT ID: VC-99882</span>
              </div>
            </div>
          </form>

          {/* Preferences and toggles */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-2">
              <Sliders className="w-5 h-5 text-[#ddb7ff]" />
              <h2 className="font-display text-base font-bold text-white">Control Panel Settings</h2>
            </div>

            <div className="space-y-4">
              {/* Language Selector */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-medium text-white block">System Translation Language</span>
                  <span className="text-xs text-[#c7c4d7] font-light">Sets caption target translation model translation.</span>
                </div>
                <select
                  value={settings.language}
                  onChange={handleLanguageChange}
                  className="bg-[#131b2e] border border-white/10 text-xs rounded-xl py-2 px-3 text-white focus:outline-none focus:border-[#c0c1ff]"
                >
                  <option value="English">English (United States)</option>
                  <option value="Spanish">Español (España)</option>
                  <option value="German">Deutsch (Deutschland)</option>
                  <option value="Japanese">日本語 (日本)</option>
                </select>
              </div>

              {/* Push Alerts toggle */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <span className="text-sm font-medium text-white block">System Sound Alerts</span>
                  <span className="text-xs text-[#c7c4d7] font-light">Play ambient notification sound upon caption analysis completion.</span>
                </div>
                <button
                  onClick={handleToggleNotify}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    settings.notificationsEnabled ? "bg-[#c0c1ff]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`bg-[#0b1326] w-4 h-4 rounded-full shadow-md transform duration-300 ${
                      settings.notificationsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Analytics toggle */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <span className="text-sm font-medium text-white block">Enable Analytics</span>
                  <span className="text-xs text-[#c7c4d7] font-light">Allow anonymous usage data collection to improve AI models.</span>
                </div>
                <button
                  onClick={handleToggleAnalytics}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-pointer ${
                    settings.analyticsEnabled ? "bg-[#c0c1ff]" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`bg-[#0b1326] w-4 h-4 rounded-full shadow-md transform duration-300 ${
                      settings.analyticsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Subscription and Cloud Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Subscription Card */}
          <div className="glass-bright rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-[#c0c1ff]/10">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#8083ff]/10 blur-[50px] rounded-full"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono bg-[#c0c1ff]/15 text-[#c0c1ff] border border-[#c0c1ff]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  {settings.tier} LEVEL
                </span>
                <span className="text-sm font-mono text-[#c7c4d7]/70">PRO-2026</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white">Visionary Pro</h3>
                <p className="text-xs text-[#c7c4d7] font-light mt-1">Unlimited access to serverless high-accuracy vision nodes.</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-mono text-[#c7c4d7]/70 block">PLAN PRICE</span>
                <span className="font-display text-lg font-bold text-white">$0 / forever</span>
              </div>
              <span className="text-[10px] font-mono text-[#89ceff]">RENEWAL: 01 AUG 2026</span>
            </div>
          </div>

          {/* Cloud Diagnostics */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3 mb-1">
              <Shield className="w-5 h-5 text-[#89ceff]" />
              <h2 className="font-display text-base font-bold text-white">Engine Diagnostics</h2>
            </div>

            <div className="space-y-3 text-[11px] font-mono text-[#c7c4d7]">
              <div className="flex justify-between">
                <span>VISION MODEL</span>
                <span className="text-white">Fireworks</span>
              </div>
              <div className="flex justify-between">
                <span>PROXY GATEWAY</span>
                <span className="text-[#89ceff] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SECURE HANDSHAKE
                </span>
              </div>
              <div className="flex justify-between">
                <span>LATENCY SLA</span>
                <span className="text-white">&lt; 1.5 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>API TOKEN EXPIRE</span>
                <span className="text-[#ddb7ff] font-semibold">NEVER EXPIRES</span>
              </div>
            </div>
          </div>

          {/* Database Reset */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
            <p className="text-xs text-[#c7c4d7] font-light">Clearing the local cache deletes all item caption reports permanently.</p>
            <button
              onClick={triggerReset}
              className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isResetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              Clear Database Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
