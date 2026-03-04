"use client";

import VoiceOrb from "@/components/VoiceOrb";
import HorizontalSplit from "@/components/animations/HorizontalSplit";
import WavyText from "@/components/animations/WavyText";
import RainingLetters from "@/components/animations/RainingLetters";
import SubtleHighlight from "@/components/animations/SubtleHighlight";
import Words3D from "@/components/animations/Words3D";
import ExplodingCharacters from "@/components/animations/ExplodingCharacters";
import Reveal from "@/components/Reveal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen relative flex flex-col items-center pt-24 pb-32">

      <div className="w-full max-w-300 px-6 z-10 flex flex-col items-center">

        {/* Top bar / reference layout */}
        <header className="w-full flex justify-between items-center md:flex absolute top-6 left-0 px-8">
          <div className="w-10 h-10 rounded-full bg-surface/10 backdrop-blur-md flex items-center justify-center border border-white/10" data-cursor="link">
            {/* Logo placeholder */}
            <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-full bg-surface/10 hover:bg-surface/20 border border-white/10 text-sm backdrop-blur-md transition-colors text-white" data-cursor="link">
              Sign Up
            </button>
            <button className="px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white text-sm backdrop-blur-md transition-colors" data-cursor="link">
              Log In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center mt-12 mb-16 text-center w-full max-w-2xl relative">
          <Reveal variant="scale-in" delay={1.4}>
            <div className="mb-4">
              <VoiceOrb />
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={1.6}>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-2">
              Good Afternoon,
            </h1>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-primary">
              What&apos;s on your mind?
            </h2>
          </Reveal>

          <Reveal variant="fade-up" delay={1.8} className="w-full mt-12 flex justify-center">
            <button
              onClick={() => router.push("/chat")}
              className="group flex items-center gap-3 px-6 py-[14px] bg-[#E8602C]/10 border border-[#E8602C]/35 rounded-[14px] backdrop-blur-md cursor-pointer w-fit mx-auto transition-all duration-200 hover:bg-[#E8602C]/20 hover:border-[#E8602C]/65 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]"
            >
              <span className="text-[#E8602C] shrink-0">
                {/* Microphone SVG — 20px */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </span>
              <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-medium text-[#F5EDD6] tracking-[0.01em] whitespace-nowrap">
                Chat with VoiceBite
              </span>
              <span className="text-[#F5EDD6]/45 shrink-0 ml-auto transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#E8602C]">
                {/* Arrow right SVG — 16px */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </Reveal>
        </section>

        {/* AnimeJS Grid */}
        <section className="w-full mt-24">
          <Reveal variant="fade-up" delay={0}>
            <h3 className="text-sm font-mono text-text-muted tracking-widest uppercase mb-8 ml-2">
              Get started with an example below
            </h3>
          </Reveal>

          <Reveal variant="fade-up" delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 content-center items-center">
              <HorizontalSplit />
              <WavyText />
              <RainingLetters />
              <Words3D />
              <ExplodingCharacters />
              <SubtleHighlight />
            </div>
          </Reveal>
        </section>

      </div>
    </main>
  );
}

