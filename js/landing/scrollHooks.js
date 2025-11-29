// Use global React hooks
const { useState, useEffect, useRef } = React;

// Expose constants and utilities globally
window.LandingScrollHooks = {
  SCROLL_HEIGHT_MULTIPLIER: 4,
  HERO_FADE_START: 0.0,
  HERO_FADE_END: 0.08,
  ZOOM_START: 0.08, // same as HERO_FADE_END
  ZOOM_END: 0.14,
  ZOOM_START_SCALE: 1.8,
  ZOOM_END_SCALE: 1.0,
  TIMELINE_START: 0.4,
  TIMELINE_END: 0.9,

  clamp: (v, min, max) => Math.max(min, Math.min(max, v)),

  getSectionOpacity: (progress, trigger, duration = 0.08) => {
    const fadeInStart = trigger - 0.04;
    const fadeInEnd = trigger;
    const fadeOutStart = trigger + duration;
    const fadeOutEnd = trigger + duration + 0.04;

    if (progress < fadeInStart || progress > fadeOutEnd) return 0;
    if (progress >= fadeInEnd && progress <= fadeOutStart) return 1;
    if (progress < fadeInEnd)
      return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
    return 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  },

  useScrollProgress: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      let ticking = false;

      const onScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? window.LandingScrollHooks.clamp(scrollTop / docHeight, 0, 1) : 0;

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
  },

  useLerpedValue: (target, smoothing = 0.12) => {
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
  },

  useAutoRotatingIndex: (len, delay, paused) => {
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
  }
};
