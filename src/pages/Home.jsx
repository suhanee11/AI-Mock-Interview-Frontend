import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Clean SVG icons — no emojis
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconTimer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/><path d="M12 2v3"/>
  </svg>
);

const IconSparkle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

const IconMic = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
);

const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
  </svg>
);

const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        .nav-link { position: relative; padding-bottom: 2px; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: #3b82f6; transition: width 0.25s ease; }
        .nav-link:hover { color: #ffffff !important; }
        .nav-link:hover::after { width: 100%; }

        .btn-primary:hover { background: #2563eb !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.35); }
        .btn-primary:active { transform: translateY(0) !important; }
        .btn-secondary:hover { color: #ffffff !important; border-color: #3b82f6 !important; background: rgba(59,130,246,0.06) !important; }

        .step-card { transition: border-color 0.25s, transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
        .step-card:hover { border-color: rgba(59,130,246,0.25) !important; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(59,130,246,0.08); }

        .feature-link { position: relative; padding-bottom: 1px; }
        .feature-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #3b82f6; transition: width 0.2s ease; }
        .feature-link:hover::after { width: 100%; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.glowBlob} />
        <div style={styles.container}>

          {/* Nav */}
          <div style={styles.nav}>
           <span style={styles.logo}>Prep<span style={{ color: "#3b82f6", fontWeight: 700 }}>Sathi</span></span>
            <div style={styles.navLinks}>
              <span className="nav-link" style={styles.navLink} onClick={() => navigate("/interview")}>Interview</span>
              <span className="nav-link" style={styles.navLink} onClick={() => navigate("/ats")}>ATS Checker</span>
            </div>
          </div>

          {/* Hero */}
          <div style={styles.hero}>
            <div style={styles.eyebrowPill}>AI Powered by Gemini</div>
            <h1 style={styles.heroTitle}>
              Ace your next<br />
              <span style={styles.heroBlue}>tech interview</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Practice with real AI feedback, get your resume scored against job descriptions,
              and walk into interviews fully.
            </p>

            <div style={styles.trustBadges}>
              <div style={styles.badge}><div style={styles.badgeDot} />No signup needed</div>
              <span style={styles.badgeSep}>·</span>
              <div style={styles.badge}>100% Free</div>
              <span style={styles.badgeSep}>·</span>
              <div style={styles.badge}>Powered by Gemini</div>
            </div>

            <div style={styles.heroBtns}>
              <button className="btn-primary" style={styles.btnPrimary} onClick={() => navigate("/interview")}>Start interview →</button>
              <button className="btn-secondary" style={styles.btnSecondary} onClick={() => navigate("/ats")}>Check ATS score</button>
            </div>

            <div style={styles.statsRow}>
              <div style={styles.stat}><span style={styles.statNum}>5</span><span style={styles.statLabel}>Questions per session</span></div>
              <div style={styles.statDivider} />
              <div style={styles.stat}><span style={styles.statNum}>90s</span><span style={styles.statLabel}>Timer per question</span></div>
              <div style={styles.statDivider} />
              <div style={styles.stat}><span style={styles.statNum}>AI</span><span style={styles.statLabel}>Feedback on every answer</span></div>
            </div>
          </div>

          {/* How it works */}
          <div className="reveal" style={styles.sectionDivider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerLabel}>How it works</span>
            <div style={styles.dividerLine} />
          </div>

          <div className="reveal" style={styles.stepsRow}>
            {[
              { num: "01", icon: <IconTarget />, title: "Pick your role", desc: "Choose a target job role or upload your resume for personalized questions based on your actual experience." },
              { num: "02", icon: <IconTimer />, title: "Answer 5 questions", desc: "Each question comes with a 90s timer. Type your answer or use voice input — just like a real interview." },
              { num: "03", icon: <IconSparkle />, title: "Get AI feedback", desc: "Receive detailed feedback on every answer — what you got right, what's missing, and how to improve." },
            ].map((s) => (
              <div key={s.num} className="step-card" style={styles.stepCard}>
                <div style={styles.stepHeader}>
                  <div style={styles.stepIconWrap}>{s.icon}</div>
                  <span style={styles.stepNum}>{s.num}</span>
                </div>
                <div style={styles.stepTitle}>{s.title}</div>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ ...styles.hrLine, marginTop: "3rem" }} />

          {/* What you can do */}
          <div className="reveal" style={styles.sectionDivider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerLabel}>What you can do</span>
            <div style={styles.dividerLine} />
          </div>

          <div className="reveal" style={styles.featuresGrid}>
            <div style={styles.feature}>
              <div style={styles.featureIconWrap}><IconMic /></div>
              <p style={styles.featureEyebrow}>Mock interview</p>
              <h2 style={styles.featureTitle}>Practice like it's the real thing</h2>
              <p style={styles.featureDesc}>Select your target role and get 5 tailored technical questions — each with a 90 second timer. Answer by typing or speaking, and get detailed AI feedback on every response.</p>
              <span className="feature-link" style={styles.featureLink} onClick={() => navigate("/interview")}>Start interview →</span>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIconWrap}><IconDoc /></div>
              <p style={styles.featureEyebrow}>Resume mode</p>
              <h2 style={styles.featureTitle}>Questions based on your background</h2>
              <p style={styles.featureDesc}>Upload your resume and the AI generates questions specific to your actual projects, tech stack, and experience — not generic ones everyone else gets.</p>
              <span className="feature-link" style={styles.featureLink} onClick={() => navigate("/interview")}>Try it →</span>
            </div>
          </div>

          <div style={styles.hrLine} />

          <div className="reveal" style={styles.featuresGrid}>
            <div style={styles.feature}>
              <div style={styles.featureIconWrap}><IconChart /></div>
              <p style={styles.featureEyebrow}>ATS checker</p>
              <h2 style={styles.featureTitle}>Know your resume score before applying</h2>
              <p style={styles.featureDesc}>Paste any job description and upload your resume. Get an ATS score out of 100, matched and missing keywords, and actionable suggestions to improve your chances.</p>
              <span className="feature-link" style={styles.featureLink} onClick={() => navigate("/ats")}>Check resume →</span>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIconWrap}><IconMic /></div>
              <p style={styles.featureEyebrow}>Voice input</p>
              <h2 style={styles.featureTitle}>Speak your answers out loud</h2>
              <p style={styles.featureDesc}>Real interviews are verbal — so practice that way. Click the mic, speak your answer, and the app transcribes it in real time. Much more realistic than typing.</p>
              <span className="feature-link" style={styles.featureLink} onClick={() => navigate("/interview")}>Try voice mode →</span>
            </div>
          </div>

          <div style={styles.hrLine} />

          {/* CTA */}
          <div className="reveal" style={styles.cta}>
            <h2 style={styles.ctaTitle}>Ready to start?</h2>
            <p style={styles.ctaSubtitle}>No signup needed. Just pick a role and go.</p>
            <button className="btn-primary" style={styles.btnPrimary} onClick={() => navigate("/interview")}>Start interview →</button>
          </div>

          <p style={styles.footer}>Powered by Gemini AI · Built with Spring Boot + React</p>

        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#060c18",
    color: "#e2e8f0",
    position: "relative",
    overflowX: "hidden",
  },
  glowBlob: {
    position: "fixed",
    top: "-120px", left: "50%",
    transform: "translateX(-50%)",
    width: "800px", height: "600px",
    background: "radial-gradient(ellipse, rgba(59,130,246,0.13) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 3rem",
    position: "relative",
    zIndex: 1,
  },

  // Nav
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "5rem", paddingTop: "0.5rem",
    borderBottom: "1px solid #0d1f38", paddingBottom: "1.25rem",
  },
  logo: { fontSize: "22px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" },
  navLinks: { display: "flex", gap: "2rem" },
  navLink: { fontSize: "13px", color: "#64748b", cursor: "pointer", transition: "color 0.2s" },

  // Hero
  hero: { marginBottom: "5rem" },
  eyebrowPill: {
    display: "inline-block", fontSize: "11px", color: "#3b82f6",
    letterSpacing: "0.06em", background: "rgba(59,130,246,0.1)",
    border: "1px solid rgba(59,130,246,0.2)", borderRadius: "20px",
    padding: "4px 14px", marginBottom: "1.5rem", fontWeight: "500",
  },
  heroTitle: {
    fontSize: "58px", fontWeight: "700", lineHeight: "1.1",
    letterSpacing: "-0.03em", margin: "0 0 1.5rem", color: "#ffffff",
  },
  heroBlue: { color: "#3b82f6" },
  heroSubtitle: {
    fontSize: "16px", color: "#64748b", lineHeight: "1.7",
    maxWidth: "520px", margin: "0 0 1.5rem",
  },

  trustBadges: { display: "flex", gap: "1.25rem", alignItems: "center", marginBottom: "2rem" },
  badge: { display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#475569", letterSpacing: "0.03em" },
  badgeDot: { width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" },
  badgeSep: { color: "#0d1f38", fontSize: "14px" },

  heroBtns: { display: "flex", gap: "0.75rem", marginBottom: "3rem" },
  btnPrimary: {
    padding: "11px 26px", fontSize: "14px", fontWeight: "600",
    background: "#3b82f6", color: "#ffffff", border: "none",
    borderRadius: "8px", cursor: "pointer", transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
  },
  btnSecondary: {
    padding: "11px 26px", fontSize: "14px", fontWeight: "500",
    background: "transparent", color: "#94a3b8",
    border: "1px solid #1e3a5f", borderRadius: "8px",
    cursor: "pointer", transition: "color 0.2s, border-color 0.2s, background 0.2s",
  },

  statsRow: { display: "flex", alignItems: "center", gap: "2rem" },
  stat: { display: "flex", flexDirection: "column", gap: "2px" },
  statNum: { fontSize: "22px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" },
  statLabel: { fontSize: "12px", color: "#475569" },
  statDivider: { width: "1px", height: "32px", background: "#0d1f38" },

  sectionDivider: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" },
  dividerLine: { flex: 1, height: "1px", background: "#0d1f38" },
  dividerLabel: { fontSize: "11px", color: "#1e3a5f", whiteSpace: "nowrap", letterSpacing: "0.05em" },

  // Steps — icon + number side by side, no big emoji
  stepsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" },
  stepCard: {
    background: "#0a1628", border: "1px solid #0d1f38",
    borderRadius: "12px", padding: "1.5rem",
  },
  stepHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "1rem",
  },
  stepIconWrap: {
    width: "36px", height: "36px",
    background: "rgba(59,130,246,0.1)",
    border: "1px solid rgba(59,130,246,0.15)",
    borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#3b82f6",
  },
  stepNum: {
    fontSize: "11px", fontWeight: "700", color: "#1e3a5f",
    letterSpacing: "0.08em",
  },
  stepTitle: { fontSize: "15px", fontWeight: "600", color: "#ffffff", marginBottom: "0.5rem" },
  stepDesc: { fontSize: "13px", color: "#475569", lineHeight: "1.6", margin: 0 },

  // Features
  featuresGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "3rem" },
  feature: { display: "flex", flexDirection: "column", gap: "0.6rem" },
  featureIconWrap: {
    width: "36px", height: "36px",
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.12)",
    borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#3b82f6", marginBottom: "0.5rem",
  },
  featureEyebrow: { fontSize: "11px", color: "#3b82f6", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, fontWeight: "500" },
  featureTitle: { fontSize: "20px", fontWeight: "600", margin: 0, color: "#ffffff", lineHeight: "1.3", letterSpacing: "-0.02em" },
  featureDesc: { fontSize: "14px", color: "#475569", lineHeight: "1.7", margin: 0 },
  featureLink: { fontSize: "13px", color: "#3b82f6", cursor: "pointer", fontWeight: "500", marginTop: "0.25rem", width: "fit-content" },

  hrLine: { height: "1px", background: "#0d1f38", marginBottom: "3rem" },

  cta: { textAlign: "center", padding: "3rem 0", borderTop: "1px solid #0d1f38" },
  ctaTitle: { fontSize: "32px", fontWeight: "700", margin: "0 0 0.75rem", color: "#ffffff", letterSpacing: "-0.02em" },
  ctaSubtitle: { fontSize: "14px", color: "#475569", margin: "0 0 2rem" },

  footer: { textAlign: "center", color: "#1e3a5f", fontSize: "12px", marginTop: "2rem", paddingBottom: "2rem" },
};