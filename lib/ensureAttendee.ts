import { fetchAttendee, saveAttendee } from "./store";

export async function ensureAttendee(id: string, name: string): Promise<void> {
  const existing = await fetchAttendee(id);
  if (existing) {
    if (existing.name !== name) {
      await saveAttendee({ ...existing, name });
    }
    return;
  }
  await saveAttendee({
    id,
    name,
    pronoun: "",
    jewish: "",
    photoDataUrl: "",
    foodPreference: "",
    drinkPreference: "",
    bringing: "",
    bringingCategory: "",
  });
}
