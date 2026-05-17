"use client";
import { useEffect, useState } from "react";
import { getSession, signIn, signOut, type Session } from "@/lib/session";

type Props = {
  children: (session: Session) => React.ReactNode;
};

export function SignIn({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (!session) {
    return (
      <div className="signin-overlay">
        <h3>Welcome!</h3>
        <p className="muted">Just enter your name to join the Shavuot dinner.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            setSession(signIn(name));
          }}
        >
          <div className="field">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <button className="btn" type="submit">Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="signed-as">
        Signed in as <strong>{session.name}</strong>
        <button onClick={() => { signOut(); setSession(null); }}>sign out</button>
      </div>
      {children(session)}
    </>
  );
}
