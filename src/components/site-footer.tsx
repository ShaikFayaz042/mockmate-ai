import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Practice interviews with a real-time AI interviewer. Voice, video, and text — with feedback that actually moves the needle.
          </p>
        </div>
        <FooterCol title="Product" links={[["Features", "#features"], ["How it works", "#how"], ["Pricing", "#pricing"], ["Modes", "#modes"]]} />
        <FooterCol title="Company" links={[["About", "#"], ["Contact", "#"], ["Privacy", "#"], ["Terms", "#"]]} />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© {year} MockMate. Crafted for confident interviews.</span>
          <span className="font-mono tracking-tight">v2.0</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-sm text-foreground/80 transition-colors hover:text-foreground">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
