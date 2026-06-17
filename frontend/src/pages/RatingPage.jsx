import React, { useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useAssessment } from "@/context/AssessmentContext";
import { computeQuizScores, getTopCareers } from "@/lib/scoring";

const RATING_LABELS = {
  1: "Not Interested",
  2: "Slightly Interested",
  3: "Interested",
  4: "Very Interested",
  5: "Dream Career",
};

function StarRow({ careerName, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5" data-testid={`stars-${careerName.replace(/\s+/g, "-").toLowerCase()}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            className="ce-star p-1"
            data-testid={`star-${careerName.replace(/\s+/g, "-").toLowerCase()}-${n}`}
            onClick={() => onChange(value === n ? 0 : n)}
            aria-label={`Rate ${careerName} ${n} stars - ${RATING_LABELS[n]}`}
          >
            <Star
              size={26}
              weight={active ? "fill" : "regular"}
              color={active ? "var(--accent)" : "var(--border)"}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function RatingPage() {
  const navigate = useNavigate();
  const { answers, ratings, setRating, finishedAssessment, markRatingFinished, hydrated } =
    useAssessment();

  const quizScores = useMemo(() => computeQuizScores(answers), [answers]);
  const top10 = useMemo(() => getTopCareers(quizScores, 10), [quizScores]);

  if (!hydrated) return null;
  if (!finishedAssessment) return <Navigate to="/assessment" replace />;

  const ratedCount = top10.filter((c) => (ratings[c.name] || 0) > 0).length;
  const canContinue = ratedCount >= top10.length; // require all rated

  const handleSubmit = () => {
    markRatingFinished();
    navigate("/results");
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        rightSlot={
          <div
            className="text-xs font-bold tracking-[0.2em] uppercase font-mono-tabular"
            style={{ color: "var(--text-2)" }}
            data-testid="rating-counter"
          >
            {ratedCount} / {top10.length} rated
          </div>
        }
      />

      <main className="max-w-3xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: "var(--accent)" }}
            data-testid="rating-eyebrow"
          >
            Step 3 · Career Rating
          </div>
          <h1
            className="font-display font-black tracking-tighter text-3xl md:text-4xl mt-3"
            data-testid="rating-title"
          >
            Rate your top 10 matches
          </h1>
          <p
            className="mt-3 text-base md:text-lg max-w-xl"
            style={{ color: "var(--text-2)" }}
            data-testid="rating-helper"
          >
            Be ruthless. Your ratings combine with the quiz to surface the careers
            that genuinely excite you.
          </p>

          {/* Legend */}
          <div className="mt-7 grid grid-cols-5 gap-2 max-w-xl" data-testid="rating-legend">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <div className="flex">
                  {Array.from({ length: n }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      weight="fill"
                      color="var(--accent)"
                    />
                  ))}
                </div>
                <div
                  className="text-[10px] font-bold tracking-[0.1em] uppercase text-center leading-tight"
                  style={{ color: "var(--text-2)" }}
                >
                  {RATING_LABELS[n]}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-3" data-testid="careers-list">
          {top10.map((career, idx) => (
            <motion.div
              key={career.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="ce-card px-5 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              data-testid={`career-row-${idx + 1}`}
            >
              <div className="flex items-start gap-4">
                <span
                  className="font-display font-black text-2xl tracking-tighter w-9 font-mono-tabular"
                  style={{ color: "var(--text-2)" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-display font-extrabold text-xl tracking-tight">
                    {career.name}
                  </div>
                  <div
                    className="text-sm mt-0.5"
                    style={{ color: "var(--text-2)" }}
                  >
                    {career.category}
                  </div>
                </div>
              </div>
              <StarRow
                careerName={career.name}
                value={ratings[career.name] || 0}
                onChange={(v) => setRating(career.name, v)}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur"
        data-testid="rating-nav-bar"
      >
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between gap-3">
          <button
            data-testid="rating-back-button"
            onClick={() => navigate("/assessment")}
            className="inline-flex items-center gap-2 px-5 h-12 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--text)] transition"
          >
            <ArrowLeft size={18} weight="bold" />
            Back to questions
          </button>
          <button
            data-testid="rating-submit-button"
            onClick={handleSubmit}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 px-7 h-12 rounded-full font-semibold text-white transition-transform"
            style={{
              background: canContinue ? "var(--accent)" : "#9ca3af",
              cursor: canContinue ? "pointer" : "not-allowed",
              boxShadow: canContinue ? "4px 4px 0 0 #0a0a0a" : "none",
            }}
          >
            See my top 3
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
