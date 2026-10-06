"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import RateCalculator from "@/components/RateCalculator";
import { onIntroDone } from "@/components/Loader";
import map from "@/lib/worldmap.json";
import { Btn, Cross, Frame } from "@/components/ui";

function LiveCorridor() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % map.routes.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div data-live className="absolute bottom-5 left-5 flex items-center gap-3 rounded-[6px] bg-paper/90 px-4 py-3 text-sm shadow-[0_12px_30px_-18px_rgba(10,45,77,0.45)] backdrop-blur" aria-hidden>
      <span className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative size-2 rounded-full bg-accent" />
      </span>
      <span className="text-fg-2">Corridor</span>
      <span key={i} className="animate-[fadein_0.5s_ease-out]">Hong Kong <span className="text-accent">→</span> {map.routes[i].name}</span>
    </div>
  );
}

const STATEMENT = "Remittances, business payments, wholesale banknotes and a partner platform, from one licensed Hong Kong team.";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create("[data-h1]", { type: "chars,words", mask: "words" });
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // One intro timeline, held until the loader starts wiping away (see onIntroDone).
        const intro = gsap.timeline({ paused: true });
        intro
          .from(split.chars, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.018 }, 0.1)
          .from("[data-land]", { opacity: 0, duration: 1.6, ease: "power2.out", stagger: { each: 0.004, from: "random" } }, 0)
          .from("[data-calc]", { opacity: 0, y: 24, duration: 1, ease: "expo.out" }, 0.5)
          // Routes fan out from Hong Kong, cities pop in, then packets keep flowing (SVG animateMotion).
          .fromTo("[data-route]", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut", stagger: 0.12 }, 0.5)
          .fromTo("[data-city]", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.12 }, 1.4)
          .fromTo("[data-label]", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.12 }, 1.6)
          .fromTo("[data-packets]", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.1)
          .from("[data-live]", { opacity: 0, y: 16, duration: 0.8, ease: "expo.out" }, 1.9);
        const stop = onIntroDone(() => intro.play());
        return () => stop();
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // Scroll story (desktop, where the hero is pinned): the map eases towards Hong Kong,
        // routes brighten, the statement fills in.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.to("[data-map]", { scale: 1.3, ease: "none", duration: 1 }, 0)
          .to("[data-route]", { strokeWidth: 2.4, ease: "none", duration: 1 }, 0)
          .fromTo("[data-word]", { color: "#b9c0c7" }, { color: "#21262b", stagger: 0.04, ease: "none", duration: 0.1 }, 0.1);
      });

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative px-2 md:h-[220vh] md:px-4">
      <div className="flex flex-col pt-[88px] md:sticky md:top-0 md:h-[100dvh] md:pt-[96px]">
        <Frame className="flex min-h-0 flex-1 flex-col border-t">
          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            {/* Map */}
            <div className="relative h-[46vh] min-w-0 flex-none overflow-hidden md:h-auto md:flex-1">
              <svg data-map viewBox={`0 0 ${map.w} ${map.h}`} className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden
                style={{ transformOrigin: `${(map.hk[0] / map.w) * 100}% ${(map.hk[1] / map.h) * 100}%` }}>
                <path d={map.grid} fill="none" stroke="#d9dde2" strokeWidth="0.5" strokeDasharray="1 3" />
                {map.land.map((d, i) => (
                  <path key={i} data-land d={d} fill="#eceff2" stroke="#9aa3ad" strokeWidth="0.5" />
                ))}
                {map.routes.map((r, i) => (
                  <g key={r.name}>
                    <path d={r.d} fill="none" stroke="#14bdb7" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4" />
                    <path id={`route-${i}`} data-route d={r.d} fill="none" stroke="#14bdb7" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx={r.at[0]} cy={r.at[1]} r="3" fill="none" stroke="#0d61a6" strokeWidth="0.8">
                      <animate attributeName="r" values="3;9" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                    <circle data-city cx={r.at[0]} cy={r.at[1]} r="3.2" fill="#0d61a6" stroke="#f6f7f8" strokeWidth="1.2" />
                    <text data-label x={r.at[0] + 6} y={r.at[1] + 3} fontSize="9" fill="#66707a" fontFamily="var(--font-archivo)">{r.name}</text>
                  </g>
                ))}
                {/* Payments in flight: two packets per route, offset so the map is always moving. */}
                <g data-packets className="motion-reduce:hidden">
                  {map.routes.flatMap((r, i) =>
                    [0, 1].map((k) => (
                      <circle key={`${r.name}-${k}`} r="2.4" fill="#0d61a6">
                        <animateMotion dur={`${3.2 + (i % 3) * 0.6}s`} begin={`${i * 0.35 + k * 1.7}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                          <mpath href={`#route-${i}`} />
                        </animateMotion>
                      </circle>
                    )),
                  )}
                </g>
                <circle cx={map.hk[0]} cy={map.hk[1]} r="9" fill="none" stroke="#14bdb7" strokeWidth="1">
                  <animate attributeName="r" values="5;12;5" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0;1" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx={map.hk[0]} cy={map.hk[1]} r="4" fill="#14bdb7" />
              </svg>
              <LiveCorridor />
            </div>

            {/* Rate panel */}
            <div data-calc className="flex shrink-0 flex-col justify-center gap-4 border-t border-line px-5 py-6 md:w-[360px] md:border-l md:border-t-0 md:px-7 2xl:w-[420px]">
              <div>
                <p className="text-[15px] leading-snug tracking-[-0.02em]">See what arrives before you send</p>
                <p className="mt-1 text-xs leading-relaxed text-fg-2">Compare currencies in seconds. No hidden fees.</p>
              </div>
              <RateCalculator compact />
            </div>
          </div>

          {/* Headline row */}
          <div className="relative order-first grid border-b border-line md:order-none md:border-b-0 md:border-t md:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_420px]">
            <Cross className="-top-2 right-[352px] hidden md:block 2xl:right-[412px]" />
            <h1 data-h1 className="px-6 py-7 text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.02] tracking-[-0.045em] md:px-8 md:py-9">
              The trusted route for money across borders
            </h1>
            <div className="flex flex-col justify-end gap-5 border-line px-6 pb-8 md:border-l md:px-7 md:pb-9">
              <p className="text-[15px] leading-snug">
                {STATEMENT.split(" ").map((w, i) => <span key={i} data-word>{w} </span>)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Btn href="/business" variant="outline">For business</Btn>
                <Btn href="/partners" variant="outline">For partners</Btn>
              </div>
            </div>
          </div>
        </Frame>
      </div>
    </section>
  );
}
