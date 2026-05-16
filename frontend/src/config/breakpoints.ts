/** Mobile-first breakpoints aligned with Figma artboards (M / T / D). */
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1200,
  wide: 1440,
} as const

export type BreakpointName = keyof typeof BREAKPOINTS

export const MEDIA = {
  tablet: `(min-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  wide: `(min-width: ${BREAKPOINTS.wide}px)`,
} as const
