import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, FileVideo, Sparkles, Languages, Heading, 
  Image as ImageIcon, Play, Pause, AlertTriangle, 
  Film, ArrowRight, CheckCircle, Info, Clock, RotateCcw
} from "lucide-react";

interface UploadViewProps {
  onImageSelected: (base64Data: string, filename: string, fileSize: string) => void;
  onError: (msg: string) => void;
}

interface ChallengeVideo {
  id: string;
  title: string;
  url: string;
  duration: string;
  durationSeconds: number;
  size: string;
  description: string;
  thumbnail: string;
}

// 4 gorgeous royalty-free short clips strictly between 30s and 2 minutes in duration
const CHALLENGE_LIBRARY: ChallengeVideo[] = [
  {
    id: "starry-aurora",
    title: "Cosmic Aurora Borealis",
    url: "https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-aurora-borealis-over-mountains-44023-large.mp4",
    duration: "45s",
    durationSeconds: 45,
    size: "3.4 MB",
    description: "Starry vibrant night sky with aurora borealis waving above cosmic mountain ridges.",
    thumbnail: "🌌"
  },
  {
    id: "tokyo-rain",
    title: "Cyberpunk Tokyo Refraction",
    url: "https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-street-signs-reflected-on-wet-asphalt-43183-large.mp4",
    duration: "1m 00s",
    durationSeconds: 60,
    size: "4.8 MB",
    description: "Futuristic neon light from colorful signs reflecting on wet asphalt during rain.",
    thumbnail: "🌆"
  },
  {
    id: "misty-forest",
    title: "Overhead Forest Canopy",
    url: "https://assets.mixkit.co/videos/preview/mixkit-drone-shot-of-a-dense-forest-with-mist-42792-large.mp4",
    duration: "35s",
    durationSeconds: 35,
    size: "2.8 MB",
    description: "Mysterious drone flyover of a dense green redwood forest covered in slow moving fog.",
    thumbnail: "🌲"
  },
  {
    id: "dark-coder",
    title: "Cyber Developer Coding",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-keyboard-in-the-dark-44021-large.mp4",
    duration: "1m 30s",
    durationSeconds: 90,
    size: "6.1 MB",
    description: "Close up view of programmer hands typing code commands furiously in a dark glowing terminal room.",
    thumbnail: "⌨️"
  }
];

export default function UploadView({ onImageSelected, onError }: UploadViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoName, setActiveVideoName] = useState<string>("");
  const [activeVideoSize, setActiveVideoSize] = useState<string>("");
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync state with HTML5 Video element events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [activeVideoUrl]);

  // Handle uploaded/dropped files
  const handleFile = (file: File) => {
    if (!file) return;
    setValidationError(null);

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      setValidationError("Invalid file format. Please upload a video clip (.mp4, .webm) or an image frame.");
      return;
    }

    if (isVideo) {
      // Validate duration first
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.src = URL.createObjectURL(file);
      
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        const sec = videoElement.duration;
        
        // Strictly 30 seconds to 2 minutes check
        if (sec < 30 || sec > 120) {
          const readableSec = sec.toFixed(1);
          setValidationError(
            `Duration Limit Violation: This clip is ${readableSec}s. Video clips must be strictly between 30 seconds and 2 minutes in length.`
          );
          onError(`Video clip is outside the permitted 30s - 2m range (Got ${readableSec}s).`);
          return;
        }

        // Accept the video
        const readableSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        setActiveVideoUrl(URL.createObjectURL(file));
        setActiveVideoName(file.name);
        setActiveVideoSize(readableSize);
        setIsPlaying(false);
      };

      videoElement.onerror = () => {
        setValidationError("Failed to read the video clip metadata. Please ensure it is a valid encoded MP4 or WebM video.");
      };
    } else if (isImage) {
      // Accept standard image right away as snapshot frame
      const readableSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onImageSelected(base64, file.name, readableSize);
      };
      reader.onerror = () => {
        onError("Failed to read the uploaded image frame.");
      };
      reader.readAsDataURL(file);
    }
  };

  const selectChallengeVideo = (video: ChallengeVideo) => {
    setValidationError(null);
    setActiveVideoUrl(video.url);
    setActiveVideoName(video.title + " (Challenge Clip)");
    setActiveVideoSize(video.size);
    setIsPlaying(false);
    
    // Auto-scroll to workspace for smooth user guidance
    setTimeout(() => {
      videoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  const handleAnalyzeFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setIsAnalyzing(true);
    
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not construct 2D graphics context.");

      // Scale canvas to match the native aspect ratio of the video
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 450;

      // Draw active frame onto canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Export as High quality JPEG Data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      
      const roundedTime = currentTime.toFixed(1);
      const outputFilename = `${activeVideoName.replace(/\s+/g, "_")}_frame_at_${roundedTime}s.jpg`;

      // Dispatch to main caption flow
      setTimeout(() => {
        setIsAnalyzing(false);
        onImageSelected(dataUrl, outputFilename, activeVideoSize || "1.5 MB");
      }, 700);

    } catch (err: any) {
      console.error("Frame capture error:", err);
      setIsAnalyzing(false);
      onError("Failed to capture the current video frame. If using a custom remote video, check CORS compliance.");
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay/play blocked by browser sandbox rules:", err);
      });
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      
      {/* Header section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8083ff]/10 border border-[#8083ff]/20 text-xs text-[#c0c1ff] font-mono">
          <Film className="w-3.5 h-3.5" />
          <span>FIREWORKS AI CAPTION CHALLENGE</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
          Short Video Summarizer
        </h1>
        <p className="text-sm md:text-base text-[#c7c4d7] max-w-2xl mx-auto font-light leading-relaxed">
          Evaluate multi-style captions for video clips strictly between <strong className="text-white font-medium">30 seconds and 2 minutes</strong>. Choose from our pre-compiled challenge set or drop your own.
        </p>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-200 p-4 rounded-2xl flex items-start gap-3 shadow-xl max-w-3xl mx-auto">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Duration Rule Blocked</p>
            <p className="opacity-95 font-light mt-0.5">{validationError}</p>
          </div>
          <button 
            onClick={() => setValidationError(null)} 
            className="text-red-400 hover:text-white transition-colors cursor-pointer text-xs uppercase font-mono tracking-wider font-bold"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* FIXED CHALLENGE VIDEO LIBRARY GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c0c1ff]" />
            <span>Select From Fixed Challenge Clips (30s - 2m)</span>
          </h3>
          <span className="text-[10px] font-mono text-[#c7c4d7]/60">LLM-JUDGE COMPLIANT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHALLENGE_LIBRARY.map((video) => {
            const isActive = activeVideoUrl === video.url;
            return (
              <button
                key={video.id}
                onClick={() => selectChallengeVideo(video)}
                className={`glass-panel p-5 rounded-2xl text-left border transition-all duration-300 relative group cursor-pointer flex flex-col justify-between h-48 hover:-translate-y-1 ${
                  isActive 
                    ? "border-[#c0c1ff] bg-white/5 ring-1 ring-[#c0c1ff]/30 shadow-[0_10px_25px_rgba(128,131,255,0.15)]" 
                    : "border-white/5 hover:border-white/15 hover:bg-white/3"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{video.thumbnail}</span>
                    <span className="text-[10px] font-mono bg-[#c0c1ff]/10 text-[#c0c1ff] px-2 py-0.5 rounded-md border border-[#c0c1ff]/15 font-semibold">
                      {video.duration}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white line-clamp-1 group-hover:text-[#c0c1ff] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-[#c7c4d7]/70 font-light mt-1.5 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] font-mono text-[#908fa0]">
                  <span>SIZE: {video.size}</span>
                  <span className="text-[#c0c1ff] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    LOAD CLIP <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE MOUNTED WORKSPACE */}
      {activeVideoUrl ? (
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6 relative overflow-hidden">
          
          {/* Header metadata bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 flex items-center justify-center text-xl">
                🎬
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base truncate max-w-[320px]">
                  {activeVideoName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#c7c4d7]/70 font-mono">
                  <span>SIZE: {activeVideoSize}</span>
                  <span>•</span>
                  <span className="text-[#89ceff]">VALID TIMELINE DURATION</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveVideoUrl(null);
                setValidationError(null);
              }}
              className="px-4 py-2 bg-white/3 hover:bg-white/8 border border-white/5 rounded-xl text-xs text-[#c7c4d7] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Workspace
            </button>
          </div>

          {/* Interactive Player Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="aspect-[16/9] bg-black rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl group">
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  className="w-full h-full object-contain"
                  playsInline
                />
                
                {/* Big play button overlay */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white shadow-2xl"
                  >
                    <Play className="w-6 h-6 fill-current ml-1 text-[#c0c1ff]" />
                  </button>
                )}
              </div>

              {/* Advanced Timeline Playback Controls */}
              <div className="bg-[#12192a]/60 border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#c7c4d7]">
                  <span className="text-[#c0c1ff] font-bold">TIMELINE INTERPOLATION</span>
                  <span>{formatTime(currentTime)} / {formatTime(duration || 0)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5 cursor-pointer active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleTimelineChange}
                    className="flex-1 accent-[#c0c1ff] h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Stage Side Panel: Instructions & Capture CTA */}
            <div className="lg:col-span-4 space-y-4 h-full flex flex-col justify-between">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-[#c0c1ff] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Interactive Analyzer</span>
                </div>
                
                <p className="text-xs text-[#c7c4d7] leading-relaxed font-light">
                  Scrub the video timeline and pause on your target clip sequence. The Fireworks AI judge evaluates how effectively you capture context across the four required style personas:
                </p>

                <div className="space-y-2 text-[11px] font-mono text-[#c7c4d7]/90">
                  <div className="flex items-center gap-2 bg-white/3 p-2 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#89ceff]"></span>
                    <span>Formal Summary</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/3 p-2 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff80b0]"></span>
                    <span>Sarcastic Commentary</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/3 p-2 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ddb7ff]"></span>
                    <span>Humorous Tech Tone</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/3 p-2 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                    <span>Humorous Non-Tech Tone</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleAnalyzeFrame}
                  disabled={isAnalyzing}
                  className="w-full gradient-btn py-4 rounded-2xl text-white font-display text-sm font-semibold flex items-center justify-center gap-2 group cursor-pointer active:scale-95 disabled:opacity-50 shadow-lg shadow-[#8083ff]/20"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Capturing frame & summarizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Multi-Style Caption</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-[#908fa0] font-mono uppercase">
                  Generates 4 distinct style summaries
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DRAG AND DROP MANUAL ENTRY ZONE */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`glass-panel rounded-3xl p-8 md:p-14 border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all duration-300 relative overflow-hidden group ${
            isDragging 
              ? "border-[#c0c1ff] bg-white/5 shadow-[0_0_30px_rgba(192,193,255,0.15)]" 
              : "border-[#c0c1ff]/30 hover:border-[#c0c1ff]/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="video/*,image/*"
            className="hidden"
          />

          {/* Ambient background shimmer */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"></div>

          {/* Moving Cloud/Video Icon */}
          <div className="relative w-24 h-24 mb-2 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
            <div className="absolute inset-0 bg-[#c0c1ff]/10 rounded-full blur-xl scale-125 animate-pulse"></div>
            <div className="relative bg-[#222a3d]/80 w-20 h-20 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
              <Upload className="w-10 h-10 text-[#c0c1ff]" />
            </div>
          </div>

          <div className="text-center space-y-2 z-10">
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">Upload Video or Image</h2>
            <p className="text-sm text-[#c7c4d7] font-light max-w-sm">
              Drag & drop a short video clip (30s to 2m) or a high-quality visual frame snapshot to start.
            </p>
          </div>

          <div className="flex gap-3 z-10">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="gradient-btn px-8 py-3.5 rounded-full text-white font-display text-sm font-semibold flex items-center gap-2 group cursor-pointer active:scale-95"
            >
              <FileVideo className="w-4 h-4" />
              Browse Media Files
            </button>
          </div>

          {/* Formats support details */}
          <div className="flex flex-col items-center gap-3 pt-5 border-t border-white/5 w-full max-w-md z-10">
            <div className="flex flex-wrap justify-center gap-2 text-[10px] font-mono tracking-wider font-semibold">
              <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] px-3 py-1 rounded-full border border-[#c0c1ff]/15">MP4 / WEBM (30S - 2M)</span>
              <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] px-3 py-1 rounded-full border border-[#c0c1ff]/15">PNG</span>
              <span className="bg-[#c0c1ff]/10 text-[#c0c1ff] px-3 py-1 rounded-full border border-[#c0c1ff]/15">JPEG</span>
            </div>
            <p className="text-[11px] text-[#908fa0] font-mono">CORS compliant video files supported.</p>
          </div>
        </div>
      )}

      {/* Offscreen Canvas for Keyframe Extraction */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Supporting Bento cards at the bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-[#89ceff]/10 rounded-xl text-[#89ceff] border border-[#89ceff]/15">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Fine-Tuned Evaluator</p>
            <p className="text-xs text-[#c7c4d7] mt-1 font-light leading-relaxed">
              Utilizing Fireworks AI API to evaluate the summarization styles with precision and correctness.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-[#ddb7ff]/10 rounded-xl text-[#ddb7ff] border border-[#ddb7ff]/15">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Four Persona Matrix</p>
            <p className="text-xs text-[#c7c4d7] mt-1 font-light leading-relaxed">
              Strictly exports Formal Summary, Sarcastic, Humorous Tech, and Humorous Non-Tech.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-[#c0c1ff]/10 rounded-xl text-[#c0c1ff] border border-[#c0c1ff]/15">
            <Heading className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Strict Timeline Constraints</p>
            <p className="text-xs text-[#c7c4d7] mt-1 font-light leading-relaxed">
              Validation guards prevent files below 30 seconds or above 2 minutes from polluting your submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
