import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { shared } from "../styles/shared";

export default function AtsChecker() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!resumeFile || !jobDescription.trim()) return;
    setLoading(true); setError(""); setResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const { data } = await axios.post("http://localhost:8080/api/ats/check", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const clean = data.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch {
      setError("ATS check failed. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.atsScore >= 70 ? "#22c55e" : result.atsScore >= 40 ? "#f59e0b" : "#ef4444"
    : "#fff";

  const scoreLabel = result
    ? result.atsScore >= 70 ? "Strong Match 💪" : result.atsScore >= 40 ? "Moderate Match 🔧" : "Weak Match ⚠️"
    : "";

  return (
    <div style={shared.page}>
      <div style={shared.container}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>← Back</button>
        <div style={shared.badge}>Gemini Powered</div>
        <h1 style={shared.title}>📄 ATS Score Checker</h1>
        <p style={shared.subtitle}>See how well your resume matches a job description</p>
        <div style={shared.divider} />

        {/* Upload resume */}
        <p style={shared.label}>Upload Resume (PDF or TXT)</p>
        <label style={styles.uploadBox}>
          <input type="file" accept=".pdf,.txt" style={{ display: "none" }}
            onChange={e => setResumeFile(e.target.files[0])} />
          {resumeFile
            ? <span style={{ color: "#a5b4fc" }}>✅ {resumeFile.name}</span>
            : <span style={{ color: "#475569" }}>📁 Click to upload your resume</span>
          }
        </label>

        {/* Job description */}
        <p style={{ ...shared.label, marginTop: "1.2rem" }}>Paste Job Description</p>
        <textarea style={styles.textarea}
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          rows={6} />

        {error && <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>{error}</p>}

        <button style={{ ...shared.btn, background: "linear-gradient(135deg, #10b981, #059669)", opacity: (resumeFile && jobDescription.trim()) ? 1 : 0.4 }}
          onClick={handleCheck}
          disabled={!resumeFile || !jobDescription.trim() || loading}>
          {loading ? "⏳ Analyzing Resume..." : "🔍 Check ATS Score →"}
        </button>

        {/* Results */}
        {result && (
          <div style={{ marginTop: "2rem" }}>
            <div style={shared.divider} />

            {/* Score ring */}
            <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle cx="70" cy="70" r="58" fill="none"
                  stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - result.atsScore / 100)}
                  strokeLinecap="round" transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
                <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="800" fill={scoreColor}>{result.atsScore}</text>
                <text x="70" y="85" textAnchor="middle" fontSize="12" fill="#94a3b8">/100</text>
              </svg>
              <p style={{ color: scoreColor, fontWeight: "700", fontSize: "1.1rem", margin: "0.5rem 0 0" }}>{scoreLabel}</p>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{result.summary}</p>
            </div>

            {/* Matched keywords */}
            <div style={styles.section}>
              <h3 style={{ color: "#34d399", marginBottom: "0.8rem" }}>✅ Matched Keywords</h3>
              <div style={styles.tags}>
                {result.matchedKeywords?.map(k => (
                  <span key={k} style={{ ...styles.tag, background: "rgba(34,197,94,0.15)", color: "#86efac" }}>{k}</span>
                ))}
              </div>
            </div>

            {/* Missing keywords */}
            <div style={styles.section}>
              <h3 style={{ color: "#f87171", marginBottom: "0.8rem" }}>❌ Missing Keywords</h3>
              <div style={styles.tags}>
                {result.missingKeywords?.map(k => (
                  <span key={k} style={{ ...styles.tag, background: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>{k}</span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div style={styles.section}>
              <h3 style={{ color: "#fbbf24", marginBottom: "0.8rem" }}>💡 Suggestions</h3>
              <ul style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.8", paddingLeft: "1.2rem" }}>
                {result.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <button style={shared.btn} onClick={() => { setResult(null); setResumeFile(null); setJobDescription(""); }}>
              🔄 Check Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem", marginBottom: "1rem", padding: 0 },
  uploadBox: { display: "block", border: "2px dashed rgba(255,255,255,0.15)", borderRadius: "12px", padding: "1.5rem", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)", fontSize: "0.95rem" },
  textarea: { width: "100%", padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", resize: "vertical", outline: "none", lineHeight: "1.6", boxSizing: "border-box" },
  section: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.2rem", marginBottom: "1rem" },
  tags: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  tag: { padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "500" },
};