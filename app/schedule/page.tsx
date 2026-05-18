export default function SchedulePage() {
  const items = [
    { when: "7:00 PM (ish)", what: "Arrival & welcome drinks", note: "Come settle in, meet the others." },
    { when: "8:00 PM", what: "Candle lighting", note: "Marking the start of Shavuot together." },
    { when: "8:15 PM", what: "Dinner is served", note: "Dairy feast — cheeses, quiches, salads, blintzes." },
    { when: "9:15 PM", what: "Reading from the Book of Ruth", note: "A short reading, a few thoughts to share." },
    { when: "9:45 PM", what: "Dessert & coffee", note: "The cheesecake moment." },
    { when: "10:15 PM", what: "Your favourite commandments!", note: "A short text and open conversation about your favourite commandments to hold — or break!" },
    { when: "Late", what: "Linger, sing, drift home", note: "No rush. The night is long, the balcony is open, the spring breeze is flowing." },
  ];

  return (
    <>
      <div className="card">
        <h2>Schedule for the night <span className="heb-small">· סדר הערב</span></h2>
        <p className="muted small" style={{ marginTop: 0 }}>
          Tentative · most likely made-up · subject to vibes.
        </p>
        <ul className="timeline">
          {items.map((it) => (
            <li key={it.when}>
              <span className="when">{it.when}</span>
              <strong>{it.what}</strong>
              <div className="muted">{it.note}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>A little something extra</h3>
        <p>
          We'll have a short text-study moment after dessert — a single page from
          the Book of Ruth, with a question or two. No prep needed; just curiosity.
          Bring a thought, a memory of a Shavuot past, or a question you'd like
          to chew on.
        </p>
      </div>
    </>
  );
}
