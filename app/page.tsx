import { EVENT } from "@/lib/event";
import { CheeseWedge, MilkJug, Pomegranate, Sunflower } from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      <div className="card card-deco">
        <Sunflower size={64} className="card-deco-icon top-right" />
        <h2>You're invited <span className="heb-small">· הזמנה</span></h2>
        <p>
          Join {EVENT.host} for a warm Shavuot dinner with friends — dairy
          delights, conversation, and a celebration of the giving of the Torah.
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
        <p style={{ fontSize: "1.15rem", margin: "0 0 6px", fontWeight: 600 }}>
          {EVENT.venue}
        </p>
        <p className="muted" style={{ margin: "0 0 14px" }}>
          {EVENT.venueDetail}
        </p>
        <a
          className="btn secondary"
          href={EVENT.mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          {EVENT.postcode} · Open in Maps →
        </a>
      </div>

      <div className="card card-deco">
        <Pomegranate size={64} className="card-deco-icon top-right" />
        <h2>What to do</h2>
        <ol>
          <li>Pick what you'd like to <strong>bring</strong> on the Potluck tab.</li>
          <li>Peek at the <strong>schedule</strong> for the evening.</li>
          <li>See who else is coming on the Potluck board.</li>
        </ol>
      </div>
    </>
  );
}
