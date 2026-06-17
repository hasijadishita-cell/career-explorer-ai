import React from "react";
import { Rocket, GraduationCap, Trophy } from "@phosphor-icons/react";

export default function RoadmapBlock({ roadmap }) {
  if (!roadmap) return null;
  const stages = [
    { key: "beginner", title: "Beginner", icon: <Rocket size={18} weight="bold" />, lists: [
      { name: "Skills to learn", items: roadmap.beginner?.skills },
      { name: "Recommended courses", items: roadmap.beginner?.courses },
    ] },
    { key: "intermediate", title: "Intermediate", icon: <GraduationCap size={18} weight="bold" />, lists: [
      { name: "Projects to build", items: roadmap.intermediate?.projects },
      { name: "Certifications", items: roadmap.intermediate?.certifications },
    ] },
    { key: "advanced", title: "Advanced", icon: <Trophy size={18} weight="bold" />, lists: [
      { name: "Internships", items: roadmap.advanced?.internships },
      { name: "Jobs to target", items: roadmap.advanced?.jobs },
    ] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="roadmap-block">
      {stages.map((stage, idx) => (
        <div key={stage.key} className="ce-card p-5" style={{ boxShadow: "none" }} data-testid={`roadmap-${stage.key}`}>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
              {stage.icon}
            </span>
            <div>
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
                Stage {idx + 1}
              </div>
              <div className="font-display font-extrabold text-lg">{stage.title}</div>
            </div>
          </div>
          {stage.lists.map((l) => (
            <div key={l.name} className="mt-4">
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "var(--text-2)" }}>{l.name}</div>
              <ul className="mt-2 space-y-1.5">
                {(l.items || []).map((item) => (
                  <li key={item} className="text-sm flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
