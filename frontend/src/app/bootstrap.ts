import { initAuthTabs } from "../components/auth-card/authTabs.ts";
import {
  initAddCryptoUi,
  initCryptoHubScrollAnimation,
} from "../components/crypto-hub/index.ts";
import { initMobileMenu } from "../components/header/index.ts";
import {
  initHeroVideo,
  initLearnMoreModal,
  initVideoModal,
} from "../components/hero/index.ts";
import { initIntroSequence, onIntroComplete } from "../core/introSequence.ts";
import { initAuth } from "../features/auth/index.ts";
import { initCryptoLive } from "../features/crypto-live/index.ts";

export function bootstrap(): void {
  onIntroComplete(() => {
    initCryptoLive();
    initAddCryptoUi();
    initCryptoHubScrollAnimation();
  });

  initIntroSequence();
  initAuth();
  initAuthTabs();
  initHeroVideo();
  initLearnMoreModal();
  initVideoModal();
  initMobileMenu();
}
