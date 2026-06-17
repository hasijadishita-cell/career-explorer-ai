import React, { useMemo, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkle,
  Download,
  ShareNetwork,
  ArrowClockwise,
  Trophy,
  Star,
  Lightning,
} from "@phosphor-icons/react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import { useAssessment } from "@/context/AssessmentContext";
import { computeQuizScores, computeFinalResults, buildWhyMatches } from "@/lib/scoring";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { answers, ratings, finishedRating, reset, hydrated } = useAssessment();
  const shareRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const quizScores = useMemo(() => computeQuizScores(answers), [answers]);
  const allResults = useMemo(
    () => computeFinalResults(quizScores, ratings),
    [quizScores, ratings]
  );
  const top3 = allResults.slice(0, 3);

  if (!hydrated) return null;
  if (!finishedRating) return <Navigate to="/" replace />;

  const handleDownload = async () => {
    if (!shareRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#fdfdfd",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `career-explorer-result-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Result downloaded");
    } catch (e) {
      toast.error("Could not generate image. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const text = `My top career match is ${top3[0].name} (${top3[0].match}% match) on Career Explorer AI.`;
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Career Explorer AI", text, url });
      } catch {
        // user dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast.success("Result copied to clipboard");
      } catch {
        toast.error("Copy failed");
      }
    }
  };

  const handleRestart = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <AppHeader
        rightSlot={
          <button
            onClick={handleRestart}
            data-testid="restart-button"
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-2 underline-offset-4"
            style={{ color: "var(--accent)" }}
          >
            <ArrowClockwise size={16} weight="bold" />
            Retake
          </button>
        }
      />

      <main className="max-w-5xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div
            className="inline-flex items-center gap-2 ce-chip ce-chip-accent mb-4"
            data-testid="results-eyebrow"
          >
            <Sparkle size={14} weight="fill" />
            YOUR RESULTS · BASED ON 9 ANSWERS & 10 RATINGS
          </div>
          <h1
            className="font-display font-black tracking-tighter text-4xl md:text-5xl"
            data-testid="results-title"
          >
            Your top 3 career matches.
          </h1>
          <p
            className="mt-3 text-base md:text-lg max-w-xl"
            style={{ color: "var(--text-2)" }}
            data-testid="results-subtitle"
          >
            Combined from your quiz answers and ratings. Save it, share it, or
            retake any time.
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3" data-testid="results-actions">
            <button
              data-testid="download-button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 h-11 rounded-full font-semibold text-white"
              style={{
                background: "var(--accent)",
                boxShadow: "4px 4px 0 0 #0a0a0a",
                opacity: downloading ? 0.7 : 1,
              }}
            >
              <Download size={18} weight="bold" />
              {downloading ? "Generating..." : "Download as image"}
            </button>
            <button
              data-testid="share-button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 h-11 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--text)] transition"
            >
              <ShareNetwork size={18} weight="bold" />
              Share
            </button>
          </div>
        </motion.div>

        {/* Capture wrapper for screenshot */}
        <div ref={shareRef} className="mt-10 bg-[var(--bg)] p-1">
          {/* Top match — hero card */}
          <TopMatchCard career={top3[0]} answers={answers} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-6">
            {top3.slice(1).map((c, i) => (
              <SecondaryMatchCard
                key={c.name}
                rank={i + 2}
                career={c}
                answers={answers}
              />
            ))}
          </div>

          {/* Footer brand mark inside shareable section */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--text-2)" }}
            >
              Career Explorer AI
            </div>
            <div
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--text-2)" }}
            >
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Remaining ranks (4-10) compact */}
        <section className="mt-14">
          <h2 className="font-display font-extrabold text-2xl tracking-tight">
            Also worth exploring
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
            The next 7 careers ranked by your combined score.
          </p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="other-careers">
            {allResults.slice(3, 10).map((c, i) => (
              <div
                key={c.name}
                className="ce-card px-5 py-4 flex items-center justify-between gap-3"
                data-testid={`other-career-${i + 4}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="font-display font-black text-xl tracking-tighter w-7 font-mono-tabular"
                    style={{ color: "var(--text-2)" }}
                  >
                    {String(i + 4).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-display font-bold text-lg tracking-tight">
                      {c.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-2)" }}>
                      {c.category}
                    </div>
                  </div>
                </div>
                <div
                  className="font-display font-black text-2xl tracking-tighter font-mono-tabular"
                  style={{ color: "var(--accent)" }}
                >
                  {c.match}%
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function TopMatchCard({ career, answers }) {
  const why = buildWhyMatches(career.name, answers);
  return (
    <div
      className="rounded-[1.5rem] overflow-hidden border border-[var(--border)] relative"
      style={{ background: "var(--surface)" }}
      data-testid="top-match-card"
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left — accent fill */}
        <div
          className="md:col-span-4 p-7 md:p-9 flex flex-col justify-between relative ce-grain"
          style={{ background: "var(--accent)", color: "#fff", minHeight: "260px" }}
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase bg-white/15 rounded-full px-3 py-1">
              <Trophy size={12} weight="fill" />
              #1 MATCH
            </div>
            <div
              className="font-display font-black tracking-tighter mt-5 leading-none"
              style={{ fontSize: "5rem" }}
              data-testid="top-match-percent"
            >
              {career.match}%
            </div>
            <div className="text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-90">
              MATCH
            </div>
          </div>
          <div className="text-sm opacity-90 mt-6 flex items-center gap-1.5">
            <Star size={14} weight="fill" />
            Your rating: {career.rating || 0} / 5
          </div>
        </div>

        {/* Right — content */}
        <div className="md:col-span-8 p-7 md:p-9">
          <div
            className="text-xs font-bold tracking-[0.22em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            {career.category}
          </div>
          <h2
            className="font-display font-black tracking-tighter text-3xl md:text-4xl mt-2"
            data-testid="top-match-name"
          >
            {career.name}
          </h2>
          <p
            className="mt-4 text-base md:text-lg leading-relaxed"
            style={{ color: "var(--text-2)" }}
            data-testid="top-match-description"
          >
            {career.description}
          </p>

          <div className="mt-6">
            <div
              className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2"
              style={{ color: "var(--text-2)" }}
            >
              Key Skills
            </div>
            <div className="flex flex-wrap gap-2" data-testid="top-match-skills">
              {career.skills.map((s) => (
                <span key={s} className="ce-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div
            className="mt-6 rounded-2xl p-5 border border-[var(--border)] flex gap-3"
            style={{ background: "var(--surface-2)" }}
            data-testid="top-match-why"
          >
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              <Lightning size={18} weight="fill" />
            </div>
            <div>
              <div
                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                style={{ color: "var(--accent)" }}
              >
                Why this matches you
              </div>
              <div className="text-sm md:text-base mt-1 font-medium">{why}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecondaryMatchCard({ rank, career, answers }) {
  const why = buildWhyMatches(career.name, answers);
  return (
    <div
      className="ce-card p-6 md:p-7"
      data-testid={`secondary-match-${rank}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="text-[10px] font-bold tracking-[0.22em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            #{rank} · {career.category}
          </div>
          <h3 className="font-display font-extrabold text-2xl tracking-tight mt-1">
            {career.name}
          </h3>
        </div>
        <div
          className="font-display font-black tracking-tighter text-4xl font-mono-tabular"
          data-testid={`secondary-match-percent-${rank}`}
        >
          {career.match}%
        </div>
      </div>
      <p
        className="text-sm md:text-base mt-3 leading-relaxed"
        style={{ color: "var(--text-2)" }}
      >
        {career.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {career.skills.slice(0, 4).map((s) => (
          <span key={s} className="ce-chip text-[11px]">
            {s}
          </span>
        ))}
      </div>
      <div
        className="mt-4 text-xs font-medium border-t border-[var(--border)] pt-3"
        style={{ color: "var(--text-2)" }}
      >
        {why}
      </div>
    </div>
  );
}
