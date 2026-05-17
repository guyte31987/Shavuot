import { NextResponse } from "next/server";
import { readDb, upsertAttendee } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ attendees: db.attendees });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.id || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "id and name required" }, { status: 400 });
  }
  const saved = await upsertAttendee({
    id: body.id,
    name: body.name.trim(),
    pronoun: body.pronoun ?? "",
    photoDataUrl: body.photoDataUrl ?? "",
    foodPreference: body.foodPreference ?? "",
    drinkPreference: body.drinkPreference ?? "",
    bringing: body.bringing ?? "",
    bringingCategory: body.bringingCategory ?? "",
  });
  return NextResponse.json({ attendee: saved });
}
