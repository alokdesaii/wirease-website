import Link from "next/link";

// Organised by need and by customer, so each visitor finds their path from the footer too.
const COLS = [
  { h: "By need", links: [["Send money home", "/send-money"], ["Pay suppliers abroad", "/business"], ["Buy or sell banknotes", "/banknotes"], ["Launch a remittance brand", "/partners"]] },
  { h: "By customer", links: [["Individuals", "/send-money"], ["Businesses", "/business"], ["Banks and exchange houses", "/banknotes"], ["Agents and partners", "/partners"]] },
  { h: "Wirease", links: [["Trust and compliance", "/trust"], ["Company", "/company"], ["Contact", "/company#contact"], ["Privacy", "/privacy"]] },
];

const OFFICES = [
  { name: "Head office, Hong Kong", lines: "Unit 1407A, 14/F, Lippo Sun Plaza, 28 Canton Road, Tsim Sha Tsui, Kowloon", tel: "+852 2366 4416" },
  { name: "Branch, Hong Kong", lines: "Room 226-227, 2/F, Hankow Centre, 5-15 Hankow Road, Tsim Sha Tsui, Kowloon", tel: "+852 2366 4470" },
  { name: "Branch, Melbourne", lines: "Suite 7, Level 23, Collins Square Tower Five, 727 Collins Street, Melbourne VIC 3008", tel: "+61 3 9544 2010" },
];

export default function Footer() {
  return (
    <footer className="bg-navy px-2 text-paper md:px-4">
      <div className="relative mx-auto max-w-none border-x border-paper/15">
        <div className="grid gap-12 px-6 pb-12 pt-20 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:px-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wirease-logo.svg" alt="Wirease" width={81} height={40} className="h-10 w-auto rounded-sm bg-paper px-2 py-1" />
            <p className="mt-6 max-w-[26ch] text-lg leading-snug tracking-[-0.02em]">The trusted route for money across borders</p>
            <a href="mailto:support@wirease.com" className="mt-6 inline-block text-sm text-paper/70 hover:text-accent">support@wirease.com</a>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <p className="text-xs uppercase tracking-[0.12em] text-paper/50">{c.h}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {c.links.map(([t, h]) => <li key={t}><Link href={h} className="text-paper/85 hover:text-accent">{t}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="grid border-t border-paper/15 sm:grid-cols-3">
          {OFFICES.map((o, i) => (
            <address key={o.name} className={`px-6 py-6 not-italic md:px-8 ${i < 2 ? "border-paper/15 sm:border-r" : ""}`}>
              <p className="text-sm">{o.name}</p>
              <p className="mt-2 text-xs leading-relaxed text-paper/60">{o.lines}</p>
              <a href={`tel:${o.tel.replace(/\s/g, "")}`} className="mt-2 inline-block text-xs tabular-nums text-paper/85 hover:text-accent">{o.tel}</a>
            </address>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-paper/15 px-6 py-6 text-xs text-paper/50 md:flex-row md:px-8">
          <p className="max-w-[92ch]">Wirease Limited, Hong Kong, is the holding company of Wirease subsidiaries globally and is regulated by the Customs and Excise Department of Hong Kong. Wirease Pty Limited is regulated in Australia by ASIC (ACN 160 562 381). Support hours Monday to Friday, 09:30 to 17:30 HKT.</p>
          <p className="shrink-0">© {new Date().getFullYear()} Wirease</p>
        </div>
      </div>
    </footer>
  );
}
