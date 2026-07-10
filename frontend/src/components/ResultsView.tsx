import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Copy, Check, Download, Edit2, Save, X, RefreshCw,
  BookOpen, Ghost, Terminal, Sparkles, AlertCircle
} from "lucide-react";
import { UploadedItem, CaptionStyle, CaptionData } from "../types";

interface ResultsViewProps {
  item: UploadedItem;
  onUpdateItem: (updatedItem: UploadedItem) => void;
  onNavigateToUpload: () => void;
}

export default function ResultsView({ item, onUpdateItem, onNavigateToUpload }: ResultsViewProps) {
  const [editingStyle, setEditingStyle] = useState<CaptionStyle | null>(null);
  const [editText, setEditText] = useState("");
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopyStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleDownloadSingle = (caption: CaptionData) => {
    const blob = new Blob([`${caption.title}\n\n${caption.text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caption-${caption.style}-${item.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    let content = `VISIONCAPTION AI REPORT\n`;
    content += `Asset Title: ${item.title}\n`;
    content += `Analyzed At: ${item.timestamp}\n`;
    content += `AI Classification Confidence: ${item.confidence.toFixed(1)}%\n`;
    content += `=========================================\n\n`;

    Object.values(item.captions).forEach((cap) => {
      content += `${cap.title.toUpperCase()} (${cap.style.toUpperCase()})\n`;
      content += `${cap.text}\n`;
      content += `Stats: ${cap.wordCount} words, ${cap.charCount} chars\n`;
      content += `-----------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `captions-report-${item.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEdit = (style: CaptionStyle, currentText: string) => {
    setEditingStyle(style);
    setEditText(currentText);
  };

  const saveEdit = (style: CaptionStyle) => {
    if (!editText.trim()) return;

    const updatedCaptions = { ...item.captions };
    const targetCaption = updatedCaptions[style];

    updatedCaptions[style] = {
      ...targetCaption,
      text: editText,
      wordCount: editText.split(/\s+/).filter(Boolean).length,
      charCount: editText.length,
    };

    onUpdateItem({
      ...item,
      captions: updatedCaptions,
    });

    setEditingStyle(null);
  };

  const getStyleIcon = (style: CaptionStyle) => {
    switch (style) {
      case "formal":
        return <BookOpen className="w-5 h-5 text-[#89ceff]" />;
      case "sarcastic":
        return <Ghost className="w-5 h-5 text-[#ff80b0]" />;
      case "humorous-tech":
        return <Terminal className="w-5 h-5 text-[#ddb7ff]" />;
      case "humorous":
        return <Sparkles className="w-5 h-5 text-[#c0c1ff]" />;
    }
  };

  const getStyleColor = (style: CaptionStyle) => {
    switch (style) {
      case "formal":
        return "border-[#89ceff]/20 hover:border-[#89ceff]/40 bg-[#89ceff]/2";
      case "sarcastic":
        return "border-[#ff80b0]/20 hover:border-[#ff80b0]/40 bg-[#ff80b0]/2";
      case "humorous-tech":
        return "border-[#ddb7ff]/20 hover:border-[#ddb7ff]/40 bg-[#ddb7ff]/2";
      case "humorous":
        return "border-[#c0c1ff]/20 hover:border-[#c0c1ff]/40 bg-[#c0c1ff]/2";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">

      {/* Fallback Banner */}
      {item.isFallback && (
        <div className="lg:col-span-12 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl p-5 flex items-start gap-4 shadow-lg shadow-[#f59e0b]/2">
          <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-display font-bold text-[#fbcfe8] text-sm">High AI Service Demand (Auto-Mitigated)</h4>
            <p className="text-[#c7c4d7] font-light mt-1.5 leading-relaxed">
              FireWorks is currently experiencing a temporary surge in global demand. To keep your workspace active and uninterrupted, our high-fidelity custom summarizer has processed your content and mapped contextually aligned style personas.
            </p>
          </div>
        </div>
      )}

      {/* Left side: Uploaded image and AI Confidence info */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel rounded-2xl p-3 overflow-hidden shadow-xl border border-white/5">
          <div className="aspect-[4/3] w-full rounded-xl bg-black relative overflow-hidden group">
            <img
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
              src={item.imageUrl}
              alt={item.title}
            />
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#c7c4d7]/70 uppercase tracking-widest block">AI Classification Confidence</span>
            <span className="font-display text-2xl font-bold text-white flex items-center gap-2">
              {item.confidence.toFixed(1)}% <span className="text-xs text-[#89ceff] font-mono font-medium">(EXCELLENT)</span>
            </span>
          </div>
          {/* Circular progress display */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" className="stroke-white/5 fill-none" strokeWidth="4" />
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-[#c0c1ff] fill-none transition-all duration-1000"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 24}
                strokeDashoffset={2 * Math.PI * 24 * (1 - item.confidence / 100)}
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-[#c0c1ff]">Vision</span>
          </div>
        </div>

        {/* Media Metadata */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-3 font-mono text-xs text-[#c7c4d7]">
          <h3 className="font-display font-bold text-white uppercase tracking-wider text-sm border-b border-white/5 pb-2">Asset Details</h3>
          <div className="flex justify-between">
            <span>FILE NAME</span>
            <span className="text-white text-right truncate max-w-[200px]">{item.title}</span>
          </div>
          <div className="flex justify-between">
            <span>PROCESSED AT</span>
            <span className="text-white text-right">{item.timestamp}</span>
          </div>
          <div className="flex justify-between">
            <span>FILE SIZE</span>
            <span className="text-white text-right">{item.fileSize || "1.2 MB"}</span>
          </div>
          <div className="flex justify-between">
            <span>FORMAT</span>
            <span className="text-white text-right">{item.format || "PNG Still Frame"}</span>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onNavigateToUpload}
            className="flex-1 py-3 px-5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold text-sm flex items-center justify-center gap-2 text-white active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Upload New
          </button>

          <button
            onClick={handleDownloadAll}
            className="flex-1 py-3 px-5 rounded-xl gradient-btn font-semibold text-sm flex items-center justify-center gap-2 text-white active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download All Report
          </button>
        </div>
      </div>

      {/* Right side: 4 style caption cards */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h2 className="font-display text-xl font-bold text-white">Generated Style Personas</h2>
          <span className="text-[10px] font-mono bg-[#8083ff]/10 text-[#c0c1ff] border border-[#8083ff]/20 px-2.5 py-0.5 rounded-full uppercase">
            4 active styles
          </span>
        </div>

        {Object.entries(item.captions).map(([styleKey, caption]) => {
          const isEditing = editingStyle === styleKey;
          const style = styleKey as CaptionStyle;

          return (
            <motion.div
              key={style}
              className={`glass-panel rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${getStyleColor(style)}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                {/* Header card info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      {getStyleIcon(style)}
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-white">
                        {style === "formal" && "Formal Summary"}
                        {style === "sarcastic" && "Sarcastic Commentary"}
                        {style === "humorous-tech" && "Humorous Tech Tone"}
                        {style === "humorous" && "Humorous Non-Tech Tone"}
                      </h4>
                      <p className="text-[10px] text-[#c7c4d7]/70 font-mono tracking-wider">{caption.title.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Actions bar */}
                  {!isEditing && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startEdit(style, caption.text)}
                        title="Edit Caption"
                        className="p-2 text-[#c7c4d7]/70 hover:text-white bg-white/3 hover:bg-white/8 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadSingle(caption)}
                        title="Download Caption Txt"
                        className="p-2 text-[#c7c4d7]/70 hover:text-white bg-white/3 hover:bg-white/8 rounded-lg transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(caption.text, style)}
                        title="Copy Caption"
                        className={`p-2 bg-white/3 rounded-lg transition-all cursor-pointer ${copyStates[style] ? "text-[#89ceff] bg-[#89ceff]/10" : "text-[#c7c4d7]/70 hover:text-white hover:bg-white/8"
                          }`}
                      >
                        {copyStates[style] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Body paragraph */}
                {isEditing ? (
                  <div className="space-y-3 mb-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full bg-[#131b2e]/60 border border-[#c0c1ff]/30 focus:border-[#c0c1ff] focus:outline-none focus:ring-1 focus:ring-[#c0c1ff] rounded-xl p-3 text-sm text-white font-sans font-light resize-y"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingStyle(null)}
                        className="py-1.5 px-3 border border-white/10 rounded-lg text-xs font-semibold text-[#c7c4d7] hover:bg-white/5 active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(style)}
                        className="py-1.5 px-3 bg-[#c0c1ff] hover:bg-[#c0c1ff]/90 text-[#0b1326] rounded-lg text-xs font-bold active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-sans text-white/90 leading-relaxed font-light mb-4">
                    "{caption.text}"
                  </p>
                )}
              </div>

              {/* Word count metrics in footers */}
              {!isEditing && (
                <div className="flex items-center gap-4 border-t border-white/5 pt-3 mt-1 text-[10px] font-mono text-[#c7c4d7]/60">
                  <span className="flex items-center gap-1">WORD COUNT: <strong className="text-white font-medium">{caption.wordCount}</strong></span>
                  <span className="flex items-center gap-1">CHARACTERS: <strong className="text-white font-medium">{caption.charCount}</strong></span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
