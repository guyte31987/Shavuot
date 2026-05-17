import { promises as fs } from "fs";
import path from "path";
import type { Database, Attendee } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    const empty: Database = { attendees: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(empty, null, 2));
  }
}

export async function readDb(): Promise<Database> {
  await ensureFile();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Database;
    if (!parsed.attendees) parsed.attendees = [];
    return parsed;
  } catch {
    return { attendees: [] };
  }
}

export async function writeDb(db: Database): Promise<void> {
  await ensureFile();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function upsertAttendee(input: Partial<Attendee> & { id: string; name: string }): Promise<Attendee> {
  const db = await readDb();
  const now = Date.now();
  const existing = db.attendees.find((a) => a.id === input.id);
  if (existing) {
    Object.assign(existing, input, { updatedAt: now });
    await writeDb(db);
    return existing;
  }
  const created: Attendee = {
    id: input.id,
    name: input.name,
    pronoun: input.pronoun ?? "",
    photoDataUrl: input.photoDataUrl ?? "",
    foodPreference: input.foodPreference ?? "",
    drinkPreference: input.drinkPreference ?? "",
    bringing: input.bringing ?? "",
    bringingCategory: input.bringingCategory ?? "",
    createdAt: now,
    updatedAt: now,
  };
  db.attendees.push(created);
  await writeDb(db);
  return created;
}

export async function deleteAttendee(id: string): Promise<void> {
  const db = await readDb();
  db.attendees = db.attendees.filter((a) => a.id !== id);
  await writeDb(db);
}
