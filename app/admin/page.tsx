"use client";
import { useEffect, useMemo, useState } from "react";
import { EVENT } from "@/lib/event";
import { nameToId } from "@/lib/session";
import { deleteAttendee, subscribeAttendees, subscribeItems } from "@/lib/store";
import type { Attendee, Item } from "@/lib/types";

const PW_KEY = "shavuot.admin";

const RSVP_LABEL: Record<string, string> = {
  "dinner": "Dinner",
  "drinks": "Drinks",
  "both": "Both",
  "no": "Can't make it",
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

  // Detect name-slug collisions so we can flag duplicate rows in the table.
  const dupStatus = useMemo(() => {
    const groups = new Map<string, Attendee[]>();
    for (const a of attendees) {
      const key = nameToId(a.name) || a.id;
      (groups.get(key) ?? groups.set(key, []).get(key)!).push(a);
    }
    const status: Record<string, "canonical" | "duplicate" | "unique"> = {};
    for (const [slug, group] of groups) {
      if (group.length === 1) {
        status[group[0].id] = "unique";
        continue;
      }
      const canonical =
        group.find((a) => a.id === slug) ??
        [...group].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))[0];
      for (const a of group) {
        status[a.id] = a.id === canonical.id ? "canonical" : "duplicate";
      }
    }
    return status;
  }, [attendees]);

  const counts = useMemo(() => {
    const c = { dinner: 0, drinks: 0, both: 0, no: 0, undecided: 0 };
    for (const a of attendees) {
      const r = a.rsvp || "";
      if (r === "dinner") c.dinner++;
      else if (r === "drinks") c.drinks++;
      else if (r === "both") c.both++;
      else if (r === "no") c.no++;
      else c.undecided++;
    }
    return c;
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
        <h2>Admin · {attendees.length} signed in</h2>
        <p className="muted small" style={{ margin: 0 }}>
          Dinner: {counts.dinner + counts.both} · Drinks: {counts.drinks + counts.both} ·
          Both: {counts.both} · No: {counts.no} · Undecided: {counts.undecided}
        </p>
      </div>

      <div className="card">
        <h3>Ideas pool — still unclaimed ({pool.length})</h3>
        {pool.length === 0 ? (
          <p className="muted">Empty.</p>
        ) : (
          <ul>
            {pool.map((i) => (
              <li key={i.id}>
                {i.label} <span className="muted small">· added by {i.addedByName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>All responses</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>RSVP</th>
              <th>Food prefs</th>
              <th>Drinks</th>
              <th>Notes</th>
              <th>Bringing</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a) => {
              const dup = dupStatus[a.id];
              return (
                <tr key={a.id} className={dup === "duplicate" ? "row-duplicate" : ""}>
                  <td>
                    <strong>{a.name}</strong>
                    {dup === "duplicate" && (
                      <span className="badge badge-dup" title="Older record with the same name — safe to remove">
                        duplicate
                      </span>
                    )}
                    {dup === "canonical" && (
                      <span className="badge badge-keep" title="Newest record for this name — keep this one">
                        keep
                      </span>
                    )}
                  </td>
                  <td>{RSVP_LABEL[a.rsvp ?? ""] ?? "—"}</td>
                  <td>{a.foodPreference}</td>
                  <td>{a.drinkPreference}</td>
                  <td>{a.notes}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
