import { TASKS, DONE_TASKS } from '@/constants/landing-constatnts';

export function TasksPreview() {
  return (
    <div
      id="how-it-works"
      className="border-b border-border bg-muted/20 py-16 scroll-mt-24"
    >
      <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="py-10">
          <h2 className="text-3xl md:text-4xl tracking-tight">
            Your team&apos;s work,
            <br />
            at a glance.
          </h2>
          <p className='mt-5 '>
            Stay on top of your tasks  one step at a time.
          </p>
        </div>

          {/* right */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground pb-2.5 border-b border-border mb-1">
                In Progress — {TASKS.length} tasks
              </div>

              {TASKS.map((t, i) => (
                <div
                  key={i}
                  className={`bg-card border border-border px-4 py-3.5 flex items-center justify-between rounded-sm border-l-[3px] transition-colors hover:border-primary/30 ${t.status === 'active' ? 'border-l-primary' : t.status === 'late' ? 'border-l-destructive' : 'border-l-transparent'}`}
                >
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted-foreground mb-1">
                      {t.cat}
                    </div>
                    <div className="text-[15px] text-foreground leading-[1.3] font-medium tracking-tight">
                      {t.name}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div
                      className={`text-[12px] font-bold ${t.status === 'active' ? 'text-primary' : t.status === 'late' ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                      {t.due}
                    </div>
                    <div
                      className={`w-1.75h-[7px] rounded-full ${t.status === 'active' ? 'bg-primary' : t.status === 'late' ? 'bg-destructive' : 'bg-muted-foreground'}`}
                    />
                  </div>
                </div>
              ))}

              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground pt-4 pb-2.5 border-b border-border mb-1 mt-2">
                Completed this week — 12 tasks
              </div>

              {DONE_TASKS.map((t, i) => (
                <div
                  key={i}
                  className="bg-card border border-border border-l-transparent border-l-[3px] px-4 py-3.5 flex items-center justify-between rounded-sm opacity-50"
                >
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted-foreground mb-1">
                      {t.cat}
                    </div>
                    <div className="text-[15px] text-foreground leading-[1.3] font-medium tracking-tight line-through decoration-muted-foreground/30">
                      {t.name}
                    </div>
                  </div>
                  <div className="text-[12px] font-bold text-green-500">
                    {t.due}
                  </div>
                </div>
              ))}
            </div>

      </div>
    </div>
  );
}
