import { Scales, ShieldCheck, Lightning, Bank, Globe, Coins, Buildings, Handshake } from "@phosphor-icons/react/dist/ssr";
import { Frame } from "@/components/ui";

const CREDS = [
  { t: "Customs & Excise", s: "Licensed, Hong Kong", Icon: Scales },
  { t: "ASIC", s: "Regulated, Australia", Icon: ShieldCheck },
  { t: "SWIFT", s: "Our own SWIFT code", Icon: Lightning },
  { t: "Safeguarded", s: "Funds held with banks", Icon: Bank },
  { t: "100+ countries", s: "Payment reach", Icon: Globe },
  { t: "50+ currencies", s: "Banknotes traded", Icon: Coins },
  { t: "Since 2010", s: "Trading in Hong Kong", Icon: Buildings },
  { t: "IMTS", s: "Partner platform", Icon: Handshake },
];

export default function Credentials() {
  return (
    <section className="px-2 md:px-4">
      <Frame className="border-t">
        <h2 className="px-6 pb-12 pt-20 text-center text-[clamp(1.6rem,2.6vw,2.2rem)] tracking-[-0.04em] md:pt-28">Licensed, connected and accountable</h2>
        <ul className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {CREDS.map(({ t, s, Icon }, i) => (
            <li key={t} className={`group flex h-32 items-center gap-4 border-line px-6 transition-colors duration-500 hover:bg-card md:px-8 ${i % 2 ? "" : "border-r"} md:border-r ${i % 4 === 3 ? "md:border-r-0" : ""} ${i < 6 ? "border-b" : ""} ${i < 4 ? "md:border-b" : "md:border-b-0"}`}>
              <Icon size={26} weight="light" className="shrink-0 text-fg-2 transition-colors duration-500 group-hover:text-blue" aria-hidden />
              <div>
                <p className="tracking-[-0.02em]">{t}</p>
                <p className="text-xs text-fg-2">{s}</p>
              </div>
            </li>
          ))}
        </ul>
      </Frame>
    </section>
  );
}
