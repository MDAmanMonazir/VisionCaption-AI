import React, { useState } from "react";
import { Search, Eye, Trash2, Calendar, FileText, ChevronRight } from "lucide-react";
import { UploadedItem } from "../types";

interface HistoryViewProps {
  history: UploadedItem[];
  onSelectItem: (item: UploadedItem) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToUpload: () => void;
}

export default function HistoryView({
  history,
  onSelectItem,
  onDeleteItem,
  onNavigateToUpload,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(searchLower);
    
    // Check if any of the caption texts match the search query as well!
    const captionMatch = Object.values(item.captions).some((cap) => 
      cap.text.toLowerCase().includes(searchLower)
    );

    return titleMatch || captionMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Analysis History</h1>
          <p className="text-xs text-[#c7c4d7] font-light mt-1">Review, filter, and export previously analyzed frames.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#c7c4d7]/70">TOTAL PROCESSED:</span>
          <span className="font-display font-bold text-white bg-[#8083ff]/10 border border-[#8083ff]/20 px-3 py-1 rounded-full text-sm">
            {history.length} items
          </span>
        </div>
      </div>

      {/* Search Input Box */}
      {history.length > 0 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c7c4d7]/60">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by filename or caption contents..."
            className="w-full bg-white/3 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-[#c7c4d7]/50 focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all"
          />
        </div>
      )}

      {/* History Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="glass-panel hover:bg-white/5 rounded-2xl border border-white/5 hover:border-[#c0c1ff]/30 flex flex-col justify-between overflow-hidden transition-all duration-300 group"
          >
            {/* Visual Thumbnail */}
            <div className="aspect-[16/10] bg-black relative overflow-hidden">
              <img 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                src={item.imageUrl} 
                alt={item.title} 
              />
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                <span className="text-[10px] font-mono font-bold bg-[#0b1326]/80 text-[#c0c1ff] border border-[#c0c1ff]/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  Acc: {item.confidence.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Contents info */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base truncate" title={item.title}>
                  {item.title}
                </h3>
                
                {/* Process Timestamp */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#c7c4d7]/60 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </div>

                {/* Snippet preview */}
                <p className="text-xs text-[#c7c4d7] font-light line-clamp-3 mt-3 border-t border-white/5 pt-3 leading-relaxed">
                  "{item.captions.formal.text}"
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-4">
                <button
                  onClick={() => onSelectItem(item)}
                  className="flex-1 py-2 px-3 bg-[#c0c1ff]/10 hover:bg-[#c0c1ff]/20 text-[#c0c1ff] border border-[#c0c1ff]/15 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" /> View Report
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  title="Delete from History"
                  className="p-2 bg-white/3 hover:bg-red-500/10 text-[#c7c4d7] hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty States */}
      {history.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center space-y-5 max-w-xl mx-auto border border-white/5">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#c7c4d7]/50 border border-white/5 shadow-inner">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-white">No items in your queue</h3>
            <p className="text-sm text-[#c7c4d7] font-light max-w-xs mx-auto">
              Once you upload images or video captures, your fully structured reports will automatically save here.
            </p>
          </div>
          <button
            onClick={onNavigateToUpload}
            className="gradient-btn px-6 py-2.5 rounded-full text-white font-display text-xs font-semibold flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            Upload Now <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-[#c7c4d7] font-light">
          <p>No results found matching "{searchTerm}".</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="text-xs text-[#c0c1ff] hover:underline mt-2 cursor-pointer"
          >
            Clear search filter
          </button>
        </div>
      ) : null}
    </div>
  );
}
