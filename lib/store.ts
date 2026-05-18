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
import type { Attendee, Item, Pic } from "./types";

const ATTENDEES = "attendees";
const ITEMS = "items";
const PICS = "pics";

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

export async function addItem(input: {
  label: string;
  category?: string;
  addedBy: string;
  addedByName: string;
  assignedTo?: string | null;
  origin?: "pool" | "direct";
}): Promise<Item> {
  const now = Date.now();
  const assignedTo = input.assignedTo ?? null;
  const origin = input.origin ?? (assignedTo ? "direct" : "pool");
  const ref = await addDoc(collection(getDb(), ITEMS), {
    label: input.label.trim(),
    category: input.category ?? "",
    assignedTo,
    origin,
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
    assignedTo,
    origin,
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

/* -------- pics (Teesh gallery) -------- */

export async function addPic(input: {
  dataUrl: string;
  caption: string;
  uploadedBy: string;
  uploadedByName: string;
}): Promise<Pic> {
  const now = Date.now();
  const ref = await addDoc(collection(getDb(), PICS), {
    dataUrl: input.dataUrl,
    caption: input.caption,
    uploadedBy: input.uploadedBy,
    uploadedByName: input.uploadedByName,
    createdAt: now,
  });
  await updateDoc(ref, { id: ref.id });
  return {
    id: ref.id,
    dataUrl: input.dataUrl,
    caption: input.caption,
    uploadedBy: input.uploadedBy,
    uploadedByName: input.uploadedByName,
    createdAt: now,
  };
}

export async function deletePic(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), PICS, id));
}

export function subscribePics(cb: (pics: Pic[]) => void): () => void {
  const q = query(collection(getDb(), PICS), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return { ...(data as Pic), id: d.id };
      }),
    );
  });
}
