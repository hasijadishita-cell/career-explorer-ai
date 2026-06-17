import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { QUESTIONS } from "@/data/careerData";
import { useAssessment } from "@/context/AssessmentContext";

export default function AssessmentPage() {
  const navigate = useNavigate();
  const {
    answers,
    currentStep,
    setAnswer,
    setCurrentStep,
    markAssessmentFinished,
  } = useAssessment();

  const total = QUESTIONS.length;
  const step = Math.min(Math.max(currentStep, 0), total - 1);
  const question = QUESTIONS[step];
  const selected = answers[question.id];
  const progress = ((step + (selected ? 1 : 0)) / total) * 100;

  const next = () => {
    if (!selected) return;
    if (step === total - 1) {
      markAssessmentFinished();
      navigate("/rate");
    } else {
      setCurrentStep(step + 1);
    }
  };

  const back = () => {
    if (step === 0) {
      navigate("/");
    } else {
      setCurrentStep(step - 1);
    }
  };

  const roundLabel = useMemo(
    () =>
      question.round === 1
        ? "Round 1 · Values & Background"
        : "Round 2 · Interest Discovery",
    [question]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        rightSlot={
          <div
            className="text-xs font-bold tracking-[0.2em] uppercase font-mono-tabular"
            style={{ color: "var(--text-2)" }}
            data-testid="progress-counter"
          >
            {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        }
      />

      {/* Progress bar */}
      <div
        className="ce-progress-track mx-5 md:mx-8 mt-4 max-w-6xl md:mx-auto md:w-full"
        data-testid="progress-bar"
      >
        <div
          className="ce-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 md:px-8 pt-10 md:pt-14 pb-28">
        <div
          className="text-xs font-bold tracking-[0.22em] uppercase"
          style={{ color: "var(--accent)" }}
          data-testid="round-label"
        >
          {roundLabel}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h1
              className="font-display font-black tracking-tighter text-3xl md:text-4xl mt-3"
              data-testid="question-title"
            >
              {question.title}
            </h1>
            <p
              className="mt-3 text-base md:text-lg"
              style={{ color: "var(--text-2)" }}
              data-testid="question-helper"
            >
              {question.helper}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3.5" data-testid="options-list">
              {question.options.map((opt, idx) => {
                const isSelected = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    data-testid={`option-${question.id}-${opt.value}`}
                    data-selected={isSelected ? "true" : "false"}
                    onClick={() => setAnswer(question.id, opt.value)}
                    className="ce-card text-left px-5 md:px-6 py-5 md:py-5 flex items-center justify-between gap-4 min-h-[72px]"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-mono-tabular"
                        style={{
                          background: isSelected ? "var(--accent)" : "var(--surface-2)",
                          color: isSelected ? "#fff" : "var(--text)",
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-display font-bold text-lg md:text-xl tracking-tight">
                        {opt.label}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle
                        size={22}
                        weight="fill"
                        color="var(--accent)"
                        data-testid={`option-check-${opt.value}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur"
        data-testid="nav-bar"
      >
        <div className="max-w-2xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between gap-3">
          <button
            data-testid="back-button"
            onClick={back}
            className="inline-flex items-center gap-2 px-5 h-12 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--text)] transition"
          >
            <ArrowLeft size={18} weight="bold" />
            {step === 0 ? "Home" : "Back"}
          </button>
          <button
            data-testid="next-button"
            onClick={next}
            disabled={!selected}
            className="inline-flex items-center gap-2 px-7 h-12 rounded-full font-semibold text-white transition-transform"
            style={{
              background: selected ? "var(--accent)" : "#9ca3af",
              cursor: selected ? "pointer" : "not-allowed",
              boxShadow: selected ? "4px 4px 0 0 #0a0a0a" : "none",
            }}
          >
            {step === total - 1 ? "See my matches" : "Next"}
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
