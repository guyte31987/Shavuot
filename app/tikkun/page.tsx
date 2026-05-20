"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type BodyItem = string | { quote: string[]; citation: string };

type Section = {
  num: string;
  title: string;
  body: BodyItem[];
  image: string | null;
  footer?: string;
};

const SECTIONS: Section[] = [
  {
    num: "I",
    title: "The Smallest Book",
    body: [
      'The Book of Ruth is hardly a book — just four chapters, a little over two thousand six hundred words. And yet it is, as the scholar Ilana Pardes writes, "the most elaborate tale of a woman to be found in the Bible."',
    ],
    image: "cover.jpg",
  },
  {
    num: "II",
    title: "A Famine, A Family, A Migration",
    body: [
      "It begins with a severe famine. An Israelite man named Elimelech leaves Bethlehem with his wife Naomi and their two sons, and they immigrate to the foreign land of Moab seeking better prospects. The sons marry Moabite women — Ruth and Orpah (which gives Oprah Winfrey her name), both of whom are neither Israelite nor Jewish.",
    ],
    image: "01.jpg",
  },
  {
    num: "III",
    title: "Three Widows",
    body: [
      "Once settled, the men die, all three of them, and the three widows, Naomi, Ruth and Orpah, are left to survive alone.",
    ],
    image: "02.jpg",
  },
  {
    num: "IV",
    title: "The Age of Judges",
    body: [
      "This happens during the biblical era referred to as Judges (שופטים) — an age of lawlessness and strife, when ad-hoc chieftains attempted to rescue the Hebrew tribes from their enemies, ultimately futilely, as even after the most successful battles, chaos was quick to return.",
      'Into this broken world, the Book of Ruth offers what Pardes calls "an alternative possibility, or perhaps a glimpse of a different chapter within this period."',
    ],
    image: "03.jpg",
  },
  {
    num: "V",
    title: "A Different World",
    body: [
      "We enter this world, Bethlehem in the days of harvest, with no shadow of an enemy on the horizon. People greet one another with respect in the fields, and legal matters are settled peacefully at the town's gate. The contrast is deliberate, as this is a story about what the world could look like.",
    ],
    image: "04.jpg",
  },
  {
    num: "VI",
    title: "Go Back",
    body: [
      "Following the deaths of Elimelech and his sons, Naomi decides to return to Bethlehem. She tells her daughters-in-law, Ruth and Orpah, to go back to their own people, find new Moabite husbands, and begin again. She states she has nothing to offer them — no sons, no property, no future. Orpah weeps, kisses her, and goes.",
    ],
    image: "05.jpg",
  },
  {
    num: "VII",
    title: "The Oath",
    body: [
      "Ruth refuses. And what she says has echoed across three thousand years, in family gatherings, Shavuot dinners and many Jewish Reform lesbian weddings:",
      {
        quote: [
          "“Do not urge me to leave you or to return from following you.",
          "For where you go I will go, and where you lodge I will lodge.",
          "Your people shall be my people, and your God my God.",
          "Where you die I will die, and there will I be buried.”",
        ],
        citation: "(Ruth 1:16)",
      },
    ],
    image: "06.jpg",
  },
  {
    num: "VIII",
    title: "The Cost of the Choice",
    body: [
      "She says this knowing exactly what it costs. She is a Moabite — a foreigner, whom the Israelites regarded with deep suspicion and xenophobia. She will arrive in Bethlehem with no husband, no family, no legal standing, an immigrant, and yet the choice is made.",
    ],
    image: "07.jpg",
  },
  {
    num: "IX",
    title: "Hesed",
    body: [
      "There is a Hebrew word for what Ruth does in this moment: hesed. It has no single English equivalent — it is usually translated as lovingkindness, or loyal love, but neither quite captures it.",
      "HaRambam — one of the greatest Jewish scholars — defined it as an act of goodness extended toward someone who has no claim upon you — not born of obligation, not driven by kinship or debt or the expectation of return. It is what you do when you do not have to.",
      "Naomi has told Ruth to go. She owes her nothing. The law releases her entirely. What Ruth does next is therefore, by definition, beyond the law. It is hesed in its purest form — chosen freely, on a road, in grief, with no witness but the two of them.",
    ],
    image: "08.jpg",
  },
  {
    num: "X",
    title: "The Margins",
    body: [
      "The two go to Bethlehem, and once they arrive, Ruth goes out to glean — to collect grain left behind at the edges of the fields by the harvesters. This was the right of the poor under Hebrew law: a form of generosity encoded into the very structure of agriculture itself. She occupies a liminal space — neither fully inside nor fully outside, making her life in the gaps the dominant world leaves behind.",
    ],
    image: "09.jpg",
  },
  {
    num: "XI",
    title: "Boaz",
    body: [
      "She happens to glean in the field of Boaz, a wealthy man and distant relative of Naomi’s dead husband. Boaz notices her. He hears what she has done for Naomi. He leaves extra grain in her path, offers her water, feeds her at his own table. He is kind in ways the law does not require of him. And here the word hesed appears again — because Boaz, too, goes beyond what is asked.",
    ],
    image: "10.jpg",
  },
  {
    num: "XII",
    title: "No Villains",
    body: [
      "Unlike most Biblical books and most literature — there are no villains in this story. All it has are good people who are “not flawless nor are their lives necessarily less miserable or devoid of tensions, but they have a unique light, an unimaginable generosity, that compels all who surround them, even those who try to deny their fascination.”",
      "Ruth is the primary agent of that light. But so is Boaz. So, quietly, is Naomi — who despite her grief and bitterness never stops manoeuvring, never stops caring for the woman who refused to leave her. The scroll is saturated in hesed — not as sentiment, but as action. As a series of choices, made again and again, by people who were not required to make them.",
    ],
    image: "11.jpg",
  },
  {
    num: "XIII",
    title: "The Threshing Floor",
    body: [
      "Naomi then instructs Ruth in an audacious move: go to the threshing floor at night, uncover his feet, lie down, wait. When he wakes, ask him to spread his cloak over you — you are kin. It is, in the language of the time, a proposal. There is much that is transgressive here — an erotically charged encounter at midnight, in which Ruth takes the initiative and names what she needs.",
    ],
    image: "12.jpg",
  },
  {
    num: "XIV",
    title: "An Unruly Figure",
    body: [
      "She is, as Pardes puts it, “culturally an unruly figure” — ever in flux, down the centuries shaped and reshaped by rabbis and artists who sometimes tried to make her more manageable, and sometimes embraced her otherness entirely.",
    ],
    image: "13.jpg",
  },
  {
    num: "XV",
    title: "The Grandmother of Nations",
    body: [
      "Boaz is moved. He navigates a legal technicality and marries Ruth. A son is born. The women of Bethlehem give the child to Naomi and say: a son has been born to Naomi. As though she herself had given birth. His name is Obed, who becomes the father of Jesse, who becomes the father of David, beginning a lineage which also leads to Jesus. And thus an immigrant stranger becomes the grandmother of nations.",
    ],
    image: "14.jpg",
  },
  {
    num: "XVI",
    title: "Why This Text Exists",
    body: [
      "The Talmud asked, long after the scroll was written: why does this text exist? It contains no laws of purity or impurity, no prohibitions, no commandments. And it answered its own question: it was written to teach us the magnitude of the reward given to those who perform acts of hesed. The lovingkindness of doing when we do not have to. For ourselves, for our friends, and for strangers.",
    ],
    footer: "Shavuot 5786 • שבועות תשפז",
    image: "15.jpg",
  },
];

export default function TikkunPage() {
  const [idx, setIdx] = useState(0);
  const total = SECTIONS.length;
  const readerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const shouldScroll = useRef(false);

  const prev = useCallback(() => { shouldScroll.current = true; setIdx((i) => Math.max(0, i - 1)); }, []);
  const next = useCallback(() => { shouldScroll.current = true; setIdx((i) => Math.min(total - 1, i + 1)); }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  useEffect(() => {
    if (shouldScroll.current) {
      readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      shouldScroll.current = false;
    }
  }, [idx]);

  const s = SECTIONS[idx];

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <div className="tikkun-reader" ref={readerRef}>
      <button
        className="tikkun-arrow tikkun-arrow-side"
        onClick={prev}
        disabled={idx === 0}
        aria-label="Previous section"
      >
        ‹
      </button>

      <div className="tikkun-main">
        <div
          className="tikkun-card"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="tikkun-card-body">
            <div className="tikkun-num">{s.num}</div>
            <h2 className="tikkun-title">{s.title}</h2>
            <div className="tikkun-body">
              {s.body.map((item, i) =>
                typeof item === "string" ? (
                  <p key={i}>{item}</p>
                ) : (
                  <blockquote key={i} className="tikkun-quote">
                    {item.quote.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                    <p className="tikkun-citation">{item.citation}</p>
                  </blockquote>
                )
              )}
            </div>
            {s.footer && <p className="tikkun-footer">{s.footer}</p>}
          </div>
          {s.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={idx} src={`/tikkun/${s.image}`} alt="" className="tikkun-img" />
          )}
        </div>

        {/* Scrubber */}
        <div className="tikkun-scrubber">
          <input
            type="range"
            min={0}
            max={total - 1}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            aria-label="Section"
          />
          <div className="tikkun-progress">
            {idx + 1}&thinsp;/&thinsp;{total}
          </div>
        </div>

        <div className="tikkun-mobile-nav">
          <div className="tikkun-mobile-btns">
            <button
              className="tikkun-arrow"
              onClick={prev}
              disabled={idx === 0}
              aria-label="Previous section"
            >
              ‹
            </button>
            <button
              className="tikkun-arrow"
              onClick={next}
              disabled={idx === total - 1}
              aria-label="Next section"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <button
        className="tikkun-arrow tikkun-arrow-side"
        onClick={next}
        disabled={idx === total - 1}
        aria-label="Next section"
      >
        ›
      </button>
    </div>
  );
}
