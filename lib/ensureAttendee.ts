import { fetchAttendee, saveAttendee } from "./store";

/** Create the attendee on first sign-in. Preserve the original casing of the
 *  display name (first writer wins) so "Mitch" doesn't flip to "mitch" later. */
export async function ensureAttendee(id: string, name: string): Promise<void> {
  const existing = await fetchAttendee(id);
  if (existing) return;
  await saveAttendee({
    id,
    name,
    rsvp: "",
    foodPreference: "",
    drinkPreference: "",
    notes: "",
    bringing: "",
  });
}
