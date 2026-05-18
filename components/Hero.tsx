import { ShavuotHeader } from "./ShavuotHeader";

export function Hero() {
  return (
    <div
      style={{
        margin: "16px 0 24px",
        borderRadius: 18,
        overflow: "hidden",
        border: "2px solid #1a1a1a",
        boxShadow: "5px 5px 0 #1a1a1a",
      }}
    >
      <ShavuotHeader title="Shavuot Dinner" strap="This Friday · Hackney Wick" height={160} />
    </div>
  );
}
