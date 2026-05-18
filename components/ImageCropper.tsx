"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  file: File;
  /** Viewport size (CSS px). Output is also square. */
  viewportSize?: number;
  /** Output square size in pixels. */
  outputSize?: number;
  onCrop: (dataUrl: string) => void;
  onCancel: () => void;
};

export function ImageCropper({
  file,
  viewportSize = 280,
  outputSize = 1000,
  onCrop,
  onCancel,
}: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [minScale, setMinScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);

  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const pinch = useRef<{ dist: number; scale: number } | null>(null);

  // Load image, compute "cover" scale + centred starting offset
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const i = new Image();
    i.onload = () => {
      const cover = Math.max(viewportSize / i.width, viewportSize / i.height);
      setMinScale(cover);
      setScale(cover);
      setOffset({
        x: (viewportSize - i.width * cover) / 2,
        y: (viewportSize - i.height * cover) / 2,
      });
      setImg(i);
    };
    i.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, viewportSize]);

  function clamp(x: number, y: number, s: number, image = img) {
    if (!image) return { x, y };
    const dW = image.width * s;
    const dH = image.height * s;
    return {
      x: Math.min(0, Math.max(viewportSize - dW, x)),
      y: Math.min(0, Math.max(viewportSize - dH, y)),
    };
  }

  function setZoom(s: number) {
    if (!img) return;
    const next = Math.max(minScale, Math.min(minScale * 5, s));
    setScale(next);
    setOffset((o) => clamp(o.x, o.y, next));
  }

  // ---------- pointer (desktop mouse + touch unified) ----------

  function onPointerDown(e: React.PointerEvent) {
    if (!img) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    setOffset(clamp(drag.current.ox + dx, drag.current.oy + dy, scale));
  }
  function onPointerUp(e: React.PointerEvent) {
    drag.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }

  // ---------- pinch (two-finger touch) ----------

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinch.current = { dist, scale };
      drag.current = null;
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const next = Math.max(
        minScale,
        Math.min(minScale * 5, pinch.current.scale * (dist / pinch.current.dist)),
      );
      setScale(next);
      setOffset((o) => clamp(o.x, o.y, next));
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinch.current = null;
  }

  // ---------- wheel zoom ----------

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom(scale * (1 + -e.deltaY * 0.0015));
  }

  // ---------- commit ----------

  async function commit() {
    if (!img) return;
    setBusy(true);
    try {
      const sX = -offset.x / scale;
      const sY = -offset.y / scale;
      const sSize = viewportSize / scale;
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sX, sY, sSize, sSize, 0, 0, outputSize, outputSize);

      let dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      // Belt + braces: shrink under ~900KB to stay clear of the 1MB doc limit
      if (dataUrl.length * 0.75 > 900_000) {
        dataUrl = canvas.toDataURL("image/jpeg", 0.72);
      }
      onCrop(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cropper">
      <div
        className="cropper-window"
        style={{ width: viewportSize, height: viewportSize }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {img && (
          <img
            src={img.src}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: img.width * scale,
              height: img.height * scale,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
            }}
          />
        )}
        <div className="cropper-mask" />
      </div>

      <div className="cropper-zoom">
        <span aria-hidden>−</span>
        <input
          type="range"
          min={minScale}
          max={minScale * 5}
          step={0.01}
          value={scale}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
        />
        <span aria-hidden>+</span>
      </div>

      <p className="muted small cropper-hint">Drag to pan · pinch / wheel / slider to zoom</p>

      <div className="cropper-actions">
        <button className="btn" onClick={commit} disabled={busy || !img}>
          {busy ? "Cropping…" : "Use this crop"}
        </button>
        <button className="btn secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </div>
  );
}
