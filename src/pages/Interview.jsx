import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import QuestionTimer from "../components/QuestionTimer";
import { generateQuestions, generateQuestionsFromResume, getFeedback } from "../service/session";

const ROLES = [
  { title: "Frontend Developer", icon: "🎨" },
  { title: "Backend Developer", icon: "⚙️" },
  { title: "Full Stack Developer", icon: "🚀" },
  { title: "Data Analyst", icon: "📊" },
  { title: "DevOps Engineer", icon: "🛠️" },
  { title: "Java Developer", icon: "☕" }
];

const QUESTION_TIME = 90;

export default function Interview() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [allFeedback, setAllFeedback] = useState([]);
  const [step, setStep] = useState("select");
  const [loading, setLoading] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const isSubmitting = useRef(false);
  const recognitionRef = useRef(null);
  const sessionId = useRef(crypto.randomUUID());

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice input is only supported in Chrome."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      setAnswer(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setIsListening(false);
  };

  const toggleVoice = () => { if (isListening) stopListening(); else startListening(); };

  const startInterview = async () => {
    setLoading(true);
    let raw;
    if (resumeFile) {
      const res = await generateQuestionsFromResume(selectedRole, resumeFile);
      raw = res.data.content;
    } else {
      const res = await generateQuestions(selectedRole);
      raw = res.data.content;
    }
    const parsed = raw.split("\n").map(l => l.trim()).filter(l => l.length > 10)
      .filter(l => l.match(/^\d/) || l.match(/^[-*•]/))
      .map(l => l.replace(/^[\d]+[\.\):\s]+/, "").replace(/^[-*•]\s*/, "").trim())
      .filter(l => l.length > 0);
    setQuestions(parsed);
    setStep("interview");
    setLoading(false);
  };

  const submitAnswer = async (fromTimer = false) => {
    if (isSubmitting.current) return;
    stopListening();
    isSubmitting.current = true;
    if (fromTimer) setTimedOut(true);
    setLoading(true);
    const currentAnswer = fromTimer ? (answer.trim() || "(No answer — time ran out)") : answer;
    const res = await getFeedback(
      sessionId.current,
      selectedRole,
      questions[currentQ],
      currentAnswer,
      currentQ + 1,
      fromTimer
    );
    setFeedback(res.data.content);
    setAllFeedback(prev => [...prev, { question: questions[currentQ], answer: currentAnswer, feedback: res.data.content, timedOut: fromTimer }]);
    setLoading(false);
    isSubmitting.current = false;
  };

  const nextQuestion = () => {
    isSubmitting.current = false;
    setTimedOut(false);
    stopListening();
    if (currentQ + 1 < questions.length) {
      setCurrentQ(q => q + 1);
      setAnswer(""); setFeedback("");
      setTimerKey(k => k + 1);
    } else {
      setStep("result");
    }
  };

  // ── SELECT STEP ──
  if (step === "select") return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>Prep<span style={{ color: "#4f8ef7" }}>Sathi</span></div>
        <div style={s.navLinks}>
          <span style={{ ...s.navLink, color: "#4f8ef7" }}>Interview</span>
          <span onClick={() => navigate("/ats")} style={s.navLink}>ATS Checker</span>
        </div>
      </nav>

      <div style={s.wrapper}>
        <div style={s.topRow}>
          <button onClick={() => navigate("/")} style={s.backBtn}>← Back</button>
          <div style={s.badge}><div style={s.badgeDot} />AI Powered by Gemini</div>
        </div>

        <h1 style={s.title}>AI Mock Interview</h1>
        <p style={s.subtitle}>Practice with real AI feedback and walk in fully PrepSathi</p>
        <div style={s.divider} />

        <p style={s.label}>Select your target role</p>
        <div style={s.rolesGrid}>
          {ROLES.map(role => (
            <div key={role.title}
              style={{ ...s.roleCard, ...(selectedRole === role.title ? s.roleSelected : {}) }}
              onClick={() => setSelectedRole(role.title)}>
              <span style={{ fontSize: "22px" }}>{role.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: 500, marginTop: 4 }}>{role.title}</span>
            </div>
          ))}
        </div>

        <p style={{ ...s.label, marginTop: "24px" }}>
          Upload Resume <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>(optional — for tailored questions)</span>
        </p>
        <label style={{ ...s.uploadBox, borderColor: resumeFile ? "rgba(79,142,247,0.4)" : "rgba(255,255,255,0.1)", background: resumeFile ? "rgba(79,142,247,0.04)" : "rgba(255,255,255,0.02)" }}>
          <input type="file" accept=".pdf" style={{ display: "none" }} onChange={e => setResumeFile(e.target.files[0])} />
          {resumeFile ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
              <span style={{ fontSize: "18px" }}>📄</span>
              <span style={{ color: "#7aabf9", fontSize: "13px" }}>{resumeFile.name}</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "20px" }}>↑</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Click to upload resume PDF</span>
            </div>
          )}
        </label>
        {resumeFile && (
          <button onClick={() => setResumeFile(null)} style={s.clearBtn}>✕ Remove resume</button>
        )}

        <div style={s.infoRow}>
          {[
            { icon: "📝", label: "5 Questions" },
            { icon: "⏱", label: `${QUESTION_TIME}s each` },
            { icon: resumeFile ? "📄" : "🤖", label: resumeFile ? "Tailored to resume" : "AI Feedback" }
          ].map((item, i) => (
            <div key={i} style={s.infoCard}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{item.label}</span>
            </div>
          ))}
        </div>

        <button
          style={{ ...s.primaryBtn, opacity: selectedRole && !loading ? 1 : 0.4, cursor: selectedRole && !loading ? "pointer" : "not-allowed" }}
          onClick={startInterview} disabled={!selectedRole || loading}>
          {loading ? (resumeFile ? "Analyzing Resume..." : "Generating Questions...") : "Start Interview →"}
        </button>
      </div>
    </div>
  );

  // INTERVIEW STEP
  if (step === "interview") return (
    <div style={s.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <nav style={s.nav}>
       <div style={s.logo}>Prep<span style={{ color: "#4f8ef7" }}>Sathi</span></div>
        <div style={{ ...s.badge, marginRight: 0 }}>
          <div style={s.badgeDot} />{selectedRole}
        </div>
      </nav>

      <div style={s.wrapper}>
        {/* Progress */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Question {currentQ + 1} of {questions.length}</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{Math.round(((currentQ + 1) / questions.length) * 100)}% complete</span>
          </div>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {!feedback && (
          <QuestionTimer key={timerKey} durationSeconds={QUESTION_TIME}
            onTimeUp={() => { if (!feedback && !isSubmitting.current) submitAnswer(true); }} />
        )}

        {timedOut && (
          <div style={{ ...s.alertBox, background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", color: "#f87171", marginBottom: "16px" }}>
            ⏰ Time's up — your answer was auto-submitted.
          </div>
        )}

        {/* Question */}
        <div style={s.questionBox}>
          <div style={s.qLabel}>Q{currentQ + 1}</div>
          <p style={s.questionText}>{questions[currentQ]}</p>
        </div>

        {/* Answer area */}
        <p style={{ ...s.label, marginBottom: "8px" }}>Your Answer</p>
        <div style={{ position: "relative" }}>
          <textarea
            style={{ ...s.textarea, paddingRight: "52px", opacity: feedback ? 0.5 : 1 }}
            placeholder={isListening ? "Listening... speak your answer!" : "Type your answer or use the mic to speak"}
            value={answer} onChange={e => setAnswer(e.target.value)} disabled={!!feedback}
          />
          {!feedback && (
            <div style={{ position: "absolute", bottom: "28px", right: "14px" }}>
              {isListening && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(239,68,68,0.3)", animation: "ripple 1s ease-out infinite" }} />
              )}
              <button onClick={toggleVoice} style={{ ...s.micBtn, background: isListening ? "rgba(239,68,68,0.85)" : "rgba(79,142,247,0.8)" }}>
                {isListening ? "⏹" : "🎤"}
              </button>
            </div>
          )}
        </div>

        {isListening && (
          <div style={{ ...s.alertBox, background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.15)", color: "#fca5a5", marginBottom: "16px" }}>
            <span style={{ animation: "pulse 1s infinite", display: "inline-block" }}>🔴</span> Listening... click ⏹ to stop
          </div>
        )}

        {!feedback ? (
          <button
            style={{ ...s.primaryBtn, opacity: answer.length > 5 && !loading ? 1 : 0.4, cursor: answer.length > 5 && !loading ? "pointer" : "not-allowed" }}
            onClick={() => submitAnswer(false)} disabled={answer.length < 5 || loading}>
            {loading ? <><span style={s.spinner} /> Analyzing answer...</> : "Submit Answer →"}
          </button>
        ) : (
          <div>
            <div style={s.feedbackBox}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={s.feedbackBadge}>AI Feedback</div>
              </div>
              <div style={s.markdownWrap}><ReactMarkdown>{feedback}</ReactMarkdown></div>
            </div>
            <button style={s.primaryBtn} onClick={nextQuestion}>
              {currentQ + 1 < questions.length ? "Next Question →" : "See Final Results →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // RESULT STEP 
  if (step === "result") return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>Prep<span style={{ color: "#4f8ef7" }}>Sathi</span></div>
      </nav>

      <div style={s.wrapper}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏆</div>
          <h1 style={s.title}>Interview Complete!</h1>
          <p style={s.subtitle}>Full performance review for <span style={{ color: "#7aabf9" }}>{selectedRole}</span></p>
        </div>

        {allFeedback.map((item, i) => (
          <div key={i} style={s.resultCard}>
            <div style={s.resultHeader}>
              <span style={s.resultQLabel}>Q{i + 1}</span>
              <span style={s.resultQuestion}>{item.question}</span>
              {item.timedOut && <span style={s.timedOutTag}>⏰ Timed out</span>}
            </div>
            <div style={s.resultAnswer}>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 500, display: "block", marginBottom: 4 }}>YOUR ANSWER</span>
              {item.answer}
            </div>
            <div style={s.feedbackBox}>
              <div style={s.feedbackBadge}>AI Feedback</div>
              <div style={{ marginTop: "12px", ...s.markdownWrap }}><ReactMarkdown>{item.feedback}</ReactMarkdown></div>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button style={{ ...s.primaryBtn, flex: 1 }} onClick={() => { setStep("select"); setAllFeedback([]); setCurrentQ(0); setAnswer(""); setFeedback(""); setSelectedRole(""); setResumeFile(null); }}>
            ↺ Start New Interview
          </button>
          <button style={{ ...s.primaryBtn, flex: 1, background: "transparent", border: "0.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }} onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#080e1a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#fff" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: "0.5px solid rgba(255,255,255,0.07)", background: "rgba(8,14,26,0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 },
  logo: { fontSize: "17px", fontWeight: 600, letterSpacing: "-0.3px" },
  navLinks: { display: "flex", gap: "32px", alignItems: "center" },
  navLink: { color: "rgba(255,255,255,0.5)", fontSize: "14px", cursor: "pointer" },
  wrapper: { maxWidth: "680px", margin: "0 auto", padding: "48px 24px 80px" },
  topRow: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" },
  backBtn: { background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "13px", padding: 0 },
  badge: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(79,142,247,0.12)", border: "0.5px solid rgba(79,142,247,0.3)", borderRadius: "20px", padding: "4px 12px", color: "#7aabf9", fontSize: "11px", fontWeight: 500 },
  badgeDot: { width: "5px", height: "5px", borderRadius: "50%", background: "#4f8ef7" },
  title: { fontSize: "32px", fontWeight: 700, letterSpacing: "-0.8px", margin: "0 0 8px", color: "#fff" },
  subtitle: { fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px", lineHeight: 1.6 },
  divider: { height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "0 0 28px" },
  label: { fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.65)", margin: "0 0 10px", display: "block" },
  rolesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "8px" },
  roleCard: { padding: "16px 12px", border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: "12px", cursor: "pointer", textAlign: "center", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.45)", display: "flex", flexDirection: "column", alignItems: "center", transition: "all 0.15s ease" },
  roleSelected: { border: "0.5px solid rgba(79,142,247,0.5)", background: "rgba(79,142,247,0.1)", color: "#7aabf9" },
  uploadBox: { display: "block", border: "0.5px solid", borderRadius: "12px", padding: "20px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", marginBottom: "6px" },
  clearBtn: { background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "12px", padding: 0, marginBottom: "16px" },
  infoRow: { display: "flex", gap: "10px", margin: "20px 0 28px" },
  infoCard: { flex: 1, padding: "14px 10px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "10px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  primaryBtn: { width: "100%", padding: "14px", background: "#4f8ef7", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" },
  progressTrack: { height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#4f8ef7", borderRadius: "10px", transition: "width 0.4s ease" },
  questionBox: { background: "rgba(79,142,247,0.07)", border: "0.5px solid rgba(79,142,247,0.2)", padding: "20px 24px", borderRadius: "14px", marginBottom: "20px" },
  qLabel: { color: "#4f8ef7", fontWeight: 700, fontSize: "11px", letterSpacing: "1.5px", marginBottom: "8px" },
  questionText: { color: "rgba(255,255,255,0.88)", fontSize: "16px", lineHeight: 1.7, margin: 0 },
  textarea: { width: "100%", minHeight: "140px", padding: "14px 16px", fontSize: "14px", borderRadius: "12px", border: "0.5px solid rgba(255,255,255,0.1)", marginBottom: "14px", boxSizing: "border-box", background: "rgba(255,255,255,0.03)", color: "#fff", resize: "vertical", outline: "none", lineHeight: 1.7, fontFamily: "inherit", transition: "border-color 0.2s" },
  micBtn: { width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 },
  alertBox: { border: "0.5px solid", borderRadius: "10px", padding: "10px 14px", fontSize: "13px" },
  feedbackBox: { background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px 20px", marginBottom: "14px" },
  feedbackBadge: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(79,142,247,0.12)", border: "0.5px solid rgba(79,142,247,0.25)", borderRadius: "20px", padding: "3px 10px", color: "#7aabf9", fontSize: "11px", fontWeight: 500 },
  markdownWrap: { color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.8 },
  spinner: { width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" },
  resultCard: { background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", marginBottom: "14px" },
  resultHeader: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px", flexWrap: "wrap" },
  resultQLabel: { background: "rgba(79,142,247,0.15)", color: "#7aabf9", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", flexShrink: 0, marginTop: 2 },
  resultQuestion: { color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, flex: 1, lineHeight: 1.5 },
  resultAnswer: { color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.7, background: "rgba(255,255,255,0.02)", borderRadius: "10px", padding: "12px 14px", marginBottom: "12px" },
  timedOutTag: { background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "0.5px solid rgba(239,68,68,0.2)", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", flexShrink: 0 },
};