"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Frame } from "@/components/ui";

const STATS = [
  { n: 2010, s: "", label: "Trading in Hong Kong since" },
  { n: 100, s: "+", label: "Countries our payments reach" },
  { n: 50, s: "+", label: "Banknote currencies traded" },
  { n: 2, s: "", label: "Licensed markets, Hong Kong and Australia" },
];

export default function Stats() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-n]").forEach((el) => {
          const end = Number(el.dataset.n);
          const o = { v: end > 1000 ? end - 16 : 0 };
          gsap.to(o, { v: end, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate: () => (el.textContent = String(Math.round(o.v))) });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-navy px-2 text-paper md:px-4">
      <Frame dark className="border-t">
        <div className="grid md:grid-cols-[1fr_2fr]">
          <p className="px-6 py-12 text-[clamp(1.4rem,2vw,1.8rem)] leading-[1.15] tracking-[-0.035em] md:px-8 md:py-16">
            Families, businesses and financial institutions rely on Wirease to move money properly.
          </p>
          <dl className="grid grid-cols-2 border-t border-paper/15 md:border-l md:border-t-0">
            {STATS.map((s, i) => (
              <div key={s.label} className={`flex flex-col-reverse justify-between gap-6 border-paper/15 p-6 md:p-8 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""}`}>
                <dt className="text-sm text-paper/60">{s.label}</dt>
                <dd className="text-[clamp(2.6rem,5vw,4.6rem)] leading-none tracking-[-0.05em] tabular-nums">
                  <span data-n={s.n}>{s.n}</span><span className="text-accent">{s.s}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Frame>
    </section>
  );
}
