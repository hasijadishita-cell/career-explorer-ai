import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkle, Download, ShareNetwork, ArrowClockwise, Trophy, Star,
  Lightning, BookmarkSimple, Bookmark, CurrencyDollar, Robot, ArrowRight,
} from "@phosphor-icons/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import RoadmapBlock from "@/components/RoadmapBlock";
import { useAssessment } from "@/context/AssessmentContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { computeQuizScores, computeFinalResults, buildWhyMatches } from "@/lib/scoring";
import { CAREERS } from "@/data/careerData";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { answers, ratings, finishedRating, reset, hydrated } = useAssessment();
  const shareRef = useRef(null);

  const country = user?.country || "US";
  const quizScores = useMemo(() => computeQuizScores(answers), [answers]);
  const allResults = useMemo(() => computeFinalResults(quizScores, ratings), [quizScores, ratings]);
  const top3 = allResults.slice(0, 3);

  const [details, setDetails] = useState({});
  const [savedSet, setSavedSet] = useState(new Set());
  const [aiText, setAiText] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Fetch detail for top 3 from backend (country-aware salary etc)
  useEffect(() => {
    if (!finishedRating) return;
    (async () => {
      try {
        const map = {};
        await Promise.all(top3.map(async (c) => {
          const { data } = await api.get(`/careers/${encodeURIComponent(c.name)}`, { params: { country } });
          map[c.name] = data;
        }));
        setDetails(map);
      } catch {
        // optional — UI still renders frontend-only data
      }
    })();
  }, [finishedRating, country, top3.map(c => c.name).join("|")]); // eslint-disable-line

  // Persist assessment for logged-in users (once)
  const savedAssessmentRef = useRef(false);
  useEffect(() => {
    if (!user || !finishedRating || savedAssessmentRef.current) return;
    savedAssessmentRef.current = true;
    api.post("/assessments", {
      answers, ratings,
      top3: top3.map((c) => ({ name: c.name, match: c.match, category: c.category })),
      country,
    }).catch(() => {});
    api.get("/saved-careers").then(({ data }) => setSavedSet(new Set(data.map((s) => s.career)))).catch(() => {});
  }, [user, finishedRating]); // eslint-disable-line

  if (!hydrated) return null;
  if (!finishedRating) return <Navigate to="/" replace />;

  const toggleSave = async (careerName) => {
    if (!user) {
      toast.message("Sign in to save careers", { description: "Create a free account to bookmark careers and view past results." });
      return;
    }
    if (savedSet.has(careerName)) {
      await api.delete(`/saved-careers/${encodeURIComponent(careerName)}`);
      setSavedSet((s) => { const n = new Set(s); n.delete(careerName); return n; });
      toast.success("Removed");
    } else {
      await api.post("/saved-careers", { career: careerName });
      setSavedSet((s) => new Set(s).add(careerName));
      toast.success("Saved");
    }
  };

  const captureCanvas = async () => {
    if (!shareRef.current) throw new Error("Result section not found");
    // Ensure web fonts are loaded so capture isn't blank/Times-fallback
    if (document?.fonts?.ready) {
      try { await document.fonts.ready; } catch (e) { /* ignore */ }
    }
    // Small delay to allow any pending layout
    await new Promise((r) => setTimeout(r, 60));
    return await html2canvas(shareRef.current, {
      backgroundColor: "#fdfdfd",
      scale: window.devicePixelRatio > 1 ? 2 : 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: shareRef.current.scrollWidth,
      windowHeight: shareRef.current.scrollHeight,
    });
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const canvas = await captureCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "career-explorer-results.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded");
    } catch (e) {
      console.error("[Image export] failed:", e);
      toast.error(`Image export failed: ${e.message || e}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL("image/png");
      // Fit canvas into A4 portrait, preserve aspect
      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "p" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgW = pageW - 24; // 12pt margin each side
      const imgH = imgW * ratio;
      let y = 12;
      if (imgH <= pageH - 24) {
        pdf.addImage(imgData, "PNG", 12, y, imgW, imgH);
      } else {
        // Slice across multiple pages
        const sliceH = (pageH - 24) / imgW * canvas.width;
        let remaining = canvas.height;
        let srcY = 0;
        const tmpCanvas = document.createElement("canvas");
        const ctx = tmpCanvas.getContext("2d");
        tmpCanvas.width = canvas.width;
        while (remaining > 0) {
          const slice = Math.min(sliceH, remaining);
          tmpCanvas.height = slice;
          ctx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
          ctx.drawImage(canvas, 0, srcY, canvas.width, slice, 0, 0, canvas.width, slice);
          const sliceData = tmpCanvas.toDataURL("image/png");
          const sliceImgH = (slice / canvas.width) * imgW;
          pdf.addImage(sliceData, "PNG", 12, 12, imgW, sliceImgH);
          remaining -= slice;
          srcY += slice;
          if (remaining > 0) pdf.addPage();
        }
      }
      pdf.save("career-explorer-results.pdf");
      toast.success("PDF downloaded");
    } catch (e) {
      console.error("[PDF export] failed:", e);
      toast.error(`PDF export failed: ${e.message || e}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    const shareText = `My top career match is ${top3[0]?.name} (${top3[0]?.match}% match) on Career Explorer AI.`;
    const shareUrl = window.location.origin;
    const payload = `${shareText} ${shareUrl}`;
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: "Career Explorer AI", text: shareText, url: shareUrl });
          toast.success("Shared");
          return;
        } catch (err) {
          if (err?.name === "AbortError") return; // user cancelled
          console.warn("[Share] navigator.share failed, falling back:", err);
        }
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
        toast.success("Result copied to clipboard");
        return;
      }
      // Last-resort fallback: textarea copy
      const ta = document.createElement("textarea");
      ta.value = payload;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) toast.success("Result copied to clipboard");
      else throw new Error("Clipboard unavailable");
    } catch (e) {
      console.error("[Share] failed:", e);
      toast.error(`Share failed: ${e.message || e}`);
    } finally {
      setSharing(false);
    }
  };

  const handleAiExplain = async () => {
    if (!user) {
      toast.message("Sign in to use AI explanations", { description: "Create a free account to unlock AI-generated career insights." });
      return;
    }
    setAiBusy(true);
    try {
      const { data } = await api.post("/ai/explain", {
        answers,
        top3: top3.map((c) => ({ name: c.name, match: c.match })),
      });
      setAiText(data.explanation);
    } catch (e) {
      toast.error(e.response?.data?.detail || "AI explanation failed");
    } finally {
      setAiBusy(false);
    }
  };

  const handleRestart = () => { reset(); navigate("/"); };

  return (
    <div className="min-h-screen">
      <AppHeader rightSlot={
        <button onClick={handleRestart} data-testid="restart-button" className="inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-2 underline-offset-4" style={{ color: "var(--accent)" }}>
          <ArrowClockwise size={16} weight="bold" /> Retake
        </button>
      } />

      <main className="max-w-5xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-24">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 ce-chip ce-chip-accent mb-4" data-testid="results-eyebrow">
            <Sparkle size={14} weight="fill" />
            YOUR RESULTS · {country} · BASED ON 9 ANSWERS & 10 RATINGS
          </div>
          <h1 className="font-display font-black tracking-tighter text-4xl md:text-5xl" data-testid="results-title">
            Your top 3 career matches.
          </h1>
          <p className="mt-3 text-base md:text-lg max-w-xl" style={{ color: "var(--text-2)" }} data-testid="results-subtitle">
            Combined from your quiz answers and ratings. Salary localised to <strong>{country}</strong>.
            {!user && <> <Link to="/signup" className="font-bold underline" style={{ color: "var(--accent)" }}>Create a free account</Link> to save them.</>}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3" data-testid="results-actions">
            <button onClick={handleDownloadImage} disabled={downloading} data-testid="download-image-button" className="inline-flex items-center gap-2 px-4 h-11 rounded-full font-semibold text-white" style={{ background: "var(--accent)", boxShadow: "4px 4px 0 0 #0a0a0a", opacity: downloading ? 0.7 : 1 }}>
              <Download size={18} weight="bold" /> {downloading ? "Generating..." : "Image"}
            </button>
            <button onClick={handleDownloadPDF} disabled={downloadingPdf} data-testid="download-pdf-button" className="inline-flex items-center gap-2 px-4 h-11 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--text)]" style={{ opacity: downloadingPdf ? 0.6 : 1 }}>
              <Download size={18} weight="bold" /> {downloadingPdf ? "Generating..." : "PDF"}
            </button>
            <button onClick={handleShare} disabled={sharing} data-testid="share-button" className="inline-flex items-center gap-2 px-4 h-11 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--text)]" style={{ opacity: sharing ? 0.6 : 1 }}>
              <ShareNetwork size={18} weight="bold" /> {sharing ? "Sharing..." : "Share"}
            </button>
            <button onClick={handleAiExplain} disabled={aiBusy} data-testid="ai-explain-button" className="inline-flex items-center gap-2 px-4 h-11 rounded-full font-semibold border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
              <Robot size={18} weight="bold" /> {aiBusy ? "Generating..." : "AI explanation"}
            </button>
          </div>

          {aiText && (
            <div className="mt-6 ce-card p-5 md:p-6" data-testid="ai-explanation" style={{ background: "var(--accent-muted)", borderColor: "var(--accent)" }}>
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
                ✨ AI insight · Claude Sonnet 4.5
              </div>
              <p className="mt-2 text-base md:text-lg leading-relaxed whitespace-pre-line">{aiText}</p>
            </div>
          )}
        </motion.div>

        {/* Captured area */}
        <div ref={shareRef} className="mt-10 bg-[var(--bg)] p-1">
          {top3.map((c, i) => (
            <CareerResultCard
              key={c.name}
              rank={i + 1}
              career={c}
              detail={details[c.name]}
              answers={answers}
              saved={savedSet.has(c.name)}
              onToggleSave={() => toggleSave(c.name)}
              isHero={i === 0}
            />
          ))}

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-2)" }}>Career Explorer AI</div>
            <div className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-2)" }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="font-display font-extrabold text-2xl tracking-tight">Also worth exploring</h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="other-careers">
            {allResults.slice(3, 10).map((c, i) => (
              <Link to={`/career/${encodeURIComponent(c.name)}`} key={c.name} className="ce-card px-5 py-4 flex items-center justify-between" data-testid={`other-career-${i + 4}`}>
                <div className="flex items-center gap-4">
                  <span className="font-display font-black text-xl tracking-tighter w-7 font-mono-tabular" style={{ color: "var(--text-2)" }}>
                    {String(i + 4).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-display font-bold text-lg tracking-tight">{c.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-2)" }}>{c.category}</div>
                  </div>
                </div>
                <div className="font-display font-black text-2xl tracking-tighter font-mono-tabular" style={{ color: "var(--accent)" }}>{c.match}%</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function CareerResultCard({ rank, career, detail, answers, saved, onToggleSave, isHero }) {
  const why = buildWhyMatches(career.name, answers);
  const wlb = detail?.wlb ?? 3;
  return (
    <div className={`rounded-[1.5rem] overflow-hidden border border-[var(--border)] ${isHero ? "" : "mt-6"}`} style={{ background: "var(--surface)" }} data-testid={`match-card-${rank}`}>
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className={`md:col-span-4 p-7 md:p-9 flex flex-col justify-between relative ${isHero ? "ce-grain" : ""}`} style={{ background: isHero ? "var(--accent)" : "var(--surface-2)", color: isHero ? "#fff" : "var(--text)", minHeight: "220px" }}>
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase rounded-full px-3 py-1" style={{ background: isHero ? "rgba(255,255,255,0.15)" : "var(--bg)" }}>
              <Trophy size={12} weight="fill" /> #{rank} MATCH
            </div>
            <div className="font-display font-black tracking-tighter mt-5 leading-none" style={{ fontSize: isHero ? "5rem" : "3.5rem" }} data-testid={`match-percent-${rank}`}>
              {career.match}%
            </div>
            <div className="text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-90">MATCH</div>
          </div>
          <div className="text-sm mt-6 flex items-center gap-1.5 opacity-90">
            <Star size={14} weight="fill" /> Your rating: {career.rating || 0} / 5
          </div>
        </div>

        <div className="md:col-span-8 p-7 md:p-9">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>{career.category}</div>
              <h2 className="font-display font-black tracking-tighter text-3xl md:text-4xl mt-2" data-testid={`match-name-${rank}`}>{career.name}</h2>
            </div>
            <button onClick={onToggleSave} data-testid={`save-button-${rank}`} aria-label="Save" className="p-2 rounded-full hover:bg-[var(--surface-2)]">
              {saved ? <Bookmark size={20} weight="fill" color="var(--accent)" /> : <BookmarkSimple size={20} weight="bold" />}
            </button>
          </div>
          <p className="mt-3 text-base md:text-lg leading-relaxed" style={{ color: "var(--text-2)" }} data-testid={`match-description-${rank}`}>
            {career.description}
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3" data-testid={`match-meta-${rank}`}>
            <Meta icon={<CurrencyDollar size={16} weight="bold" />} label="Salary" value={detail?.salary?.display || "—"} />
            <Meta icon={<Star size={16} weight="fill" />} label="Work-life" value={`${wlb} / 5`} />
            <Meta icon={<Lightning size={16} weight="bold" />} label="Demand" value={detail?.outlook || "Stable"} />
          </div>

          <div className="mt-5">
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "var(--text-2)" }}>Key Skills</div>
            <div className="flex flex-wrap gap-2" data-testid={`match-skills-${rank}`}>
              {(career.skills || CAREERS[career.name]?.skills || []).map((s) => <span key={s} className="ce-chip">{s}</span>)}
            </div>
          </div>

          <div className="mt-5 rounded-2xl p-4 border border-[var(--border)] flex gap-3" style={{ background: "var(--surface-2)" }} data-testid={`match-why-${rank}`}>
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
              <Lightning size={16} weight="fill" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>Why this matches you</div>
              <div className="text-sm md:text-base mt-1 font-medium">{why}</div>
            </div>
          </div>

          {isHero && detail?.roadmap && (
            <div className="mt-7">
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "var(--accent)" }}>Your roadmap</div>
              <RoadmapBlock roadmap={detail.roadmap} />
            </div>
          )}

          <Link to={`/career/${encodeURIComponent(career.name)}`} className="inline-flex items-center gap-1.5 mt-6 font-bold text-sm" style={{ color: "var(--accent)" }} data-testid={`match-detail-link-${rank}`}>
            See full career detail <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, label, value }) {
  return (
    <div className="border border-[var(--border)] rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--text-2)" }}>
        {icon}{label}
      </div>
      <div className="font-display font-extrabold text-sm mt-1">{value}</div>
    </div>
  );
}
