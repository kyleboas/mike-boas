const { useState, useEffect, useRef } = React;

/* ==================================================================
   CONFIGURATION
   ================================================================== */

// Scroll behavior
const SCROLL_HEIGHT_MULTIPLIER = 8;

// Fade timing
const FADE_DURATION = 0.04; 
const HOLD_DURATION = 0.1;
const GAP_BETWEEN_SECTIONS = 0.02;

// Zoom animation
const ZOOM_END_PROGRESS = 0.14;
const ZOOM_START_SCALE = 1.8;
const ZOOM_END_SCALE = 1.0; 

// Timeline scroll window
const TIMELINE_START = 0.4;
const TIMELINE_END = 0.9;

// Animation smoothing
const LERP_SMOOTHING = 0.12;

// Testimonial auto-advance
const TESTIMONIAL_INTERVAL_MS = 6000;

/* ==================================================================
   FADE CONFIG
   ================================================================== */

const createFadeConfig = (fadeInStart) => ({
  fadeInStart,
  fadeInEnd: fadeInStart + FADE_DURATION,
  fadeOutStart: fadeInStart + FADE_DURATION + HOLD_DURATION,
  fadeOutEnd: fadeInStart + FADE_DURATION + HOLD_DURATION + FADE_DURATION,
});

const getNextStart = (prev) => prev.fadeOutEnd + GAP_BETWEEN_SECTIONS;

const hero = {
  fadeInStart: 0,
  fadeInEnd: 0,
  fadeOutStart: 0,
  fadeOutEnd: 0.08,
};

const logos = createFadeConfig(getNextStart(hero));
const strategy = createFadeConfig(getNextStart(logos));
const testimonial = createFadeConfig(getNextStart(strategy));

const ctaFadeStart = getNextStart(testimonial);
const cta = {
  fadeInStart: ctaFadeStart,
  fadeInEnd: ctaFadeStart + FADE_DURATION,
  fadeOutStart: 1, // Never fade out
  fadeOutEnd: 1,
};

const FADE_CONFIG = {
  hero,
  logos,
  strategy,
  testimonial,
  cta,
};

/* ==================================================================
   DATA
   ================================================================== */

const TESTIMONIALS = [
  {
    quote:
      "Mike brings unique perspective with his extensive background in marketing and sales, which has not only enhanced the visibility and impact of Medical Information across the organization, but also motivated the team to deliver new customer centric digital solutions. Above all, Mike prioritizes people first, ensuring each and every person on the team are empowered to pursue personal development and growth.",
    name: "Sean Swisher",
    title: "Senior Director, Global Medical Execution, Respiratory Biologics",
    company: "AstraZeneca",
    avatar:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/testimonials/sean-swisher.jpeg",
  },
  {
    quote:
      "Michael is a seasoned and innovative Medical Affairs professional and has been at the forefront of some of AZ's most important transformation to digital and Al related content within the medical information and scientific communications space. His strong marketing background also allows to put a true 'customer lens' on all the work his team delivers.",
    name: "Robert Fogel, MD",
    title: "VP, Global Medical Affairs",
    company: "AstraZeneca",
    avatar:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/testimonials/robert-fogel.jpeg",
  },
  {
    quote:
      "What stands out most about Mike is his commitment to empowering the team as individuals, while driving the whole team towards a future vision. As my manager, he understands my strengths, has challenged me to grow, and has supported me when it was needed most.",
    name: "Amy Fetchko",
    title: "Senior Director",
    company: "AstraZeneca",
    avatar:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/testimonials/amy-fetchko.jpeg",
  },
];

const LOGO_DATA = [
  {
    src: "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/medcom.png",
    alt: "Med Communications",
    class: "logo-image invert-logo",
  },
  {
    src: "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/aingens.gif",
    alt: "Aingens",
    class: "logo-image invert-logo",
  },
  {
    src: "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/thestem.png",
    alt: "The Stem",
    class: "logo-image",
  },
];

const careerTimeline = [
  {
    period: "1991 – 2007",
    org: "AstraZeneca",
    yrs: "15 yrs 10 mos",
    logo:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/astrazeneca.png",
    bullets: [
      'Created the first hospital "emergency room" strategy focused on improving the use of a Pulmicort Respules (pediatric nebulized asthma treatment)',
      "Designed the first primary care & hospital sales force focused on improving the use of Pulmicort Respules (pediatric nebulized asthma treatment)",
      "First District Sales Manager (DSM) on the National DSM Effectiveness Team",
    ],
  },
  {
    role: "BS, Finance",
    org: "Penn State",
    logo:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/penn-state.png",
    summary: "Bachelor of Science - BS, Finance",
    bullets: ["Brandywine Campus Mens Soccer Team", "Acacia Fraternity"],
  },
];

/* ==================================================================
   UTILITIES
   ================================================================== */

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getOpacity = (progress, config) => {
  const { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd } = config;

  if (progress < fadeInStart || progress > fadeOutEnd) return 0;
  if (progress >= fadeInEnd && progress <= fadeOutStart) return 1;
  if (progress < fadeInEnd) {
    return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  }
  return 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
};

const calculateZoomScale = (scrollProgress) => {
  const zoomStart = FADE_CONFIG.hero.fadeOutEnd;
  const t = clamp((scrollProgress - zoomStart) / (ZOOM_END_PROGRESS - zoomStart), 0, 1);
  return ZOOM_START_SCALE + (ZOOM_END_SCALE - ZOOM_START_SCALE) * t;
};

/* ==================================================================
   ICONS
   ================================================================== */

const IconBase = ({ children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

const Mail = (props) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <polyline points="3 7 12 13 21 7" />
  </IconBase>
);

const Calendar = (props) => (
  <IconBase {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </IconBase>
);

const Linkedin = (props) => (
  <IconBase {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </IconBase>
);

/* ==================================================================
   MAIN COMPONENT
   ================================================================== */

const BridgeLanding = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const containerRef = useRef(null);
  const timelineViewportRef = useRef(null);
  const timelineListRef = useRef(null);
  const [timelineMaxScroll, setTimelineMaxScroll] = useState(0);

  // Use refs for animated values to avoid triggering re-renders
  const overlayRef = useRef(null);
  const displayScaleRef = useRef(ZOOM_START_SCALE);
  const displayYRef = useRef(0);
  const targetScaleRef = useRef(ZOOM_START_SCALE);
  const targetYRef = useRef(0);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentTestimonial = TESTIMONIALS[activeTestimonial];

  // Scroll progress tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const next =
        docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;

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

  // Timeline max scroll calculation
  useEffect(() => {
    const updateTimelineMaxScroll = () => {
      if (!timelineViewportRef.current || !timelineListRef.current) return;
      const viewportHeight = timelineViewportRef.current.clientHeight;
      const listHeight = timelineListRef.current.scrollHeight;
      const maxScroll = Math.max(0, listHeight - viewportHeight);
      setTimelineMaxScroll(maxScroll);
    };

    updateTimelineMaxScroll();
    window.addEventListener("resize", updateTimelineMaxScroll);
    return () => window.removeEventListener("resize", updateTimelineMaxScroll);
  }, []);

  // Calculate target values
  const heroOpacity = isEmailFocused ? 1 : getOpacity(scrollProgress, FADE_CONFIG.hero);
  const targetScale = calculateZoomScale(scrollProgress);

  const timelineRange = TIMELINE_END - TIMELINE_START;
  const timelineT = clamp(
    (scrollProgress - TIMELINE_START) / timelineRange,
    0,
    1
  );
  const timelineScrollY = -timelineMaxScroll * timelineT;

  // Update target refs when scroll changes
  useEffect(() => {
    targetScaleRef.current = targetScale;
    targetYRef.current = timelineScrollY;
  }, [targetScale, timelineScrollY]);

  // Combined RAF loop for smooth animations (eliminates ~120 setState calls/second)
  useEffect(() => {
    let rafId;
    const EPSILON = 0.0001;

    const animate = () => {
      // Update display values with smoothing
      displayScaleRef.current += (targetScaleRef.current - displayScaleRef.current) * LERP_SMOOTHING;
      displayYRef.current += (targetYRef.current - displayYRef.current) * LERP_SMOOTHING;

      // Apply transforms directly to DOM (no state updates = no re-renders)
      if (overlayRef.current) {
        overlayRef.current.style.transform = `scale(${displayScaleRef.current})`;
      }
      if (timelineListRef.current) {
        timelineListRef.current.style.transform = `translateY(${displayYRef.current}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Testimonial auto-rotation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, TESTIMONIAL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Section opacities
  const logosOpacity = getOpacity(scrollProgress, FADE_CONFIG.logos);
  const strategyOpacity = getOpacity(scrollProgress, FADE_CONFIG.strategy);
  const testimonialOpacity = getOpacity(scrollProgress, FADE_CONFIG.testimonial);
  const ctaOpacity = getOpacity(scrollProgress, FADE_CONFIG.cta);

  return (
    <div
      ref={containerRef}
      className="page-container"
      style={{ height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
    >
      {/* Scroll-animated background - transform applied via RAF */}
      <div ref={overlayRef} className="overlay" />

      {/* Floating content */}
      <div className="floating-content">
        {/* Hero Section */}
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
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                  <button className="primary-button">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logos */}
        <div
          className="logos-section"
          style={{
            opacity: logosOpacity,
            pointerEvents: logosOpacity > 0 ? "auto" : "none",
          }}
        >
          <h3 className="section-label">Trusted By Industry Leaders</h3>

          <div className="logos-row">
            {LOGO_DATA.map((logo, idx) => (
              <div key={idx} className="logo-card">
                <img src={logo.src} alt={logo.alt} className={logo.class} />
              </div>
            ))}
          </div>
        </div>

        {/* Strategy */}
        <div
          className="strategy-section"
          style={{
            opacity: strategyOpacity,
            pointerEvents: strategyOpacity > 0 ? "auto" : "none",
          }}
        >
          <div className="strategy-sequence">
            {/* 1 */}
            <div className="strategy-block">
              <h3 className="strategy-title">Purpose</h3>
              <p className="strategy-subheading">
                Elevate human potential and impact
              </p>
              <p className="strategy-text">
                Creating the space for people and organizations to achieve{" "}
                <span className="strategy-text-bold">
                  extraordinary results
                </span>
                .
              </p>
            </div>

            {/* 2 */}
            <div className="strategy-block">
              <h3 className="strategy-title">Philosophy</h3>
              <p className="strategy-subheading">People Before Projects</p>
              <p className="strategy-text">
                When people feel{" "}
                <span className="strategy-text-bold">valued</span>, belief
                builds, alignment follows, and execution becomes{" "}
                <span className="strategy-text-bold">unstoppable</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div
          className="testimonial-section"
          style={{
            opacity: testimonialOpacity,
          }}
        >
          <div
            className="testimonial-wrapper"
            style={{ pointerEvents: testimonialOpacity > 0 ? "auto" : "none" }}
          >
            {/* Left arrow */}
            <button
              type="button"
              className="testimonial-nav testimonial-nav-left"
              onClick={() =>
                setActiveTestimonial(
                  (activeTestimonial - 1 + TESTIMONIALS.length) %
                    TESTIMONIALS.length
                )
              }
            >
              ‹
            </button>

            {/* Viewport + track */}
            <div
              className="testimonial-viewport"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="testimonial-track"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {TESTIMONIALS.map((t, idx) => (
                  <div className="testimonial-slide" key={idx}>
                    <div className="testimonial-card interactive-card">
                      <p className="testimonial-text">"{t.quote}"</p>

                      <div className="testimonial-footer">
                        {t.avatar && (
                          <img
                            className="testimonial-avatar"
                            src={t.avatar}
                            alt={`Portrait of ${t.name}`}
                          />
                        )}
                        <div className="testimonial-meta">
                          <p className="testimonial-author">{t.name}</p>
                          <p className="testimonial-title">{t.title}</p>
                          <p className="testimonial-company">{t.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right arrow */}
            <button
              type="button"
              className="testimonial-nav testimonial-nav-right"
              onClick={() =>
                setActiveTestimonial(
                  (activeTestimonial + 1) % TESTIMONIALS.length
                )
              }
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div
            className="testimonial-dots"
            aria-label="Select testimonial"
            style={{ pointerEvents: testimonialOpacity > 0 ? "auto" : "none" }}
          >
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={
                  "testimonial-dot" +
                  (idx === activeTestimonial ? " testimonial-dot-active" : "")
                }
                onClick={() => setActiveTestimonial(idx)}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="cta-section"
          style={{
            opacity: ctaOpacity,
          }}
        >
          <div
            className="cta-card interactive-card"
            style={{ pointerEvents: ctaOpacity > 0 ? "auto" : "none" }}
          >
            <p className="cta-text">
              {"Let's"} build the bridge to your next success story.
            </p>

            <button
              className="cta-button"
              onClick={() =>
                window.open(
                  "https://calendly.com/heyboas/30-minute-zoom-call",
                  "_blank"
                )
              }
            >
              <Calendar width={24} height={24} />
              <span>Schedule a Consultation</span>
            </button>

            <div className="cta-footer">
              <div className="cta-icons">
                <a href="https://www.linkedin.com/in/g-michael-boas" className="cta-icon-link">
                  <Linkedin width={28} height={28} />
                </a>
                <a href="mailto:contact@mikeboas.net" className="cta-icon-link">
                  <Mail width={28} height={28} />
                </a>
              </div>
              <p className="cta-credit">
                Made by <a href="https://kyleboas.com">Kyle Boas</a>. © 2025
                Mike Boas. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BridgeLanding />);
