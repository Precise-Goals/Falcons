import React, { useState, useRef } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const SKILLS = [
  "Web Dev",
  "App Dev",
  "ML/AI",
  "Data Science",
  "UI/UX",
  "DevOps",
  "Cybersecurity",
  "Blockchain",
  "IoT",
  "Game Dev",
  "DSA/CP",
  "Cloud",
  "AR/VR",
  "Robotics/Embedded",
  "Open Source",
  "Research",
];

const BRANCHES = [
  "Artificial Intelligence and Data Science",
  "Artificial Intelligence and Machine Learning",
  "Civil Engineering",
  "Computer Engineering",
  "Computer Science and Engineering",
  "Computer Science and Engineering (Data Science)",
  "Computer Science and Engineering(AI)",
  "Electrical Engineering",
  "Electronics Engineering",
  "Electronics and Computer Science Engineering",
  "Electronics and Telecommunication Engineering",
  "ENTC",
  "Information Technology",
  "Mechanical Engineering",
  "Other",
];

const YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

const TIERS = [
  { value: "Beginner", label: "Beginner (0–1)" },
  { value: "Elite", label: "Elite (2–3)" },
  { value: "Master", label: "Master (5+)" },
  { value: "Expert", label: "Expert (7+)" },
  { value: "Grandmaster", label: "Grandmaster (10+ per month)" },
];

const compressImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 400;
        let w = img.width,
          h = img.height;
        if (w > h) {
          h = (h / w) * MAX;
          w = MAX;
        } else {
          w = (w / h) * MAX;
          h = MAX;
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

export const EditProfile = ({ profile, onClose, onSaved }) => {
  const { currentUser, refreshProfile } = useAuth();
  const [form, setForm] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleSkill = (s) =>
    set(
      "skills",
      form.skills?.includes(s)
        ? form.skills.filter((x) => x !== s)
        : [...(form.skills || []), s],
    );

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }
    const compressed = await compressImage(file);
    set("photoBase64", compressed);
  };

  const handleSave = async () => {
    const trimmedBio = form.bio?.trim() || "";
    if (!form.fullName?.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!form.contactNumber?.trim()) {
      toast.error("Please enter your contact number");
      return;
    }
    if (!form.gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!form.githubUsername?.trim()) {
      toast.error("Please enter your GitHub username");
      return;
    }
    if (!form.linkedinUrl?.trim()) {
      toast.error("Please enter your LinkedIn profile URL");
      return;
    }
    if (!form.discordId?.trim()) {
      toast.error("Please enter your Discord ID");
      return;
    }
    if (!trimmedBio) {
      toast.error("Please enter a bio (minimum 175 characters)");
      return;
    }
    if (trimmedBio.length < 175) {
      toast.error(`Bio requires at least 175 characters (${trimmedBio.length}/250 entered)`);
      return;
    }
    if (trimmedBio.length > 250) {
      toast.error(`Bio must be at most 250 characters (${trimmedBio.length}/250 entered)`);
      return;
    }
    if (!form.passingOutYear) {
      toast.error("Please select your passing out year");
      return;
    }
    if (!form.branch) {
      toast.error("Please select your branch");
      return;
    }
    if (!form.collegeName?.trim()) {
      toast.error("Please enter your college / university name");
      return;
    }
    if (!form.city?.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!form.hackathonTier) {
      toast.error("Please select your hackathon tier");
      return;
    }
    if (!form.hackathonFrequency) {
      toast.error("Please select your hackathon frequency");
      return;
    }
    if (
      form.yearsOfExperience === "" ||
      form.yearsOfExperience === undefined ||
      form.yearsOfExperience === null
    ) {
      toast.error("Please enter your coding experience in years");
      return;
    }
    if (form.lookingForTeam === null || form.lookingForTeam === undefined) {
      toast.error("Please select if you are looking for a team");
      return;
    }
    if (!form.skills || form.skills.length === 0) {
      toast.error("Please select at least one skill or domain");
      return;
    }

    setSaving(true);
    try {
      const uid = currentUser.uid;
      await updateDoc(doc(db, "users", uid), {
        fullName: form.fullName?.trim(),
        contactNumber: form.contactNumber?.trim(),
        photoBase64: form.photoBase64 || "",
        gender: form.gender,
        githubUsername: form.githubUsername?.trim(),
        linkedinUrl: form.linkedinUrl?.trim(),
        instagramHandle: form.instagramHandle?.trim() || "",
        bio: trimmedBio,
        discordId: form.discordId?.trim(),
        passingOutYear: Number(form.passingOutYear),
        branch: form.branch,
        collegeName: form.collegeName?.trim(),
        city: form.city?.trim(),
        cgpa: form.cgpa ? Number(form.cgpa) : null,
        hackathonFrequency: form.hackathonFrequency,
        hackathonTier: form.hackathonTier,
        skills: form.skills || [],
        yearsOfExperience: Number(form.yearsOfExperience),
        lookingForTeam: form.lookingForTeam,
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      toast.success("Profile saved successfully");
      onSaved();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="t-overlay ep-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="t-modal t-modal-wide ep-modal">
        <button
          className="t-btn-icon t-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="ep-modal-title">Edit Profile</h2>

        <div className="ep-form-body">
          {/* Personal */}
          <section className="ep-section">
            <div className="pm-section-title">Personal</div>
            <div className="ep-fields">
              {/* Photo */}
              <div className="t-input-group">
                <label className="t-label">Profile Photo</label>
                <div className="photo-upload-area">
                  {form.photoBase64 ? (
                    <img
                      src={form.photoBase64}
                      alt="Preview"
                      className="photo-preview"
                    />
                  ) : (
                    <div
                      className="photo-placeholder"
                      onClick={() => fileRef.current?.click()}
                    >
                      ＋
                    </div>
                  )}
                  <button
                    className="t-btn t-btn-ghost"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => fileRef.current?.click()}
                    type="button"
                  >
                    {form.photoBase64 ? "Change photo" : "Upload photo"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhoto}
                  />
                </div>
              </div>

              <div className="ep-grid-2">
                <div className="t-input-group">
                  <label className="t-label">Full Name *</label>
                  <input
                    className="t-input"
                    value={form.fullName || ""}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                </div>
                <div className="t-input-group">
                  <label className="t-label">Contact Number *</label>
                  <input
                    className="t-input"
                    type="tel"
                    value={form.contactNumber || ""}
                    onChange={(e) => set("contactNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="t-input-group">
                <label className="t-label">Gender *</label>
                <div className="t-pill-group">
                  {["Male", "Female", "Prefer not to say"].map((g) => (
                    <button
                      key={g}
                      className={`t-pill${form.gender === g ? " active" : ""}`}
                      onClick={() => set("gender", g)}
                      type="button"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Social */}
          <section className="ep-section">
            <div className="pm-section-title">Social</div>
            <div className="ep-fields">
              <div className="ep-grid-2">
                <div className="t-input-group">
                  <label className="t-label">GitHub Username *</label>
                  <input
                    className="t-input"
                    placeholder="octocat"
                    value={form.githubUsername || ""}
                    onChange={(e) => set("githubUsername", e.target.value)}
                  />
                </div>
                <div className="t-input-group">
                  <label className="t-label">Discord ID *</label>
                  <input
                    className="t-input"
                    placeholder="username or username#1234"
                    value={form.discordId || ""}
                    onChange={(e) => set("discordId", e.target.value)}
                  />
                </div>
              </div>

              <div className="t-input-group">
                <label className="t-label">LinkedIn URL *</label>
                <input
                  className="t-input"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedinUrl || ""}
                  onChange={(e) => set("linkedinUrl", e.target.value)}
                />
              </div>

              <div className="t-input-group">
                <label className="t-label">Instagram Handle (optional)</label>
                <input
                  className="t-input"
                  placeholder="@yourhandle"
                  value={form.instagramHandle || ""}
                  onChange={(e) => set("instagramHandle", e.target.value)}
                />
              </div>

              <div className="t-input-group">
                <div className="ep-bio-header">
                  <label className="t-label" style={{ marginBottom: 0 }}>
                    Bio (175–250 chars) *
                  </label>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color:
                        (form.bio?.trim().length || 0) === 0
                          ? "var(--t-muted-2)"
                          : (form.bio?.trim().length || 0) < 175
                            ? "#e0a352"
                            : (form.bio?.trim().length || 0) <= 250
                              ? "#4ade80"
                              : "#e05252",
                    }}
                  >
                    {(form.bio?.trim().length || 0) === 0
                      ? "Compulsory (min 175 chars)"
                      : (form.bio?.trim().length || 0) < 175
                        ? `${175 - (form.bio?.trim().length || 0)} more chars needed (${form.bio?.length || 0}/250)`
                        : `${form.bio?.length || 0}/250 ✓`}
                  </span>
                </div>
                <textarea
                  className="t-input t-textarea"
                  maxLength={250}
                  placeholder="Tell the community about yourself, your skills, hackathon experience, and interests (minimum 175 characters)..."
                  value={form.bio || ""}
                  onChange={(e) => set("bio", e.target.value)}
                  required
                />
                {(form.bio?.length || 0) > 0 &&
                  (form.bio?.trim().length || 0) < 175 && (
                    <p
                      style={{
                        fontSize: "0.74rem",
                        color: "#e0a352",
                        marginTop: "0.25rem",
                      }}
                    >
                      ⚠️ Bio requires at least 175 characters (
                      {form.bio?.trim().length || 0} entered). Please add{" "}
                      {175 - (form.bio?.trim().length || 0)} more characters.
                    </p>
                  )}
              </div>
            </div>
          </section>

          {/* Academic */}
          <section className="ep-section">
            <div className="pm-section-title">Academic</div>
            <div className="ep-fields">
              <div className="ep-grid-2">
                <div className="t-input-group">
                  <label className="t-label">Passing Out Year *</label>
                  <select
                    className="t-input t-select"
                    value={form.passingOutYear || ""}
                    onChange={(e) => set("passingOutYear", e.target.value)}
                  >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
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
                    value={form.cgpa || ""}
                    onChange={(e) => set("cgpa", e.target.value)}
                  />
                </div>
              </div>

              <div className="t-input-group">
                <label className="t-label">Branch *</label>
                <select
                  className="t-input t-select"
                  value={form.branch || ""}
                  onChange={(e) => set("branch", e.target.value)}
                >
                  <option value="">Select branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ep-grid-2">
                <div className="t-input-group">
                  <label className="t-label">College / University *</label>
                  <input
                    className="t-input"
                    placeholder="NMIET, Pune"
                    value={form.collegeName || ""}
                    onChange={(e) => set("collegeName", e.target.value)}
                  />
                </div>
                <div className="t-input-group">
                  <label className="t-label">City *</label>
                  <input
                    className="t-input"
                    placeholder="Pune"
                    value={form.city || ""}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="ep-section">
            <div className="pm-section-title">Experience</div>
            <div className="ep-fields">
              <div className="ep-grid-2">
                <div className="t-input-group">
                  <label className="t-label">Hackathon Tier *</label>
                  <select
                    className="t-input t-select"
                    value={form.hackathonTier || ""}
                    onChange={(e) => set("hackathonTier", e.target.value)}
                  >
                    <option value="">Select tier</option>
                    {TIERS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="t-input-group">
                  <label className="t-label">Years Coding *</label>
                  <input
                    className="t-input"
                    type="number"
                    min="0"
                    max="20"
                    placeholder="2"
                    value={form.yearsOfExperience !== undefined ? form.yearsOfExperience : ""}
                    onChange={(e) => set("yearsOfExperience", e.target.value)}
                  />
                </div>
              </div>

              <div className="t-input-group">
                <label className="t-label">How often do you participate? *</label>
                <div className="t-pill-group">
                  {["Rarely", "Monthly", "Weekly"].map((f) => (
                    <button
                      key={f}
                      className={`t-pill${form.hackathonFrequency === f ? " active" : ""}`}
                      onClick={() => set("hackathonFrequency", f)}
                      type="button"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="t-input-group">
                <label className="t-label">Looking for Team? *</label>
                <div className="t-pill-group">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      className={`t-pill${form.lookingForTeam === v ? " active" : ""}`}
                      onClick={() => set("lookingForTeam", v)}
                      type="button"
                    >
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="t-input-group">
                <label className="t-label">Skills & Domains * (select all that apply)</label>
                <div className="t-pill-group" style={{ marginTop: "0.25rem" }}>
                  {SKILLS.map((s) => (
                    <button
                      key={s}
                      className={`t-pill${form.skills?.includes(s) ? " active" : ""}`}
                      onClick={() => toggleSkill(s)}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="ep-actions">
          <button className="t-btn t-btn-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="t-btn t-btn-primary"
            onClick={handleSave}
            disabled={saving}
            type="button"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
