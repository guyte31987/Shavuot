"use client";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { Attendee, Item } from "./types";

const ATTENDEES = "attendees";
const ITEMS = "items";

export function attendeeDoc(id: string) {
  return doc(getDb(), ATTENDEES, id);
}
export function itemDoc(id: string) {
  return doc(getDb(), ITEMS, id);
}

/* -------- attendees -------- */

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
  const q = query(collection(getDb(), ATTENDEES), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as Attendee));
  });
}

/* -------- items -------- */

export async function addItem(input: { label: string; category?: string; addedBy: string; addedByName: string }): Promise<Item> {
  const now = Date.now();
  const ref = await addDoc(collection(getDb(), ITEMS), {
    label: input.label.trim(),
    category: input.category ?? "",
    assignedTo: null,
    addedBy: input.addedBy,
    addedByName: input.addedByName,
    createdAt: now,
    updatedAt: now,
  });
  await updateDoc(ref, { id: ref.id });
  return {
    id: ref.id,
    label: input.label.trim(),
    category: input.category ?? "",
    assignedTo: null,
    addedBy: input.addedBy,
    addedByName: input.addedByName,
    createdAt: now,
    updatedAt: now,
  };
}

export async function assignItem(itemId: string, attendeeId: string | null): Promise<void> {
  await updateDoc(itemDoc(itemId), {
    assignedTo: attendeeId,
    updatedAt: Date.now(),
  });
}

export async function deleteItem(itemId: string): Promise<void> {
  await deleteDoc(itemDoc(itemId));
}

export function subscribeItems(cb: (items: Item[]) => void): () => void {
  const q = query(collection(getDb(), ITEMS), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return { ...(data as Item), id: d.id };
      }),
    );
  });
}
