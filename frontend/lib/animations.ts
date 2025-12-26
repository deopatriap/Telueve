import anime from "animejs";

// ============================================
// Animation Constants
// ============================================

export const EASING = {
  default: "easeOutExpo",
  smooth: "cubicBezier(.5, .05, .1, .3)",
  elastic: "easeOutElastic(1, .6)",
};

export const DURATION = {
  fast: 400,
  default: 800,
  slow: 1200,
  hero: 2000,
};

// ============================================
// Animation Presets
// ============================================

/**
 * Staggered fade and slide up animation for lists/grids
 */
export const staggerFadeUp = (targets: any, delay: number = 0) => {
  return (anime as any)({
    targets,
    translateY: [20, 0],
    opacity: [0, 1],
    delay: (anime as any).stagger(100, { start: delay }),
    easing: EASING.default,
    duration: DURATION.default,
  });
};

/**
 * Text reveal animation (characters or words)
 */
export const revealText = (targets: string | HTMLElement | NodeList, delay: number = 0) => {
  return (anime as any)({
    targets,
    translateY: ["110%", "0%"],
    opacity: [0, 1],
    delay: (anime as any).stagger(20, { start: delay }),
    easing: EASING.default,
    duration: DURATION.slow,
  });
};

/**
 * Smooth counter animation for stats
 */
export const animateCounter = (
  targets: string | HTMLElement,
  value: number,
  duration: number = 2000
) => {
  return (anime as any)({
    targets,
    innerHTML: [0, value],
    easing: EASING.default,
    round: 1, // No decimals
    duration,
  });
};

/**
 * Pulse effect for buttons/CTA
 */
export const pulseAnimation = (target: string | HTMLElement) => {
  return (anime as any)({
    targets: target,
    scale: [1, 1.05, 1],
    easing: 'easeInOutSine',
    duration: 1500,
    loop: true,
  });
};

/**
 * Page transition out (fade out)
 */
export const pageOut = (target: string | HTMLElement, onComplete: () => void) => {
  return (anime as any)({
    targets: target,
    opacity: [1, 0],
    translateY: [0, -10],
    easing: EASING.default,
    duration: 300,
    complete: onComplete,
  });
};

/**
 * Page transition in (fade in)
 */
export const pageIn = (target: string | HTMLElement) => {
  return (anime as any)({
    targets: target,
    opacity: [0, 1],
    translateY: [10, 0],
    easing: EASING.default,
    duration: DURATION.default,
    delay: 100, // Wait for previous page to clear mostly
  });
};

/**
 * Glitch Text Effect
 * Randomly replaces characters before settling on final text
 */
export const glitchText = (
  target: HTMLElement,
  originalText: string,
  updateText: (t: string) => void
) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let iterations = 0;

  const interval = setInterval(() => {
    const glitched = originalText
      .split("")
      .map((char, index) => {
        if (index < iterations) {
          return originalText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    updateText(glitched);

    if (iterations >= originalText.length) {
      clearInterval(interval);
    }

    iterations += 1 / 3; // Speed of resolve
  }, 30);

  return () => clearInterval(interval);
};

/**
 * Magnetic Hover Effect
 * Element sticks to mouse slightly
 */
export const magneticHover = (
  target: HTMLElement | null,
  e: React.MouseEvent,
  strength: number = 20
) => {
  if (!target) return;
  const bounds = target.getBoundingClientRect();
  const x = e.clientX - bounds.left - bounds.width / 2;
  const y = e.clientY - bounds.top - bounds.height / 2;

  anime({
    targets: target,
    translateX: x / strength,
    translateY: y / strength,
    duration: 100,
    easing: 'easeOutSine'
  });
};

export const resetMagnetic = (target: HTMLElement | null) => {
  if (!target) return;
  anime({
    targets: target,
    translateX: 0,
    translateY: 0,
    duration: 800,
    easing: 'easeOutElastic(1, .5)'
  });
};

