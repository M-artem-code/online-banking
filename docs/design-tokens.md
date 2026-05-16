# Design tokens (Figma — KAIROS)

Source of truth: `frontend/public/figma/main/`, `ui-kit/`.  
CSS variables: `frontend/src/styles/tokens.css`.

## Breakpoints

| Name | Width | Figma ref |
|------|-------|-----------|
| mobile | 375px | `M. HP.png` |
| tablet | 768px | `T. HP.png` |
| desktop | 1200px | `HP.png` |
| wide | 1440px | artboard max |

JS: `frontend/src/config/breakpoints.ts`  
CSS: `--bp-*` in `tokens.css` (use `@media (min-width: …)` mobile-first).

## Typography

| Token | Value |
|-------|--------|
| `--font-display` | Michroma, fallback system-ui |
| `--font-body` | Inter, fallback system-ui |
| Display XL | `clamp(1.75rem, 3.5vw, 3rem)` — hero H1 |
| Nav | 0.8125rem, uppercase, wide tracking |
| Body | 1rem / 1.6 |

Utility classes: `frontend/src/styles/typography.css`.

## Colors

| Token | Hex | Usage |
|-------|-----|--------|
| `--color-bg-primary` | `#000B26` | page, hero |
| `--color-bg-crypto` | `#001226` | markets section |
| `--color-bg-menu` | `#051630` | mobile menu overlay |
| `--color-purple-deep` | `#2E0066` | auth header, accents |
| `--color-gold` | `#C5B378` | Google CTA, outlines |
| `--color-surface` | `#FFFFFF` | cards, modals |
| `--color-text-primary` | `#FFFFFF` | on dark |
| `--color-text-on-surface` | `#2E0066` | on white cards |

## Layout

| Token | Value |
|-------|--------|
| `--container-max` | 1440px |
| `--header-height` | 72px |
| `--radius-card` | 20px |

## Crypto (Binance — Phase 6)

Target 10 pairs: BTC, ETH, SOL, XRP, USDC, BNB, DOGE, SUI, USDT + Midnight (verify ticker).

Current config: `frontend/src/config/coins.ts` (5 coins until Phase 6).
