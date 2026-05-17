"use client";
import { useEffect, useState } from "react";
import type { Attendee } from "@/lib/types";

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/attendees");
      const data = await res.json();
      setAttendees(data.attendees ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="card">
      <h2>Attendees · {attendees.length}</h2>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : attendees.length === 0 ? (
        <p className="muted">No one's signed in yet.</p>
      ) : (
        <div className="attendee-grid">
          {attendees.map((a) => (
            <div className="attendee-card" key={a.id}>
              {a.photoDataUrl ? (
                <img src={a.photoDataUrl} alt={a.name} className="avatar" />
              ) : (
                <div className="avatar">{a.name[0]?.toUpperCase()}</div>
              )}
              <div className="name">{a.name}</div>
              {a.pronoun && <div className="pronoun">{a.pronoun}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
