"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP } from "@/lib/gsap";
import { Btn, Frame } from "@/components/ui";

const Globe = dynamic(() => import("@/components/Globe"), { ssr: false });

export default function Rails() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-rail]", { opacity: 0, y: 40, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 65%" } });
        gsap.from("[data-orb]", { scale: 0.9, rotate: -10, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 75%" } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-navy px-2 text-paper md:px-4">
      <Frame dark className="border-t">
        <div className="relative grid min-h-[86vh] items-center overflow-hidden py-16 md:grid-cols-2">
          {/* One canvas fills the whole panel; the globe is placed inside the 3D scene,
              right of centre on desktop and below the text on phones. */}
          <div data-orb className="pointer-events-none absolute inset-0">
            <Globe dotColor="#5c7d9b" sphereColor="#0a2d4d" distance={2.3} dotSize={0.01} offset={[0.2, 0]} mobileOffset={[0, -0.22]} />
          </div>
          <div className="relative z-10 px-6 pb-[110vw] md:pb-0 md:pl-[clamp(2rem,5.5vw,7rem)] md:pr-0">
            <h2 data-rail className="text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.05em]">Built on our own rails</h2>
            <p data-rail className="mt-6 max-w-[44ch] leading-relaxed text-paper/70">
              Wirease is one of the few firms its size with a SWIFT code and a full payments solution through multiple banking relationships. Fewer intermediaries between your money and its destination, and one team accountable from first instruction to final credit.
            </p>
            <div data-rail className="mt-9 flex flex-wrap gap-2">
              <Btn href="/partners">Explore the platform</Btn>
              <Btn href="/trust" variant="light">How we protect you</Btn>
            </div>
          </div>
        </div>
      </Frame>
    </section>
  );
}
