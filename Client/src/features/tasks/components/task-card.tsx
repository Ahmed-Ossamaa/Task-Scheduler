import { getTaskStatusInfo } from '@/lib/utils';
import { Task } from '../types';

export function TaskCard({ task }: { task: Task }) {
  const statusInfo = getTaskStatusInfo(task.deadLine, task.status);
  const category = task.project?.name || 'General';

  return (
    <div
      className={`group flex items-center justify-between p-5 bg-card border border-border/50 rounded-md shadow-sm hover:shadow-md transition-all ${statusInfo.color} border-l-4`}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
          {category}
        </span>
        <h3 className="text-lg text-foreground">{task.title}</h3>
      </div>

      <div className={`text-[13px] ${statusInfo.textColor}`}>
        {statusInfo.label}
      </div>
    </div>
  );
}
