import { Btn, Frame } from "@/components/ui";

// Abstract backdrop: a fine dot grid fading to the edges, with soft rings
// rippling out from behind the headline, like a transfer going out.
export default function FinalCta() {
  return (
    <section className="px-2 md:px-4">
      <Frame className="border-t">
        <div className="relative overflow-hidden px-6 py-28 text-center md:py-40">
          <div
            className="absolute inset-0 [background-image:radial-gradient(#c3cad1_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_70%_at_50%_50%,#000_10%,transparent_75%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="ripple absolute left-1/2 top-1/2 size-[min(70vw,760px)] rounded-full border border-accent/40 [transform:translate(-50%,-50%)_scale(0.15)]"
                style={{ animationDelay: `${i * 2}s` }}
              />
            ))}
            <span className="absolute left-1/2 top-1/2 size-[min(70vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(20,189,183,0.10),transparent)]" />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.05em]">Start your next transfer with Wirease</h2>
            <div className="mt-9 flex justify-center gap-2">
              <Btn href="/company#contact">Talk to us</Btn>
              <Btn href="/send-money" variant="outline">Send money</Btn>
            </div>
          </div>
        </div>
      </Frame>
    </section>
  );
}
