import { EVENT } from "@/lib/event";
import { CheeseWedge, MilkJug, Pomegranate, Sunflower } from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      <div className="card card-deco">
        <Sunflower size={64} className="card-deco-icon top-right" />
        <h2>You're invited <span className="heb-small">· הזמנה</span></h2>
        <p>
          Join us for a warm Shavuot dinner with friends — dairy delights,
          conversation, and a celebration of the giving of the Torah.
        </p>
      </div>

      <div className="card card-deco">
        <MilkJug size={64} className="card-deco-icon top-right" />
        <h2>When <span className="heb-small">· מתי</span></h2>
        <p style={{ fontSize: "1.15rem", margin: 0 }}>
          <strong>{EVENT.date}</strong>
          <br />
          {EVENT.time}
        </p>
      </div>

      <div className="card card-deco">
        <CheeseWedge size={64} className="card-deco-icon top-right" />
        <h2>Where <span className="heb-small">· איפה</span></h2>
        <p style={{ fontSize: "1.15rem", margin: "0 0 14px" }}>{EVENT.address}</p>
        <a
          className="btn secondary"
          href={`${EVENT.mapsUrl}${encodeURIComponent(EVENT.address)}`}
          target="_blank"
          rel="noreferrer"
        >
          Open in Maps →
        </a>
      </div>

      <div className="card card-deco">
        <Pomegranate size={64} className="card-deco-icon top-right" />
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
