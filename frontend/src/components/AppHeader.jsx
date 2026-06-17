import React from "react";
import { Link } from "react-router-dom";
import { Compass, Globe, SignOut, User as UserIcon } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const COUNTRIES = [
  { code: "US", label: "🇺🇸 US" },
  { code: "UK", label: "🇬🇧 UK" },
  { code: "CA", label: "🇨🇦 CA" },
  { code: "AU", label: "🇦🇺 AU" },
  { code: "IN", label: "🇮🇳 IN" },
];

export default function AppHeader({ rightSlot }) {
  const { user, logout, setCountry } = useAuth() || {};
  const handleCountry = async (code) => {
    if (!user) return;
    try {
      await setCountry(code);
      toast.success(`Country set to ${code}`);
    } catch {
      toast.error("Could not update country");
    }
  };

  return (
    <header
      className="w-full border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur sticky top-0 z-30"
      data-testid="app-header"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
            <Compass size={18} weight="bold" color="#fff" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight">
            Career Explorer<span style={{ color: "var(--accent)" }}> AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 border border-[var(--border)] rounded-full px-2 py-1" data-testid="country-selector">
              <Globe size={14} />
              <select
                value={user.country || "US"}
                onChange={(e) => handleCountry(e.target.value)}
                data-testid="country-select"
                className="bg-transparent text-xs font-bold tracking-wider uppercase outline-none cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          )}
          {rightSlot}
          {user ? (
            <>
              <Link to="/dashboard" data-testid="dashboard-link" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold">
                <UserIcon size={14} weight="bold" /> {user.name?.split(" ")[0] || "Me"}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" data-testid="admin-link" className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Admin</Link>
              )}
              <button onClick={logout} data-testid="logout-button" className="p-2 rounded-full hover:bg-[var(--surface-2)]" aria-label="Logout">
                <SignOut size={16} weight="bold" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" data-testid="header-login" className="text-sm font-semibold">Sign in</Link>
              <Link to="/signup" data-testid="header-signup" className="text-sm font-bold text-white rounded-full px-4 py-2" style={{ background: "var(--accent)" }}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
