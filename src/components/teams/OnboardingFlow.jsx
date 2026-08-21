import React, { useState, useRef } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const SKILLS = [
  "Web Dev", "App Dev", "ML/AI", "Data Science", "UI/UX", "DevOps",
  "Cybersecurity", "Blockchain", "IoT", "Game Dev", "DSA/CP",
  "Cloud", "AR/VR", "Robotics/Embedded", "Open Source", "Research",
];

const BRANCHES = [
  "Computer Engineering", "Information Technology", "ENTC",
  "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
  "AI & Data Science", "Other",
];

const YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

const TIERS = [
  { value: "Beginner", label: "Beginner (0–1)" },
  { value: "Elite", label: "Elite (2–3)" },
  { value: "Master", label: "Master (5+)" },
  { value: "Expert", label: "Expert (7+)" },
  { value: "Grandmaster", label: "Grandmaster (10+ per month)" },
];

// Compress image using canvas to ~150KB JPEG
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 400; // px
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * MAX; w = MAX; }
        else { w = (w / h) * MAX; h = MAX; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const StepDots = ({ total, current }) => (
  <div className="ob-step-indicator">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`ob-step-dot${i === current ? " active" : i < current ? " done" : ""}`}
      />
    ))}
  </div>
);

export const OnboardingFlow = ({ onComplete }) => {
  const { currentUser, refreshProfile } = useAuth();
  const [phase, setPhase] = useState("greeting"); // greeting | frames
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  // ── Frame data ────────────────────────────────────────
  const [f1, setF1] = useState({
    fullName: "", contactNumber: "", photoBase64: "", gender: "",
  });
  const [f2, setF2] = useState({
    githubUsername: "", linkedinUrl: "", instagramHandle: "",
    bio: "", discordId: "",
  });
  const [f3, setF3] = useState({
    passingOutYear: "", branch: "", collegeName: "", city: "", cgpa: "",
  });
  const [f4, setF4] = useState({
    hackathonFrequency: "", hackathonTier: "", skills: [],
    yearsOfExperience: "", lookingForTeam: null,
  });
  const [agreed, setAgreed] = useState(false);

  // ── Greeting phase ────────────────────────────────────
  React.useEffect(() => {
    if (phase === "greeting") {
      const t = setTimeout(() => setPhase("frames"), 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // ── Photo handling ────────────────────────────────────
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }
    const compressed = await compressImage(file);
    setF1((p) => ({ ...p, photoBase64: compressed }));
  };

  // ── Skills toggle ─────────────────────────────────────
  const toggleSkill = (skill) => {
    setF4((p) => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter((s) => s !== skill)
        : [...p.skills, skill],
    }));
  };

  // ── Navigation ────────────────────────────────────────
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  // ── Save profile ──────────────────────────────────────
  const handleSubmit = async () => {
    if (!agreed) { toast.error("Please agree to the terms"); return; }
    setSaving(true);
    try {
      const profile = {
        uid: currentUser.uid,
        email: currentUser.email,
        role: "member",
        verified: false,
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
        // Frame 1
        fullName: f1.fullName.trim(),
        contactNumber: f1.contactNumber.trim(),
        photoBase64: f1.photoBase64,
        gender: f1.gender,
        // Frame 2
        githubUsername: f2.githubUsername.trim(),
        linkedinUrl: f2.linkedinUrl.trim(),
        instagramHandle: f2.instagramHandle.trim(),
        bio: f2.bio.trim(),
        discordId: f2.discordId.trim(),
        // Frame 3
        passingOutYear: Number(f3.passingOutYear),
        branch: f3.branch,
        collegeName: f3.collegeName.trim(),
        city: f3.city.trim(),
        cgpa: f3.cgpa ? Number(f3.cgpa) : null,
        // Frame 4
        hackathonFrequency: f4.hackathonFrequency,
        hackathonTier: f4.hackathonTier,
        skills: f4.skills,
        yearsOfExperience: Number(f4.yearsOfExperience),
        lookingForTeam: f4.lookingForTeam,
      };
      await setDoc(doc(db, "users", currentUser.uid), profile, { merge: true });
      await refreshProfile();
      toast.success("Welcome to the Falcons!");
      onComplete();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────
  if (phase === "greeting") {
    return (
      <div className="ob-root">
        <h1 className="ob-greeting">Hello.</h1>
      </div>
    );
  }

  const frames = [
    // Frame 0 — Personal Info
    <div className="ob-frame" key="f1">
      <StepDots total={5} current={0} />
      <h2 className="ob-title">Tell us about yourself</h2>
      <p className="ob-subtitle">This information will be visible on your profile card.</p>
      <div className="ob-fields">
        {/* Photo */}
        <div className="t-input-group">
          <label className="t-label">Profile Photo *</label>
          <div className="photo-upload-area">
            {f1.photoBase64 ? (
              <img src={f1.photoBase64} alt="Preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder" onClick={() => fileRef.current?.click()}>
                ＋
              </div>
            )}
            <div>
              <button
                className="t-btn t-btn-ghost"
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                onClick={() => fileRef.current?.click()}
                type="button"
              >
                {f1.photoBase64 ? "Change photo" : "Upload photo"}
              </button>
              <p style={{ fontSize: "0.72rem", color: f1.photoBase64 ? "var(--t-muted-2)" : "#e05252", marginTop: "0.3rem" }}>
                {f1.photoBase64 ? "Compressed automatically · max 5MB" : "Required · max 5MB"}
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <div className="t-input-group">
          <label className="t-label">Full Name *</label>
          <input
            className="t-input"
            placeholder="Arjun Sharma"
            value={f1.fullName}
            onChange={(e) => setF1((p) => ({ ...p, fullName: e.target.value }))}
          />
        </div>

        <div className="t-input-group">
          <label className="t-label">Email</label>
          <input className="t-input" value={currentUser?.email || ""} readOnly />
        </div>

        <div className="t-input-group">
          <label className="t-label">Contact Number *</label>
          <input
            className="t-input"
            type="tel"
            placeholder="+91 98765 43210"
            value={f1.contactNumber}
            onChange={(e) => setF1((p) => ({ ...p, contactNumber: e.target.value }))}
          />
        </div>

        <div className="t-input-group">
          <label className="t-label">Gender *</label>
          <div className="t-pill-group">
            {["Male", "Female", "Prefer not to say"].map((g) => (
              <button
                key={g}
                className={`t-pill${f1.gender === g ? " active" : ""}`}
                onClick={() => setF1((p) => ({ ...p, gender: g }))}
                type="button"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ob-nav">
        <span />
        <button
          className="t-btn t-btn-primary"
          onClick={next}
          disabled={!f1.photoBase64 || !f1.fullName || !f1.contactNumber || !f1.gender}
        >
          Next →
        </button>
      </div>
    </div>,

    // Frame 1 — Social Presence
    <div className="ob-frame" key="f2">
      <StepDots total={5} current={1} />
      <h2 className="ob-title">Social Presence</h2>
      <p className="ob-subtitle">Connect your profiles — they'll appear on your member card.</p>
      <div className="ob-fields">
        <div className="t-input-group">
          <label className="t-label">GitHub Username *</label>
          <input
            className="t-input"
            placeholder="octocat"
            value={f2.githubUsername}
            onChange={(e) => setF2((p) => ({ ...p, githubUsername: e.target.value }))}
          />
        </div>
        <div className="t-input-group">
          <label className="t-label">LinkedIn Profile URL *</label>
          <input
            className="t-input"
            placeholder="https://linkedin.com/in/yourname"
            value={f2.linkedinUrl}
            onChange={(e) => setF2((p) => ({ ...p, linkedinUrl: e.target.value }))}
          />
        </div>
        <div className="t-input-group">
          <label className="t-label">Instagram Handle (optional)</label>
          <input
            className="t-input"
            placeholder="@yourhandle"
            value={f2.instagramHandle}
            onChange={(e) => setF2((p) => ({ ...p, instagramHandle: e.target.value }))}
          />
        </div>
        <div className="t-input-group">
          <label className="t-label">Discord ID *</label>
          <input
            className="t-input"
            placeholder="username or username#1234"
            value={f2.discordId}
            onChange={(e) => setF2((p) => ({ ...p, discordId: e.target.value }))}
          />
        </div>
        <div className="t-input-group">
          <label className="t-label">Bio / Description * (max 300 chars)</label>
          <textarea
            className="t-input t-textarea"
            placeholder="Tell the community a bit about yourself..."
            maxLength={300}
            value={f2.bio}
            onChange={(e) => setF2((p) => ({ ...p, bio: e.target.value }))}
          />
          <span className={`t-char-count${f2.bio.length > 260 ? " warn" : ""}`}>
            {f2.bio.length}/300
          </span>
        </div>
      </div>
      <div className="ob-nav">
        <button className="t-btn t-btn-ghost" onClick={back}>← Back</button>
        <button
          className="t-btn t-btn-primary"
          onClick={next}
          disabled={!f2.githubUsername || !f2.linkedinUrl || !f2.discordId || !f2.bio}
        >
          Next →
        </button>
      </div>
    </div>,

    // Frame 2 — Academic Records
    <div className="ob-frame" key="f3">
      <StepDots total={5} current={2} />
      <h2 className="ob-title">Academic Records</h2>
      <p className="ob-subtitle">Help members filter by branch and batch.</p>
      <div className="ob-fields">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="t-input-group">
            <label className="t-label">Passing Out Year *</label>
            <select
              className="t-input t-select"
              value={f3.passingOutYear}
              onChange={(e) => setF3((p) => ({ ...p, passingOutYear: e.target.value }))}
            >
              <option value="">Select year</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="t-input-group">
            <label className="t-label">CGPA (optional)</label>
            <input
              className="t-input"
              type="number"
              min="0"
              max="10"
              step="0.01"
              placeholder="8.50"
              value={f3.cgpa}
              onChange={(e) => setF3((p) => ({ ...p, cgpa: e.target.value }))}
            />
          </div>
        </div>
        <div className="t-input-group">
          <label className="t-label">Branch *</label>
          <select
            className="t-input t-select"
            value={f3.branch}
            onChange={(e) => setF3((p) => ({ ...p, branch: e.target.value }))}
          >
            <option value="">Select branch</option>
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="t-input-group">
          <label className="t-label">College / University *</label>
          <input
            className="t-input"
            placeholder="NMIET, Pune"
            value={f3.collegeName}
            onChange={(e) => setF3((p) => ({ ...p, collegeName: e.target.value }))}
          />
        </div>
        <div className="t-input-group">
          <label className="t-label">City *</label>
          <input
            className="t-input"
            placeholder="Pune"
            value={f3.city}
            onChange={(e) => setF3((p) => ({ ...p, city: e.target.value }))}
          />
        </div>
      </div>
      <div className="ob-nav">
        <button className="t-btn t-btn-ghost" onClick={back}>← Back</button>
        <button
          className="t-btn t-btn-primary"
          onClick={next}
          disabled={!f3.passingOutYear || !f3.branch || !f3.collegeName || !f3.city}
        >
          Next →
        </button>
      </div>
    </div>,

    // Frame 3 — Experience & Skills
    <div className="ob-frame" key="f4">
      <StepDots total={5} current={3} />
      <h2 className="ob-title">Experience & Skills</h2>
      <p className="ob-subtitle">Let the community know what you bring to the table.</p>
      <div className="ob-fields">
        <div className="t-input-group">
          <label className="t-label">Hackathon Tier *</label>
          <select
            className="t-input t-select"
            value={f4.hackathonTier}
            onChange={(e) => setF4((p) => ({ ...p, hackathonTier: e.target.value }))}
          >
            <option value="">How many hackathons have you done?</option>
            {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="t-input-group">
          <label className="t-label">How often do you participate? *</label>
          <div className="t-pill-group">
            {["Rarely", "Monthly", "Weekly"].map((f) => (
              <button
                key={f}
                className={`t-pill${f4.hackathonFrequency === f ? " active" : ""}`}
                onClick={() => setF4((p) => ({ ...p, hackathonFrequency: f }))}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="t-input-group">
            <label className="t-label">Years of Coding *</label>
            <input
              className="t-input"
              type="number"
              min="0"
              max="20"
              placeholder="2"
              value={f4.yearsOfExperience}
              onChange={(e) => setF4((p) => ({ ...p, yearsOfExperience: e.target.value }))}
            />
          </div>
          <div className="t-input-group">
            <label className="t-label">Looking for Team?</label>
            <div className="t-pill-group">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  className={`t-pill${f4.lookingForTeam === v ? " active" : ""}`}
                  onClick={() => setF4((p) => ({ ...p, lookingForTeam: v }))}
                  type="button"
                >
                  {v ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="t-input-group">
          <label className="t-label">Skills & Domains * (select all that apply)</label>
          <div className="t-pill-group" style={{ marginTop: "0.25rem" }}>
            {SKILLS.map((s) => (
              <button
                key={s}
                className={`t-pill${f4.skills.includes(s) ? " active" : ""}`}
                onClick={() => toggleSkill(s)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ob-nav">
        <button className="t-btn t-btn-ghost" onClick={back}>← Back</button>
        <button
          className="t-btn t-btn-primary"
          onClick={next}
          disabled={
            !f4.hackathonTier || !f4.hackathonFrequency ||
            !f4.yearsOfExperience || f4.lookingForTeam === null ||
            f4.skills.length === 0
          }
        >
          Next →
        </button>
      </div>
    </div>,

    // Frame 4 — Terms
    <div className="ob-frame" key="f5">
      <StepDots total={5} current={4} />
      <h2 className="ob-title">Code of Conduct</h2>
      <p className="ob-subtitle">Read carefully — these govern your membership.</p>
      <div className="toc-rules">
        {[
          "Respect all members and maintain a welcoming, inclusive environment at all times.",
          "No spam, hate speech, or unsolicited self-promotion outside designated channels.",
          "Provide accurate information — fake or misleading profiles will be removed without notice.",
          "Follow the Falcons community Discord guidelines and all platform-specific rules.",
        ].map((rule, i) => (
          <div className="toc-rule" key={i}>
            <span className="toc-rule-num">0{i + 1}</span>
            <span>{rule}</span>
          </div>
        ))}
      </div>
      <label className="toc-checkbox-row">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span className="toc-checkbox-label">
          I have read and agree to all the above terms and the Falcons Code of Conduct.{" "}
          <a
            href="https://discord.gg/j8XvwsSUQB"
            target="_blank"
            rel="noopener noreferrer"
            className="toc-discord-link"
            onClick={(e) => e.stopPropagation()}
          >
            Join our Discord →
          </a>
        </span>
      </label>
      <div className="ob-nav">
        <button className="t-btn t-btn-ghost" onClick={back}>← Back</button>
        <button
          className="t-btn t-btn-primary"
          onClick={handleSubmit}
          disabled={!agreed || saving}
        >
          {saving ? "Saving…" : "Enter the Falcons →"}
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="ob-root">
      {frames[step]}
    </div>
  );
};
