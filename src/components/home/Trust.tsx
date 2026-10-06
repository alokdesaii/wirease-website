"use client";

import { useRef } from "react";
import { Scales, Vault, ShieldCheck, Phone } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import map from "@/lib/worldmap.json";
import { Frame } from "@/components/ui";

const CARDS = [
  { title: "Regulated in two markets", body: "Licensed by Hong Kong's Customs and Excise Department. Wirease Pty Limited is regulated by ASIC in Australia.", Icon: Scales, cls: "bg-[#d2d6dc] text-ink" },
  { title: "Your money, kept separate", body: "Customer funds are held with established banks, apart from our own accounts, and our books are audited regularly.", Icon: Vault, cls: "bg-[#14bdb7] text-ink" },
  { title: "Screened at every step", body: "Xirni Edge runs KYC, risk and anti-money laundering checks on every customer and payment. Accounts use two-factor sign-in.", Icon: ShieldCheck, cls: "bg-[#0d61a6] text-paper" },
  { title: "A team you can call", body: "Sales and operations people in Hong Kong and Melbourne, Monday to Friday, with a fraud team watching around the clock.", Icon: Phone, cls: "bg-[#0a2d4d] text-paper" },
];

// Final resting spread: cards land side by side across the section, with a slight
// staggered height and tilt so they still read as a hand of cards.
const FAN = [
  { y: 4, r: -5 },
  { y: -4, r: -1.5 },
  { y: 4, r: 1.5 },
  { y: -4, r: 5 },
];

export default function Trust() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // Cards already sit in their spread positions (CSS). Scroll only deals them in from below.
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", pin: "[data-pin]", scrub: 0.6 } });
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((c, i) => {
          tl.from(c, { y: () => window.innerHeight * 0.75, rotation: 14 - i * 6, opacity: 0, ease: "power3.out", duration: 1 }, i * 0.7);
        });
        tl.to("[data-title]", { opacity: 0.25, duration: 1 }, 0.4);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-2 md:px-4">
      <Frame className="border-t" corners>
        <div data-pin className="relative overflow-hidden md:h-[100dvh]">
          {/* Faint living map: routes keep flowing out of Hong Kong, quietly, behind the cards. */}
          <svg viewBox={`0 0 ${map.w} ${map.h}`} className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            {map.land.map((d, i) => <path key={i} d={d} fill="#eef0f2" stroke="#d6dbe0" strokeWidth="0.6" />)}
            {map.routes.map((r, i) => (
              <g key={r.name}>
                <path id={`trust-route-${i}`} d={r.d} fill="none" stroke="#14bdb7" strokeOpacity="0.5" strokeWidth="1.1" strokeDasharray="3 6" className="route-flow" />
                <circle cx={r.at[0]} cy={r.at[1]} r="2" fill="#0d61a6" fillOpacity="0.35" />
                <circle cx={r.at[0]} cy={r.at[1]} r="2" fill="none" stroke="#0d61a6" strokeOpacity="0.4" strokeWidth="0.6">
                  <animate attributeName="r" values="2;8" dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.4;0" dur="3.2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
            <g className="motion-reduce:hidden">
              {map.routes.filter((_, i) => i % 2 === 0).map((r, k) => (
                <circle key={r.name} r="2.2" fill="#0d61a6" fillOpacity="0.6">
                  <animateMotion dur={`${6 + (k % 3)}s`} begin={`${k * 0.9}s`} repeatCount="indefinite"><mpath href={`#trust-route-${k * 2}`} /></animateMotion>
                </circle>
              ))}
            </g>
            <circle cx={map.hk[0]} cy={map.hk[1]} r="3" fill="#14bdb7" fillOpacity="0.6" />
            <circle cx={map.hk[0]} cy={map.hk[1]} r="3" fill="none" stroke="#14bdb7" strokeWidth="0.8">
              <animate attributeName="r" values="3;14" dur="3s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.6;0" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
          {/* Soft paper wash in the centre keeps the title and cards crisp over the map. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_18%,rgba(246,247,248,0.9),transparent_75%)]" aria-hidden />
          <div data-title className="relative px-6 pt-24 text-center md:pt-28">
            <h2 className="text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.04] tracking-[-0.05em]">Why clients trust Wirease</h2>
            <p className="mx-auto mt-4 max-w-[40ch] text-fg-2">Regulated, safeguarded and screened, with people you can actually reach.</p>
          </div>
          <div className="relative mx-auto mt-12 grid max-w-[420px] gap-4 px-6 pb-16 md:absolute md:inset-x-0 md:top-[34%] md:mt-0 md:max-w-[min(92%,1400px)] md:grid-cols-4 md:gap-5 md:px-0 md:pb-0">
            {CARDS.map(({ title, body, Icon, cls }, i) => (
              <article key={title} data-card style={{ ["--r" as string]: `${FAN[i].r}deg`, ["--y" as string]: `${FAN[i].y * 4}px` }}
                className={`rounded-[8px] p-6 shadow-[0_24px_48px_-24px_rgba(10,45,77,0.5)] md:min-h-[320px] md:[rotate:var(--r)] md:[translate:0_var(--y)] ${cls}`}>
                <Icon size={28} weight="light" aria-hidden />
                <h3 className="mt-10 text-xl leading-tight tracking-[-0.03em]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-80">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </Frame>
    </section>
  );
}
