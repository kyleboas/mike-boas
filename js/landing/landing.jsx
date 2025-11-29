// Use global React and ReactDOM
const { useState } = React;

// Access global components and utilities
const {
  SCROLL_HEIGHT_MULTIPLIER,
  HERO_FADE_START,
  HERO_FADE_END,
  ZOOM_START,
  ZOOM_END,
  ZOOM_START_SCALE,
  ZOOM_END_SCALE,
  clamp,
  getSectionOpacity,
  useScrollProgress,
  useLerpedValue,
} = window.LandingScrollHooks;

const HeroSection = window.HeroSection;
const LogosSection = window.LogosSection;
const StrategySection = window.StrategySection;
const TestimonialsSection = window.TestimonialsSection;
const CTASection = window.CTASection;

const BridgeLanding = () => {
  const scrollProgress = useScrollProgress();
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Hero opacity with email focus override
  const baseHeroOpacity =
    1 -
    clamp(
      (scrollProgress - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START),
      0,
      1
    );
  const heroOpacity = isEmailFocused ? 1 : baseHeroOpacity;

  // Zoom calculation
  const rawT = (scrollProgress - ZOOM_START) / (ZOOM_END - ZOOM_START);
  const zoomT = Math.max(0, Math.min(1, rawT));
  const targetScale = ZOOM_START_SCALE + (ZOOM_END_SCALE - ZOOM_START_SCALE) * zoomT;
  const displayScale = useLerpedValue(targetScale, 0.12);

  // Section opacities
  const logosOpacity = getSectionOpacity(scrollProgress, 0.18, 0.08);
  const strategyOpacity = getSectionOpacity(scrollProgress, 0.3, 0.12);
  const testimonialOpacity = getSectionOpacity(scrollProgress, 0.52, 0.06);
  const ctaOpacity = getSectionOpacity(scrollProgress, 0.68, 0.06);

  return (
    <div
      className="page-container"
      style={{ height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
    >
      {/* Scroll-animated background */}
      <div
        className="overlay"
        style={{
          transform: `scale(${displayScale})`,
        }}
      />

      {/* Floating content */}
      <div className="floating-content">
        <HeroSection
          heroOpacity={heroOpacity}
          onEmailFocus={() => setIsEmailFocused(true)}
          onEmailBlur={() => setIsEmailFocused(false)}
        />

        <LogosSection opacity={logosOpacity} />

        <StrategySection
          opacity={strategyOpacity}
          scrollProgress={scrollProgress}
        />

        <TestimonialsSection
          opacity={testimonialOpacity}
          testimonials={window.testimonialsData}
        />

        <CTASection opacity={ctaOpacity} />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BridgeLanding />);
