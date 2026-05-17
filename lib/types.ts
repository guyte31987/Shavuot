export type Attendee = {
  id: string;
  name: string;
  pronoun: string;
  photoDataUrl: string;
  foodPreference: string;
  drinkPreference: string;
  bringing: string;
  bringingCategory: string;
  createdAt: number;
  updatedAt: number;
};

export type Database = {
  attendees: Attendee[];
};
