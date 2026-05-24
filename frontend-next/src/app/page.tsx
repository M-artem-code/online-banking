"use client";

import { IntroCurtain } from "@/features/intro-sequence";
import { SiteHeader } from "@/widgets/site-header";
import { HeroSection } from "@/widgets/hero-section";
import { CryptoHub } from "@/widgets/crypto-hub";
import { MobileMenu } from "@/features/mobile-menu";
import { LearnMoreModal } from "@/features/learn-more-modal";
import { VideoModal } from "@/features/video-player-modal";

export default function Home() {
  return (
    <>
      <IntroCurtain />
      <SiteHeader />
      <main className="page">
        <HeroSection />
        <CryptoHub />
      </main>
      <div className="overlays" id="overlays" aria-hidden="false">
        <MobileMenu />
        <LearnMoreModal />
        <VideoModal />
      </div>
    </>
  );
}
