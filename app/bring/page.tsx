"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Attendee } from "@/lib/types";

export default function BringPage() {
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

  const filled = attendees.filter((a) => a.bringing.trim());
  const empty = attendees.filter((a) => !a.bringing.trim());

  return (
    <>
      <div className="card">
        <h2>What everyone's bringing</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Update yours on the <Link href="/profile">My Profile</Link> tab.
        </p>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : filled.length === 0 ? (
          <p className="muted">No one's signed up yet — be the first!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Category</th>
                <th>Bringing</th>
              </tr>
            </thead>
            <tbody>
              {filled.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.name}</strong></td>
                  <td>{a.bringingCategory || <span className="muted">—</span>}</td>
                  <td>{a.bringing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {empty.length > 0 && (
        <div className="card">
          <h3>Still to decide</h3>
          <p className="muted">{empty.map((a) => a.name).join(", ")}</p>
        </div>
      )}
    </>
  );
}
