import { EVENT } from "@/lib/event";

export default function HomePage() {
  return (
    <>
      <div className="card">
        <h2>You're invited</h2>
        <p>
          Join us for a warm Shavuot dinner with friends — dairy delights,
          conversation, and a celebration of the giving of the Torah.
        </p>
      </div>

      <div className="card">
        <h2>When</h2>
        <p style={{ fontSize: "1.1rem", margin: 0 }}>
          <strong>{EVENT.date}</strong>
          <br />
          {EVENT.time}
        </p>
      </div>

      <div className="card">
        <h2>Where</h2>
        <p style={{ fontSize: "1.1rem", margin: "0 0 10px" }}>{EVENT.address}</p>
        <a
          className="btn secondary"
          href={`${EVENT.mapsUrl}${encodeURIComponent(EVENT.address)}`}
          target="_blank"
          rel="noreferrer"
        >
          Open in Maps
        </a>
      </div>

      <div className="card">
        <h2>What to do</h2>
        <ol>
          <li>Sign in with your name on the <strong>My Profile</strong> tab.</li>
          <li>Tell us what you'd like to <strong>bring</strong> so we balance the table.</li>
          <li>Peek at the <strong>schedule</strong> and the other <strong>attendees</strong>.</li>
        </ol>
      </div>
    </>
  );
}
