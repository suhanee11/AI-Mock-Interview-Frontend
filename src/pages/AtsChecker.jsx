import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAts } from "../service/session";

export default function AtsChecker() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleCheck = async () => {
    if (!resumeFile || !jobDescription.trim()) return;
    setLoading(true); setError(""); setResult(null);

    try {
      const { data } = await checkAts(resumeFile, jobDescription);
      const clean = data.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch {
      setError("ATS check failed. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setResumeFile(file);
  };

  const scoreColor = result
    ? result.atsScore >= 70 ? "#22c55e" : result.atsScore >= 40 ? "#f59e0b" : "#ef4444"
    : "#4f8ef7";

  const scoreLabel = result
    ? result.atsScore >= 70 ? "Strong Match" : result.atsScore >= 40 ? "Moderate Match" : "Weak Match"
    : "";

  const scoreBg = result
    ? result.atsScore >= 70 ? "rgba(34,197,94,0.08)" : result.atsScore >= 40 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)"
    : "";

  const scoreBorder = result
    ? result.atsScore >= 70 ? "rgba(34,197,94,0.2)" : result.atsScore >= 40 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)"
    : "";

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.logo}>Prep<span style={{ color: "#4f8ef7" }}>Sathi</span></div>
        <div style={s.navLinks}>
          <span onClick={() => navigate("/")} style={s.navLink}>Interview</span>
          <span style={{ ...s.navLink, color: "#4f8ef7" }}>ATS Checker</span>
        </div>
      </nav>

      <div style={s.wrapper}>
        {/* Back + badge row */}
        <div style={s.topRow}>
          <button onClick={() => navigate("/")} style={s.backBtn}>
            ← Back
          </button>
          <div style={s.badge}>
            <div style={s.badgeDot} />
            AI Powered by Gemini
          </div>
        </div>

        {/* Header */}
        <h1 style={s.title}>ATS Score Checker</h1>
        <p style={s.subtitle}>See how well your resume matches a job description</p>

        <div style={s.divider} />

        {!result ? (
          <div style={s.formCard}>
            {/* Upload */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Upload Resume <span style={s.labelMuted}>(PDF or TXT)</span></label>
              <label
                style={{ ...s.uploadBox, borderColor: dragOver ? "#4f8ef7" : resumeFile ? "rgba(79,142,247,0.4)" : "rgba(255,255,255,0.1)", background: dragOver ? "rgba(79,142,247,0.06)" : resumeFile ? "rgba(79,142,247,0.04)" : "rgba(255,255,255,0.02)" }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept=".pdf,.txt" style={{ display: "none" }}
                  onChange={e => setResumeFile(e.target.files[0])} />
                {resumeFile ? (
                  <div style={s.uploadSuccess}>
                    <div style={s.fileIcon}>📄</div>
                    <div>
                      <div style={{ color: "#7aabf9", fontSize: "13px", fontWeight: 500 }}>{resumeFile.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: 2 }}>Click to change file</div>
                    </div>
                  </div>
                ) : (
                  <div style={s.uploadEmpty}>
                    <div style={s.uploadIcon}>↑</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Click or drag your resume here</div>
                    <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: 4 }}>PDF or TXT supported</div>
                  </div>
                )}
              </label>
            </div>

            {/* Job description */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Paste Job Description</label>
              <textarea
                style={s.textarea}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={6}
              />
            </div>

            {error && (
              <div style={s.errorBox}>
                <span style={{ color: "#f87171", fontSize: "13px" }}>⚠ {error}</span>
              </div>
            )}

            <button
              style={{ ...s.primaryBtn, opacity: (resumeFile && jobDescription.trim() && !loading) ? 1 : 0.4, cursor: (resumeFile && jobDescription.trim() && !loading) ? "pointer" : "not-allowed" }}
              onClick={handleCheck}
              disabled={!resumeFile || !jobDescription.trim() || loading}
            >
              {loading ? (
                <><span style={s.spinner} /> Analyzing Resume...</>
              ) : (
                "Check ATS Score →"
              )}
            </button>
          </div>
        ) : (
          /* Results */
          <div>
            {/* Score card */}
            <div style={{ ...s.scoreCard, background: scoreBg, borderColor: scoreBorder }}>
              <div style={s.scoreLeft}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke={scoreColor} strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - result.atsScore / 100)}
                    strokeLinecap="round" transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 1.2s ease" }}
                  />
                  <text x="50" y="46" textAnchor="middle" fontSize="22" fontWeight="700" fill={scoreColor}>{result.atsScore}</text>
                  <text x="50" y="62" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)">/100</text>
                </svg>
              </div>
              <div style={s.scoreRight}>
                <div style={{ color: scoreColor, fontSize: "18px", fontWeight: 600, marginBottom: 6 }}>{scoreLabel}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.6 }}>{result.summary}</div>
              </div>
            </div>

            {/* Matched keywords */}
            <div style={s.section}>
              <h3 style={{ ...s.sectionTitle, color: "#4ade80" }}>Matched Keywords</h3>
              <div style={s.tags}>
                {result.matchedKeywords?.map(k => (
                  <span key={k} style={{ ...s.tag, background: "rgba(34,197,94,0.1)", color: "#86efac", border: "0.5px solid rgba(34,197,94,0.2)" }}>{k}</span>
                ))}
              </div>
            </div>

            {/* Missing keywords */}
            <div style={s.section}>
              <h3 style={{ ...s.sectionTitle, color: "#f87171" }}>Missing Keywords</h3>
              <div style={s.tags}>
                {result.missingKeywords?.map(k => (
                  <span key={k} style={{ ...s.tag, background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "0.5px solid rgba(239,68,68,0.2)" }}>{k}</span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div style={s.section}>
              <h3 style={{ ...s.sectionTitle, color: "#fbbf24" }}>Suggestions</h3>
              <ul style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: "2", paddingLeft: "1.2rem", margin: 0 }}>
                {result.suggestions?.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
              </ul>
            </div>

            <button style={{ ...s.primaryBtn, background: "transparent", border: "0.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
              onClick={() => { setResult(null); setResumeFile(null); setJobDescription(""); }}>
              ↺ Check Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#080e1a",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#fff",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 48px",
    borderBottom: "0.5px solid rgba(255,255,255,0.07)",
    background: "rgba(8,14,26,0.85)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: { fontSize: "17px", fontWeight: 600, letterSpacing: "-0.3px" },
  navLinks: { display: "flex", gap: "32px", alignItems: "center" },
  navLink: { color: "rgba(255,255,255,0.5)", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" },
  wrapper: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    fontSize: "13px",
    padding: 0,
    transition: "color 0.2s",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(79,142,247,0.12)",
    border: "0.5px solid rgba(79,142,247,0.3)",
    borderRadius: "20px",
    padding: "4px 12px",
    color: "#7aabf9",
    fontSize: "11px",
    fontWeight: 500,
  },
  badgeDot: {
    width: "5px", height: "5px",
    borderRadius: "50%",
    background: "#4f8ef7",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.8px",
    margin: "0 0 8px",
    color: "#fff",
  },
  subtitle: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.4)",
    margin: "0 0 28px",
    lineHeight: 1.6,
  },
  divider: {
    height: "0.5px",
    background: "rgba(255,255,255,0.07)",
    margin: "0 0 32px",
  },
  formCard: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  fieldGroup: { marginBottom: "20px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
    marginBottom: "8px",
  },
  labelMuted: { color: "rgba(255,255,255,0.3)", fontWeight: 400 },
  uploadBox: {
    display: "block",
    border: "0.5px solid",
    borderRadius: "12px",
    padding: "0",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    overflow: "hidden",
  },
  uploadEmpty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 20px",
    gap: "8px",
  },
  uploadIcon: {
    width: "36px", height: "36px",
    borderRadius: "50%",
    background: "rgba(79,142,247,0.12)",
    border: "0.5px solid rgba(79,142,247,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", color: "#4f8ef7",
    marginBottom: "4px",
  },
  uploadSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
  },
  fileIcon: { fontSize: "24px" },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "13px",
    borderRadius: "12px",
    border: "0.5px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#fff",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.7",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  errorBox: {
    background: "rgba(239,68,68,0.08)",
    border: "0.5px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "16px",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px",
    background: "#4f8ef7",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s, transform 0.15s",
    marginTop: "8px",
  },
  spinner: {
    width: "14px", height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
  scoreCard: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    border: "0.5px solid",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
  },
  scoreLeft: { flexShrink: 0 },
  scoreRight: { flex: 1 },
  section: {
    background: "rgba(255,255,255,0.02)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "18px 20px",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "12px",
    letterSpacing: "0.2px",
  },
  tags: { display: "flex", flexWrap: "wrap", gap: "8px" },
  tag: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },
};