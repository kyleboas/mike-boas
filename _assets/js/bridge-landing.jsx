const { useState, useEffect, useRef, useMemo } = React;
const {
  Mail,
  Calendar,
  ArrowRight,
  CheckCircle,
  Linkedin,
  TrendingUp,
  Users,
  Target,
  Quote,
} = lucideReact;

const BridgeLanding = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  // Total height multiplier (e.g., 10x screen height for the scroll distance)
  const SCROLL_HEIGHT_MULTIPLIER = 12;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight - windowHeight;

      // Calculate progress from 0 to 1
      const progress = Math.max(0, Math.min(1, scrollTop / docHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Helper to calculate opacity based on scroll "slots" ---
  // triggerPoint: 0.1 means 10% down the page.
  // duration: how long (in scroll %) it stays visible.
  const getSectionOpacity = (triggerPoint, duration = 0.08) => {
    const fadeInStart = triggerPoint - 0.04;
    const fadeInEnd = triggerPoint;
    const fadeOutStart = triggerPoint + duration;
    const fadeOutEnd = triggerPoint + duration + 0.04;

    if (scrollProgress < fadeInStart || scrollProgress > fadeOutEnd) return 0;
    if (scrollProgress >= fadeInEnd && scrollProgress <= fadeOutStart) return 1;

    // Fading in
    if (scrollProgress < fadeInEnd) {
      return (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    }

    // Fading out
    if (scrollProgress > fadeOutStart) {
      return 1 - (scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
    }
    return 0;
  };

  // --- Dynamic Styles based on Scroll ---

  // 1. Sky Gradient: Night -> Dawn -> Day
  const getSkyBackground = () => {
    if (scrollProgress < 0.3) {
      // Night to Dawn
      const t = scrollProgress / 0.3;
      return `linear-gradient(to bottom, 
        rgb(${10 * (1 - t) + 30 * t}, ${15 * (1 - t) + 20 * t}, ${
        30 * (1 - t) + 60 * t
      }), 
        rgb(${20 * (1 - t) + 80 * t}, ${25 * (1 - t) + 40 * t}, ${
        50 * (1 - t) + 80 * t
      }))`;
    } else if (scrollProgress < 0.6) {
      // Dawn to Sunrise
      const t = (scrollProgress - 0.3) / 0.3;
      return `linear-gradient(to bottom, 
        rgb(${30 * (1 - t) + 135 * t}, ${20 * (1 - t) + 206 * t}, ${
        60 * (1 - t) + 235 * t
      }), 
        rgb(${80 * (1 - t) + 255 * t}, ${40 * (1 - t) + 200 * t}, ${
        80 * (1 - t) + 150 * t
      }))`;
    } else {
      // Sunrise to Day
      const t = (scrollProgress - 0.6) / 0.4;
      return `linear-gradient(to bottom, 
        rgb(${135 * (1 - t) + 135 * t}, ${206 * (1 - t) + 206 * t}, ${
        235 * (1 - t) + 250 * t
      }), 
        rgb(${255 * (1 - t) + 200 * t}, ${200 * (1 - t) + 230 * t}, ${
        150 * (1 - t) + 255 * t
      }))`;
    }
  };

  // 2. Sun Position & Style
  const sunBottom = -10 + scrollProgress * 90; // Starts -10% ends 80% up
  const sunColor = scrollProgress < 0.4 ? "#ff4500" : "#fdb813"; // Red to Yellow
  const sunShadow =
    scrollProgress < 0.4
      ? "0 0 40px rgba(255, 69, 0, 0.6)"
      : "0 0 80px rgba(253, 184, 19, 0.8)";

  // 3. Bridge Animation (Sketch -> Built)
  // We'll use two SVG paths. One dashed (sketch), one solid (built).
  // Opacity of "built" layer increases with scroll.
  const builtOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.1) * 1.5));
  const sketchOpacity = 1 - builtOpacity;
  const bridgeScale = 1 + scrollProgress * 0.2; // Mild zoom effect
  const bridgeTranslateY = (1 - scrollProgress) * 5; // Slight rise

  return (
    <div
      ref={containerRef}
      style={{ height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
      className="relative w-full"
    >
      {/* --- Fixed Viewport (The Screen) --- */}
      <div
        className="fixed top-0 left-0 w-full h-screen overflow-hidden transition-colors duration-700"
        style={{ background: getSkyBackground() }}
      >
        {/* --- Stars (Fade out by 30%) --- */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 4) }}
        >
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                width: Math.random() > 0.5 ? "2px" : "3px",
                height: Math.random() > 0.5 ? "2px" : "3px",
                opacity: Math.random() * 0.8,
              }}
            />
          ))}
        </div>

        {/* --- The Sun --- */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: "120px",
            height: "120px",
            bottom: `${sunBottom}%`,
            background: sunColor,
            boxShadow: sunShadow,
            zIndex: 1,
          }}
        />

        {/* --- Content Sections (Floating in Sky) --- */}
        {/* We map scroll ranges to component visibility */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white pointer-events-none">
          {/* Section 1: Hero (0% - 12%) */}
          <div
            className="absolute w-full max-w-4xl transition-all duration-700 transform"
            style={{
              opacity: getSectionOpacity(0.02, 0.08),
              transform: `translateY(${
                getSectionOpacity(0.02, 0.08) === 0 ? "20px" : "0px"
              })`,
            }}
          >
            <h1 className="text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
              John Doe
            </h1>
            <h2 className="text-4xl font-light mb-6 text-blue-100 drop-shadow-md">
              The Bridge Builder
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Connecting people to projects
            </p>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl inline-block pointer-events-auto border border-white/20 shadow-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="px-4 py-2 rounded-lg bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                />
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
                  Stay in touch
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Logo Marquee (15% - 25%) */}
          <div
            className="absolute w-full max-w-5xl transition-all duration-700"
            style={{ opacity: getSectionOpacity(0.18, 0.08) }}
          >
            <h3 className="text-2xl font-light mb-8 uppercase tracking-widest drop-shadow-md">
              Trusted By Industry Leaders
            </h3>
            <div className="flex flex-wrap justify-center gap-12 opacity-80">
              {["Pfizer", "J&J", "Moderna", "Novartis", "Merck"].map(
                (logo, idx) => (
                  <div
                    key={idx}
                    className="text-3xl font-serif font-bold drop-shadow-lg"
                  >
                    {logo}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Section 3: Services (30% - 42%) */}
          <div
            className="absolute w-full max-w-6xl transition-all duration-700"
            style={{ opacity: getSectionOpacity(0.32, 0.1) }}
          >
            <h3 className="text-4xl font-bold mb-12 drop-shadow-lg">
              Strategic Solutions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Medical Affairs",
                  icon: <Users size={32} />,
                  desc: "Expert guidance on medical strategy and stakeholder engagement.",
                },
                {
                  title: "Marketing Strategy",
                  icon: <Target size={32} />,
                  desc: "Bridge the gap between product potential and market adoption.",
                },
                {
                  title: "AI Integration",
                  icon: <TrendingUp size={32} />,
                  desc: "Leveraging future-tech for pharmaceutical advancement.",
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl transition-all duration-500"
                  style={{
                    transform: `translateY(${
                      scrollProgress < 0.32 ? "50px" : "0"
                    })`,
                    opacity: scrollProgress > 0.32 ? 1 : 0,
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <div className="mb-4 text-blue-300">{service.icon}</div>
                  <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                  <p className="text-sm opacity-80 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Impact (45% - 55%) */}
          <div
            className="absolute w-full max-w-5xl transition-all duration-700"
            style={{ opacity: getSectionOpacity(0.48, 0.08) }}
          >
            <h3 className="text-4xl font-bold mb-12 drop-shadow-lg">
              Measurable Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Engagement Increase", val: "150%" },
                { label: "YoY Growth", val: "45%" },
                { label: "Strategic Accuracy", val: "99.9%" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-6xl font-black text-yellow-400 mb-2 drop-shadow-lg">
                    {stat.val}
                  </div>
                  <div className="text-xl font-medium tracking-wide uppercase opacity-90">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Experience Timeline (58% - 70%) */}
          <div
            className="absolute w-full max-w-3xl transition-all duration-700"
            style={{ opacity: getSectionOpacity(0.62, 0.1) }}
          >
            <h3 className="text-4xl font-bold mb-10 drop-shadow-lg">
              35+ Years of Excellence
            </h3>
            <div className="relative border-l-2 border-white/30 ml-6 md:ml-0 md:pl-8 space-y-8 text-left">
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
                  year: "1988 - 1995",
                  role: "Clinical Research",
                  desc: "Foundational experience in trial management.",
                },
              ].map((item, i) => (
                <div key={i} className="relative pl-8 md:pl-0">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] md:-left-[41px] top-1 w-4 h-4 bg-yellow-400 rounded-full shadow-lg border-2 border-white/50"></div>
                  <h4 className="text-2xl font-bold text-yellow-200">
                    {item.year}
                  </h4>
                  <h5 className="text-xl font-semibold mb-1">{item.role}</h5>
                  <p className="opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Testimonials (72% - 82%) */}
          <div
            className="absolute w-full max-w-4xl transition-all duration-700"
            style={{ opacity: getSectionOpacity(0.76, 0.08) }}
          >
            <Quote className="w-12 h-12 mb-6 mx-auto text-yellow-400 opacity-80" />
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl">
                <p className="text-2xl italic font-light leading-relaxed mb-4">
                  "John isn't just a consultant; he's a true partner. He built
                  the bridge that allowed our R&D and Marketing teams to finally
                  speak the same language."
                </p>
                <p className="font-bold text-lg">-- Sarah J., VP of Oncology</p>
              </div>
            </div>
          </div>

          {/* Section 7: Calling Card & Footer (85% - 100%) */}
          <div
            className="absolute w-full max-w-2xl transition-all duration-700"
            style={{ opacity: getSectionOpacity(0.9, 0.15) }}
          >
            {/* Card */}
            <div className="bg-white text-slate-900 p-10 rounded-2xl shadow-2xl pointer-events-auto transform transition-transform hover:scale-105 duration-300">
              <h2 className="text-4xl font-bold mb-4 text-slate-800">
                Ready to get to work?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Let's build the bridge to your next success story.
              </p>

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-8">
                <Calendar size={24} />
                Schedule a Consultation
              </button>

              <div className="border-t border-slate-200 pt-6 flex flex-col items-center">
                <div className="flex gap-6 mb-4">
                  <a
                    href="#"
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={28} />
                  </a>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={28} />
                  </a>
                </div>
                <p className="text-slate-400 text-sm">
                  © 2024 John Doe Consulting. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- The Bridge (Bottom Layer) --- */}
        <div
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          style={{
            zIndex: 10,
            height: "45vh", // Height of the bridge visual
            transform: `scale(${bridgeScale}) translateY(${bridgeTranslateY}%)`,
            transformOrigin: "bottom center",
            transition: "transform 0.1s linear",
          }}
        >
          {/* We overlap two SVGs: One is sketch style, one is built style. We crossfade opacity. */}

          {/* Layer 1: The Sketch (Dashed, White/Gray, Hand-drawn look) */}
          <svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            style={{ opacity: sketchOpacity }}
          >
            {/* Cables */}
            <path
              d="M0,50 Q250,350 500,150 T1000,50"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <path
              d="M0,80 Q250,380 500,180 T1000,80"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* Towers */}
            <line
              x1="200"
              y1="400"
              x2="200"
              y2="50"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="4"
              strokeDasharray="4,8"
            />
            <line
              x1="800"
              y1="400"
              x2="800"
              y2="50"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="4"
              strokeDasharray="4,8"
            />

            {/* Vertical Suspenders (Randomized loop logic simulated by hardcoding a few for sketch) */}
            {[...Array(20)].map((_, i) => (
              <line
                key={i}
                x1={50 + i * 45}
                y1="400"
                x2={50 + i * 45}
                y2="100"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            ))}

            {/* Deck */}
            <path
              d="M0,350 L1000,250"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
            <path
              d="M0,380 L1000,280"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
          </svg>

          {/* Layer 2: The Built Bridge (Solid, Colored, Strong) */}
          <svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            style={{ opacity: builtOpacity }}
          >
            {/* Back Cables */}
            <path
              d="M-50,60 Q250,360 500,160 T1050,60"
              fill="none"
              stroke="#5d1a1a"
              strokeWidth="4"
            />

            {/* Towers */}
            {/* Left Tower */}
            <rect x="180" y="50" width="40" height="350" fill="#7b2222" />
            <rect x="190" y="60" width="20" height="300" fill="#963333" />
            <line
              x1="180"
              y1="120"
              x2="220"
              y2="120"
              stroke="#5d1a1a"
              strokeWidth="5"
            />
            <line
              x1="180"
              y1="220"
              x2="220"
              y2="220"
              stroke="#5d1a1a"
              strokeWidth="5"
            />

            {/* Right Tower */}
            <rect x="780" y="50" width="40" height="350" fill="#7b2222" />
            <rect x="790" y="60" width="20" height="300" fill="#963333" />
            <line
              x1="780"
              y1="120"
              x2="820"
              y2="120"
              stroke="#5d1a1a"
              strokeWidth="5"
            />
            <line
              x1="780"
              y1="220"
              x2="820"
              y2="220"
              stroke="#5d1a1a"
              strokeWidth="5"
            />

            {/* Main Cables */}
            <path
              d="M-50,50 Q250,350 500,150 T1050,50"
              fill="none"
              stroke="#963333"
              strokeWidth="6"
            />

            {/* Vertical Suspenders */}
            {[...Array(25)].map((_, i) => {
              const x = 50 + i * 38;
              // Simple parabola approx for cable height
              const distFromCenter = Math.abs(x - 500) / 500;
              const cableY = 150 + 200 * distFromCenter * distFromCenter;
              return (
                <line
                  key={i}
                  x1={x}
                  y1="350"
                  x2={x}
                  y2={cableY}
                  stroke="#7b2222"
                  strokeWidth="2"
                />
              );
            })}

            {/* The Deck */}
            {/* Perspective Deck - wider at bottom (left) narrowing to right? 
                Actually user said "Get closer to other side". 
                Let's make it a straight heavy beam for stability. */}
            <path d="M-100,350 L1100,350" stroke="#333" strokeWidth="40" />
            <line
              x1="-100"
              y1="335"
              x2="1100"
              y2="335"
              stroke="#555"
              strokeWidth="5"
            />{" "}
            {/* Railing */}
            <line
              x1="-100"
              y1="370"
              x2="1100"
              y2="370"
              stroke="#222"
              strokeWidth="10"
            />{" "}
            {/* Under structure */}
          </svg>
        </div>
      </div>

      {/* Helper Text (Only visible if they haven't scrolled) */}
      <div
        className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce transition-opacity duration-500 pointer-events-none z-50 ${
          scrollProgress > 0.05 ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-sm uppercase tracking-widest mb-2">
          Scroll to Begin Journey
        </p>
        <div className="w-6 h-10 border-2 border-white rounded-full mx-auto flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Mount the component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BridgeLanding />);