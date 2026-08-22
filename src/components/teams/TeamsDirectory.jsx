import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ProfileModal } from "./ProfileModal";
import { EditProfile } from "./EditProfile";
import { AdminPanel } from "./AdminPanel";
import toast from "react-hot-toast";

/* ──────────────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────────────── */
const ALL_SKILLS = [
  "Web Dev", "App Dev", "ML/AI", "Data Science", "UI/UX", "DevOps",
  "Cybersecurity", "Blockchain", "IoT", "Game Dev", "DSA/CP",
  "Cloud", "AR/VR", "Robotics/Embedded", "Open Source", "Research",
];

const ALL_TIERS = ["Beginner", "Elite", "Master", "Expert", "Grandmaster"];

const ALL_BRANCHES = [
  "Computer Engineering", "Information Technology", "ENTC",
  "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
  "AI & Data Science", "Other",
];

const EMPTY_FILTERS = {
  branch: [], year: [], tier: [], skills: [], looking: null,
};

/* ──────────────────────────────────────────────────────
   Filter Dock — a small centered floating panel
   ────────────────────────────────────────────────────── */
const FilterDock = ({ active, onClose, onApply }) => {
  const [draft, setDraft] = useState({ ...EMPTY_FILTERS });
  const dockRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!active) return;
    const handleClick = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [active, onClose]);

  const toggle = (key, val) =>
    setDraft((p) => ({
      ...p,
      [key]: p[key].includes(val)
        ? p[key].filter((x) => x !== val)
        : [...p[key], val],
    }));

  const countActive = Object.values(draft).flat().filter(Boolean).length;

  if (!active) return null;

  return (
    <div className="fdock-overlay">
      <div className="fdock" ref={dockRef}>
        <div className="fdock-header">
          <span className="fdock-title">Filters</span>
          {countActive > 0 && (
            <button
              className="fdock-clear"
              onClick={() => setDraft({ ...EMPTY_FILTERS })}
            >
              Clear all
            </button>
          )}
          <button className="fdock-close" onClick={onClose}>✕</button>
        </div>

        <div className="fdock-body">
          {/* Branch */}
          <div className="fdock-section">
            <span className="fdock-label">Branch</span>
            <div className="fdock-pills">
              {ALL_BRANCHES.map((b) => (
                <button
                  key={b}
                  className={`fdock-pill${draft.branch.includes(b) ? " on" : ""}`}
                  onClick={() => toggle("branch", b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Tier */}
          <div className="fdock-section">
            <span className="fdock-label">Hackathon Tier</span>
            <div className="fdock-pills">
              {ALL_TIERS.map((t) => (
                <button
                  key={t}
                  className={`fdock-pill${draft.tier.includes(t) ? " on" : ""}`}
                  onClick={() => toggle("tier", t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="fdock-section">
            <span className="fdock-label">Skills</span>
            <div className="fdock-pills">
              {ALL_SKILLS.map((s) => (
                <button
                  key={s}
                  className={`fdock-pill${draft.skills.includes(s) ? " on" : ""}`}
                  onClick={() => toggle("skills", s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Team status */}
          <div className="fdock-section">
            <span className="fdock-label">Looking for team?</span>
            <div className="fdock-pills">
              {[
                { label: "Open to team", val: true },
                { label: "Not looking", val: false },
              ].map(({ label, val }) => (
                <button
                  key={label}
                  className={`fdock-pill${draft.looking === val ? " on" : ""}`}
                  onClick={() =>
                    setDraft((p) => ({
                      ...p,
                      looking: p.looking === val ? null : val,
                    }))
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="fdock-footer">
          <button className="fdock-apply" onClick={() => { onApply(draft); onClose(); }}>
            Apply filters{countActive > 0 ? ` (${countActive})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────
   Member Card (site-themed, light background)
   ────────────────────────────────────────────────────── */
const initials = (name) =>
  name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

const SiteMemberCard = ({ profile, onClick, isOwn }) => {
  const visibleSkills = (profile.skills || []).slice(0, 3);
  const extra = (profile.skills || []).length - 3;

  return (
    <div
      className="site-member-card"
      data-tier={profile.hackathonTier || ""}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="abs"></div>
      {profile.lookingForTeam && (
        <span className="smc-looking">Open to team</span>
      )}

      <div className="smc-top">
        {profile.photoBase64 ? (
          <img src={profile.photoBase64} alt={profile.fullName} className="smc-avatar" />
        ) : (
          <div className="smc-avatar-ph">{initials(profile.fullName)}</div>
        )}
        <div className="smc-info">
          <div className="smc-name">
            {profile.fullName}
            {isOwn && <span className="smc-you">you</span>}
          </div>
          <div className="smc-meta">
            {profile.branch} · {profile.passingOutYear}
          </div>
        </div>
      </div>

      {profile.bio && (
        <p className="smc-bio">{profile.bio}</p>
      )}

      <div className="smc-skills">
        {visibleSkills.map((s) => (
          <span key={s} className="smc-skill">{s}</span>
        ))}
        {extra > 0 && <span className="smc-skill">+{extra}</span>}
      </div>

      <div className="smc-footer">
        {profile.githubUsername && (
          <a
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank" rel="noopener noreferrer"
            className="smc-link"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub ↗
          </a>
        )}
        {profile.linkedinUrl && (
          <a
            href={profile.linkedinUrl}
            target="_blank" rel="noopener noreferrer"
            className="smc-link"
            onClick={(e) => e.stopPropagation()}
          >
            LinkedIn ↗
          </a>
        )}
        {profile.hackathonTier && (
          <span className="smc-tier">{profile.hackathonTier}</span>
        )}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────
   TeamsDirectory
   ────────────────────────────────────────────────────── */
export const TeamsDirectory = () => {
  const { currentUser, userProfile, openAuthModal, logout, refreshProfile } = useAuth();
  const isAdmin = userProfile?.role === "admin";
  const hasDetails = Boolean(currentUser && userProfile?.onboardingComplete);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [filterOpen, setFilterOpen] = useState(false);

  const handleDetailsAction = () => {
    if (!currentUser) {
      openAuthModal();
    } else if (!userProfile?.onboardingComplete) {
      refreshProfile();
    } else {
      const myProfile = members.find((m) => m.uid === currentUser.uid) || userProfile;
      setSelected(myProfile);
      setEditing(true);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setMembers(
        snap.docs.map((d) => d.data()).filter((u) => u.onboardingComplete)
      );
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (uid) => {
    try {
      await deleteDoc(doc(db, "users", uid));
      setMembers((m) => m.filter((u) => u.uid !== uid));
      setSelected(null);
      toast.success("Profile removed");
      if (uid === currentUser?.uid) await logout();
    } catch {
      toast.error("Something went wrong");
    }
  };

  // Active filter count (for button badge)
  const activeFilterCount = [
    ...filters.branch, ...filters.tier, ...filters.skills,
    ...(filters.looking !== null ? [filters.looking] : []),
  ].length;

  // Filtering
  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    if (q && !(
      m.fullName?.toLowerCase().includes(q) ||
      m.githubUsername?.toLowerCase().includes(q) ||
      m.bio?.toLowerCase().includes(q) ||
      m.collegeName?.toLowerCase().includes(q) ||
      m.branch?.toLowerCase().includes(q)
    )) return false;
    if (filters.branch.length && !filters.branch.includes(m.branch)) return false;
    if (filters.tier.length && !filters.tier.includes(m.hackathonTier)) return false;
    if (filters.skills.length && !filters.skills.some((s) => (m.skills || []).includes(s))) return false;
    if (filters.looking !== null && m.lookingForTeam !== filters.looking) return false;
    return true;
  });

  return (
    <div className="td-main">
      {/* Page heading */}
      <div className="td-heading">
        <h2 className="td-title">Member Directory</h2>
        <p className="td-count-text">
          {loading ? "Loading…" : `${filtered.length} of ${members.length} members`}
        </p>
      </div>

      {/* Search + Filter toolbar */}
      <div className="td-toolbar-site">
        <div className="td-search-wrap-site">
          <svg className="td-search-ico" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="td-search-input"
            placeholder="Search by name, branch, bio…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="td-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <button
          className={`td-filter-btn${activeFilterCount > 0 ? " td-filter-btn--active" : ""}`}
          onClick={() => setFilterOpen((v) => !v)}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="td-filter-badge">{activeFilterCount}</span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            className="td-clear-btn"
            onClick={() => setFilters({ ...EMPTY_FILTERS })}
          >
            Clear filters
          </button>
        )}

        {/* Add / Edit your details button */}
        <button
          className={`td-details-btn${hasDetails ? " td-details-btn--edit" : " td-details-btn--add"}`}
          onClick={handleDetailsAction}
        >
          {hasDetails ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit your details</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add your details</span>
            </>
          )}
        </button>

        {/* User actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* {userProfile?.fullName && (
            <span style={{ fontSize: "0.825rem", color: "#666", fontFamily: "Montserrat" }}>
              {userProfile.fullName.split(" ")[0]}
            </span>
          )} */}
          {isAdmin && (
            <button
              className="td-icon-btn"
              onClick={() => setShowAdmin(true)}
              title="Admin Panel"
            >
              ⚙
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="td-active-chips">
          {filters.branch.map((b) => (
            <span key={b} className="td-chip">
              {b}
              <button onClick={() => setFilters((p) => ({ ...p, branch: p.branch.filter((x) => x !== b) }))}>✕</button>
            </span>
          ))}
          {filters.tier.map((t) => (
            <span key={t} className="td-chip">
              {t}
              <button onClick={() => setFilters((p) => ({ ...p, tier: p.tier.filter((x) => x !== t) }))}>✕</button>
            </span>
          ))}
          {filters.skills.map((s) => (
            <span key={s} className="td-chip">
              {s}
              <button onClick={() => setFilters((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }))}>✕</button>
            </span>
          ))}
          {filters.looking !== null && (
            <span className="td-chip">
              {filters.looking ? "Open to team" : "Not looking"}
              <button onClick={() => setFilters((p) => ({ ...p, looking: null }))}>✕</button>
            </span>
          )}
        </div>
      )}

      {/* Filter Dock */}
      <FilterDock
        active={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => setFilters(f)}
      />

      {/* Grid */}
      {loading ? (
        <div className="td-loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="site-member-card site-member-card--skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="td-empty-site">
          <p>No members match your search.</p>
          <button className="td-clear-btn" onClick={() => { setSearch(""); setFilters({ ...EMPTY_FILTERS }); }}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="td-grid-site">
          {filtered.map((m) => (
            <SiteMemberCard
              key={m.uid}
              profile={m}
              isOwn={m.uid === currentUser?.uid}
              onClick={() => setSelected(m)}
            />
          ))}
        </div>
      )}

      {/* Profile Modal (dark overlay, fine as-is) */}
      {selected && !editing && (
        <ProfileModal
          profile={selected}
          isOwn={selected.uid === currentUser?.uid}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(true)}
          onDelete={() => handleDelete(selected.uid)}
        />
      )}

      {selected && editing && (
        <EditProfile
          profile={selected}
          onClose={() => setEditing(false)}
          onSaved={async () => {
            await fetchMembers();
            await refreshProfile();
            setEditing(false);
            setSelected(null);
          }}
        />
      )}

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
};
