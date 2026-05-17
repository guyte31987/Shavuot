"use client";
import { useEffect, useMemo, useState } from "react";
import type { Attendee } from "@/lib/types";

const PW_KEY = "shavuot.admin";

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(PW_KEY) : null;
    if (stored) {
      setPw(stored);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch("/api/attendees")
      .then((r) => r.json())
      .then((d) => setAttendees(d.attendees ?? []))
      .finally(() => setLoading(false));
  }, [authed]);

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/attendees");
    const d = await res.json();
    setAttendees(d.attendees ?? []);
    setLoading(false);
  }

  async function del(id: string) {
    if (!confirm("Remove this attendee?")) return;
    const res = await fetch(`/api/attendees/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": pw },
    });
    if (res.ok) refresh();
    else {
      setError("Delete failed — password may be wrong.");
      setAuthed(false);
      localStorage.removeItem(PW_KEY);
    }
  }

  const byCategory = useMemo(() => {
    const groups: Record<string, Attendee[]> = {};
    for (const a of attendees) {
      if (!a.bringing.trim()) continue;
      const key = a.bringingCategory || "Uncategorised";
      (groups[key] ||= []).push(a);
    }
    return groups;
  }, [attendees]);

  if (!authed) {
    return (
      <div className="signin-overlay">
        <h3>Admin</h3>
        <p className="muted">Enter the host password.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            localStorage.setItem(PW_KEY, pw);
            setAuthed(true);
          }}
        >
          <div className="field">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
            />
          </div>
          <button className="btn" type="submit">Enter</button>
          {error && <p className="muted" style={{ color: "var(--danger)" }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Admin · {attendees.length} attendees</h2>
          <button className="btn secondary" onClick={refresh} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Contributions by category</h3>
        {Object.keys(byCategory).length === 0 ? (
          <p className="muted">No contributions yet.</p>
        ) : (
          Object.entries(byCategory).map(([cat, list]) => (
            <div key={cat} style={{ marginBottom: 14 }}>
              <h4 style={{ marginBottom: 4 }}>{cat}</h4>
              <ul style={{ marginTop: 0 }}>
                {list.map((a) => (
                  <li key={a.id}>
                    <strong>{a.name}</strong> — {a.bringing}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3>All responses</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Pronouns</th>
              <th>Food prefs</th>
              <th>Drinks</th>
              <th>Bringing</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.name}</strong></td>
                <td>{a.pronoun}</td>
                <td>{a.foodPreference}</td>
                <td>{a.drinkPreference}</td>
                <td>
                  {a.bringingCategory && <em>{a.bringingCategory}: </em>}
                  {a.bringing}
                </td>
                <td className="muted">
                  {new Date(a.updatedAt).toLocaleString()}
                </td>
                <td>
                  <button className="btn danger" onClick={() => del(a.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
