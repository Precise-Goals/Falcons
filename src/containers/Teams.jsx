import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OnboardingFlow } from "../components/teams/OnboardingFlow";
import { TeamsDirectory } from "../components/teams/TeamsDirectory";
import { Navbar } from "../components/navbar";
import "../App.css";
import "../teams.css";

/* ── Teams Footer ─────────────────────────────────────── */
const TeamsFooter = () => (
  <footer
    style={{
      borderTop: "1px solid #e8e8e8",
      padding: "1.25rem 6%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#bbb",
      fontSize: "0.78rem",
      fontFamily: "Montserrat, sans-serif",
      flexWrap: "wrap",
      gap: "0.5rem",
      background: "#efefef",
    }}
  >
    <span>© {new Date().getFullYear()} Falcons Hackathon Community</span>
    <div style={{ display: "flex", gap: "1.5rem" }}>
      <Link to="/policies" style={{ color: "#bbb", textDecoration: "none" }}>
        Policies
      </Link>
      <a
        href="https://discord.gg/j8XvwsSUQB"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#bbb", textDecoration: "none" }}
      >
        Discord
      </a>
      <a
        href="https://github.com/Falcon-s-Hackathon-Community"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#bbb", textDecoration: "none" }}
      >
        GitHub
      </a>
    </div>
  </footer>
);

/* ── Main Teams Page ─────────────────────────────────── */
export const Teams = () => {
  const { currentUser, userProfile, loading } = useAuth();

  /* User is logged in but hasn't completed onboarding */
  const needsOnboarding =
    currentUser && userProfile && !userProfile.onboardingComplete;

  /* Full-screen onboarding — replaces the page entirely */
  if (!loading && needsOnboarding) {
    return (
      <div style={{ background: "#080808", minHeight: "100vh" }}>
        <OnboardingFlow
          onComplete={() => {
            /* refreshProfile() inside OnboardingFlow updates context,
               React re-renders this component:
               needsOnboarding → false → TeamsDirectory shows */
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#efefef",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Same navbar as the main site */}
      <Navbar />

      <div className="td-site-frame" style={{ flex: 1 }}>
        {loading ? (
          /* Loading skeletons */
          <div className="td-loading" style={{ marginTop: "2rem" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="site-member-card site-member-card--skeleton" />
            ))}
          </div>
        ) : (
          /* Public directory available to all visitors */
          <TeamsDirectory />
        )}
      </div>

      <TeamsFooter />
    </div>
  );
};
