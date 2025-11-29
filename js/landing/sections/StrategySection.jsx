// Define StrategySection globally
window.StrategySection = ({ opacity, scrollProgress }) => {
  const { FADE_CONFIG, getOpacity } = window.LandingScrollHooks;
  const purposeOpacity = getOpacity(scrollProgress, FADE_CONFIG.strategyBlock1);
  const philosophyOpacity = getOpacity(scrollProgress, FADE_CONFIG.strategyBlock2);

  return (
    <section
      className="strategy-section"
      style={{
        opacity,
        pointerEvents: opacity > 0 ? "auto" : "none",
      }}
    >
      <div className="strategy-sequence">
        <div
          className="strategy-block"
          style={{
            opacity: purposeOpacity,
          }}
        >
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

        <div
          className="strategy-block"
          style={{
            opacity: philosophyOpacity,
          }}
        >
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
    </section>
  );
};
