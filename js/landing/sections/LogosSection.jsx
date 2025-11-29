// Define LogosSection globally
window.LogosSection = ({ opacity }) => {
  const logos = [
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

  return (
    <section
      className="logos-section"
      style={{
        opacity,
        pointerEvents: opacity > 0 ? "auto" : "none",
      }}
    >
      <h3 className="section-label">Trusted By Industry Leaders</h3>

      <div className="logos-row">
        {logos.map((logo, idx) => (
          <div key={idx} className="logo-card">
            <img src={logo.src} alt={logo.alt} className={logo.class} />
          </div>
        ))}
      </div>
    </section>
  );
};
