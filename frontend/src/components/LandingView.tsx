import { motion } from "motion/react";
import { ArrowRight, BrainCircuit, Sparkles, Zap, ChevronRight, Play } from "lucide-react";

interface LandingViewProps {
  onGetStarted: () => void;
}

export default function LandingView({ onGetStarted }: LandingViewProps) {
  return (
    <div className="relative min-h-[90vh]">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-6 md:px-16 py-16 relative">
        <div className="absolute -top-10 w-80 h-80 bg-[#8083ff]/10 blur-[100px] rounded-full"></div>
        
        <motion.h1 
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-5xl leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Unveil the Soul of Your Imagery with <span className="gradient-text">VisionCaption AI</span>
        </motion.h1>

        <motion.p 
          className="text-base md:text-xl text-[#c7c4d7] max-w-3xl mb-10 leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Harness the power of neural architecture to generate AI-powered captions in multiple styles—from poetic and descriptive to precise and technical.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 items-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            onClick={onGetStarted}
            className="gradient-btn px-8 py-4 rounded-xl font-display text-lg text-white font-medium cursor-pointer active:scale-95 flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-[#dae2fd] font-medium flex items-center gap-2 group cursor-pointer active:scale-95"
          >
            View Showcase 
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Hero Image/Graphic */}
        <motion.div 
          className="mt-16 w-full max-w-5xl glass-panel rounded-2xl p-3 overflow-hidden shadow-2xl relative group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="aspect-[16/9] w-full rounded-xl bg-[#131b2e] relative overflow-hidden">
            <img 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-102" 
              alt="Futuristic UI dashboard"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASJX3k7-F3COBjNwLI1SxOvZcay_FzxLoo9J-HJ_2EBH3g7eETrfva7yD58L7kmyTPO96ntM_UWOEpCR6KdL-opGVZjImhFEQG2c5QBIK-GFyU2GnjpOuE6qMMOiPh7kEFk-shrfqYB-Sx8G8YHRM1tmFr0iXgNU_3VghqWBIeyb7Co8j9ruj4WeLtoyXU4UEAaibnm8u9gOpgfHzrTRC-CLyzBX8uuCxW5_wdaGpqPu8JkHkwn7s"
            />
            <div 
              onClick={onGetStarted}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <div className="glass-panel p-6 rounded-full bg-white/5 shadow-2xl active:scale-90 transition-transform">
                <Play className="w-8 h-8 text-[#c0c1ff] fill-[#c0c1ff]" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Technological Edge</h2>
          <p className="text-[#c7c4d7] font-light">Built on the foundation of next-generation vision transformers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            className="glass-panel p-8 rounded-2xl group hover:border-[#c0c1ff]/30 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#c0c1ff]/10 flex items-center justify-center mb-6 text-[#c0c1ff]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">AI Analysis</h3>
            <p className="text-[#c7c4d7] text-sm leading-relaxed font-light">
              Beyond simple recognition. Our models understand spatial relationships, lighting nuances, and emotional context within every frame.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            className="glass-panel p-8 rounded-2xl group hover:border-[#ddb7ff]/30 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#ddb7ff]/10 flex items-center justify-center mb-6 text-[#ddb7ff]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">Multi-Style Captions</h3>
            <p className="text-[#c7c4d7] text-sm leading-relaxed font-light">
              Tailor your voice. Choose between social-media trendy, professional documentation, or poetic narratives at the click of a button.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            className="glass-panel p-8 rounded-2xl group hover:border-[#89ceff]/30 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#89ceff]/10 flex items-center justify-center mb-6 text-[#89ceff]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-[#c7c4d7] text-sm leading-relaxed font-light">
              Optimized for real-time throughput. Process high-resolution images with zero latency on our serverless compute clusters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 md:px-16 bg-[#131b2e]/30 rounded-3xl mb-24 border border-white/5 mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <span className="font-display text-xs text-[#c0c1ff] uppercase tracking-[0.2em] mb-4 block font-medium">The Workflow</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">From Pixels to Prose</h2>
            
            <div className="relative space-y-12 pl-12">
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#c0c1ff] to-[#ddb7ff] opacity-20"></div>
              
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[54px] top-0 w-10 h-10 rounded-full bg-[#0b1326] border border-[#c0c1ff] flex items-center justify-center z-10 shadow-[0_0_15px_rgba(192,193,255,0.15)]">
                  <span className="font-bold text-sm text-[#c0c1ff]">1</span>
                </div>
                <h4 className="font-display text-lg font-semibold mb-2">Upload Image</h4>
                <p className="text-[#c7c4d7] text-sm font-light">Drop your image, paste image URLs, or capture high-fidelity mockups. We handle standard image and video still assets.</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[54px] top-0 w-10 h-10 rounded-full bg-[#0b1326] border border-[#c0c1ff] flex items-center justify-center z-10 shadow-[0_0_15px_rgba(192,193,255,0.15)]">
                  <span className="font-bold text-sm text-[#c0c1ff]">2</span>
                </div>
                <h4 className="font-display text-lg font-semibold mb-2">Neural Extraction</h4>
                <p className="text-[#c7c4d7] text-sm font-light">Fireworks vision networks analyze semantic layout, objects, atmospheric mood, and depth fields simultaneously.</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[54px] top-0 w-10 h-10 rounded-full bg-[#0b1326] border border-[#c0c1ff] flex items-center justify-center z-10 shadow-[0_0_15px_rgba(192,193,255,0.15)]">
                  <span className="font-bold text-sm text-[#c0c1ff]">3</span>
                </div>
                <h4 className="font-display text-lg font-semibold mb-2">Review & Customize</h4>
                <p className="text-[#c7c4d7] text-sm font-light">Inspect and copy four distinct stylized caption personas: Professional, Sarcastic, Humorous, and Developer Humour.</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-[#8083ff]/10 blur-3xl opacity-30 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative glass-panel p-2 rounded-2xl overflow-hidden aspect-[4/5]">
              <img 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl" 
                alt="Futuristic neon astronaut still"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJYr52HAWuVTSLUNXNI8Vs-CZNKxAko9O2zMxOAgPX1Fwo5kOsQ4tpMZy2nd1GcEvXlmlvGyOTevz9tFDJg4ymyXDutlLtgV_qw0VBaTvSWI-kyK4hv1mACOnwq4-D7fgZsHRD4m8AIOEkhGN7P7mf_D0oX88QxL1t-jCztRjsR6ZY-DKPN6zPpz3FSFFRNWUpJPXWLi1hrFGYLUkZ_PYhqqFPOxuvRluRgLyZ2z_4Vmq5DrY6DEk"
              />
              {/* Process Overlays */}
              <div className="absolute top-8 right-8 flex flex-col gap-2">
                <div className="glass-panel px-4 py-2 rounded-full text-xs animate-pulse border-[#c0c1ff]/30 text-[#c0c1ff] font-mono">Analyzing context...</div>
                <div className="glass-panel px-4 py-2 rounded-full text-xs delay-75 animate-pulse border-[#ddb7ff]/30 text-[#ddb7ff] font-mono">Luminescence detected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-16 px-6 md:px-16 text-center relative overflow-hidden mb-24 max-w-6xl mx-auto">
        <div className="glass-panel p-12 md:p-16 rounded-[40px] relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8083ff]/5 to-[#6f00be]/5 opacity-50"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Ready to redefine your visual library?</h2>
            <p className="text-[#c7c4d7] mb-10 text-base md:text-lg font-light">
              Join thousands of content creators, developers, and designers automated with instant, smart vision captioning.
            </p>
            <button 
              onClick={onGetStarted}
              className="gradient-btn px-10 py-5 rounded-2xl font-display text-lg text-white font-medium cursor-pointer active:scale-95"
            >
              Start for Free
            </button>
            <p className="mt-4 text-xs text-[#908fa0] opacity-80">No registration fees. Powered by server-side AMD DEVELOPER PROGRAM.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
