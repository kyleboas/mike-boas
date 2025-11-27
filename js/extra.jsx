{/* Timeline – from college to today */}
        <div
          className="timeline-section"
          style={{ 
            opacity: timelineOpacity,
            pointerEvents: timelineOpacity > 0 ? "auto" : "none",
          }}
        >
          <h3 className="timeline-heading">35+ Years of Experience</h3>

          <div className="timeline-card" ref={timelineViewportRef}>
            <div
              className="timeline-list"
              ref={timelineListRef}
              style={{
                transform: `translate3d(0, ${displayY}px, 0)`,
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
                          (item.type === "education"
                            ? " timeline-logo-edu"
                            : "")
                        }
                      />
                    )}
                  </div>

                  <div className="timeline-content">
                    <p className="timeline-period">{item.period}</p>

                    <div className="timeline-title-row">
                      <h4 className="timeline-role">{item.org}</h4>
                      {item.yrs && (
                        <span className="timeline-yrs">{item.yrs}</span>
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
                          {item.featuredProject.description}
                        </p>
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