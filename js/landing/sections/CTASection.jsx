import React from "react";
import { Calendar, Mail, Linkedin } from "../icons";

const CTASection = ({ opacity }) => {
  const handleScheduleClick = () => {
    window.open(
      "https://calendly.com/heyboas/30-minute-zoom-call",
      "_blank"
    );
  };

  return (
    <section
      className="cta-section"
      style={{
        opacity,
      }}
    >
      <div
        className="cta-card interactive-card"
        style={{ pointerEvents: opacity > 0 ? "auto" : "none" }}
      >
        <p className="cta-text">
          {"Let's"} build the bridge to your next success story.
        </p>

        <button className="cta-button" onClick={handleScheduleClick}>
          <Calendar width={24} height={24} />
          <span>Schedule a Consultation</span>
        </button>

        <div className="cta-footer">
          <div className="cta-icons">
            <a
              href="https://www.linkedin.com/in/g-michael-boas"
              className="cta-icon-link"
            >
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
    </section>
  );
};

export default CTASection;
