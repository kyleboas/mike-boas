const { useState, useEffect, useRef } = React;

/* ------------------------------------------------------------------
   Minimal hero + background zoom only (one-shot)
------------------------------------------------------------------ */

const BridgeHeroOnly = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayScale, setDisplayScale] = useState(1.8);
  const targetScaleRef = useRef(1.8);

  const [heroDone, setHeroDone] = useState(false); // <— NEW

  const HERO_FADE_START = 0.0;
  const HERO_FADE_END = 0.08;
  const zoomStart = HERO_FADE_END; // 0.08
  const zoomEnd = 0.14;

  const hasStartedPostTransitionRef = useRef(false);

  // Track document scroll (0 → 1)
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

  // Hero opacity (while it still exists)
  const heroOpacity = heroDone
    ? 0
    : 1 -
      clamp(
        (scrollProgress - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START),
        0,
        1
      );

  // Background zoom
  const rawT = (scrollProgress - zoomStart) / (zoomEnd - zoomStart);
  const zoomT = clamp(rawT, 0, 1);

  const startScale = 1.8; // close framing
  const endScale = 1.0;   // fully zoomed out
  const scale = startScale + (endScale - startScale) * zoomT;
  const translateY = 0;

  // Smooth scale lerp
  useEffect(() => {
    targetScaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    let rafId;
    const SCALE_SMOOTHING = 0.12;

    const animate = () => {
      setDisplayScale(prev => prev + (targetScaleRef.current - prev) * SCALE_SMOOTHING);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Post-at-top, fade-in + scroll lock sequence (one time)
  useEffect(() => {
    const POST_FADE_DURATION = 1000; // ms – match your CSS

    if (
      !heroDone &&
      !hasStartedPostTransitionRef.current &&
      scrollProgress >= zoomEnd
    ) {
      hasStartedPostTransitionRef.current = true;

      const article = document.querySelector("article.post, article.page");
      if (!article) return;

      // Make sure post starts at top
      window.scrollTo({ top: 0, behavior: "auto" });

      // Lock scroll during fade-in
      document.body.style.overflow = "hidden";

      // Prepare / trigger fade
      article.style.opacity = "0";
      article.style.transition = "opacity 1s ease-in";
      requestAnimationFrame(() => {
        article.style.opacity = "1";
      });

      // When fade done: unlock scroll + mark hero as done
      setTimeout(() => {
        document.body.style.overflow = "";
        setHeroDone(true);
      }, POST_FADE_DURATION);
    }
  }, [scrollProgress, zoomEnd, heroDone]);

  // Once hero is done, render nothing forever
  if (heroDone) {
    return null;
  }

  return (
    // Fixed overlay: always on top while active, never pushes the post down
    <div
      className="page-container"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {/* Scroll-animated background */}
      <div
        className="overlay"
        style={{
          transform: `scale(${displayScale}) translateY(${translateY}%)`,
          pointerEvents: "none",
        }}
      />

      {/* Floating hero content */}
      <div
        className="floating-content"
        style={{ pointerEvents: "auto" }} // hero is still interactive
      >
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

        {/* You can add more hero-only sections here if needed */}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BridgeHeroOnly />);