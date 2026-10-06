"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";

// Business: an example payment moving through its stages, on a loop.
const STAGES = ["Payment instruction received", "Funds received by bank transfer", "KYC and AML screening passed", "Sent via SWIFT", "Credited to supplier"];
export function PaymentTracker() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, scrollTrigger: { trigger: root.current, start: "top 85%", toggleActions: "play pause resume pause" } });
        tl.set("[data-tick]", { scale: 0 }).set("[data-stage]", { opacity: 0.35 }).set("[data-bar]", { scaleY: 0 })
          .to("[data-bar]", { scaleY: 1, duration: STAGES.length * 0.7, ease: "none" }, 0);
        STAGES.forEach((_, i) => {
          tl.to(`[data-stage="${i}"]`, { opacity: 1, duration: 0.2 }, i * 0.7).to(`[data-tick="${i}"]`, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, i * 0.7);
        });
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className="w-full max-w-[400px] rounded-[6px] bg-paper p-6 shadow-[0_20px_40px_-28px_rgba(10,45,77,0.4)]">
      <div className="flex items-baseline justify-between">
        <p className="text-sm">Supplier payment</p>
        <p className="text-xs text-fg-2">Example</p>
      </div>
      <p className="mt-1 text-2xl tracking-[-0.03em] tabular-nums">USD 48,250.00</p>
      <ol className="relative mt-6 space-y-4">
        <span className="absolute bottom-2 left-[9px] top-2 w-px bg-line" aria-hidden />
        <span data-bar className="absolute bottom-2 left-[9px] top-2 w-px origin-top bg-accent" aria-hidden />
        {STAGES.map((s, i) => (
          <li key={s} data-stage={i} className="relative flex items-center gap-3 text-sm">
            <span className="relative grid size-[19px] place-items-center rounded-full border border-line bg-paper">
              <span data-tick={i} className="absolute inset-0 grid place-items-center rounded-full bg-accent text-ink"><Check size={10} weight="bold" aria-hidden /></span>
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

// Banknotes: a board of currencies with a highlight hopping between them.
const CCY = ["USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "CHF", "SGD", "THB", "INR", "PHP", "KRW", "TWD", "AED", "SAR", "MYR", "IDR", "VND", "NZD", "MOP", "NPR", "BDT", "PKR"];
export function CurrencyBoard() {
  const [hot, setHot] = useState<number[]>([0, 7, 14]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHot(Array.from({ length: 3 }, () => Math.floor(Math.random() * CCY.length))), 1100);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full max-w-[420px]">
      <ul className="grid grid-cols-6 gap-1.5">
        {CCY.map((c, i) => (
          <li key={c} className={`grid h-12 place-items-center rounded-[4px] text-xs tracking-wide transition-colors duration-700 ${hot.includes(i) ? "bg-navy text-paper" : "bg-paper text-fg-2"}`}>{c}</li>
        ))}
      </ul>
      {/* ponytail: illustrative set. Swap for the actual traded list. */}
      <p className="mt-3 text-xs text-fg-2">A sample of the 50+ currencies on our desk</p>
    </div>
  );
}

// Partners: type a brand name and pick a colour, and the mini app rebrands live.
const SWATCHES = ["#0d61a6", "#14bdb7", "#21262b", "#c2410c", "#7c3aed"];
export function BrandPreview() {
  const [name, setName] = useState("Harbour Remit");
  const [color, setColor] = useState(SWATCHES[0]);
  return (
    <div className="grid w-full max-w-[460px] gap-5 sm:grid-cols-[1fr_190px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="brand" className="text-xs text-fg-2">Your brand name</label>
          <input id="brand" value={name} maxLength={20} onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-[4px] border border-line bg-paper px-3 text-sm outline-none focus:border-accent" />
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs text-fg-2">Brand colour</legend>
          <div className="mt-2 flex gap-2">
            {SWATCHES.map((s) => (
              <button key={s} type="button" onClick={() => setColor(s)} aria-label={`Use colour ${s}`} aria-pressed={s === color}
                className={`size-7 rounded-full transition-transform ${s === color ? "scale-110 ring-2 ring-offset-2 ring-offset-card" : ""}`} style={{ background: s, ["--tw-ring-color" as string]: s }} />
            ))}
          </div>
        </fieldset>
        <p className="text-xs leading-relaxed text-fg-2">Your customers see your brand. Wirease runs the rails and compliance underneath.</p>
      </div>
      <div className="overflow-hidden rounded-[14px] border border-line bg-paper shadow-[0_20px_40px_-28px_rgba(10,45,77,0.45)]" aria-label="Preview of your branded app">
        <div className="px-4 pb-6 pt-5 text-paper transition-colors duration-500" style={{ background: color }}>
          <p className="truncate text-sm">{name || "Your brand"}</p>
          <p className="mt-4 text-[11px] opacity-75">Send to</p>
          <p className="text-lg tracking-[-0.03em]">Philippines</p>
        </div>
        <div className="space-y-2 p-4 text-xs">
          <div className="flex justify-between"><span className="text-fg-2">You send</span><span>HKD 5,000</span></div>
          <div className="flex justify-between"><span className="text-fg-2">Delivery</span><span>Bank account</span></div>
          <div className="mt-3 rounded-[6px] py-2 text-center text-paper transition-colors duration-500" style={{ background: color }}>Continue</div>
          <p className="pt-1 text-center text-[10px] text-fg-2">Powered by Wirease IMTS</p>
        </div>
      </div>
    </div>
  );
}

function Node({ label, code, tone }: { label: string; code: string; tone: "accent" | "blue" }) {
  return (
    <div className="flex w-[104px] flex-col items-center gap-3 text-center">
      <span className="relative grid size-16 place-items-center rounded-full bg-paper ring-1 ring-line">
        <span className={`absolute inset-0 animate-ping rounded-full opacity-20 motion-reduce:hidden ${tone === "accent" ? "bg-accent" : "bg-blue"}`} style={{ animationDuration: "2.6s" }} />
        <span className={`relative text-sm tracking-wide ${tone === "accent" ? "text-[#0e8f8a]" : "text-blue"}`}>{code}</span>
      </span>
      <span className="text-sm leading-tight">{label}</span>
    </div>
  );
}

// Individuals: pick where home is; a simple two-node transfer animates and the promise list ticks through.
const HOMES = [
  { country: "Philippines", ccy: "PHP" },
  { country: "India", ccy: "INR" },
  { country: "Nepal", ccy: "NPR" },
  { country: "Nigeria", ccy: "NGN" },
  { country: "UAE", ccy: "AED" },
  { country: "United Kingdom", ccy: "GBP" },
];
const PROMISES = ["Rate and fee shown before you pay", "Paid by bank transfer", "Screened and sent through our banks", "Delivered to their bank account"];

export function SendHome() {
  const root = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const home = HOMES[i];

  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % HOMES.length), 4200);
    return () => clearInterval(id);
  }, [auto]);


  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut", transformOrigin: "0% 50%" });
        gsap.fromTo("[data-dest]", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)", delay: 0.6 });
        gsap.fromTo("[data-p]", { opacity: 0.25, x: -6 }, { opacity: 1, x: 0, duration: 0.5, ease: "expo.out", stagger: 0.18, delay: 0.5 });
      });
    },
    { scope: root, dependencies: [i] },
  );

  return (
    <div ref={root} className="flex h-full w-full flex-col">
      <div role="tablist" aria-label="Choose a destination" className="mb-4 flex flex-wrap gap-1.5">
        {HOMES.map((h, n) => (
          <button key={h.country} role="tab" aria-selected={n === i} onClick={() => { setI(n); setAuto(false); }}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${n === i ? "bg-navy text-paper" : "bg-paper text-fg-2 hover:text-fg"}`}>
            {h.country}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-[8px] bg-paper shadow-[0_24px_48px_-28px_rgba(10,45,77,0.45)]">
        {/* Abstract corridor: origin and destination nodes with a payment crossing between them. */}
        <div className="relative flex h-[200px] flex-none items-center justify-between gap-4 bg-[radial-gradient(#d3d9de_1px,transparent_1.2px)] [background-size:18px_18px] px-6 md:h-[240px] md:px-12" aria-hidden>
          <Node label="Hong Kong" code="HKD" tone="accent" />
          <div className="relative h-px flex-1">
            <span className="absolute inset-0 border-t border-dashed border-mist" />
            <span data-line key={`l${i}`} className="absolute inset-0 bg-accent" />
            <span className="travel absolute -top-[5px] size-[11px] rounded-full bg-blue shadow-[0_0_0_5px_rgba(13,97,166,0.15)] motion-reduce:hidden" />
          </div>
          <div data-dest key={`d${i}`}><Node label={home.country} code={home.ccy} tone="blue" /></div>
        </div>
        <div className="border-t border-line p-5 md:p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-xl tracking-[-0.03em]">Hong Kong <span className="text-accent">→</span> {home.country}</p>
            <p className="text-xs text-fg-2">HKD to {home.ccy}</p>
          </div>
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {PROMISES.map((p) => (
              <li key={p} data-p className="flex items-center gap-3 text-sm">
                <span className="grid size-[18px] place-items-center rounded-full bg-accent text-ink"><Check size={10} weight="bold" aria-hidden /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
