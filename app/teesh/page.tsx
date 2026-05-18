"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/components/AppGate";
import { addPic, deletePic, subscribePics } from "@/lib/store";
import type { Pic } from "@/lib/types";

const MAX_DIM = 1000;
const JPEG_QUALITY = 0.82;
const MAX_BYTES = 900_000;

export default function TeeshPage() {
  const { id, name } = useSession();
  const [pics, setPics] = useState<Pic[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<{ dataUrl: string; size: number } | null>(null);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => subscribePics(setPics), []);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That doesn't look like an image.");
      return;
    }
    try {
      const dataUrl = await resizeImage(file, MAX_DIM, JPEG_QUALITY);
      const size = dataUrl.length * 0.75; // base64 → bytes approx
      if (size > MAX_BYTES) {
        // try again, smaller
        const smaller = await resizeImage(file, 800, 0.78);
        if (smaller.length * 0.75 > MAX_BYTES) {
          setError("That picture is too big even after resizing — try a smaller one.");
          return;
        }
        setPending({ dataUrl: smaller, size: smaller.length * 0.75 });
      } else {
        setPending({ dataUrl, size });
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't read that file.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function upload() {
    if (!pending) return;
    setBusy(true);
    setError("");
    try {
      await addPic({
        dataUrl: pending.dataUrl,
        caption: caption.trim(),
        uploadedBy: id,
        uploadedByName: name,
      });
      setPending(null);
      setCaption("");
    } catch (err) {
      console.error(err);
      setError("Upload failed — try again?");
    } finally {
      setBusy(false);
    }
  }

  async function remove(pic: Pic) {
    if (pic.uploadedBy !== id) return;
    if (!confirm("Remove this picture of Teesh?")) return;
    try {
      await deletePic(pic.id);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Pics of Teesh <span className="heb-small">· טיש</span></h2>
        <p>
          Resident kitchen overseer, green-eyed bandit, the muse behind the wheat
          field. Drop your favourite Teesh shots here — from the night, or from
          any night.
        </p>

        <div className="teesh-upload">
          {!pending ? (
            <label className="btn">
              Choose a photo
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onPick}
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div className="teesh-preview">
              <img src={pending.dataUrl} alt="" />
              <div className="teesh-preview-form">
                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={120}
                />
                <div className="teesh-preview-actions">
                  <button className="btn" onClick={upload} disabled={busy}>
                    {busy ? "Uploading…" : "Add to gallery"}
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => {
                      setPending(null);
                      setCaption("");
                    }}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </div>
                <p className="muted small" style={{ margin: 0 }}>
                  Resized to ~{Math.round(pending.size / 1024)} KB.
                </p>
              </div>
            </div>
          )}
          {error && <p className="muted" style={{ color: "var(--danger)" }}>{error}</p>}
        </div>
      </div>

      <div className="card">
        <h3>Gallery · {pics.length}</h3>
        {pics.length === 0 ? (
          <p className="muted">No pics yet. Be the first!</p>
        ) : (
          <div className="teesh-grid">
            {pics.map((p) => (
              <figure className="teesh-card" key={p.id}>
                <img src={p.dataUrl} alt={p.caption || "Teesh"} loading="lazy" />
                {p.uploadedBy === id && (
                  <button
                    className="teesh-x"
                    onClick={() => remove(p)}
                    aria-label="Delete"
                    title="Delete"
                  >
                    ×
                  </button>
                )}
                <figcaption>
                  {p.caption && <div className="teesh-caption">{p.caption}</div>}
                  <div className="teesh-meta">
                    by {p.uploadedByName}
                    {" · "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function resizeImage(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
