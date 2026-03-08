import VoiceOrb from "@/components/VoiceOrb";
import HorizontalSplit from "@/components/animations/HorizontalSplit";
import WavyText from "@/components/animations/WavyText";
import RainingLetters from "@/components/animations/RainingLetters";
import SubtleHighlight from "@/components/animations/SubtleHighlight";
import Words3D from "@/components/animations/Words3D";
import ExplodingCharacters from "@/components/animations/ExplodingCharacters";
import Reveal from "@/components/Reveal";
import RedirectBtn from "@/components/home/RedirectBtn";
import Signup from "@/components/auth/Signup";
import Login from "@/components/auth/Login";
import { auth } from "./lib/auth";
import Logout from "@/components/auth/Logout";

export default async function Home() {
  const session = await auth();
  let isUser = true;

  if (!session?.user) isUser = false;
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
            {isUser ? <Logout /> : (
              <>
                <Signup />
                <Login />
              </>
            )}
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
            <RedirectBtn />
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

