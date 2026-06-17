import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "@phosphor-icons/react";

export default function AppHeader({ rightSlot }) {
  return (
    <header
      className="w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur sticky top-0 z-30"
      data-testid="app-header"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <Compass size={18} weight="bold" color="#fff" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight">
            Career Explorer<span style={{ color: "var(--accent)" }}> AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">{rightSlot}</div>
      </div>
    </header>
  );
}
