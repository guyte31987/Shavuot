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
          <h2>
            Welcome to Shavuot Dinner
            <span className="heb-small">· ברוכים הבאים</span>
          </h2>
          <p className="splash-host">
            Kindly hosted by <strong>{EVENT.host}</strong>
          </p>
          <p className="splash-when">
            <strong>{EVENT.date}</strong> · {EVENT.time}
            <br />
            <span className="muted">
              {EVENT.venue} ·{" "}
              <a href={EVENT.mapsUrl} target="_blank" rel="noreferrer">
                {EVENT.postcode}
              </a>
            </span>
          </p>
          <p>
            Please sign in with your name to see all the details, let us know
            you're joining, and pick what you'll bring for the potluck.
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
