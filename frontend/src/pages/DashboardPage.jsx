import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/AppHeader";
import AssessmentTrendChart from "@/components/AssessmentTrendChart";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ArrowRight, Bookmark, Trash, Sparkle } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [saved, setSaved] = useState([]);
  const [trends, setTrends] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) nav("/login", { state: { from: "/dashboard" } });
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [a, s, t] = await Promise.all([
          api.get("/assessments"),
          api.get("/saved-careers"),
          api.get("/assessments/trends"),
        ]);
        setAssessments(a.data);
        setSaved(s.data);
        setTrends(t.data);
      } catch (e) {
        toast.error("Failed to load dashboard");
      } finally {
        setBusy(false);
      }
    })();
  }, [user]);

  const removeSaved = async (career) => {
    await api.delete(`/saved-careers/${encodeURIComponent(career)}`);
    setSaved((arr) => arr.filter((s) => s.career !== career));
    toast.success("Removed");
  };

  const deleteAssessment = async (id) => {
    await api.delete(`/assessments/${id}`);
    setAssessments((arr) => arr.filter((a) => a.id !== id));
    toast.success("Deleted");
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
            Dashboard
          </div>
          <h1 className="font-display font-black tracking-tighter text-4xl md:text-5xl mt-2" data-testid="dashboard-title">
            Hi, {user.name}.
          </h1>
          <p className="mt-2 text-base md:text-lg" style={{ color: "var(--text-2)" }}>
            Your past assessments, saved careers and explorations.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => nav("/assessment")}
              data-testid="new-assessment-button"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-full font-bold text-white"
              style={{ background: "var(--accent)", boxShadow: "4px 4px 0 0 #0a0a0a" }}
            >
              <Sparkle size={16} weight="fill" /> New assessment
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </motion.div>

        <section className="mt-12">
          <h2 className="font-display font-extrabold text-2xl tracking-tight">Past assessments</h2>
          {busy ? (
            <div className="mt-6 text-sm" style={{ color: "var(--text-2)" }}>Loading...</div>
          ) : assessments.length === 0 ? (
            <div className="ce-card p-6 mt-5" data-testid="no-assessments">
              <p className="font-medium">No assessments yet.</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
                Take your first assessment to see your top career matches.
              </p>
            </div>
          ) : (
            <>
              {trends && trends.points && trends.points.length > 0 && (
                <div className="mt-5">
                  <AssessmentTrendChart data={trends} />
                </div>
              )}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="assessments-list">
              {assessments.map((a) => (
                <div key={a.id} className="ce-card p-5" data-testid={`assessment-${a.id}`}>
                  <div className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: "var(--accent)" }}>
                    {new Date(a.created_at).toLocaleDateString()} · {a.country}
                  </div>
                  <div className="mt-1 font-display font-bold text-lg">
                    Top match: {a.top3?.[0]?.name} · {a.top3?.[0]?.match}%
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
                    {(a.top3 || []).slice(0, 3).map((c) => c.name).join(" · ")}
                  </div>
                  <button
                    onClick={() => deleteAssessment(a.id)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: "var(--text-2)" }}
                  >
                    <Trash size={12} /> Delete
                  </button>
                </div>
              ))}
            </div>
            </>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display font-extrabold text-2xl tracking-tight">Saved careers</h2>
          {saved.length === 0 ? (
            <div className="ce-card p-6 mt-5">
              <p className="font-medium">No saved careers yet.</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
                Use the bookmark on any career to save it here.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" data-testid="saved-list">
              {saved.map((s) => (
                <div key={s.career} className="ce-card p-4 flex items-center justify-between" data-testid={`saved-${s.career.replace(/\s+/g,'-').toLowerCase()}`}>
                  <div>
                    <div className="font-display font-bold">{s.career}</div>
                    <div className="text-xs" style={{ color: "var(--text-2)" }}>
                      Saved {new Date(s.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button onClick={() => removeSaved(s.career)} className="p-2 hover:text-[var(--accent)]" aria-label="Remove">
                    <Bookmark size={18} weight="fill" color="var(--accent)" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
