import Link from "next/link";

// The page sits in a hairline frame; each section starts on a rule with small squares at the corners.
export function Frame({ children, className = "", dark = false, corners = true, id }: { children: React.ReactNode; className?: string; dark?: boolean; corners?: boolean; id?: string }) {
  const sq = dark ? "bg-paper/70" : "bg-navy";
  return (
    <div id={id} className={`relative mx-auto max-w-none border-x ${dark ? "border-paper/15" : "border-line"} ${className}`}>
      {corners && (
        <>
          <span className={`absolute -left-[3px] -top-[3px] z-10 size-[5px] ${sq}`} aria-hidden />
          <span className={`absolute -right-[3px] -top-[3px] z-10 size-[5px] ${sq}`} aria-hidden />
        </>
      )}
      {children}
    </div>
  );
}

export function Cross({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute size-4 ${className}`} aria-hidden>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent" />
    </span>
  );
}

export function Btn({ href, children, variant = "accent" }: { href: string; children: React.ReactNode; variant?: "accent" | "outline" | "light" }) {
  const v = {
    accent: "bg-accent text-ink hover:bg-[#10a49f]",
    outline: "border border-navy text-navy hover:bg-navy hover:text-paper",
    light: "bg-paper text-navy hover:bg-mist",
  }[variant];
  return (
    <Link href={href} className={`inline-flex items-center whitespace-nowrap rounded-[4px] px-5 py-3 text-sm transition-colors duration-300 active:translate-y-px ${v}`}>
      {children}
    </Link>
  );
}
