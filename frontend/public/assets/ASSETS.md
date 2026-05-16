# Production assets

| Path | Purpose |
|------|---------|
| `/fonts/` | Self-hosted woff2 (display font subset) — optional; Michroma loaded via Google Fonts for now |
| `/images/` | Logo SVG, posters (`hero-poster.webp`) |
| `/icons/crypto/` | Coin SVGs exported from Figma ui-kit |
| `/video/HP.mp4` | Hero background video |
| `/figma/` | **Dev reference only** — do not import in production CSS/JS |

Export checklist (Phase 3+):

- `images/kairos-logo.svg` from `figma/ui-kit/Kairos.png`
- `icons/crypto/{btc,eth,sol,xrp,usdc,bnb,doge,sui,usdt,night}.svg`
- `images/hero-poster.webp` — frame from `figma/animation/HP.png`
