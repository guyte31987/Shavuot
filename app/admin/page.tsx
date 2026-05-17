"use client";
import { useEffect, useMemo, useState } from "react";
import { EVENT } from "@/lib/event";
import { deleteAttendee, subscribeAttendees, subscribeItems } from "@/lib/store";
import type { Attendee, Item } from "@/lib/types";

const PW_KEY = "shavuot.admin";

const JEWISH_LABEL: Record<string, string> = {
  "jewish": "Jewish",
  "jew-ally": "Jew-ally",
  "other": "Other",
  "": "—",
};

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [items, setItems] = useState<Item[]>([]);
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
    const ua = subscribeAttendees(setAttendees);
    const ui = subscribeItems(setItems);
    return () => { ua(); ui(); };
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

  const itemsByAttendee = useMemo(() => {
    const m: Record<string, Item[]> = {};
    for (const i of items) if (i.assignedTo) (m[i.assignedTo] ||= []).push(i);
    return m;
  }, [items]);

  const pool = items.filter((i) => !i.assignedTo);

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
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
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
        <h2>Admin · {attendees.length} attendees · {items.length} items</h2>
      </div>

      <div className="card">
        <h3>Ideas pool — still unclaimed ({pool.length})</h3>
        {pool.length === 0 ? (
          <p className="muted">Empty.</p>
        ) : (
          <ul>{pool.map((i) => <li key={i.id}>{i.label} <span className="muted small">· added by {i.addedByName}</span></li>)}</ul>
        )}
      </div>

      <div className="card">
        <h3>All responses</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Pronouns</th>
              <th>Jewish?</th>
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
                <td>{JEWISH_LABEL[a.jewish ?? ""] ?? "—"}</td>
                <td>{a.foodPreference}</td>
                <td>{a.drinkPreference}</td>
                <td>
                  {(itemsByAttendee[a.id] || []).map((i) => i.label).join(", ")}
                  {a.bringing?.trim() && (
                    <>
                      {(itemsByAttendee[a.id] || []).length > 0 && " · "}
                      <em>{a.bringing}</em>
                    </>
                  )}
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
