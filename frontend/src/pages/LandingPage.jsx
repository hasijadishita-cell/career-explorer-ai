import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkle,
  Target,
  ChartLineUp,
  Lightning,
} from "@phosphor-icons/react";
import AppHeader from "@/components/AppHeader";
import { useAssessment } from "@/context/AssessmentContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { finishedRating, reset } = useAssessment();
  const hasPrev = Boolean(finishedRating);

  return (
    <div className="min-h-screen">
      <AppHeader
        rightSlot={
          hasPrev && (
            <Link
              to="/results"
              data-testid="view-last-result-link"
              className="text-sm font-semibold underline decoration-2 underline-offset-4"
              style={{ color: "var(--accent)" }}
            >
              View last result
            </Link>
          )
        }
      />

      <main className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <span
              className="inline-flex items-center gap-2 ce-chip ce-chip-accent mb-7"
              data-testid="landing-eyebrow"
            >
              <Sparkle size={14} weight="fill" />
              CAREER ASSESSMENT · 2 ROUNDS · 5 MIN
            </span>
            <h1
              className="font-display font-black tracking-tighter text-5xl sm:text-6xl lg:text-7xl leading-[0.95]"
              data-testid="landing-headline"
            >
              Discover a career that matches your{" "}
              <span style={{ color: "var(--accent)" }}>interests</span>,{" "}
              <span className="underline decoration-[6px] decoration-[var(--accent)] underline-offset-4">
                strengths
              </span>
              , and goals.
            </h1>
            <p
              className="text-lg md:text-xl font-medium mt-7 max-w-xl"
              style={{ color: "var(--text-2)" }}
              data-testid="landing-subhead"
            >
              Take a quick assessment and get personalised career recommendations
              with clear next steps — built for students and young professionals.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                data-testid="start-assessment-button"
                onClick={() => {
                  reset();
                  navigate("/assessment");
                }}
                className="group inline-flex items-center gap-3 px-7 md:px-9 h-14 rounded-full font-semibold text-white text-base shadow-[6px_6px_0_0_#0a0a0a] transition-transform hover:translate-y-[-2px]"
                style={{ background: "var(--accent)" }}
              >
                Start Assessment
                <ArrowRight
                  size={20}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              {hasPrev && (
                <button
                  data-testid="resume-last-button"
                  onClick={() => navigate("/results")}
                  className="inline-flex items-center gap-2 px-6 h-14 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--text)] transition"
                >
                  View my last result
                </button>
              )}
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { label: "Questions", value: "9" },
                { label: "Careers Mapped", value: "31" },
                { label: "Minutes", value: "~5" },
              ].map((s) => (
                <div key={s.label} data-testid={`stat-${s.label.toLowerCase()}`}>
                  <div className="font-display font-black text-3xl tracking-tight">
                    {s.value}
                  </div>
                  <div
                    className="text-xs font-bold tracking-[0.18em] uppercase mt-1"
                    style={{ color: "var(--text-2)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — geometric collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md ml-auto">
              <div
                className="absolute inset-0 rounded-[2rem] ce-grain"
                style={{ background: "var(--accent)" }}
              />
              <img
                src="https://images.unsplash.com/photo-1565598621680-94ac0c22b148?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwzfHxzdHVkZW50JTIwcHJvZmVzc2lvbmFsJTIwd29ya2luZyUyMG1vZGVybnxlbnwwfHx8fDE3ODE2ODQwNjR8MA&ixlib=rb-4.1.0&q=85"
                alt="Student working on laptop"
                className="absolute inset-0 w-full h-full object-cover rounded-[2rem] mix-blend-luminosity grayscale-[40%]"
                style={{ transform: "translate(14px, 14px)" }}
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -left-6 bg-white border border-[var(--border)] rounded-2xl px-5 py-4 shadow-[6px_6px_0_0_#0a0a0a]">
                <div
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  Your Top Match
                </div>
                <div className="font-display font-black text-2xl mt-1">
                  98% · AI Engineer
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How it works */}
        <section className="mt-24 md:mt-32">
          <div
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            How it works
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight max-w-2xl">
            Three quick steps from confusion to clarity.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-10">
            {[
              {
                icon: <Target size={22} weight="bold" />,
                title: "Answer 9 honest questions",
                desc: "Two rounds covering your values, interests and ambitions. No right or wrong.",
              },
              {
                icon: <Lightning size={22} weight="bold" />,
                title: "Rate your top 10 careers",
                desc: "We surface careers that match your answers. Tell us which excite you.",
              },
              {
                icon: <ChartLineUp size={22} weight="bold" />,
                title: "Get your top 3 matches",
                desc: "See match %, skills, and exactly why each career fits you.",
              },
            ].map((s, i) => (
              <div
                key={s.title}
                className="ce-card p-6 md:p-7"
                data-testid={`how-step-${i + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                >
                  {s.icon}
                </div>
                <div
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
                  style={{ color: "var(--text-2)" }}
                >
                  Step {i + 1}
                </div>
                <div className="font-display font-extrabold text-xl tracking-tight">
                  {s.title}
                </div>
                <p
                  className="mt-3 text-base leading-relaxed"
                  style={{ color: "var(--text-2)" }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm" style={{ color: "var(--text-2)" }}>
            © {new Date().getFullYear()} Career Explorer AI · A free career
            assessment.
          </div>
          <div
            className="text-xs font-bold tracking-[0.18em] uppercase"
            style={{ color: "var(--text-2)" }}
          >
            v1 · mock data
          </div>
        </footer>
      </main>
    </div>
  );
}
