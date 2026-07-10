import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrainCircuit, Mail, ArrowRight, ShieldAlert, Sparkles, KeyRound, ShieldCheck, CornerUpLeft, ExternalLink, RefreshCw } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (userName: string, userEmail: string) => void;
}

type AuthStep = "enter-email" | "enter-otp";

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [step, setStep] = useState<AuthStep>("enter-email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Sandbox helper if Ethereal is used
  const [sandboxUrl, setSandboxUrl] = useState<string | null>(null);
  const [testOtp, setTestOtp] = useState<string | null>(null);
  
  // Resend OTP countdown timer
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSandboxUrl(null);
    setTestOtp(null);

    if (!email || !email.includes("@")) {
      setFormError("Please enter a valid cryptographic email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to transmit OTP security code.");
      }

      setStep("enter-otp");
      setCountdown(30); // 30 seconds wait before resend is active
      
      if (data.isTest) {
        if (data.previewUrl) {
          setSandboxUrl(data.previewUrl);
        }
        if (data.testOtp) {
          setTestOtp(data.testOtp);
        }
      }
    } catch (err: any) {
      console.error("Auth send OTP error:", err);
      setFormError(err.message || "Network error. Vision core transmission offline.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (otp.trim().length !== 6) {
      setFormError("Please enter the complete 6-digit security key.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      // Successful verification!
      onLoginSuccess(data.userName, data.email);
    } catch (err: any) {
      console.error("Auth verify OTP error:", err);
      setFormError(err.message || "Invalid or expired key. Please request a new security clearance.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFastAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess("Visionary Pilot", "pro_visionary_2026@visionai.io");
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 relative">
      {/* Background radial glow effect */}
      <div className="absolute w-[500px] h-[500px] bg-[#8083ff]/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      
      <motion.div 
        className="w-full max-w-md glass-panel rounded-[32px] p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Shimmer line indicator at top of card */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c0c1ff] to-transparent opacity-60 animate-pulse"></div>
        
        {/* Core branding representation */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8083ff] to-[#ddb7ff] p-0.5 flex items-center justify-center shadow-[0_0_25px_rgba(128,131,255,0.25)] mb-4">
            <div className="w-full h-full bg-[#0b1326] rounded-[14px] flex items-center justify-center">
              <BrainCircuit className="w-7 h-7 text-[#c0c1ff]" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Secure Vision Gate
          </h1>
          <p className="text-xs text-[#c7c4d7]/70 font-light mt-1">
            Authorize connection via dynamic secure email keys
          </p>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence>
          {formError && (
            <motion.div 
              className="mb-5 bg-red-500/10 border border-red-500/20 text-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-light"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Gateway Failure</p>
                <p className="mt-0.5 opacity-95">{formError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multi-step view handler */}
        <AnimatePresence mode="wait">
          {step === "enter-email" ? (
            <motion.form
              key="form-email"
              onSubmit={handleSendOtp}
              className="space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#c7c4d7]/70 uppercase tracking-wider block">
                  Pilot Cryptographic Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c7c4d7]/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pilot@visioncaption.ai"
                    disabled={isLoading}
                    className="w-full bg-white/3 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-[#c7c4d7]/30 focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-btn py-3.5 mt-2 rounded-xl text-white font-display text-sm font-semibold flex items-center justify-center gap-2 group cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Transmitting Authentication Key...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Verification Key</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="form-otp"
              onSubmit={handleVerifyOtp}
              className="space-y-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#c0c1ff]" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{email}</p>
                  <p className="text-[10px] text-[#c7c4d7]/70 font-light mt-0.5">Verification key dispatched</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep("enter-email"); setOtp(""); setSandboxUrl(null); setTestOtp(null); }}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-[#c0c1ff] flex items-center gap-1 cursor-pointer transition-all border border-white/5"
                >
                  <CornerUpLeft className="w-3 h-3" />
                  Edit
                </button>
              </div>

              {/* Real-time sandbox test server preview link helper */}
              {(sandboxUrl || testOtp) && (
                <motion.div 
                  className="bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 rounded-2xl p-4 space-y-2.5 text-xs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[#c0c1ff]">
                    <Sparkles className="w-3.5 h-3.5 text-[#c0c1ff] animate-pulse" />
                    <span>Development Sandbox Access</span>
                  </div>
                  <p className="text-[11px] text-[#c7c4d7]/90 leading-relaxed">
                    Ethereal sandbox is active. Retrieve your 6-digit access OTP below:
                  </p>
                  {testOtp && (
                    <div className="text-center bg-[#8083ff]/15 border border-[#8083ff]/30 py-2.5 rounded-xl text-xl font-mono font-bold tracking-widest text-white selection:bg-[#8083ff]">
                      {testOtp}
                    </div>
                  )}
                  {sandboxUrl && (
                    <a
                      href={sandboxUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-[#8083ff]/30 text-[11px]"
                    >
                      <span>Open Virtual Mailbox Inbox</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-[#c7c4d7]/70 uppercase tracking-wider block">
                    Verification Pass Key (OTP)
                  </label>
                  <span className="text-[10px] font-mono text-[#c0c1ff]">6-Digits Required</span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c7c4d7]/50" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 123456"
                    disabled={isLoading}
                    className="w-full bg-white/3 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold tracking-widest text-white placeholder-[#c7c4d7]/30 text-center focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#c7c4d7]/70 font-light px-1">
                <span>Didn't receive code?</span>
                {countdown > 0 ? (
                  <span className="text-[#c0c1ff] font-mono">Resend available in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#c0c1ff] hover:text-white font-semibold flex items-center gap-1 cursor-pointer hover:underline transition-all"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                    Resend Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-btn py-3.5 mt-2 rounded-xl text-white font-display text-sm font-semibold flex items-center justify-center gap-2 group cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authorizing Pass Key...</span>
                  </>
                ) : (
                  <>
                    <span>Decrypt & Enter Gate</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Divider line */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-y-1/2 left-0 right-0 h-[1px] bg-white/5"></div>
          <span className="relative bg-[#0b1326] px-3.5 text-[10px] font-mono tracking-widest text-[#c7c4d7]/40 uppercase">
            OR EXPLORE INSTANTLY
          </span>
        </div>

        {/* Direct Bypass Guest Login Button */}
        <button
          type="button"
          onClick={triggerFastAccess}
          disabled={isLoading}
          className="w-full py-3 bg-white/3 hover:bg-white/8 border border-white/5 hover:border-[#c0c1ff]/30 text-white font-display text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c0c1ff]" />
          Launch Guest Pilot Session
        </button>

        <p className="mt-6 text-center text-[10px] font-mono text-[#908fa0] leading-normal uppercase">
          Authorization protected by Vision Shield Security protocol v4.0.
        </p>
      </motion.div>
    </div>
  );
}
