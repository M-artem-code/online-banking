"use client";

import { IntroCurtain } from "@/components/IntroCurtain";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { CryptoHub } from "@/components/CryptoHub";
import { MobileMenu } from "@/components/MobileMenu";
import { LearnMoreModal } from "@/components/LearnMoreModal";
import { VideoModal } from "@/components/VideoModal";

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
