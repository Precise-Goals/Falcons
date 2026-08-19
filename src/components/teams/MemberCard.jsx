import React from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const initials = (name) =>
  name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

export const MemberCard = ({ profile, onClick, isOwn }) => {
  const skillsToShow = (profile.skills || []).slice(0, 3);
  const extra = (profile.skills || []).length - 3;

  return (
    <div className="member-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}>
      {profile.lookingForTeam && (
        <span className="member-looking-badge">Open to team</span>
      )}
      <div className="member-card-top">
        {profile.photoBase64 ? (
          <img src={profile.photoBase64} alt={profile.fullName} className="member-avatar" />
        ) : (
          <div className="member-avatar-placeholder">{initials(profile.fullName)}</div>
        )}
        <div>
          <div className="member-name">
            {profile.fullName}
            {isOwn && (
              <span style={{ fontSize: "0.7rem", color: "var(--t-muted-2)", marginLeft: "0.4rem" }}>
                (you)
              </span>
            )}
          </div>
          <div className="member-meta">
            {profile.branch} · {profile.passingOutYear}
          </div>
        </div>
      </div>

      {profile.bio && (
        <p style={{
          fontSize: "0.8rem", color: "var(--t-muted)", marginBottom: "0.75rem",
          lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>
          {profile.bio}
        </p>
      )}

      <div className="member-skills">
        {skillsToShow.map((s) => (
          <span key={s} className="member-skill-tag">{s}</span>
        ))}
        {extra > 0 && (
          <span className="member-skill-tag">+{extra}</span>
        )}
      </div>

      <div className="member-links">
        {profile.githubUsername && (
          <a
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="member-link"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.625-5.476 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        )}
        {profile.linkedinUrl && (
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="member-link"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        )}
        {profile.hackathonTier && (
          <span className="tier-badge" style={{ marginLeft: "auto" }}>
            {profile.hackathonTier}
          </span>
        )}
      </div>
    </div>
  );
};
