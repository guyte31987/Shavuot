"use client";
import { useEffect, useState } from "react";
import { SignIn } from "@/components/SignIn";
import { fetchAttendee, saveAttendee } from "@/lib/store";

const CATEGORIES = [
  "Main dish",
  "Side / Salad",
  "Cheese / Dairy",
  "Dessert",
  "Bread / Pastry",
  "Drinks",
  "Other",
];

function ProfileForm({ id, name }: { id: string; name: string }) {
  const [pronoun, setPronoun] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [foodPreference, setFoodPreference] = useState("");
  const [drinkPreference, setDrinkPreference] = useState("");
  const [bringing, setBringing] = useState("");
  const [bringingCategory, setBringingCategory] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const a = await fetchAttendee(id);
        if (a) {
          setPronoun(a.pronoun ?? "");
          setPhotoDataUrl(a.photoDataUrl ?? "");
          setFoodPreference(a.foodPreference ?? "");
          setDrinkPreference(a.drinkPreference ?? "");
          setBringing(a.bringing ?? "");
          setBringingCategory(a.bringingCategory ?? "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file, 320);
    setPhotoDataUrl(dataUrl);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      await saveAttendee({
        id, name, pronoun, photoDataUrl,
        foodPreference, drinkPreference,
        bringing, bringingCategory,
      });
      setStatus("saved");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 1800);
  }

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <form onSubmit={save} className="card">
      <h2>My profile</h2>

      <div className="row">
        <div className="field">
          <label>Name</label>
          <input type="text" value={name} disabled />
        </div>
        <div className="field">
          <label>Pronouns</label>
          <input
            type="text"
            placeholder="e.g. she/her, he/him, they/them"
            value={pronoun}
            onChange={(e) => setPronoun(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Photo</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {photoDataUrl ? (
            <img src={photoDataUrl} alt="" className="avatar" />
          ) : (
            <div className="avatar">{name[0]?.toUpperCase() ?? "?"}</div>
          )}
          <input type="file" accept="image/*" onChange={onPhoto} />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>Food preferences / allergies</label>
          <textarea
            placeholder="vegetarian, lactose-free, nut allergy…"
            value={foodPreference}
            onChange={(e) => setFoodPreference(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Drink preferences</label>
          <textarea
            placeholder="red wine, sparkling water, no alcohol…"
            value={drinkPreference}
            onChange={(e) => setDrinkPreference(e.target.value)}
          />
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>What I'm bringing</h3>
      <div className="row">
        <div className="field">
          <label>Category</label>
          <select
            value={bringingCategory}
            onChange={(e) => setBringingCategory(e.target.value)}
          >
            <option value="">— pick one —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>What exactly?</label>
          <input
            type="text"
            placeholder="e.g. spinach quiche for 8"
            value={bringing}
            onChange={(e) => setBringing(e.target.value)}
          />
        </div>
      </div>

      <button className="btn" type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save profile"}
      </button>
      {status === "error" && <p className="muted">Couldn't save — try again.</p>}
    </form>
  );
}

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  return (
    <SignIn>
      {(session) => <ProfileForm id={session.id} name={session.name} />}
    </SignIn>
  );
}
