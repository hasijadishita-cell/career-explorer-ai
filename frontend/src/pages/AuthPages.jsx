import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, EnvelopeSimple, Lock, User as UserIcon, Globe } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

const COUNTRY_OPTIONS = [
  { code: "US", label: "United States" },
  { code: "UK", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "IN", label: "India" },
];

function AuthShell({ title, sub, children, footer }) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-2/5 p-12 flex-col justify-between ce-grain"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
            <Compass size={20} weight="bold" />
          </span>
          <span className="font-display font-extrabold text-lg">Career Explorer AI</span>
        </Link>
        <div>
          <h2 className="font-display font-black text-5xl tracking-tighter leading-[0.95]">
            Find a career that<br />actually fits you.
          </h2>
          <p className="opacity-90 mt-5 text-lg max-w-md">
            9 questions. Top 3 matches. Personalised roadmaps for every recommendation.
          </p>
        </div>
        <div className="text-xs font-bold tracking-[0.22em] uppercase opacity-80">
          Mock data · No spam · Free forever
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
              <Compass size={16} weight="bold" color="#fff" />
            </span>
            <span className="font-display font-extrabold">Career Explorer AI</span>
          </Link>
          <h1 className="font-display font-black tracking-tighter text-3xl md:text-4xl">{title}</h1>
          <p className="mt-2 text-base" style={{ color: "var(--text-2)" }}>
            {sub}
          </p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm" style={{ color: "var(--text-2)" }}>{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}

function Field({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-2)]">{icon}</span>
      <input
        {...props}
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)] bg-white text-[var(--text)] placeholder:text-[var(--text-2)] font-medium"
      />
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      const next = location.state?.from || "/dashboard";
      nav(next);
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      sub="Sign in to view your past results and save careers."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-bold underline decoration-2 underline-offset-4" style={{ color: "var(--accent)" }} data-testid="signup-link">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" data-testid="login-form">
        <Field icon={<EnvelopeSimple size={18} />} type="email" required placeholder="Email" data-testid="login-email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field icon={<Lock size={18} />} type="password" required placeholder="Password" data-testid="login-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-semibold" style={{ color: "var(--accent)" }} data-testid="forgot-link">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          data-testid="login-submit"
          className="w-full h-12 rounded-full font-bold text-white"
          style={{ background: "var(--accent)", boxShadow: "4px 4px 0 0 #0a0a0a", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

export function SignupPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "US" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.country);
      toast.success("Account created");
      nav("/dashboard");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail) || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      sub="Save assessments, favourite careers, and unlock AI explanations."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold underline decoration-2 underline-offset-4" style={{ color: "var(--accent)" }} data-testid="login-link">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" data-testid="signup-form">
        <Field icon={<UserIcon size={18} />} required placeholder="Full name" data-testid="signup-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Field icon={<EnvelopeSimple size={18} />} type="email" required placeholder="Email" data-testid="signup-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field icon={<Lock size={18} />} type="password" minLength={6} required placeholder="Password (min 6 chars)" data-testid="signup-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-2)]"><Globe size={18} /></span>
          <select
            data-testid="signup-country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none bg-white text-[var(--text)] font-medium appearance-none"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          data-testid="signup-submit"
          className="w-full h-12 rounded-full font-bold text-white"
          style={{ background: "var(--accent)", boxShadow: "4px 4px 0 0 #0a0a0a", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { api } = await import("@/lib/api");
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (e) {
      toast.error("Could not send reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Forgot password?" sub="Enter your email and we'll send a reset link.">
      {sent ? (
        <div className="ce-card p-6" data-testid="forgot-sent">
          <p className="font-medium">
            If that email exists in our system, we&apos;ve sent a reset link.
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>
            Check your inbox (and the backend console as a demo fallback).
          </p>
          <Link to="/login" className="inline-block mt-5 font-bold" style={{ color: "var(--accent)" }}>
            Back to sign in →
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" data-testid="forgot-form">
          <Field icon={<EnvelopeSimple size={18} />} type="email" required placeholder="Email" data-testid="forgot-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button
            type="submit"
            disabled={loading}
            data-testid="forgot-submit"
            className="w-full h-12 rounded-full font-bold text-white"
            style={{ background: "var(--accent)", boxShadow: "4px 4px 0 0 #0a0a0a" }}
          >
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export function ResetPasswordPage() {
  const nav = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error("Missing reset token"); return; }
    setLoading(true);
    try {
      const { api } = await import("@/lib/api");
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password reset — please sign in");
      nav("/login");
    } catch (e) {
      toast.error("Reset failed — token may be invalid or used");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set a new password" sub="Choose a strong password you'll remember.">
      <form onSubmit={submit} className="space-y-4" data-testid="reset-form">
        <Field icon={<Lock size={18} />} type="password" minLength={6} required placeholder="New password" data-testid="reset-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button
          type="submit"
          disabled={loading || !token}
          data-testid="reset-submit"
          className="w-full h-12 rounded-full font-bold text-white"
          style={{ background: "var(--accent)", boxShadow: "4px 4px 0 0 #0a0a0a", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
        {!token && <p className="text-sm" style={{ color: "var(--text-2)" }}>Open the reset link from your email to continue.</p>}
      </form>
    </AuthShell>
  );
}
