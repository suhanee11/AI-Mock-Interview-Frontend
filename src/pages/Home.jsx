import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Home() {
  const navigate = useNavigate();

  // Scroll reveal
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
        .step-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #3b82f6, transparent); opacity: 0; transition: opacity 0.25s; }
        .step-card:hover { border-color: rgba(59,130,246,0.2) !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(59,130,246,0.1); }
        .step-card:hover::before { opacity: 1; }

        .feature-link { position: relative; padding-bottom: 1px; }
        .feature-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #3b82f6; transition: width 0.2s ease; }
        .feature-link:hover::after { width: 100%; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.glowBlob} />

        <div style={styles.container}>

          {/* Nav */}
          <div style={styles.nav}>
            <span style={styles.logo}>PrepAI</span>
            <div style={styles.navLinks}>
              <span className="nav-link" style={styles.navLink} onClick={() => navigate("/interview")}>Interview</span>
              <span className="nav-link" style={styles.navLink} onClick={() => navigate("/ats")}>ATS Checker</span>
            </div>
          </div>

          {/* Hero */}
          <div style={styles.hero}>
            <div style={styles.eyebrowPill}>✦ AI Powered by Gemini</div>
            <h1 style={styles.heroTitle}>
              Ace your next<br />
              <span style={styles.heroBlue}>tech interview</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Practice with real AI feedback, get your resume scored against job descriptions,
              and walk into interviews fully prepared.
            </p>

            {/* Trust badges */}
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

            {/* Stats row */}
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
              { num: "Step 01", icon: "🎯", title: "Pick your role", desc: "Choose a target job role or upload your resume for personalized questions based on your actual experience." },
              { num: "Step 02", icon: "⏱️", title: "Answer 5 questions", desc: "Each question comes with a 90s timer. Type your answer or use voice input — just like a real interview." },
              { num: "Step 03", icon: "✨", title: "Get AI feedback", desc: "Receive detailed feedback on every answer — what you got right, what's missing, and how to improve." },
            ].map((s) => (
              <div key={s.num} className="step-card" style={styles.stepCard}>
                <div style={styles.stepNum}>{s.num}</div>
                <div style={styles.stepIcon}>{s.icon}</div>
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
              <div style={styles.featureIcon}>🎤</div>
              <p style={styles.featureEyebrow}>Mock interview</p>
              <h2 style={styles.featureTitle}>Practice like it's the real thing</h2>
              <p style={styles.featureDesc}>Select your target role and get 5 tailored technical questions — each with a 90 second timer. Answer by typing or speaking, and get detailed AI feedback on every response.</p>
              <span className="feature-link" style={styles.featureLink} onClick={() => navigate("/interview")}>Start interview →</span>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>📄</div>
              <p style={styles.featureEyebrow}>Resume mode</p>
              <h2 style={styles.featureTitle}>Questions based on your background</h2>
              <p style={styles.featureDesc}>Upload your resume and the AI generates questions specific to your actual projects, tech stack, and experience — not generic ones everyone else gets.</p>
              <span className="feature-link" style={styles.featureLink} onClick={() => navigate("/interview")}>Try it →</span>
            </div>
          </div>

          <div style={styles.hrLine} />

          <div className="reveal" style={styles.featuresGrid}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>📊</div>
              <p style={styles.featureEyebrow}>ATS checker</p>
              <h2 style={styles.featureTitle}>Know your resume score before applying</h2>
              <p style={styles.featureDesc}>Paste any job description and upload your resume. Get an ATS score out of 100, matched and missing keywords, and actionable suggestions to improve your chances.</p>
              <span className="feature-link" style={styles.featureLink} onClick={() => navigate("/ats")}>Check resume →</span>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🎙️</div>
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
  logo: { fontSize: "16px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" },
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

  // Trust badges
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

  // Stats
  statsRow: { display: "flex", alignItems: "center", gap: "2rem" },
  stat: { display: "flex", flexDirection: "column", gap: "2px" },
  statNum: { fontSize: "22px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" },
  statLabel: { fontSize: "12px", color: "#475569" },
  statDivider: { width: "1px", height: "32px", background: "#0d1f38" },

  // Section divider
  sectionDivider: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" },
  dividerLine: { flex: 1, height: "1px", background: "#0d1f38" },
  dividerLabel: { fontSize: "11px", color: "#1e3a5f", whiteSpace: "nowrap", letterSpacing: "0.05em" },

  // How it works
  stepsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" },
  stepCard: {
    background: "#0a1628", border: "1px solid #0d1f38",
    borderRadius: "12px", padding: "1.5rem",
  },
  stepNum: { fontSize: "11px", fontWeight: "700", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" },
  stepIcon: { fontSize: "1.75rem", marginBottom: "0.75rem" },
  stepTitle: { fontSize: "15px", fontWeight: "600", color: "#ffffff", marginBottom: "0.5rem" },
  stepDesc: { fontSize: "13px", color: "#475569", lineHeight: "1.6" },

  // Features
  featuresGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "3rem" },
  feature: { display: "flex", flexDirection: "column", gap: "0.6rem" },
  featureIcon: { fontSize: "1.5rem", marginBottom: "0.5rem" },
  featureEyebrow: { fontSize: "11px", color: "#3b82f6", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, fontWeight: "500" },
  featureTitle: { fontSize: "20px", fontWeight: "600", margin: 0, color: "#ffffff", lineHeight: "1.3", letterSpacing: "-0.02em" },
  featureDesc: { fontSize: "14px", color: "#475569", lineHeight: "1.7", margin: 0 },
  featureLink: { fontSize: "13px", color: "#3b82f6", cursor: "pointer", fontWeight: "500", marginTop: "0.25rem", width: "fit-content" },

  hrLine: { height: "1px", background: "#0d1f38", marginBottom: "3rem" },

  // CTA
  cta: { textAlign: "center", padding: "3rem 0", borderTop: "1px solid #0d1f38" },
  ctaTitle: { fontSize: "32px", fontWeight: "700", margin: "0 0 0.75rem", color: "#ffffff", letterSpacing: "-0.02em" },
  ctaSubtitle: { fontSize: "14px", color: "#475569", margin: "0 0 2rem" },

  footer: { textAlign: "center", color: "#1e3a5f", fontSize: "12px", marginTop: "2rem", paddingBottom: "2rem" },
};