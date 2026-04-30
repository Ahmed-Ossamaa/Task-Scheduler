import { STATS } from '@/constants/landing-constatnts';

export function Stats() {
  return (
<div className="border-b border-border">
  <div className="w-full grid grid-cols-1 md:grid-cols-3">
    {STATS.map((stat, i) => (
      <div
        key={i}
        className={`
          flex flex-col items-center justify-center text-center
          py-8 md:py-12 px-6
          transition-all duration-300
          ${i < STATS.length - 1 ? 'md:border-r border-border' : ''}
        `}
      >
        <div className="text-5xl md:text-6xl tracking-tighter">
          {stat.num}
        </div>
        <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mt-2">
          {stat.label}
        </div>
      </div>
    ))}
  </div>
</div>
  );
}