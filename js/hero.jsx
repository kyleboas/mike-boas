const { useState, useEffect, useRef } = React;

/* ------------------------------------------------------------------
   Minimal hero + background zoom only
------------------------------------------------------------------ */

const ANIMATION_SCROLL_PX = 300; // how much scroll you want for fade + zoom

const BridgeHeroOnly = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayScale, setDisplayScale] = useState(1.8);
  const targetScaleRef = useRef(1.8);
  const [containerHeight, setContainerHeight] = useState(
    typeof window !== "undefined"
      ? window.innerHeight + ANIMATION_SCROLL_PX
      : 0
  );

  // keep container height = viewport + animation distance
  useEffect(() => {
    const updateHeight = () => {
      setContainerHeight(window.innerHeight + ANIMATION_SCROLL_PX);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Basic scroll progress (0 → 1) across the page
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const next =
        docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollProgress(next);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // Hero fades out immediately on scroll (no fade-in)
  const HERO_FADE_START = 0.0;
  const HERO_FADE_END = 0.08;

  const heroOpacity =
    1 -
    clamp(
      (scrollProgress - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START),
      0,
      1
    );

  // --- scroll-based zoom for the overlay background ---
  // Zoom starts after hero has faded out
  const zoomStart = HERO_FADE_END; // 0.08
  const zoomEnd = 0.14;

  const rawT = (scrollProgress - zoomStart) / (zoomEnd - zoomStart);
  const zoomT = clamp(rawT, 0, 1);

  const startScale = 1.8; // close framing
  const endScale = 1.0;   // fully zoomed out
  const scale = startScale + (endScale - startScale) * zoomT;

  // keep background centered, no vertical translation
  const translateY = 0;

  // Update target scale whenever scroll changes
  useEffect(() => {
    targetScaleRef.current = scale;
  }, [scale]);

  // Lerp loop for smooth zoom
  useEffect(() => {
    let rafId;
    const SCALE_SMOOTHING = 0.12;

    const animate = () => {
      setDisplayScale(
        (prev) => prev + (targetScaleRef.current - prev) * SCALE_SMOOTHING
      );
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="page-container"
      style={{ height: containerHeight || "100vh" }}
    >
      {/* Scroll-animated background */}
      <div
        className="overlay"
        style={{
          transform: `scale(${displayScale}) translateY(${translateY}%)`,
        }}
      />

      {/* Floating content (hero only) */}
      <div className="floating-content">
        <div
          className="hero-section"
          style={{
            transform: `translate(-50%, ${20 * (1 - heroOpacity)}px)`,
            opacity: heroOpacity,
          }}
        >
          <div
            className="hero-card"
            style={{ pointerEvents: heroOpacity > 0 ? "auto" : "none" }}
          >
            <div className="hero-header-row">
              <div className="hero-text-block">
                <h1 className="hero-title">MIKE BOAS</h1>
                <h2 className="hero-subtitle">BRIDGE BUILDER</h2>
                <p className="hero-blurb">
                  Strategic Advisor &amp; Leadership Partner for Medical,
                  Marketing, AI Solutions
                </p>
              </div>
            </div>

            {/* Email card */}
            <div className="email-row">
              <div className="email-card interactive-card">
                <div className="email-inner">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="email-input"
                  />
                  <button className="primary-button">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional sections can follow here */}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BridgeHeroOnly />);