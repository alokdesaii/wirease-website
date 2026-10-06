"use client";

import { useId, useState } from "react";
import { ArrowsDownUp } from "@phosphor-icons/react";

// ponytail: mock USD-per-unit rates for the UI only. Replace with the Wirease rates API before launch.
const USD: Record<string, number> = {
  HKD: 0.1282, AUD: 0.6612, USD: 1, INR: 0.01187, PHP: 0.01742, NPR: 0.00742,
  GBP: 1.3318, IDR: 0.0000613, PKR: 0.00356, BDT: 0.00822, AED: 0.2723, SGD: 0.7741,
};
const FROM = ["HKD", "AUD", "USD"];
const TO = Object.keys(USD);

export default function RateCalculator({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [amount, setAmount] = useState("10000");
  const [from, setFrom] = useState("HKD");
  const [to, setTo] = useState("INR");

  const n = Number(amount.replace(/,/g, ""));
  const valid = amount !== "" && Number.isFinite(n) && n > 0;
  const rate = USD[from] / USD[to];
  const out = valid ? n * rate : 0;
  const fmt = (v: number, d = 2) => v.toLocaleString("en-HK", { maximumFractionDigits: d, minimumFractionDigits: d });

  const swap = () => {
    if (!FROM.includes(to)) return;
    setFrom(to);
    setTo(from);
  };

  return (
    <form
      className={`w-full border border-line bg-paper ${compact ? "rounded-[6px] p-4" : "p-5"}`}
      onSubmit={(e) => e.preventDefault()}
      aria-label="Currency calculator"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-amt`} className="font-mono text-xs uppercase tracking-[0.08em] text-fg-2">You send</label>
        <div className="flex items-center gap-2 border border-line bg-bg px-3 focus-within:border-accent">
          <input
            id={`${id}-amt`}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
            className={`w-full bg-transparent font-semibold tabular-nums outline-none ${compact ? "h-11 text-lg" : "h-12 text-xl"}`}
            aria-invalid={!valid}
            aria-describedby={`${id}-err`}
          />
          <select value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Send currency" className="bg-transparent font-mono text-sm outline-none">
            {FROM.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <p id={`${id}-err`} className="min-h-4 text-xs text-[#fb923c]">{valid ? "" : "Enter an amount above zero."}</p>
      </div>

      <div className="-my-1 flex items-center justify-between">
        <span className="text-xs text-fg-2 tabular-nums">1 {from} = {fmt(rate, rate < 1 ? 4 : 2)} {to}</span>
        <button type="button" onClick={swap} disabled={!FROM.includes(to)} aria-label="Swap currencies"
          className="grid size-8 place-items-center border border-line text-fg-2 transition hover:text-fg active:scale-95 disabled:opacity-40">
          <ArrowsDownUp size={16} />
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-fg-2">They receive</span>
        <div className="flex items-center gap-2 border border-line bg-paper px-3">
          <output className={`w-full content-center font-semibold tabular-nums ${compact ? "h-11 text-lg" : "h-12 text-xl"}`} aria-live="polite">{fmt(out)}</output>
          <select value={to} onChange={(e) => setTo(e.target.value)} aria-label="Receive currency" className="bg-transparent font-mono text-sm outline-none">
            {TO.filter((c) => c !== from).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-snug text-fg-2">Indicative rate. Your final rate and fee are confirmed before you pay.</p>
      {compact && (
        <a href="/send-money" className="mt-4 block rounded-[4px] bg-navy py-3 text-center text-sm text-paper transition-colors hover:bg-blue">Send money</a>
      )}
    </form>
  );
}
