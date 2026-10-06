"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import WMark from "@/components/WMark";

// Pages can wait for the intro: the callback runs as the loader starts wiping away,
// or immediately if it has already gone (or was skipped this session).
let introDone = false;
const EVT = "wirease:intro-done";
function signalIntroDone() {
  if (introDone) return;
  introDone = true;
  window.dispatchEvent(new Event(EVT));
}
export function onIntroDone(cb: () => void) {
  if (introDone) { cb(); return () => {}; }
  const h = () => cb();
  window.addEventListener(EVT, h, { once: true });
  return () => window.removeEventListener(EVT, h);
}

// Intro: the W assembles stroke by stroke, the dot drops in, a highlight sweeps across,
// then the screen wipes up to reveal the page. Plays once per browser session.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      // Review helpers: ?intro replays the loader every load; ?intro=hold freezes it on the finished W.
      const intro = new URLSearchParams(location.search).get("intro");
      let seen = false;
      try { seen = intro === null && sessionStorage.getItem("wirease-intro") === "1"; } catch {}
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finish = () => {
        signalIntroDone();
        try { sessionStorage.setItem("wirease-intro", "1"); } catch {}
        document.documentElement.style.overflow = "";
        setDone(true);
      };
      if (seen) return finish();
      document.documentElement.style.overflow = "hidden";
      // Failsafe: never let the intro block the site, even if the animation stalls.
      const bail = intro === "hold" ? undefined : setTimeout(finish, 6000);

      if (reduced) {
        gsap.to(root.current, { opacity: 0, duration: 0.4, delay: 0.4, onComplete: finish });
        return () => clearTimeout(bail);
      }

      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ onComplete: finish });
      // Only plain y moves and opacity on the SVG pieces: no scale or custom origins,
      // so every piece is guaranteed to finish exactly where the logo puts it.
      tl.from(q('[data-piece="stroke"]'), { y: 70, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.09, clearProps: "transform" })
        .from(q('[data-piece="dot"]'), { y: -90, opacity: 0, duration: 0.8, ease: "bounce.out", clearProps: "transform" }, "-=0.4")
        .from(q('[data-piece="shine"]'), { opacity: 0, duration: 0.5 }, "-=0.2")
        .fromTo(q("[data-sweep]"), { xPercent: -120 }, { xPercent: 120, duration: 0.8, ease: "power2.inOut" }, "-=0.3")
        .add(() => { if (intro === "hold") tl.pause(); })
        .to(q("[data-mark]"), { scale: 0.92, duration: 0.35, ease: "power2.in" }, "+=0.15")
        .to(q("[data-mark]"), { y: -40, opacity: 0, duration: 0.4, ease: "power2.in" })
        .add(signalIntroDone, "-=0.25")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" }, "<");
      return () => clearTimeout(bail);
    },
    { scope: root },
  );

  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[100] grid place-items-center bg-[#f6f7f8]" style={{ clipPath: "inset(0 0 0% 0)" }} aria-label="Loading Wirease" role="status">
      <div data-mark className="relative w-[min(30vw,150px)]">
        <WMark className="w-full overflow-visible" />
        {/* Light sweep across the mark; only the sweep is clipped, never the W itself. */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <span data-sweep className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-soft-light" />
        </span>
      </div>
    </div>
  );
}
