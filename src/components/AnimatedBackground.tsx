import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate deterministic random positions to avoid hydration mismatch and make layout consistent
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 2.5 + 1.5, // 1.5px to 4px
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 4, // 4s to 8s
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#080d1a]">
      {/* Dynamic ambient color nodes (Slow infinite drifting orbs) */}
      <motion.div
        className="absolute w-[45vw] h-[45vw] md:w-[35vw] md:h-[35vw] rounded-full bg-indigo-600/10 blur-[120px]"
        animate={{
          x: ["-10%", "30%", "-10%"],
          y: ["-5%", "25%", "-5%"],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "5%" }}
      />

      <motion.div
        className="absolute w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] rounded-full bg-purple-600/8 blur-[140px]"
        animate={{
          x: ["15%", "-15%", "15%"],
          y: ["35%", "5%", "35%"],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "10%", right: "5%" }}
      />

      <motion.div
        className="absolute w-[35vw] h-[35vw] rounded-full bg-fuchsia-600/6 blur-[110px]"
        animate={{
          x: ["20%", "-20%", "20%"],
          y: ["-10%", "15%", "-10%"],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "40%", left: "35%" }}
      />

      {/* Cyberpunk grid overlay to represent neural layout */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gentle horizontal vignette/scrolling speed lines for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a] via-transparent to-[#080d1a] opacity-80" />

      {/* Twinkling cyber micro-particles / network node intersections */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-[#c0c1ff] to-white shadow-[0_0_8px_rgba(192,193,255,0.5)]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            opacity: [0.15, 0.85, 0.15],
            scale: [0.8, 1.25, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
