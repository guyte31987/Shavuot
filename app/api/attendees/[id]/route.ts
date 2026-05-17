import { NextResponse } from "next/server";
import { deleteAttendee, readDb } from "@/lib/db";
import { EVENT } from "@/lib/event";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const pw = req.headers.get("x-admin-password");
  if (pw !== EVENT.adminPassword) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await deleteAttendee(id);
  return NextResponse.json({ ok: true });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const attendee = db.attendees.find((a) => a.id === id);
  if (!attendee) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ attendee });
}
