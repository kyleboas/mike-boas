import React from "react";

const HeroSection = ({ heroOpacity, onEmailFocus, onEmailBlur }) => (
  <section
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

      <div className="email-row">
        <div className="email-card interactive-card">
          <div className="email-inner">
            <input
              type="email"
              placeholder="your@email.com"
              className="email-input"
              onFocus={onEmailFocus}
              onBlur={onEmailBlur}
            />
            <button className="primary-button">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
