"use client";
import { useEffect, useMemo, useState } from "react";
import { EVENT } from "@/lib/event";
import { deleteAttendee, subscribeAttendees } from "@/lib/store";
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
    if (stored && stored === EVENT.adminPassword) {
      setPw(stored);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    const unsub = subscribeAttendees((list) => {
      setAttendees(list);
      setLoading(false);
    });
    return unsub;
  }, [authed]);

  async function del(id: string) {
    if (!confirm("Remove this attendee?")) return;
    try {
      await deleteAttendee(id);
    } catch (e) {
      console.error(e);
      setError("Delete failed.");
    }
  }

  const byCategory = useMemo(() => {
    const groups: Record<string, Attendee[]> = {};
    for (const a of attendees) {
      if (!a.bringing?.trim()) continue;
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
            if (pw === EVENT.adminPassword) {
              localStorage.setItem(PW_KEY, pw);
              setAuthed(true);
            } else {
              setError("Wrong password.");
            }
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
          {loading && <span className="muted">Loading…</span>}
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
                  {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : "—"}
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
