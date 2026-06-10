import { useState, useEffect, useRef } from "react";

export default function QuestionTimer({ durationSeconds, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const calledUp = useRef(false);

  useEffect(() => {
    setTimeLeft(durationSeconds);
    calledUp.current = false;
  }, [durationSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!calledUp.current) { calledUp.current = true; onTimeUp(); }
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, onTimeUp]);

  const pct = (timeLeft / durationSeconds) * 100;
  const R = 34;
  const circumference = 2 * Math.PI * R;
  const ringColor = timeLeft > 20 ? '#6366f1' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx="40" cy="40" r={R} fill="none"
          stroke={ringColor} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
        <text x="40" y="45" textAnchor="middle" fontSize="15" fontWeight="700" fill={ringColor}>
          {timeLeft}s
        </text>
      </svg>
      {timeLeft <= 10 && (
        <span style={{ color: "#ef4444", fontWeight: "600", fontSize: "0.9rem", animation: "pulse 1s infinite" }}>
          ⚠️ Hurry up!
        </span>
      )}
    </div>
  );
}