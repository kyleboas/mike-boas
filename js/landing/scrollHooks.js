// Use global React hooks
const { useState, useEffect, useRef } = React;

/* ==================================================================
   CONFIGURATION
   ================================================================== */

// Scroll behavior
const SCROLL_HEIGHT_MULTIPLIER = 4;

// Zoom animation constants
const ZOOM_END_PROGRESS = 0.14;
const ZOOM_START_SCALE = 1.8;
const ZOOM_END_SCALE = 1.0;

// Timeline scroll window
const TIMELINE_START = 0.4;
const TIMELINE_END = 0.9;

// Animation smoothing
const LERP_SMOOTHING = 0.12;

/* ==================================================================
   FADE CONFIG
   Edit these values to control when each section fades in/out
   All values are scroll progress (0 = top, 1 = bottom)
   ================================================================== */
const FADE_CONFIG = {
  hero: {
    fadeInStart: 0,      // Already visible at start
    fadeInEnd: 0,        // No fade-in needed
    fadeOutStart: 0,     // Start fading immediately on scroll
    fadeOutEnd: 0.08,    // Fully gone by 8%
  },
  logos: {
    fadeInStart: 0.14,
    fadeInEnd: 0.18,
    fadeOutStart: 0.26,
    fadeOutEnd: 0.30,
  },
  strategy: {
    fadeInStart: 0.26,
    fadeInEnd: 0.30,
    fadeOutStart: 0.42,
    fadeOutEnd: 0.46,
  },
  strategyBlock1: {
    fadeInStart: 0.29,
    fadeInEnd: 0.33,
    fadeOutStart: 0.45,
    fadeOutEnd: 0.49,
  },
  strategyBlock2: {
    fadeInStart: 0.32,
    fadeInEnd: 0.36,
    fadeOutStart: 0.48,
    fadeOutEnd: 0.52,
  },
  testimonial: {
    fadeInStart: 0.48,
    fadeInEnd: 0.52,
    fadeOutStart: 0.58,
    fadeOutEnd: 0.62,
  },
  cta: {
    fadeInStart: 0.64,
    fadeInEnd: 0.68,
    fadeOutStart: 0.74,
    fadeOutEnd: 0.78,
  },
};

/* ==================================================================
   UTILITIES
   ================================================================== */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Generic opacity calculator - uses config object
const getOpacity = (progress, config) => {
  const { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd } = config;

  if (progress < fadeInStart || progress > fadeOutEnd) return 0;
  if (progress >= fadeInEnd && progress <= fadeOutStart) return 1;
  if (progress < fadeInEnd) {
    return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  }
  return 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
};

// Calculate zoom scale based on scroll progress
const calculateZoomScale = (scrollProgress) => {
  const zoomStart = FADE_CONFIG.hero.fadeOutEnd;
  const t = clamp((scrollProgress - zoomStart) / (ZOOM_END_PROGRESS - zoomStart), 0, 1);
  return ZOOM_START_SCALE + (ZOOM_END_SCALE - ZOOM_START_SCALE) * t;
};

// Legacy section opacity calculator (kept for backward compatibility)
const getSectionOpacity = (progress, trigger, duration = 0.08) => {
  const fadeInStart = trigger - 0.04;
  const fadeInEnd = trigger;
  const fadeOutStart = trigger + duration;
  const fadeOutEnd = trigger + duration + 0.04;

  if (progress < fadeInStart || progress > fadeOutEnd) return 0;
  if (progress >= fadeInEnd && progress <= fadeOutStart) return 1;
  if (progress < fadeInEnd)
    return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  return 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
};

/* ==================================================================
   HOOKS
   ================================================================== */

// Hook to track scroll progress (0 to 1)
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;

      if (!ticking) {
        requestAnimationFrame(() => {
          setProgress(pct);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
};

// Hook to smoothly interpolate a value using RAF
const useLerpedValue = (target, smoothing = LERP_SMOOTHING) => {
  const [value, setValue] = useState(target);
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      setValue((prev) => prev + (targetRef.current - prev) * smoothing);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [smoothing]);

  return value;
};

// Hook to auto-rotate through an array index
const useAutoRotatingIndex = (len, delay, paused) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (paused || len <= 1) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % len),
      delay
    );
    return () => clearInterval(id);
  }, [paused, len, delay]);

  return [index, setIndex];
};

/* ==================================================================
   GLOBAL EXPORT
   ================================================================== */

// Expose constants and utilities globally
window.LandingScrollHooks = {
  // Configuration constants
  SCROLL_HEIGHT_MULTIPLIER,
  HERO_FADE_START: 0.0,
  HERO_FADE_END: 0.08,
  ZOOM_START: FADE_CONFIG.hero.fadeOutEnd,
  ZOOM_END: ZOOM_END_PROGRESS,
  ZOOM_START_SCALE,
  ZOOM_END_SCALE,
  TIMELINE_START,
  TIMELINE_END,
  FADE_CONFIG,

  // Utilities
  getOpacity,
  clamp,
  calculateZoomScale,
  getSectionOpacity,

  // Hooks
  useScrollProgress,
  useLerpedValue,
  useAutoRotatingIndex,
};
