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
  origin: "pool" | "direct";
  addedBy: string;
  addedByName: string;
  createdAt: number;
  updatedAt: number;
};

export type Pic = {
  id: string;
  dataUrl: string;
  caption: string;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: number;
};

export type Database = {
  attendees: Attendee[];
  items: Item[];
  pics: Pic[];
};
