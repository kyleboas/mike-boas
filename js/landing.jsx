const { useState, useEffect, useRef } = React;

/* ------------------------------------------------------------------
   Minimal icon components
------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------
   Career timeline data
------------------------------------------------------------------ */
const careerTimeline = [
  {
    role: "BS, Finance",
    org: "Penn State",
    logo:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/penn-state.png",
    summary: "Bachelor of Science - BS, Finance",
    bullets: [
      "Brandywine Campus Mens Soccer Team",
      "Acacia Fraternity"
    ],
  },
  {
    period: "1991 – 1996",
    role: "CV Sales Representative",
    org: "AstraZeneca",
    logo:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/astrazeneca.png",
    // add whatever you want here, just no stray bracket
    summary: "CV Sales Representative, Cardiovascular portfolio",
    bullets: [],
  },
  {
    type: "role",
    period: "2020 – Present",
    role: "Strategic Advisor",
    org: "Independent / Multiple Pharma Partners",
    logo:
      "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/consulting.png",
    summary:
      "Advising top pharma on AI-enabled medical and marketing transformations.",
    bullets: [
      "Designed global AI content strategy for 3 enterprise portfolios",
      "Coached cross-functional leadership teams on digital ways of working"
    ],
    featuredProject: {
      title: "Global AI Medical Information Platform",
      description:
        "Led the design of an omni-channel MI platform integrating generative AI, safety, and compliance workflows for 20+ markets.",
      image:
        "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/logos/astrazeneca.png"
    }
  }
];

/* ------------------------------------------------------------------
   Main component
------------------------------------------------------------------ */
const BridgeLanding = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const timelineViewportRef = useRef(null);
  const timelineListRef = useRef(null);
  const [timelineMaxScroll, setTimelineMaxScroll] = useState(0);

  // Smooth timeline scroll with lerping
  const [displayTimelineY, setDisplayTimelineY] = useState(0);
  const targetTimelineY = useRef(0);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
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

  const currentTestimonial = testimonials[activeTestimonial];

  const SCROLL_HEIGHT_MULTIPLIER = 18;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const next =
        docHeight > 0
          ? Math.max(0, Math.min(1, scrollTop / docHeight))
          : 0;

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

  // Hero fades out immediately on scroll (no fade-in)
  const HERO_FADE_START = 0.0;   // start fading as soon as user scrolls
  const HERO_FADE_END = 0.08;    // fully gone by 8% scroll

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const heroOpacity = 1 - clamp(
    (scrollProgress - HERO_FADE_START) / (HERO_FADE_END - HERO_FADE_START),
    0,
    1
  );

// --- scroll-based zoom for the overlay background ---
// Zoom starts only after hero has faded out
const zoomStart = HERO_FADE_END;      // e.g. 0.08
const zoomEnd = 0.14;

const rawT = (scrollProgress - zoomStart) / (zoomEnd - zoomStart);
const zoomT = Math.max(0, Math.min(1, rawT));

// zoom range
const startScale = 1.8;   // close-in framing
const endScale = 1.0;     // fully zoomed out
const scale = startScale + (endScale - startScale) * zoomT;

// no translation at all
const translateY = 0;

  // Timeline scroll window: items move through between 40% and 90% scroll
  const TIMELINE_START = 0.40;
  const TIMELINE_END = 0.90;
  const timelineRange = TIMELINE_END - TIMELINE_START;

  const timelineT = clamp(
    (scrollProgress - TIMELINE_START) / timelineRange,
    0,
    1
  );

  const timelineScrollY = -timelineMaxScroll * timelineT;

  // Update target for lerping
  useEffect(() => {
    targetTimelineY.current = timelineScrollY;
  }, [timelineScrollY]);

  // Continuous rAF loop for smooth interpolation
  useEffect(() => {
    let rafId;
    const animate = () => {
      setDisplayTimelineY(prev => {
        const diff = targetTimelineY.current - prev;
        // If close enough, snap to target to prevent infinite micro-updates
        if (Math.abs(diff) < 0.1) return targetTimelineY.current;
        // Smooth interpolation with 0.12 smoothing factor
        return prev + diff * 0.12;
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) =>
        (prev + 1) % testimonials.length
      );
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const getSectionOpacity = (triggerPoint, duration = 0.08) => {
    const fadeInStart = triggerPoint - 0.04;
    const fadeInEnd = triggerPoint;
    const fadeOutStart = triggerPoint + duration;
    const fadeOutEnd = triggerPoint + duration + 0.04;

    if (scrollProgress < fadeInStart || scrollProgress > fadeOutEnd) return 0;
    if (scrollProgress >= fadeInEnd && scrollProgress <= fadeOutStart) return 1;
    if (scrollProgress < fadeInEnd) {
      return (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    }
    if (scrollProgress > fadeOutStart) {
      return 1 - (scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
    }
    return 0;
  };

  return (
    <div
      ref={containerRef}
      className="page-container"
      style={{ height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
    >
      {/* Scroll-animated background */}
      <div
        className="overlay"
        style={{
          transform: `scale(${scale})`,
        }}
      />

      {/* Floating content */}
      <div className="floating-content">
        {/* Hero Section */}
        <div
          className="hero-section"
          style={{
            transform: `translate(-50%, ${20 * (1 - heroOpacity)}px)`,
            opacity: heroOpacity,
            pointerEvents: heroOpacity === 0 ? "none" : "auto",
          }}
        >
          <div className="hero-card">
            <div className="hero-header-row">
              <div className="hero-text-block">
                <h1 className="hero-title">MIKE BOAS</h1>
                <h2 className="hero-subtitle">BRIDGE BUILDER</h2>
                <p className="hero-blurb">
                  Strategic Advisor &amp; Leadership Partner for Medical, Marketing, AI Solutions
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

        {/* Logos */}
        <div
          className="logos-section"
          style={{ opacity: getSectionOpacity(0.18, 0.08) }}
        >
          <h3 className="section-label">Trusted By Industry Leaders</h3>

          <div className="logos-row">
            {[
              {
                src: "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/IMG_0927.png",
                alt: "AstraZeneca",
                class: "logo-image invert-logo",
              },
              {
                src: "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/IMG_0922.gif",
                alt: "Aingens",
                class: "logo-image invert-logo",
              },
              {
                src: "https://raw.githubusercontent.com/kyleboas/mike-boas/refs/heads/main/_assets/IMG_0926.png",
                alt: "The Stem",
                class: "logo-image",
              },
            ].map((logo, idx) => (
              <div key={idx} className="logo-card">
                <img src={logo.src} alt={logo.alt} className={logo.class} />
              </div>
            ))}
          </div>
        </div>

        {/* Strategy */}
        <div
          className="strategy-section"
          style={{ opacity: getSectionOpacity(0.3, 0.12) }}
        >
          <div className="strategy-sequence">
            {/* 1 */}
            <div
              className="strategy-block"
              style={{
                opacity: getSectionOpacity(0.33, 0.06),
              }}
            >
              <h3 className="strategy-title">Purpose</h3>
              <p className="strategy-subheading">
                Elevate human potential and impact
              </p>
              <p className="strategy-text">
                Creating the space for people and organizations to achieve <span className="strategy-text-bold">extraordinary results</span>.
              </p>
            </div>

            {/* 2 */}
            <div
              className="strategy-block"
              style={{
                opacity: getSectionOpacity(0.36, 0.06),
              }}
            >
              <h3 className="strategy-title">Philosophy</h3>
              <p className="strategy-subheading">People Before Projects</p>
              <p className="strategy-text">
                Because when people feel <span className="strategy-text-bold">valued</span>, belief builds, alignment follows, and execution becomes <span className="strategy-text-bold">unstoppable</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline – from college to today */}
        <div
          className="timeline-section"
          style={{ opacity: getSectionOpacity(0.52, 0.26) }}
        >
          <div className="timeline-card" ref={timelineViewportRef}>
            <h3 className="timeline-heading">35+ Years of Experience</h3>

            <div
              className="timeline-list"
              ref={timelineListRef}
              style={{
                transform: `translate3d(0, ${displayTimelineY}px, 0)`,
              }}
            >
              {careerTimeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-logo-wrap">
                    {item.logo && (
                      <img
                        src={item.logo}
                        alt={item.org || "Organization logo"}
                        className={
                          "timeline-logo" +
                          (item.type === "education" ? " timeline-logo-edu" : "")
                        }
                      />
                    )}
                  </div>

                  <div className="timeline-content">
                    <p className="timeline-period">{item.period}</p>

                    <div className="timeline-title-row">
                      <h4 className="timeline-role">{item.role}</h4>
                      {item.org && (
                        <span className="timeline-org">{item.org}</span>
                      )}
                    </div>

                    {item.summary && (
                      <p className="timeline-summary">{item.summary}</p>
                    )}

                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="timeline-bullets">
                        {item.bullets.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    )}

                    {item.featuredProject && (
                      <div className="timeline-project">
                        <p className="timeline-project-title">
                          {item.featuredProject.title}
                        </p>
                        <p className="timeline-project-desc">
                          {item.featuredProject.description}</p>
                        {item.featuredProject.image && (
                          <div className="timeline-project-media">
                            <img
                              src={item.featuredProject.image}
                              alt={item.featuredProject.title}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div
          className="testimonial-section"
          style={{ opacity: getSectionOpacity(0.93, 0.06) }}
        >
          <div className="testimonial-wrapper">
            {/* Left arrow */}
            <button
              type="button"
              className="testimonial-nav testimonial-nav-left"
              onClick={() =>
                setActiveTestimonial(
                  (activeTestimonial - 1 + testimonials.length) % testimonials.length
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
                {testimonials.map((t, idx) => (
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
                  (activeTestimonial + 1) % testimonials.length
                )
              }
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="testimonial-dots" aria-label="Select testimonial">
            {testimonials.map((_, idx) => (
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
          style={{ opacity: getSectionOpacity(0.96, 0.06) }}
        >
          <div className="cta-card interactive-card">
            <p className="cta-text">
              Let's build the bridge to your next success story.
            </p>

            <button className="cta-button">
              <Calendar width={24} height={24} />
              <span>Schedule a Consultation</span>
            </button>

            <div className="cta-footer">
              <div className="cta-icons">
                <a href="#" className="cta-icon-link">
                  <Linkedin width={28} height={28} />
                </a>
                <a href="#" className="cta-icon-link">
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