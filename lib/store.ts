"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { Attendee } from "./types";

const COLLECTION = "attendees";

export function attendeeDoc(id: string) {
  return doc(getDb(), COLLECTION, id);
}

export async function saveAttendee(input: Omit<Attendee, "createdAt" | "updatedAt"> & {
  createdAt?: number;
}): Promise<void> {
  const ref = attendeeDoc(input.id);
  const existing = await getDoc(ref);
  const now = Date.now();
  await setDoc(
    ref,
    {
      ...input,
      createdAt: existing.exists() ? existing.data()?.createdAt ?? now : now,
      updatedAt: now,
      updatedAtServer: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function fetchAttendee(id: string): Promise<Attendee | null> {
  const snap = await getDoc(attendeeDoc(id));
  if (!snap.exists()) return null;
  return snap.data() as Attendee;
}

export async function deleteAttendee(id: string): Promise<void> {
  await deleteDoc(attendeeDoc(id));
}

export function subscribeAttendees(cb: (attendees: Attendee[]) => void): () => void {
  const q = query(collection(getDb(), COLLECTION), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as Attendee));
  });
}
