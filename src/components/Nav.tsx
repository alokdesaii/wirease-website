"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { NAV } from "@/lib/nav";
import { Btn } from "@/components/ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-2 pt-2 md:px-4 md:pt-3">
      <nav className="mx-auto grid h-[72px] max-w-none grid-cols-[1fr_auto] items-center rounded-[8px] bg-paper/95 pl-6 pr-4 shadow-[0_1px_0_rgba(10,45,77,0.06),0_8px_24px_-16px_rgba(10,45,77,0.35)] backdrop-blur xl:grid-cols-[1fr_auto_1fr]" aria-label="Main">
        <Link href="/" aria-label="Wirease home" className="justify-self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wirease-logo-horizontal.svg" alt="Wirease" width={180} height={37} className="h-[34px] w-auto md:h-9" />
        </Link>
        <ul className="hidden items-center gap-8 xl:flex">
          {NAV.map((n) => (
            <li key={n.href}><Link href={n.href} className="text-sm transition-colors hover:text-blue">{n.label}</Link></li>
          ))}
        </ul>
        <div className="flex items-center gap-2 justify-self-end">
          <span className="hidden sm:inline-flex"><Btn href="/send-money" variant="outline">Send money</Btn></span>
          <span className="hidden sm:inline-flex"><Btn href="/company#contact">Talk to us</Btn></span>
          <button className="grid size-10 place-items-center xl:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <ul id="mobile-menu" className="mx-auto mt-2 max-w-none rounded-[6px] bg-paper p-2 shadow-lg xl:hidden">
          {NAV.map((n) => (
            <li key={n.href}><Link href={n.href} onClick={() => setOpen(false)} className="block rounded px-3 py-3 text-lg hover:bg-card">{n.label}</Link></li>
          ))}
        </ul>
      )}
    </header>
  );
}
