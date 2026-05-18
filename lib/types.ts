export type Rsvp = "" | "dinner" | "drinks" | "both" | "no";

export type Attendee = {
  id: string;
  name: string;
  rsvp: Rsvp;
  foodPreference: string;
  drinkPreference: string;
  notes: string;
  bringing: string;
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
