"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/components/AppGate";
import { EVENT } from "@/lib/event";
import { fetchAttendee, saveAttendee } from "@/lib/store";
import type { Attendee, Rsvp } from "@/lib/types";

const RSVP_OPTIONS: { value: Rsvp; label: string; sub: string }[] = [
  { value: "dinner", label: "Dinner", sub: `from ${EVENT.dinnerTime}` },
  { value: "drinks", label: "Drinks", sub: `from ${EVENT.drinksTime}` },
  { value: "both",   label: "Both",   sub: "the whole evening" },
  { value: "no",     label: "Can't make it", sub: "" },
];

function ProfileForm({ id, name }: { id: string; name: string }) {
  const [rsvp, setRsvp] = useState<Rsvp>("");
  const [foodPreference, setFoodPreference] = useState("");
  const [drinkPreference, setDrinkPreference] = useState("");
  const [notes, setNotes] = useState("");
  const [bringing, setBringing] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);
  const [storedName, setStoredName] = useState(name);

  useEffect(() => {
    (async () => {
      try {
        const a = await fetchAttendee(id);
        if (a) {
          setStoredName(a.name || name);
          setRsvp((a.rsvp ?? "") as Rsvp);
          setFoodPreference(a.foodPreference ?? "");
          setDrinkPreference(a.drinkPreference ?? "");
          setNotes(a.notes ?? "");
          setBringing(a.bringing ?? "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, name]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const existing = (await fetchAttendee(id)) as Attendee | null;
      await saveAttendee({
        id,
        name: existing?.name ?? name, // preserve first spelling
        rsvp,
        foodPreference,
        drinkPreference,
        notes,
        bringing,
      });
      setStatus("saved");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 1800);
  }

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <form onSubmit={save} className="card">
      <h2>My profile <span className="heb-small">· הפרופיל שלי</span></h2>

      <div className="field">
        <label>Name</label>
        <input type="text" value={storedName} disabled />
      </div>

      <div className="field">
        <label>Will you be joining us?</label>
        <div className="rsvp-grid">
          {RSVP_OPTIONS.map((o) => (
            <label key={o.value} className={`rsvp-opt${rsvp === o.value ? " selected" : ""}`}>
              <input
                type="radio"
                name="rsvp"
                value={o.value}
                checked={rsvp === o.value}
                onChange={() => setRsvp(o.value)}
              />
              <span className="rsvp-label">{o.label}</span>
              {o.sub && <span className="rsvp-sub">{o.sub}</span>}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Food preferences / allergies</label>
        <textarea
          placeholder="vegan, lactose-intolerant, nut allergy…"
          value={foodPreference}
          onChange={(e) => setFoodPreference(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Drink preferences</label>
        <textarea
          placeholder="red wine, sparkling water, no alcohol…"
          value={drinkPreference}
          onChange={(e) => setDrinkPreference(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Notes</label>
        <textarea
          placeholder="Anything else we should know? Plus-ones, arrival time, song requests…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {(rsvp === "dinner" || rsvp === "both") && (
        <p className="muted small">
          Adding what you'll bring? That lives on the <strong>Dinner</strong> tab.
        </p>
      )}

      <button className="btn" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save profile"}
      </button>
      {status === "error" && <p className="muted">Couldn't save — try again.</p>}
    </form>
  );
}

export default function ProfilePage() {
  const { id, name } = useSession();
  return <ProfileForm id={id} name={name} />;
}
