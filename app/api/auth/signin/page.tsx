"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

// ⚠️ Update these import paths to match your project structure
import VoiceOrb from "@/components/VoiceOrb";
import { GrabIcon } from "lucide-react";

const MotionLink = motion(Link);

// --- Loading Screen ---
const SignInLoadingScreen = () => (
  <div style={{ backgroundColor: "#0A0A0F", height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 1.2, ease: "easeInOut", repeat: 1 }}
    >
      <EmberOrbIcon size={40} />
    </motion.div>
  </div>
);

// --- Main Content Component ---
function SignInContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Redirect if authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/app");
    }
  }, [status, router]);

  if (status === "loading") return <SignInLoadingScreen />;
  if (status === "authenticated") return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/app" });
  };

  // Motion variants supporting prefers-reduced-motion
  const transition = (duration: number, delay: number, ease: any = "easeOut") => ({
    duration: shouldReduceMotion ? 0.15 : duration,
    delay: shouldReduceMotion ? delay / 2 : delay, // Compress timeline if reduced
    ease: shouldReduceMotion ? "linear" : ease,
  });

  return (
    <main style={{ backgroundColor: "#0A0A0F", minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      
      {/* Background Elements */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={transition(0.4, 0)}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        {/* Radial Glow */}
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={transition(0.6, 0, [0.0, 0.0, 0.2, 1])} // power2.out equivalent
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "1200px",
            height: "1000px",
            background: "radial-gradient(ellipse 600px 500px at 50% 50%, rgba(232, 96, 44, 0.07) 0%, transparent 70%)",
            zIndex: 0,
            pointerEvents: "none"
          }}
        />
        <GrabIcon />
        
        {/* Voice Orb (Hidden on mobile via CSS class or media query wrapper) */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={transition(0.8, 0.1)}
            className="hidden sm:block"
            style={{ position: "fixed", top: "8vh", left: "50%", transform: "translateX(-50%) scale(0.7)", pointerEvents: "none", zIndex: 0 }}
          >
            <VoiceOrb />
          </motion.div>
        )}
      </motion.div>

      {/* Back Link */}
      <MotionLink
        href="/"
        className="group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition(0.3, 0.1)}
        style={{
          position: "fixed", top: "24px", left: "28px", zIndex: 10,
          display: "flex", alignItems: "center", gap: "6px",
          fontFamily: "'DM Mono', monospace", fontSize: "11px",
          textTransform: "uppercase", letterSpacing: "0.10em",
          color: "rgba(245,237,214,0.28)", textDecoration: "none",
          transition: "color 150ms"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#E8602C")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,237,214,0.28)")}
      >
        <span style={{ transition: "transform 150ms" }} className="group-hover:-translate-x-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </span>
        Back
      </MotionLink>

      {/* Card */}
      <motion.div
        initial={{ y: shouldReduceMotion ? 0 : 20, opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={transition(0.5, 0.2, [0.19, 1, 0.22, 1])} // expo.out equivalent
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(245, 237, 214, 0.03)",
          border: "1px solid rgba(245, 237, 214, 0.09)",
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(232, 96, 44, 0.04) inset, 0 32px 80px rgba(0, 0, 0, 0.5)",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
        }}
        className="p-[40px_24px] sm:p-[48px_40px] m-6"
      >
        {/* Logo Block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: shouldReduceMotion ? 0 : 0.35 }}
          >
            <EmberOrbIcon size={36} />
          </motion.div>
          <div style={{ overflow: "hidden", marginTop: "16px" }}>
            <motion.h1
              initial={{ y: shouldReduceMotion ? 0 : "100%" }}
              animate={{ y: 0 }}
              transition={transition(0.4, 0.45, [0.19, 1, 0.22, 1])}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", color: "#F5EDD6", letterSpacing: "0.06em", margin: 0, lineHeight: 1 }}
            >
              VoiceBite
            </motion.h1>
          </div>
        </div>

        {/* Divider 1 */}
        <motion.hr
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={transition(0.4, 0.55, "easeInOut")}
          style={{
            height: "1px", border: "none", margin: "0 0 28px 0",
            background: "linear-gradient(90deg, transparent 0%, rgba(245,237,214,0.12) 30%, rgba(232,96,44,0.20) 50%, rgba(245,237,214,0.12) 70%, transparent 100%)"
          }}
        />

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
          {[
            { icon: <MicIcon />, title: "Voice-first cooking", sub: "Search recipes and control timers hands-free" },
            { icon: <ClockIcon />, title: "Smart kitchen timers", sub: "Set multiple timers at once without touching your screen" },
            { icon: <BookmarkIcon />, title: "Your personal cookbook", sub: "Save and revisit your favorite recipes anytime" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: shouldReduceMotion ? 0 : 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={transition(0.3, 0.65 + (i * 0.05))}
              style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
            >
              <div style={{ color: "#E8602C", flexShrink: 0, marginTop: "1px", width: "20px", height: "20px" }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "13px", color: "#F5EDD6", fontWeight: 500, lineHeight: 1, margin: 0 }}>{feature.title}</h3>
                <p style={{ fontSize: "12px", color: "rgba(245,237,214,0.40)", marginTop: "3px", lineHeight: 1.4, margin: 0 }}>{feature.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider 2 */}
        <motion.hr
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={transition(0.4, 0.9, "easeInOut")}
          style={{
            height: "1px", border: "none", margin: "0 0 28px 0",
            background: "linear-gradient(90deg, transparent 0%, rgba(245,237,214,0.12) 30%, rgba(232,96,44,0.20) 50%, rgba(245,237,214,0.12) 70%, transparent 100%)"
          }}
        />

        {/* Auth Error Callout */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: "16px" }}
            style={{
              padding: "10px 14px", borderRadius: "8px", background: "rgba(220, 38, 38, 0.07)",
              border: "1px solid rgba(220, 38, 38, 0.20)", display: "flex", alignItems: "center"
            }}
          >
            <WarningIcon />
            <span style={{ fontSize: "13px", color: "rgba(245,237,214,0.65)", marginLeft: "8px" }}>Sign-in failed. Please try again.</span>
          </motion.div>
        )}

        {/* Google Button */}
        <motion.button
          initial={{ y: shouldReduceMotion ? 0 : 8, opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 1.0, type: "spring", stiffness: 300, damping: 20 }}
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          style={{
            width: "100%", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            background: "rgba(245, 237, 214, 0.05)", border: "1px solid rgba(245, 237, 214, 0.15)",
            color: "#F5EDD6", fontSize: "14px", fontWeight: 500, letterSpacing: "0.02em",
            cursor: isGoogleLoading ? "default" : "pointer",
            pointerEvents: isGoogleLoading ? "none" : "auto",
            opacity: isGoogleLoading ? 0.6 : 1,
            transition: "all 180ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          className="hover:bg-[rgba(245,237,214,0.09)] hover:border-[rgba(232,96,44,0.40)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(232,96,44,0.10)] active:translate-y-0 active:scale-[0.985]"
        >
          {isGoogleLoading ? <SpinnerIcon /> : <GoogleGIcon />}
          {isGoogleLoading ? "Redirecting…" : "Continue with Google"}
        </motion.button>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          transition={transition(0.3, 1.15)}
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#F5EDD6",
            textAlign: "center", marginTop: "20px", lineHeight: 1.5, margin: "20px 0 0 0"
          }}
        >
          Secure sign-in via Google OAuth.<br/>We never store your password.
        </motion.p>
      </motion.div>
    </main>
  );
}

// --- Main Export with Suspense Boundary ---
export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoadingScreen />}>
      <SignInContent />
    </Suspense>
  );
}

// --- Minimal SVG Components ---
const EmberOrbIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="14" fill="#E8602C" fillOpacity="0.2" />
    <circle cx="18" cy="18" r="8" fill="#E8602C" />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
);

const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(220,38,38,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const GoogleGIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin text-[#F5EDD6]">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);