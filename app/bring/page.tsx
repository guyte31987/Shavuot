"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/components/AppGate";
import {
  addItem,
  assignItem,
  deleteItem,
  saveAttendee,
  subscribeAttendees,
  subscribeItems,
} from "@/lib/store";
import type { Attendee, Item } from "@/lib/types";

export default function BringPage() {
  const { id, name } = useSession();
  return <BringBoard id={id} name={name} />;
}

function BringBoard({ id, name }: { id: string; name: string }) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);

  useEffect(() => {
    const ua = subscribeAttendees(setAttendees);
    const ui = subscribeItems(setItems);
    return () => {
      ua();
      ui();
    };
  }, []);

  const pool = useMemo(() => items.filter((i) => !i.assignedTo), [items]);
  const byAttendee = useMemo(() => {
    const map: Record<string, Item[]> = {};
    for (const i of items) if (i.assignedTo) (map[i.assignedTo] ||= []).push(i);
    return map;
  }, [items]);

  const me = attendees.find((a) => a.id === id);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    await addItem({ label: newLabel, addedBy: id, addedByName: name });
    setNewLabel("");
  }

  async function quickBringingForMe(text: string) {
    if (!me) {
      await saveAttendee({
        id,
        name,
        pronoun: "",
        jewish: "",
        photoDataUrl: "",
        foodPreference: "",
        drinkPreference: "",
        bringing: text,
        bringingCategory: "",
      });
    } else {
      await saveAttendee({ ...me, bringing: text });
    }
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

  return (
    <>
      <div className="card">
        <h2>What everyone's bringing <span className="heb-small">· מה מביאים</span></h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Drag a chip from the <strong>Ideas pool</strong> onto someone's name —
          or tap a chip then tap a name. You can also type directly next to your own name.
        </p>
      </div>

      <div className="potluck">
        <div className="card potluck-people">
          <h3>People <span className="heb-small">· האורחים</span></h3>
          {attendees.length === 0 ? (
            <p className="muted">No one's signed in yet.</p>
          ) : (
            <ul className="people-list">
              {attendees.map((a) => {
                const isMe = a.id === id;
                const dropping = hoverTarget === a.id;
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
                      {a.photoDataUrl ? (
                        <img src={a.photoDataUrl} alt="" className="avatar-mini" />
                      ) : (
                        <div className="avatar-mini">{a.name[0]?.toUpperCase()}</div>
                      )}
                      <div className="person-name">
                        {a.name}
                        {isMe && <span className="me-tag">you</span>}
                      </div>
                    </div>
                    <div className="person-chips">
                      {(byAttendee[a.id] || []).map((it) => (
                        <Chip
                          key={it.id}
                          item={it}
                          picked={picked === it.id}
                          onPick={onPick}
                        />
                      ))}
                      {a.bringing?.trim() && (
                        <span className="chip chip-text">{a.bringing}</span>
                      )}
                      {(byAttendee[a.id] || []).length === 0 && !a.bringing?.trim() && (
                        <span className="muted small">drop something here…</span>
                      )}
                    </div>
                    {isMe && (
                      <input
                        type="text"
                        className="inline-bring"
                        placeholder="…or just type what you're bringing"
                        defaultValue={a.bringing ?? ""}
                        onBlur={(e) => {
                          if (e.target.value !== (a.bringing ?? "")) {
                            quickBringingForMe(e.target.value);
                          }
                        }}
                      />
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

          <form onSubmit={add} className="pool-add">
            <input
              type="text"
              value={newLabel}
              placeholder="e.g. cheesecake for 8"
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <button className="btn" type="submit">Add</button>
          </form>

          <div className="pool-chips">
            {pool.length === 0 ? (
              <p className="muted small">Nothing in the pool — everything's been claimed!</p>
            ) : (
              pool.map((it) => (
                <Chip
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

function Chip({
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

