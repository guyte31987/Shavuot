"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/components/AppGate";
import { ImageCropper } from "@/components/ImageCropper";
import { addPic, deletePic, subscribePics } from "@/lib/store";
import type { Pic } from "@/lib/types";

export default function TeeshPage() {
  const { id, name } = useSession();
  const [pics, setPics] = useState<Pic[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [pending, setPending] = useState<{ dataUrl: string; size: number } | null>(null);
  const [caption, setCaption] = useState("");
  const [lightbox, setLightbox] = useState<Pic | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => subscribePics(setPics), []);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That doesn't look like an image.");
      return;
    }
    setPickedFile(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onCropped(dataUrl: string) {
    setPending({ dataUrl, size: dataUrl.length * 0.75 });
    setPickedFile(null);
  }

  function cancelAll() {
    setPickedFile(null);
    setPending(null);
    setCaption("");
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
          any other time.
        </p>

        <div className="teesh-upload">
          {!pickedFile && !pending && (
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
          )}

          {pickedFile && (
            <ImageCropper
              file={pickedFile}
              onCrop={onCropped}
              onCancel={cancelAll}
            />
          )}

          {pending && (
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
                    onClick={cancelAll}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </div>
                <p className="muted small" style={{ margin: 0 }}>
                  ~{Math.round(pending.size / 1024)} KB ready to upload.
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
                <img
                  src={p.dataUrl}
                  alt={p.caption || "Teesh"}
                  loading="lazy"
                  onClick={() => setLightbox(p)}
                  className="teesh-card-img"
                />
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

      {lightbox && (
        <div className="teesh-lightbox" onClick={() => setLightbox(null)}>
          <div className="teesh-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="teesh-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
            <img src={lightbox.dataUrl} alt={lightbox.caption || "Teesh"} />
            {(lightbox.caption || lightbox.uploadedByName) && (
              <div className="teesh-lightbox-caption">
                {lightbox.caption && <strong>{lightbox.caption}</strong>}
                <span className="teesh-meta">
                  by {lightbox.uploadedByName} · {new Date(lightbox.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
