import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, BookmarkSimple, ArrowLeft, Star, CurrencyDollar, GraduationCap, Briefcase, Lightning } from "@phosphor-icons/react";
import { toast } from "sonner";
import RoadmapBlock from "@/components/RoadmapBlock";

export default function CareerDetailPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [career, setCareer] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const country = user?.country || "US";
    (async () => {
      try {
        const { data } = await api.get(`/careers/${encodeURIComponent(slug)}`, { params: { country } });
        setCareer(data);
      } catch {
        toast.error("Could not load career");
      }
      if (user) {
        try {
          const { data } = await api.get("/saved-careers");
          setSaved(data.some((s) => s.career.toLowerCase() === slug.toLowerCase()));
        } catch {}
      }
    })();
  }, [slug, user]);

  const toggleSave = async () => {
    if (!user) {
      nav("/login", { state: { from: `/career/${slug}` } });
      return;
    }
    if (saved) {
      await api.delete(`/saved-careers/${encodeURIComponent(career.name)}`);
      setSaved(false);
      toast.success("Removed from saved");
    } else {
      await api.post("/saved-careers", { career: career.name });
      setSaved(true);
      toast.success("Saved");
    }
  };

  if (!career) return null;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-5xl mx-auto px-5 md:px-8 pt-8 md:pt-12 pb-24">
        <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6" data-testid="career-back">
          <ArrowLeft size={14} weight="bold" /> Back
        </button>

        <div className="ce-card p-6 md:p-10" data-testid="career-detail-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
                {career.category || "Career"}
              </div>
              <h1 className="font-display font-black tracking-tighter text-4xl md:text-5xl mt-2" data-testid="career-name">
                {career.name}
              </h1>
              <p className="mt-3 text-base md:text-lg max-w-2xl" style={{ color: "var(--text-2)" }}>
                {career.description}
              </p>
            </div>
            <button
              onClick={toggleSave}
              data-testid="career-save-button"
              className="inline-flex items-center gap-2 px-4 h-11 rounded-full font-bold border border-[var(--border)] hover:border-[var(--accent)]"
            >
              {saved ? <Bookmark size={16} weight="fill" color="var(--accent)" /> : <BookmarkSimple size={16} weight="bold" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<CurrencyDollar size={20} weight="bold" />} label="Salary range" value={career.salary?.display} sub={career.salary?.currency} />
            <InfoCard icon={<GraduationCap size={20} weight="bold" />} label="Work-life balance" value={`${career.wlb} / 5`} sub={"★".repeat(career.wlb) + "☆".repeat(5 - career.wlb)} />
            <InfoCard icon={<Lightning size={20} weight="bold" />} label="Future demand" value={career.outlook} />
          </div>

          <Section title="Required skills">
            <div className="flex flex-wrap gap-2">
              {(career.skills || []).map((s) => <span key={s} className="ce-chip">{s}</span>)}
            </div>
          </Section>

          <Section title="Education">
            <p className="text-base" style={{ color: "var(--text-2)" }}>{career.education}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(career.universities || []).map((u) => <span key={u} className="ce-chip ce-chip-accent">{u}</span>)}
            </div>
          </Section>

          <Section title="Certifications">
            <div className="flex flex-wrap gap-2">
              {(career.certifications || []).map((c) => <span key={c} className="ce-chip">{c}</span>)}
            </div>
          </Section>

          <Section title="Daily responsibilities">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(career.daily || []).map((d) => (
                <li key={d} className="flex items-start gap-2 text-base" style={{ color: "var(--text-2)" }}>
                  <Briefcase size={16} weight="bold" className="mt-1" color="var(--accent)" />
                  {d}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Your roadmap">
            <RoadmapBlock roadmap={career.roadmap} />
          </Section>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value, sub }) {
  return (
    <div className="ce-card p-5" style={{ boxShadow: "none" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
        {icon}
      </div>
      <div className="text-[10px] font-bold tracking-[0.22em] uppercase mt-3" style={{ color: "var(--text-2)" }}>{label}</div>
      <div className="font-display font-extrabold text-lg mt-1">{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "var(--text-2)" }}>{sub}</div>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-10">
      <h2 className="font-display font-extrabold text-xl tracking-tight mb-3">{title}</h2>
      {children}
    </div>
  );
}
