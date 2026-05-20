import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const ROLES = [
  { title: "Frontend Developer ", icon: "🎨" },
  { title: "Backend Developer", icon: "⚙️" },
  { title: "Full Stack Developer", icon: "🚀" },
  { title: "Data Analyst", icon: "📊" },
  { title: "DevOps Engineer", icon: "🛠️" },
  { title: "Java Developer", icon: "☕" }
];

function App() {
  const [selectedRole, setSelectedRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [allFeedback, setAllFeedback] = useState([]);
  const [step, setStep] = useState("select");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    const res = await axios.post("http://localhost:8080/api/interview/questions", {
      jobRole: selectedRole
    });
    const raw = res.data.content;
    console.log("RAW:", raw);
    const parsed = raw.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 10)
      .filter(line => line.match(/^\d/) || line.match(/^[-*•]/))
      .map(line => line.replace(/^[\d]+[\.\):\s]+/, "").replace(/^[-*•]\s*/, "").trim())
      .filter(line => line.length > 0);
    setQuestions(parsed);
    setStep("interview");
    setLoading(false);
  };

  const submitAnswer = async () => {
    setLoading(true);
    const res = await axios.post("http://localhost:8080/api/interview/feedback", {
      jobRole: selectedRole,
      question: questions[currentQ],
      userAnswer: answer
    });
    setFeedback(res.data.content);
    setAllFeedback([...allFeedback, {
      question: questions[currentQ],
      answer,
      feedback: res.data.content
    }]);
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setAnswer("");
      setFeedback("");
    } else {
      setStep("result");
    }
  };

  if (step === "select") return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.badge}>AI Powered</div>
        <h1 style={styles.title}>🎤 AI Mock Interview</h1>
        <p style={styles.subtitle}>Practice with AI, ace your real interview</p>

        <div style={styles.divider} />

        <p style={styles.label}>Select your target role:</p>
        <div style={styles.rolesGrid}>
          {ROLES.map(role => (
            <div
              key={role.title}
              style={{
                ...styles.roleCard,
                ...(selectedRole === role.title ? styles.roleSelected : {})
              }}
              onClick={() => setSelectedRole(role.title)}
            >
              <span style={styles.roleIcon}>{role.icon}</span>
              <span style={styles.roleTitle}>{role.title}</span>
            </div>
          ))}
        </div>

        <div style={styles.infoRow}>
          <div style={styles.infoCard}>📝 5 Questions</div>
          <div style={styles.infoCard}>🤖 AI Feedback</div>
          <div style={styles.infoCard}>⭐ Scored</div>
        </div>

        <button
          style={{ ...styles.btn, opacity: selectedRole ? 1 : 0.4 }}
          onClick={startInterview}
          disabled={!selectedRole || loading}
        >
          {loading ? "⏳ Generating Questions..." : "Start Interview →"}
        </button>
      </div>
    </div>
  );

  if (step === "interview") return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={styles.progressLabel}>
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span style={styles.roleBadge}>{selectedRole}</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{
              ...styles.progressFill,
              width: `${((currentQ + 1) / questions.length) * 100}%`
            }} />
          </div>
        </div>

        <div style={styles.questionBox}>
          <div style={styles.qNumber}>Q{currentQ + 1}</div>
          <p style={styles.question}>{questions[currentQ]}</p>
        </div>

        <p style={styles.label}>Your Answer:</p>
        <textarea
          style={styles.textarea}
          placeholder="Type your answer here... Be as detailed as possible!"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          disabled={!!feedback}
        />

        {!feedback ? (
          <button
            style={{ ...styles.btn, opacity: answer.length > 5 ? 1 : 0.4 }}
            onClick={submitAnswer}
            disabled={answer.length < 5 || loading}
          >
            {loading ? "⏳ Analyzing your answer..." : "Submit Answer →"}
          </button>
        ) : (
          <div>
            <div style={styles.feedbackBox}>
              <h3 style={styles.feedbackTitle}>📋 AI Feedback</h3>
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
            <button style={styles.btn} onClick={nextQuestion}>
              {currentQ + 1 < questions.length ? "Next Question →" : "See Final Results →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (step === "result") return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.resultHeader}>
          <div style={styles.trophy}>🏆</div>
          <h1 style={styles.title}>Interview Complete!</h1>
          <p style={styles.subtitle}>Here's your full performance review for <strong>{selectedRole}</strong></p>
        </div>

        {allFeedback.map((item, i) => (
          <div key={i} style={styles.resultCard}>
            <div style={styles.resultQ}>Q{i + 1}: {item.question}</div>
            <div style={styles.resultAnswer}>
              <strong>Your Answer:</strong> {item.answer}
            </div>
            <div style={styles.feedbackBox}>
              <ReactMarkdown>{item.feedback}</ReactMarkdown>
            </div>
          </div>
        ))}

        <button style={styles.btn} onClick={() => {
          setStep("select");
          setCurrentQ(0);
          setAllFeedback([]);
          setFeedback("");
          setAnswer("");
          setSelectedRole("");
        }}>
          🔄 Start New Interview
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Segoe UI', sans-serif"
  },
  container: {
    maxWidth: "780px",
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "2.5rem",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  badge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "white",
    padding: "0.3rem 1rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    marginBottom: "1rem",
    letterSpacing: "1px",
    textTransform: "uppercase"
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #a5b4fc, #e879f9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "1rem",
    marginBottom: "1.5rem"
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.1)",
    marginBottom: "1.5rem"
  },
  label: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginBottom: "0.8rem",
    fontWeight: "500"
  },
  rolesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.8rem",
    marginBottom: "1.5rem"
  },
  roleCard: {
    padding: "1rem",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
    background: "rgba(255,255,255,0.03)",
    color: "#94a3b8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.4rem"
  },
  roleSelected: {
    border: "1px solid #6366f1",
    background: "rgba(99,102,241,0.2)",
    color: "#a5b4fc"
  },
  roleIcon: {
    fontSize: "1.5rem"
  },
  roleTitle: {
    fontSize: "0.85rem",
    fontWeight: "500"
  },
  infoRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem"
  },
  infoCard: {
    flex: 1,
    padding: "0.8rem",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "0.85rem"
  },
  btn: {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
    letterSpacing: "0.5px",
    marginTop: "0.5rem"
  },
  progressBar: {
    marginBottom: "1.5rem"
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
    color: "#94a3b8",
    fontSize: "0.85rem"
  },
  roleBadge: {
    background: "rgba(99,102,241,0.2)",
    color: "#a5b4fc",
    padding: "0.2rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.8rem"
  },
  progressTrack: {
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    borderRadius: "10px",
    transition: "width 0.3s ease"
  },
  questionBox: {
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.3)",
    padding: "1.5rem",
    borderRadius: "16px",
    marginBottom: "1.5rem"
  },
  qNumber: {
    color: "#6366f1",
    fontWeight: "700",
    fontSize: "0.85rem",
    marginBottom: "0.5rem",
    letterSpacing: "1px"
  },
  question: {
    color: "#e2e8f0",
    fontSize: "1.1rem",
    lineHeight: "1.7",
    margin: 0
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    padding: "1rem",
    fontSize: "0.95rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "1rem",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    resize: "vertical",
    outline: "none",
    lineHeight: "1.6"
  },
  feedbackBox: {
    background: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    padding: "1.5rem",
    borderRadius: "16px",
    marginBottom: "1rem"
  },
  feedbackTitle: {
    color: "#34d399",
    marginBottom: "1rem",
    fontSize: "1rem"
  },
  resultHeader: {
    textAlign: "center",
    marginBottom: "2rem"
  },
  trophy: {
    fontSize: "3rem",
    marginBottom: "0.5rem"
  },
  resultCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "1.5rem",
    borderRadius: "16px",
    marginBottom: "1rem"
  },
  resultQ: {
    color: "#a5b4fc",
    fontWeight: "600",
    marginBottom: "0.8rem",
    fontSize: "1rem"
  },
  resultAnswer: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    lineHeight: "1.6"
  }
};

export default App;