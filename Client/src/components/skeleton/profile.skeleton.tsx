import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 w-full animate-pulse">
      <div className="mb-8 flex justify-between">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border/50 shadow-sm">
          <CardHeader className="flex flex-col items-center pb-4 pt-8">
            <Skeleton className="w-32 h-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2 rounded-full" />
          </CardHeader>
        </Card>

        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48 border-b pb-2" />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
