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
   Main component
------------------------------------------------------------------ */
const BridgeLanding = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      quote:
        "I've had the privilege of both working in Medical Information under Mike's leadership, and partnering with Mike and the MI organization during my time in Medical Affairs. Mike brings unique perspective with his extensive background in marketing and sales, which has not only enhanced the visibility and impact of Medical Information across the organization, but also motivated the team to deliver new customer centric digital solutions. Above all, Mike prioritizes people first, ensuring each and every person on the team are empowered to pursue personal development and growth. Mike's leadership and commitment to both innovation and team development have made a meaningful impact, and I am thankful to have had the opportunity to work with and learn from him.",
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
  ];

  const currentTestimonial = testimonials[activeTestimonial];

  const SCROLL_HEIGHT_MULTIPLIER = 10;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0
          ? Math.max(0, Math.min(1, scrollTop / docHeight))
          : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Floating content */}
      <div className="floating-content">
        {/* Hero Section */}
        <div
          className="hero-section"
          style={{
            transform: `translate(-50%, ${
              getSectionOpacity(0.02, 0.08) === 0 ? "20px" : "0px"
            })`,
            opacity: getSectionOpacity(0.02, 0.08),
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
                  <button className="primary-button">Receive insights</button>
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
              <h3 className="strategy-subheading">Purpose</h3>
              <p className="strategy-text">
                To elevate human potential and amplify human impact
              </p>
              <p className="strategy-text strategy-text-italic">
                Creating the space for people and organizations to achieve extraordinary results.
              </p>
            </div>

            {/* 2 */}
            <div
              className="strategy-block"
              style={{
                opacity: getSectionOpacity(0.36, 0.06),
              }}
            >
              <h3 className="strategy-subheading">Philosophy</h3>
              <p className="strategy-text">People Before Projects</p>
              <p className="strategy-text strategy-text-italic">
                Because when people feel valued, belief builds, alignment follows, and execution becomes unstoppable.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div
          className="timeline-section"
          style={{ opacity: getSectionOpacity(0.62, 0.1) }}
        >
          <div className="timeline-card">
            <h3 className="timeline-heading">35+ Years of Excellence</h3>

            <div className="timeline-list">
              {[
                {
                  year: "2020 - Present",
                  role: "Strategic Advisor",
                  desc: "Leading AI transformations for top pharma.",
                },
                {
                  year: "2010 - 2020",
                  role: "VP of Global Marketing",
                  desc: "Directed launch strategies for 5 blockbuster drugs.",
                },
                {
                  year: "1995 - 2010",
                  role: "Medical Director",
                  desc: "Built bridges between clinical R&D and commercial teams.",
                },
                {
                  year: "1991 - 1996",
                  role: "CV Sales Representative",
                },
              ].map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <h4 className="timeline-year">{item.year}</h4>
                  <h5 className="timeline-role">{item.role}</h5>
                  {item.desc && (
                    <p className="timeline-desc">{item.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div
          className="testimonial-section"
          style={{ opacity: getSectionOpacity(0.76, 0.08) }}
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
          style={{ opacity: getSectionOpacity(0.9, 0.15) }}
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