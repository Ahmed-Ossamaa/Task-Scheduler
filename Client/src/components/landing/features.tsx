import { FEATURES } from '@/constants/landing-constatnts';

export function Features() {
  return (
    <div id="features" className="px-6 md:px-10 scroll-mt-24">
      
      <div className="flex flex-col md:flex-row justify-between py-14 border-b border-border gap-4">
        <h2 className="text-3xl md:text-4xl tracking-tight">
          Everything your team needs.
        </h2>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
          3 Core Pillars
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="p-10 group transition-all duration-300 hover:bg-foreground/5"
          >
            <div className="mb-6">{f.icon}</div>

            <h3 className="text-2xl mb-3">{f.title}</h3>

            <p className="text-[13px] text-muted-foreground leading-[1.8]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}