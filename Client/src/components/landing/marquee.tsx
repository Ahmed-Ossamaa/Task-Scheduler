import { MARQUEE_ITEMS } from '@/constants/landing-constatnts';
import { AccentDot } from '@/components/ui/landing-ui';

export function Marquee() {
  return (
    <div className="overflow-hidden border-b border-t border-border bg-muted/30 py-3 mt-10">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground px-9 inline-flex items-center gap-2.5"
          >
            <AccentDot />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}