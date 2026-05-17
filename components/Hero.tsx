import { ShavuotHeader } from "./ShavuotHeader";

export function Hero() {
  return (
    <div style={{ margin: "16px -20px 24px", borderRadius: 18, overflow: "hidden", border: "2px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
      <ShavuotHeader title="Shavuot Dinner" strap="22 May · Hackney Wick · E9 5TF" height={170} />
    </div>
  );
}
