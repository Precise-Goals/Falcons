import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

export const AdminPanel = ({ onClose }) => {
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
      setUsers((p) => p.map((u) => u.uid === uid ? { ...u, verified: !current } : u));
      toast.success(current ? "Unverified" : "Verified");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleToggleRole = async (uid, current) => {
    const newRole = current === "admin" ? "member" : "admin";
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole, updatedAt: serverTimestamp() });
      setUsers((p) => p.map((u) => u.uid === uid ? { ...u, role: newRole } : u));
      toast.success(`Role set to ${newRole}`);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const filtered = users.filter((u) =>
    !search ||
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="t-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="t-modal admin-panel" style={{ maxWidth: "900px", width: "95vw" }}>
        <div className="admin-panel-header">
          <span className="admin-title">Admin Panel · {users.length} members</span>
          <button className="t-btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="t-input-group" style={{ marginBottom: "1rem" }}>
          <input
            className="t-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <p style={{ color: "var(--t-muted-2)", padding: "2rem", textAlign: "center" }}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--t-muted-2)", padding: "2rem", textAlign: "center" }}>No members found</p>
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
                      {u.fullName || <span style={{ color: "var(--t-muted-2)" }}>—</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.branch || "—"}</td>
                    <td>{u.passingOutYear || "—"}</td>
                    <td>{u.hackathonTier || "—"}</td>
                    <td>
                      <button
                        onClick={() => handleToggleRole(u.uid, u.role)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: u.role === "admin" ? "var(--t-text)" : "var(--t-muted-2)",
                          fontSize: "0.78rem", fontFamily: "var(--t-font)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "999px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: u.role === "admin" ? "var(--t-border-light)" : "var(--t-border)",
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
                          background: "none", border: "none", cursor: "pointer",
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
                        onClick={() => handleDelete(u.uid, u.fullName || u.email)}
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
      </div>
    </div>
  );
};
