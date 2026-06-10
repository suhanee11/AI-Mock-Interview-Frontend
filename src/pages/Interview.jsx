import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import QuestionTimer from "../components/QuestionTimer";
import { shared } from "../styles/shared";

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

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is only supported in Chrome. Please use Chrome!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleVoice = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const startInterview = async () => {
    setLoading(true);
    let raw;

    if (resumeFile) {
      // resume based questions
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobRole", selectedRole);
      const res = await axios.post("http://localhost:8080/api/interview/questions-from-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      raw = res.data.content;
    } else {
      // general questions
      const res = await axios.post("http://localhost:8080/api/interview/questions", { jobRole: selectedRole });
      raw = res.data.content;
    }

    const parsed = raw.split("\n")
      .map(l => l.trim()).filter(l => l.length > 10)
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
    const res = await axios.post("http://localhost:8080/api/interview/feedback", {
      jobRole: selectedRole,
      question: questions[currentQ],
      userAnswer: currentAnswer
    });
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

  // ── SELECT ──
  if (step === "select") return (
    <div style={shared.page}>
      <div style={shared.container}>
        <button onClick={() => navigate("/")} style={styles.backBtn}>← Back</button>
        <div style={shared.badge}>AI Powered</div>
        <h1 style={shared.title}>🎤 AI Mock Interview</h1>
        <p style={shared.subtitle}>Practice with AI, ace your real interview</p>
        <div style={shared.divider} />

        <p style={shared.label}>Select your target role:</p>
        <div style={styles.rolesGrid}>
          {ROLES.map(role => (
            <div key={role.title}
              style={{ ...styles.roleCard, ...(selectedRole === role.title ? styles.roleSelected : {}) }}
              onClick={() => setSelectedRole(role.title)}>
              <span style={{ fontSize: "1.5rem" }}>{role.icon}</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>{role.title}</span>
            </div>
          ))}
        </div>

        {/* Resume upload — optional */}
        <p style={shared.label}>Upload Resume <span style={{ color: "#475569", fontWeight: "400" }}>(optional — for tailored questions)</span></p>
        <label style={styles.uploadBox}>
          <input type="file" accept=".pdf" style={{ display: "none" }}
            onChange={e => setResumeFile(e.target.files[0])} />
          {resumeFile
            ? <span style={{ color: "#a5b4fc" }}>✅ {resumeFile.name} — questions will be tailored to your resume</span>
            : <span style={{ color: "#475569" }}>📄 Click to upload your resume PDF (optional)</span>
          }
        </label>
        {resumeFile && (
          <button onClick={() => setResumeFile(null)} style={styles.clearBtn}>✕ Remove resume</button>
        )}

        <div style={styles.infoRow}>
          <div style={styles.infoCard}>📝 5 Questions</div>
          <div style={styles.infoCard}>⏱️ {QUESTION_TIME}s each</div>
          <div style={styles.infoCard}>{resumeFile ? "📄 Tailored" : "🤖 AI Feedback"}</div>
        </div>

        <button style={{ ...shared.btn, opacity: selectedRole ? 1 : 0.4 }}
          onClick={startInterview} disabled={!selectedRole || loading}>
          {loading ? (resumeFile ? "⏳ Analyzing Resume..." : "⏳ Generating Questions...") : "Start Interview →"}
        </button>
      </div>
    </div>
  );

  // ── INTERVIEW ──
  if (step === "interview") return (
    <div style={shared.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
      `}</style>
      <div style={shared.container}>
        <div style={styles.progressBar}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Question {currentQ + 1} of {questions.length}</span>
            <span style={styles.roleBadge}>{selectedRole}</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {!feedback && <QuestionTimer key={timerKey} durationSeconds={QUESTION_TIME} onTimeUp={() => { if (!feedback && !isSubmitting.current) submitAnswer(true); }} />}

        {timedOut && <div style={styles.timeoutBanner}>⏰ Time's up! Your answer was auto-submitted.</div>}

        <div style={styles.questionBox}>
          <div style={styles.qNumber}>Q{currentQ + 1}</div>
          <p style={styles.question}>{questions[currentQ]}</p>
        </div>

        <p style={shared.label}>Your Answer:</p>
        <div style={{ position: "relative" }}>
          <textarea style={{ ...styles.textarea, paddingRight: "3.5rem" }}
            placeholder={isListening ? "🎤 Listening... speak your answer!" : "Type your answer or click the mic to speak!"}
            value={answer} onChange={e => setAnswer(e.target.value)} disabled={!!feedback} />

          {!feedback && (
            <div style={{ position: "absolute", bottom: "1.5rem", right: "1rem" }}>
              {isListening && (
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "rgba(239,68,68,0.4)",
                  animation: "ripple 1s ease-out infinite"
                }} />
              )}
              <button onClick={toggleVoice} style={{
                ...styles.micBtn,
                background: isListening ? "rgba(239,68,68,0.9)" : "rgba(99,102,241,0.8)",
                boxShadow: isListening ? "0 0 12px rgba(239,68,68,0.5)" : "0 0 12px rgba(99,102,241,0.3)"
              }}>
                {isListening ? "⏹" : "🎤"}
              </button>
            </div>
          )}
        </div>

        {isListening && (
          <div style={styles.listeningBanner}>
            <span style={{ animation: "pulse 1s infinite", display: "inline-block" }}>🔴</span>
            &nbsp; Listening... click ⏹ to stop
          </div>
        )}

        {!feedback ? (
          <button style={{ ...shared.btn, opacity: answer.length > 5 ? 1 : 0.4 }}
            onClick={() => submitAnswer(false)} disabled={answer.length < 5 || loading}>
            {loading ? "⏳ Analyzing your answer..." : "Submit Answer →"}
          </button>
        ) : (
          <div>
            <div style={shared.feedbackBox}>
              <h3 style={{ color: "#34d399", marginBottom: "1rem", fontSize: "1rem" }}>📋 AI Feedback</h3>
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
            <button style={shared.btn} onClick={nextQuestion}>
              {currentQ + 1 < questions.length ? "Next Question →" : "See Final Results →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── RESULT ──
  if (step === "result") return (
    <div style={shared.page}>
      <div style={shared.container}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem" }}>🏆</div>
          <h1 style={shared.title}>Interview Complete!</h1>
          <p style={shared.subtitle}>Full performance review for <strong>{selectedRole}</strong></p>
        </div>
        {allFeedback.map((item, i) => (
          <div key={i} style={styles.resultCard}>
            <div style={{ color: "#a5b4fc", fontWeight: "600", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Q{i + 1}: {item.question}
              {item.timedOut && <span style={styles.timedOutTag}>⏰ Timed Out</span>}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1rem" }}>
              <strong>Your Answer:</strong> {item.answer}
            </div>
            <div style={shared.feedbackBox}><ReactMarkdown>{item.feedback}</ReactMarkdown></div>
          </div>
        ))}
        <button style={shared.btn} onClick={() => navigate("/")}>🏠 Back to Home</button>
      </div>
    </div>
  );
}

const styles = {
  backBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem", marginBottom: "1rem", padding: 0 },
  rolesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem", marginBottom: "1.5rem" },
  roleCard: { padding: "1rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", cursor: "pointer", textAlign: "center", background: "rgba(255,255,255,0.03)", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" },
  roleSelected: { border: "1px solid #6366f1", background: "rgba(99,102,241,0.2)", color: "#a5b4fc" },
  uploadBox: { display: "block", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1rem", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)", fontSize: "0.9rem", marginBottom: "0.5rem" },
  clearBtn: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem", marginBottom: "1rem", padding: 0 },
  infoRow: { display: "flex", gap: "1rem", marginBottom: "1.5rem", marginTop: "1.2rem" },
  infoCard: { flex: 1, padding: "0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" },
  progressBar: { marginBottom: "1.5rem" },
  roleBadge: { background: "rgba(99,102,241,0.2)", color: "#a5b4fc", padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem" },
  progressTrack: { height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "10px", transition: "width 0.3s ease" },
  questionBox: { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", padding: "1.5rem", borderRadius: "16px", marginBottom: "1.5rem" },
  qNumber: { color: "#6366f1", fontWeight: "700", fontSize: "0.85rem", marginBottom: "0.5rem", letterSpacing: "1px" },
  question: { color: "#e2e8f0", fontSize: "1.1rem", lineHeight: "1.7", margin: 0 },
  textarea: { width: "100%", minHeight: "150px", padding: "1rem", fontSize: "0.95rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1rem", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", color: "#ffffff", resize: "vertical", outline: "none", lineHeight: "1.6" },
  micBtn: { width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, transition: "all 0.2s ease" },
  listeningBanner: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "0.6rem 1rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.85rem" },
  timeoutBanner: { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", padding: "0.8rem 1rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.9rem" },
  resultCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "16px", marginBottom: "1rem" },
  timedOutTag: { background: "rgba(239,68,68,0.2)", color: "#fca5a5", padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.75rem" },
};