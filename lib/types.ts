export type Jewishness = "" | "jewish" | "jew-ally" | "other";

export type Attendee = {
  id: string;
  name: string;
  pronoun: string;
  jewish: Jewishness;
  photoDataUrl: string;
  foodPreference: string;
  drinkPreference: string;
  bringing: string;
  bringingCategory: string;
  createdAt: number;
  updatedAt: number;
};

export type Item = {
  id: string;
  label: string;
  category: string;
  assignedTo: string | null;
  addedBy: string;
  addedByName: string;
  createdAt: number;
  updatedAt: number;
};

export type Database = {
  attendees: Attendee[];
  items: Item[];
};
