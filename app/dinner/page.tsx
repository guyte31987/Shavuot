"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/AppGate";
import { ensureAttendee } from "@/lib/ensureAttendee";
import {
  addItem,
  assignItem,
  deleteItem,
  subscribeAttendees,
  subscribeItems,
} from "@/lib/store";
import type { Attendee, Item } from "@/lib/types";

export default function DinnerPage() {
  const { id, name } = useSession();
  return <DinnerBoard id={id} name={name} />;
}

function DinnerBoard({ id, name }: { id: string; name: string }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const [directDrafts, setDirectDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    // Make sure my own attendee record exists so my row shows up.
    ensureAttendee(id, name).catch((e) => console.error("ensureAttendee:", e));
    const ua = subscribeAttendees(setAttendees);
    const ui = subscribeItems(setItems);
    return () => { ua(); ui(); };
  }, [id, name]);

  const pool = useMemo(() => items.filter((i) => !i.assignedTo), [items]);
  const byAttendee = useMemo(() => {
    const map: Record<string, Item[]> = {};
    for (const i of items) if (i.assignedTo) (map[i.assignedTo] ||= []).push(i);
    return map;
  }, [items]);

  // Always render "me" first. If my attendee record hasn't synced yet,
  // synthesise a placeholder so the Add form is still visible.
  const orderedAttendees = useMemo<Attendee[]>(() => {
    const me = attendees.find((a) => a.id === id);
    const others = attendees.filter((a) => a.id !== id);
    if (me) return [me, ...others];
    const placeholder: Attendee = {
      id,
      name,
      rsvp: "",
      foodPreference: "",
      drinkPreference: "",
      notes: "",
      bringing: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return [placeholder, ...others];
  }, [attendees, id, name]);

  async function addToPool(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    await addItem({ label: newLabel, addedBy: id, addedByName: name, assignedTo: null, origin: "pool" });
    setNewLabel("");
  }

  async function addDirect(attendeeId: string, label: string) {
    if (!label.trim()) return;
    await addItem({
      label,
      addedBy: id,
      addedByName: name,
      assignedTo: attendeeId,
      origin: "direct",
    });
    setDirectDrafts((d) => ({ ...d, [attendeeId]: "" }));
  }

  function onPick(itemId: string) {
    setPicked((p) => (p === itemId ? null : itemId));
  }

  async function onDropOn(target: string | null) {
    if (!picked) return;
    await assignItem(picked, target);
    setPicked(null);
    setHoverTarget(null);
  }

  async function xAttachedChip(item: Item) {
    // Pool-origin → return to the pool. Direct → permanently delete.
    if (item.origin === "direct") {
      if (!confirm(`Remove "${item.label}"?`)) return;
      await deleteItem(item.id);
    } else {
      await assignItem(item.id, null);
    }
  }

  return (
    <>
      <div className="card">
        <h2>What everyone's bringing <span className="heb-small">· מה מביאים</span></h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Drag a chip from the <strong>Ideas pool</strong> onto someone's name —
          or tap a chip then tap a name. You can also type something straight
          into your own row.
        </p>
      </div>

      <div className="potluck">
        <div className="card potluck-people">
          <h3>People <span className="heb-small">· האורחים</span></h3>
          {orderedAttendees.length === 0 ? (
            <p className="muted">No one's signed in yet.</p>
          ) : (
            <ul className="people-list">
              {orderedAttendees.map((a) => {
                const isMe = a.id === id;
                const dropping = hoverTarget === a.id;
                const draft = directDrafts[a.id] ?? "";
                return (
                  <li
                    key={a.id}
                    className={`person-row${dropping ? " dropping" : ""}${isMe ? " me" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setHoverTarget(a.id);
                    }}
                    onDragLeave={() => setHoverTarget((t) => (t === a.id ? null : t))}
                    onDrop={(e) => {
                      e.preventDefault();
                      const itemId = e.dataTransfer.getData("text/item");
                      if (itemId) assignItem(itemId, a.id);
                      setHoverTarget(null);
                    }}
                    onClick={() => picked && onDropOn(a.id)}
                  >
                    <div className="person-head">
                      <div className="avatar-mini">{a.name[0]?.toUpperCase()}</div>
                      <div className="person-name">
                        {a.name}
                        {isMe && <span className="me-tag">you</span>}
                      </div>
                    </div>
                    <div className="person-chips">
                      {(byAttendee[a.id] || []).map((it) => {
                        const canX = it.assignedTo === id || it.addedBy === id;
                        return (
                          <AttachedChip
                            key={it.id}
                            item={it}
                            picked={picked === it.id}
                            onPick={onPick}
                            onX={canX ? () => xAttachedChip(it) : undefined}
                          />
                        );
                      })}
                      {a.bringing?.trim() && (
                        <span className="chip chip-text" title="Free-text note">
                          {a.bringing}
                        </span>
                      )}
                      {(byAttendee[a.id] || []).length === 0 && !a.bringing?.trim() && (
                        <span className="muted small">drop something here…</span>
                      )}
                    </div>

                    {isMe && (
                      <form
                        className="direct-add"
                        onSubmit={(e) => {
                          e.preventDefault();
                          addDirect(a.id, draft);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          placeholder="…or type something you'll bring"
                          value={draft}
                          onChange={(e) =>
                            setDirectDrafts((d) => ({ ...d, [a.id]: e.target.value }))
                          }
                        />
                        <button
                          className="btn btn-add"
                          type="submit"
                          disabled={!draft.trim()}
                        >
                          Add
                        </button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={`card potluck-pool${hoverTarget === "POOL" ? " dropping" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setHoverTarget("POOL");
          }}
          onDragLeave={() => setHoverTarget((t) => (t === "POOL" ? null : t))}
          onDrop={(e) => {
            e.preventDefault();
            const itemId = e.dataTransfer.getData("text/item");
            if (itemId) assignItem(itemId, null);
            setHoverTarget(null);
          }}
          onClick={() => picked && onDropOn(null)}
        >
          <h3>Ideas pool <span className="heb-small">· רעיונות</span></h3>
          <p className="muted small" style={{ marginTop: 0 }}>
            Things still up for grabs. Add anything we might want.
          </p>

          <form onSubmit={addToPool} className="pool-add" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={newLabel}
              placeholder="e.g. cheesecake for 8"
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <button className="btn" type="submit" disabled={!newLabel.trim()}>Add</button>
          </form>

          <div className="pool-chips">
            {pool.length === 0 ? (
              <p className="muted small">Nothing in the pool — everything's been claimed!</p>
            ) : (
              pool.map((it) => (
                <PoolChip
                  key={it.id}
                  item={it}
                  picked={picked === it.id}
                  onPick={onPick}
                  showDelete={it.addedBy === id}
                />
              ))
            )}
          </div>

          {picked && (
            <div className="notice">
              <strong>Picked up:</strong> {items.find((i) => i.id === picked)?.label}.
              Tap a person on the left to assign — or tap here to put it back.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AttachedChip({
  item,
  picked,
  onPick,
  onX,
}: {
  item: Item;
  picked: boolean;
  onPick: (id: string) => void;
  onX?: () => void;
}) {
  const cls = `chip chip-attached chip-${item.origin}${picked ? " picked" : ""}`;
  return (
    <span
      className={cls}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/item", item.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPick(item.id);
      }}
      title={item.origin === "direct" ? `Added by ${item.addedByName}` : `From the pool · added by ${item.addedByName}`}
    >
      {item.label}
      {onX && (
        <button
          className="chip-x"
          onClick={(e) => {
            e.stopPropagation();
            onX();
          }}
          aria-label={item.origin === "direct" ? "Delete" : "Return to pool"}
          title={item.origin === "direct" ? "Delete" : "Return to pool"}
        >
          ×
        </button>
      )}
    </span>
  );
}

function PoolChip({
  item,
  picked,
  onPick,
  showDelete = false,
}: {
  item: Item;
  picked: boolean;
  onPick: (id: string) => void;
  showDelete?: boolean;
}) {
  return (
    <span
      className={`chip${picked ? " picked" : ""}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/item", item.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPick(item.id);
      }}
      title={`Added by ${item.addedByName}`}
    >
      {item.label}
      {showDelete && (
        <button
          className="chip-x"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Remove this idea from the pool?")) deleteItem(item.id);
          }}
          aria-label="Delete"
        >
          ×
        </button>
      )}
    </span>
  );
}
