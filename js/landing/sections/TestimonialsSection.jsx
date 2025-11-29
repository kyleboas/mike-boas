// Use global React hooks
const { useState } = React;

// Define TestimonialsSection globally
window.TestimonialsSection = ({ opacity, testimonials }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = window.LandingScrollHooks.useAutoRotatingIndex(
    testimonials.length,
    6000,
    isPaused
  );

  const handlePrevious = () => {
    setActiveTestimonial(
      (activeTestimonial - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setActiveTestimonial((activeTestimonial + 1) % testimonials.length);
  };

  return (
    <section
      className="testimonial-section"
      style={{
        opacity,
      }}
    >
      <div
        className="testimonial-wrapper"
        style={{ pointerEvents: opacity > 0 ? "auto" : "none" }}
      >
        <button
          type="button"
          className="testimonial-nav testimonial-nav-left"
          onClick={handlePrevious}
        >
          ‹
        </button>

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

        <button
          type="button"
          className="testimonial-nav testimonial-nav-right"
          onClick={handleNext}
        >
          ›
        </button>
      </div>

      <div
        className="testimonial-dots"
        aria-label="Select testimonial"
        style={{ pointerEvents: opacity > 0 ? "auto" : "none" }}
      >
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
    </section>
  );
};
