"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { SendHome, PaymentTracker, CurrencyBoard, BrandPreview } from "@/components/home/Widgets";
import { Frame } from "@/components/ui";

const ROWS = [
  { who: "For individuals", title: "Send money home at a rate you see first", body: "Bank-to-bank transfers to 100+ countries, funded by simple bank transfer. No hidden fees.", href: "/send-money", cta: "Send money", W: SendHome, fill: true },
  { who: "For businesses", title: "Pay suppliers abroad with full visibility", body: "Local and international payments at competitive FX, for small invoices and large settlements alike. Multi-currency accounts on request.", href: "/business", cta: "Business payments", W: PaymentTracker },
  { who: "For banks and exchange houses", title: "Source banknotes from a leading Hong Kong desk", body: "Wholesale liquidity in 50+ currencies with quick settlement, from one of Hong Kong's largest banknote traders.", href: "/banknotes", cta: "Banknote desk", W: CurrencyBoard },
  { who: "For agents and partners", title: "Launch remittances under your own brand", body: "Our IMTS platform lets you add agents, cross-sell your products and stay compliant, while we run the rails.", href: "/partners", cta: "Partner platform", W: BrandPreview },
];

export default function Solutions() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-big]", { type: "words" });
        gsap.fromTo(split.words, { opacity: 0.15 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: "[data-big]", start: "top 80%", end: "bottom 45%", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-sol]").forEach((el) => {
          gsap.from(el.querySelectorAll("[data-in]"), { opacity: 0, y: 30, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 75%" } });
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-2 md:px-4">
      <Frame className="border-t">
        <p data-big className="mx-auto max-w-[22ch] px-6 py-24 text-center text-[clamp(2rem,4vw,3.4rem)] leading-[1.06] tracking-[-0.045em] md:py-36">
          Move money across borders at the right rate, with the right controls, through one partner
        </p>
      </Frame>
      {ROWS.map(({ who, title, body, href, cta, W, fill }) => (
        <Frame key={href} className="border-t">
          <div data-sol className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="flex flex-col justify-between gap-10 px-6 py-10 md:border-r md:border-line md:px-8 md:py-14">
              <p data-in className="text-xs text-fg-2">{who}</p>
              <div>
                <h3 data-in className="max-w-[16ch] text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.1] tracking-[-0.04em]">{title}</h3>
                <p data-in className="mt-4 max-w-[42ch] text-sm leading-relaxed text-fg-2">{body}</p>
                <Link data-in href={href} className="group mt-7 inline-flex items-center gap-2 text-sm text-blue">
                  {cta}
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </div>
            <div data-in className={`grid min-h-[420px] bg-card md:min-h-[520px] ${fill ? "p-4 md:p-7" : "place-items-center px-6 py-12"}`}>
              <W />
            </div>
          </div>
        </Frame>
      ))}
    </section>
  );
}
