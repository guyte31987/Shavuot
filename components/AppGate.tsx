"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { EVENT } from "@/lib/event";
import { ensureAttendee } from "@/lib/ensureAttendee";
import { getSession, signIn, signOut, type Session } from "@/lib/session";

const Ctx = createContext<Session | null>(null);

export function useSession(): Session {
  const s = useContext(Ctx);
  if (!s) throw new Error("useSession must be used inside <AppGate>");
  return s;
}

export function AppGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (!session) {
    return (
      <div className="splash">
        <div className="card splash-card">
          <h2 className="splash-title">Welcome to Shavuot Dinner</h2>
          <div className="splash-heb">ברוכים הבאים</div>

          <p className="splash-lede">
            <strong>{EVENT.hosts}</strong> will be delighted to have you for a
            casual celebration of Shavuot this Friday.
          </p>

          <div className="splash-when">
            <div className="splash-when-row">
              <strong>{EVENT.date}</strong>
            </div>
            <div className="splash-when-row">
              Dinner from {EVENT.dinnerTime} · Drinks from {EVENT.drinksTime}
            </div>
            <div className="splash-when-row muted">
              {EVENT.venue} ·{" "}
              <a href={EVENT.mapsUrl} target="_blank" rel="noreferrer">
                {EVENT.postcode}
              </a>
            </div>
          </div>

          <p className="splash-ask">
            Please sign in with your name to see all the details, RSVP, tell us
            food and drink preferences, and dinner options if you're joining us
            for that.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim() || submitting) return;
              setSubmitting(true);
              setError("");
              try {
                const s = signIn(name);
                try {
                  await ensureAttendee(s.id, s.name);
                } catch (err) {
                  console.error("Firestore not reachable:", err);
                }
                setSession(s);
              } catch (err) {
                console.error(err);
                setError("Couldn't sign in. Try again?");
                setSubmitting(false);
              }
            }}
            className="splash-form"
          >
            <div className="field">
              <label>Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mayim"
                autoFocus
              />
            </div>
            <button className="btn" type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Signing in…" : "Sign in →"}
            </button>
            {error && (
              <p className="muted" style={{ color: "var(--danger)", marginTop: 10 }}>
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <Ctx.Provider value={session}>
      <div className="signed-as">
        Signed in as <strong>{session.name}</strong>
        <button
          onClick={() => {
            signOut();
            setSession(null);
          }}
        >
          sign out
        </button>
      </div>
      {children}
    </Ctx.Provider>
  );
}
