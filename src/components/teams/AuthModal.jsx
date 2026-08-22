import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * GlobalAuthModal
 * ─────────────────────────────────────────────────────────
 * Rendered once at the App level (inside BrowserRouter).
 * Reads authModalOpen from context — any component can call
 * openAuthModal() to show it.
 *
 * Post-auth navigation logic:
 *   • signup          → always /teams  (onboarding will fire there)
 *   • login / google  → if onboardingComplete → stay (navigate(-1) or /)
 *                       if NOT complete       → /teams (onboarding)
 */
export const GlobalAuthModal = () => {
  const { authModalOpen, closeAuthModal, login, signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  if (!authModalOpen) return null;

  // After any successful auth, decide where to go
  const afterAuth = (profile, isNewSignup = false) => {
    closeAuthModal();
    setEmail(""); setPassword("");
    if (isNewSignup || !profile?.onboardingComplete) {
      navigate("/teams"); // onboarding will auto-trigger inside /teams
    }
    // if already onboarded → stay on current page (do nothing)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (tab === "signin") {
        const profile = await login(email, password);
        afterAuth(profile, false);
      } else {
        const profile = await signup(email, password);
        afterAuth(profile, true); // signup always → onboarding
      }
    } catch {
      // errors handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        afterAuth(profile, false);
      }
    } catch {
      // Handled in AuthContext
    } finally {
      setGLoading(false);
    }
  };

  return (
    <div
      className="t-overlay"
      onClick={(e) => e.target === e.currentTarget && closeAuthModal()}
    >
      <div className="t-modal">
        <button
          className="t-btn-icon t-modal-close"
          onClick={closeAuthModal}
          aria-label="Close"
        >
          ✕
        </button>

        <p className="auth-modal-title">
          {tab === "signin" ? "Welcome back" : "Join the Falcons"}
        </p>
        <p className="auth-modal-sub">
          {tab === "signin"
            ? "Sign in to access the member directory."
            : "Create your account and start your journey."}
        </p>

        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === "signin" ? " active" : ""}`}
            onClick={() => setTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${tab === "signup" ? " active" : ""}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="t-input-group">
            <label className="t-label">Email</label>
            <input
              className="t-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="t-input-group">
            <label className="t-label">Password</label>
            <input
              className="t-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="t-btn t-btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : tab === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="auth-google-btn"
          onClick={handleGoogle}
          disabled={gLoading}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {gLoading ? "Signing in…" : "Continue with Google"}
        </button>
      </div>
    </div>
  );
};
