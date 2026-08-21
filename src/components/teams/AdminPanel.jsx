import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

/* ── CSV export helper ───────────────────────────────────── */
const exportToCsv = (rows, filename) => {
  if (!rows.length) {
    toast.error("No data to export");
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = String(v ?? "").replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${s}"` : s;
  };
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV downloaded");
};

const formatTs = (ts) => {
  if (!ts) return "";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("en-IN");
  } catch {
    return "";
  }
};

/* ══════════════════════════════════════════════════════════
   MEMBERS TAB
   ══════════════════════════════════════════════════════════ */
const MembersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => d.data()));
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (uid, name) => {
    if (!confirm(`Remove profile of ${name}? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "users", uid));
      toast.success("Profile removed");
      setUsers((p) => p.filter((u) => u.uid !== uid));
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleToggleVerified = async (uid, current) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        verified: !current,
        updatedAt: serverTimestamp(),
      });
      setUsers((p) =>
        p.map((u) => (u.uid === uid ? { ...u, verified: !current } : u))
      );
      toast.success(current ? "Unverified" : "Verified");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleToggleRole = async (uid, current) => {
    const newRole = current === "admin" ? "member" : "admin";
    try {
      await updateDoc(doc(db, "users", uid), {
        role: newRole,
        updatedAt: serverTimestamp(),
      });
      setUsers((p) =>
        p.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
      );
      toast.success(`Role set to ${newRole}`);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const rows = users.map((u) => ({
      Name: u.fullName || "",
      Email: u.email || "",
      Branch: u.branch || "",
      Year: u.passingOutYear || "",
      Tier: u.hackathonTier || "",
      Role: u.role || "member",
      Verified: u.verified ? "Yes" : "No",
      JoinedAt: formatTs(u.createdAt),
    }));
    exportToCsv(rows, "falcons_members.csv");
  };

  return (
    <>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center" }}>
        <input
          className="t-input"
          style={{ flex: 1 }}
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="t-btn" onClick={handleExport} title="Export members as CSV">
          ↓ CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <p style={{ color: "var(--t-muted-2)", padding: "2rem", textAlign: "center" }}>
            Loading…
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "var(--t-muted-2)", padding: "2rem", textAlign: "center" }}>
            No members found
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Tier</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.uid}>
                  <td style={{ color: "var(--t-text)", fontWeight: 500 }}>
                    {u.fullName || (
                      <span style={{ color: "var(--t-muted-2)" }}>—</span>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.branch || "—"}</td>
                  <td>{u.passingOutYear || "—"}</td>
                  <td>{u.hackathonTier || "—"}</td>
                  <td>
                    <button
                      onClick={() => handleToggleRole(u.uid, u.role)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color:
                          u.role === "admin"
                            ? "var(--t-text)"
                            : "var(--t-muted-2)",
                        fontSize: "0.78rem",
                        fontFamily: "var(--t-font)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "999px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor:
                          u.role === "admin"
                            ? "var(--t-border-light)"
                            : "var(--t-border)",
                      }}
                      title="Toggle admin"
                    >
                      {u.role || "member"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleVerified(u.uid, u.verified)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: u.verified ? "var(--t-text)" : "var(--t-muted-2)",
                        fontSize: "1rem",
                      }}
                      title="Toggle verified"
                    >
                      {u.verified ? "✓" : "○"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="t-btn t-btn-danger"
                      style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem" }}
                      onClick={() =>
                        handleDelete(u.uid, u.fullName || u.email)
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   FEEDBACKS TAB
   ══════════════════════════════════════════════════════════ */
const FeedbacksTab = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "approved" | "pending"

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "feedbacks"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by createdAt desc (client-side)
      data.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0;
        const tb = b.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      });
      setFeedbacks(data);
    } catch {
      toast.error("Could not load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const handleToggleApprove = async (id, current) => {
    try {
      await updateDoc(doc(db, "feedbacks", id), {
        approved: !current,
        reviewedAt: serverTimestamp(),
      });
      setFeedbacks((p) =>
        p.map((f) => (f.id === id ? { ...f, approved: !current } : f))
      );
      toast.success(current ? "Feedback hidden from carousel" : "Feedback approved & visible in carousel");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this feedback permanently?")) return;
    try {
      await deleteDoc(doc(db, "feedbacks", id));
      setFeedbacks((p) => p.filter((f) => f.id !== id));
      toast.success("Feedback deleted");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleExport = () => {
    const rows = feedbacks.map((f) => ({
      Name: f.name || "",
      Email: f.email || "",
      Rating: f.rating ?? "",
      Comment: f.comment || "",
      Approved: f.approved ? "Yes" : "No",
      SubmittedAt: formatTs(f.createdAt),
    }));
    exportToCsv(rows, "falcons_feedbacks.csv");
  };

  const filtered = feedbacks.filter((f) => {
    const matchSearch =
      !search ||
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.comment?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "approved" && f.approved) ||
      (filter === "pending" && !f.approved);
    return matchSearch && matchFilter;
  });

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? "#f5c518" : "#333" }}>
        ★
      </span>
    ));

  return (
    <>
      {/* Controls */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="t-input"
          style={{ flex: 1, minWidth: "160px" }}
          placeholder="Search name, email or comment…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="t-input"
          style={{ width: "auto", minWidth: "120px" }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All ({feedbacks.length})</option>
          <option value="approved">Approved ({feedbacks.filter((f) => f.approved).length})</option>
          <option value="pending">Pending ({feedbacks.filter((f) => !f.approved).length})</option>
        </select>
        <button className="t-btn" onClick={handleExport} title="Export feedbacks as CSV">
          ↓ Export CSV
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <p style={{ color: "var(--t-muted-2)", padding: "2rem", textAlign: "center" }}>
            Loading feedbacks…
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "var(--t-muted-2)", padding: "2rem", textAlign: "center" }}>
            No feedbacks found
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id}>
                  <td style={{ color: "var(--t-text)", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {f.name || <span style={{ color: "var(--t-muted-2)" }}>—</span>}
                  </td>
                  <td style={{ fontSize: "0.78rem" }}>{f.email || "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{renderStars(f.rating)}</td>
                  <td style={{ maxWidth: "260px" }}>
                    <span
                      title={f.comment}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "0.8rem",
                        color: "var(--t-muted)",
                      }}
                    >
                      {f.comment}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.76rem", whiteSpace: "nowrap", color: "var(--t-muted-2)" }}>
                    {formatTs(f.createdAt)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleApprove(f.id, f.approved)}
                      style={{
                        background: f.approved ? "rgba(88,101,242,0.15)" : "none",
                        border: "1px solid",
                        borderColor: f.approved ? "#5865f2" : "var(--t-border)",
                        color: f.approved ? "#5865f2" : "var(--t-muted-2)",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontFamily: "var(--t-font)",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                      }}
                      title={f.approved ? "Click to hide from carousel" : "Click to show in carousel"}
                    >
                      {f.approved ? "✓ Approved" : "○ Pending"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="t-btn t-btn-danger"
                      style={{ fontSize: "0.75rem", padding: "0.25rem 0.65rem" }}
                      onClick={() => handleDelete(f.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   ADMIN PANEL (main export)
   ══════════════════════════════════════════════════════════ */
export const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("members"); // "members" | "feedbacks"

  const tabStyle = (tab) => ({
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--t-font)",
    fontSize: "0.875rem",
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? "var(--t-text)" : "var(--t-muted-2)",
    padding: "0.5rem 1rem",
    borderBottom: activeTab === tab ? "2px solid #5865f2" : "2px solid transparent",
    transition: "all 0.2s ease",
  });

  return (
    <div
      className="t-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="t-modal admin-panel"
        style={{ maxWidth: "960px", width: "95vw" }}
      >
        {/* Header */}
        <div className="admin-panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            <button style={tabStyle("members")} onClick={() => setActiveTab("members")}>
              👥 Members
            </button>
            <button style={tabStyle("feedbacks")} onClick={() => setActiveTab("feedbacks")}>
              💬 Feedbacks
            </button>
          </div>
          <button className="t-btn-icon" onClick={onClose}>✕</button>
        </div>

        {/* Tab content */}
        <div style={{ padding: "1rem 0 0" }}>
          {activeTab === "members" ? <MembersTab /> : <FeedbacksTab />}
        </div>
      </div>
    </div>
  );
};
