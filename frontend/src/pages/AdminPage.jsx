import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) nav("/");
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    (async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } finally {
        setBusy(false);
      }
    })();
  }, [user]);

  if (loading || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-24">
        <div className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
          Admin
        </div>
        <h1 className="font-display font-black tracking-tighter text-4xl md:text-5xl mt-2" data-testid="admin-title">
          Platform stats
        </h1>

        {busy || !stats ? (
          <div className="mt-6 text-sm">Loading...</div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5" data-testid="admin-counters">
              {[
                { label: "Users", value: stats.total_users },
                { label: "Assessments", value: stats.total_assessments },
                { label: "Saved careers", value: stats.total_saved },
              ].map((s) => (
                <div key={s.label} className="ce-card p-6" data-testid={`counter-${s.label.toLowerCase().replace(' ','-')}`}>
                  <div className="font-display font-black text-5xl tracking-tighter">{s.value}</div>
                  <div className="text-xs font-bold tracking-[0.2em] uppercase mt-2" style={{ color: "var(--text-2)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-display font-extrabold text-2xl tracking-tight">Top #1 careers</h2>
                <div className="mt-4 ce-card divide-y divide-[var(--border)]" data-testid="top-careers-list">
                  {stats.top_careers.length === 0 && <div className="p-5 text-sm" style={{ color: "var(--text-2)" }}>No data yet</div>}
                  {stats.top_careers.map((c, i) => (
                    <div key={c.name} className="px-5 py-3 flex items-center justify-between">
                      <div className="font-medium"><span style={{ color: "var(--text-2)" }}>#{i + 1}</span> {c.name}</div>
                      <div className="font-bold font-mono-tabular">{c.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display font-extrabold text-2xl tracking-tight">Most saved</h2>
                <div className="mt-4 ce-card divide-y divide-[var(--border)]" data-testid="top-saved-list">
                  {stats.top_saved.length === 0 && <div className="p-5 text-sm" style={{ color: "var(--text-2)" }}>No data yet</div>}
                  {stats.top_saved.map((c, i) => (
                    <div key={c.name} className="px-5 py-3 flex items-center justify-between">
                      <div className="font-medium"><span style={{ color: "var(--text-2)" }}>#{i + 1}</span> {c.name}</div>
                      <div className="font-bold font-mono-tabular">{c.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
