import React from "react";

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

const TimelineSection = ({ opacity }) => {
  return (
    <section
      className="timeline-section"
      style={{
        opacity,
        pointerEvents: opacity > 0 ? "auto" : "none",
      }}
    >
      <h3 className="section-label">Career Timeline</h3>
      <div className="timeline-container">
        {careerTimeline.map((item, idx) => (
          <div key={idx} className="timeline-item">
            <img src={item.logo} alt={item.org} className="timeline-logo" />
            <div className="timeline-content">
              <h4>{item.org}</h4>
              {item.period && <p className="timeline-period">{item.period}</p>}
              {item.role && <p className="timeline-role">{item.role}</p>}
              {item.summary && <p className="timeline-summary">{item.summary}</p>}
              {item.bullets && (
                <ul className="timeline-bullets">
                  {item.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;
