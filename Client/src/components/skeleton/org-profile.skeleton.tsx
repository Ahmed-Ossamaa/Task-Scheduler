import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function OrgProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <Skeleton className="w-32 h-10 rounded-md" />
      <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/40">
        <Skeleton className="h-48 w-full rounded-none" />
        <CardContent className="relative px-8 pb-8">
          <Skeleton className="absolute -top-16 w-32 h-32 rounded-xl border-4 border-background" />
          <div className="pt-20 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
