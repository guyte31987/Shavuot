import { EVENT } from "@/lib/event";
import { CheeseWedge, MilkJug, Pomegranate, Sunflower } from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      <div className="card card-deco">
        <Sunflower size={64} className="card-deco-icon top-right" />
        <h2>You're invited <span className="heb-small">· הזמנה</span></h2>
        <p>
          {EVENT.hosts} are delighted to have you for a casual celebration of
          Shavuot this Friday — dairy delights, drinks, and a long evening of
          conversation.
        </p>
      </div>

      <div className="card card-deco">
        <MilkJug size={64} className="card-deco-icon top-right" />
        <h2>When <span className="heb-small">· מתי</span></h2>
        <p style={{ fontSize: "1.1rem", margin: 0 }}>
          <strong>{EVENT.date}</strong>
          <br />
          Dinner from {EVENT.dinnerTime} · Drinks from {EVENT.drinksTime}
        </p>
      </div>

      <div className="card card-deco">
        <CheeseWedge size={64} className="card-deco-icon top-right" />
        <h2>Where <span className="heb-small">· איפה</span></h2>
        <p style={{ fontSize: "1.1rem", margin: "0 0 6px", fontWeight: 600 }}>
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
          <li>
            Let us know if you're joining (and food/drink prefs) on the{" "}
            <strong>My Profile</strong> tab.
          </li>
          <li>
            Let us know if you'd like to bring anything on the{" "}
            <strong>Dinner</strong> tab.
          </li>
          <li>
            Read more <strong>About Shavuot</strong> and have a peek at the
            tentative — most likely made-up — <strong>Schedule</strong>.
          </li>
        </ol>
      </div>
    </>
  );
}
