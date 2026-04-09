'use client';

import { useSystemErrors } from '../hooks/use-logs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { timeAgo } from '@/lib/utils';
import { AlertOctagon, CheckCircle2, ServerCrash } from 'lucide-react';

export function SystemHealth() {
  const { data: errorLogs, isLoading } = useSystemErrors(1, 10); // recent 10

  const isHealthy = errorLogs?.data.length === 0;

  return (
    <Card className={`h-full flex flex-col shadow-sm border-t-4 ${isHealthy ? 'border-t-green-800' : 'border-t-rose-500'}`}>
      <CardHeader className="border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <ServerCrash className="w-5 h-5 text-red-500" />
          System Health
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pt-4">
        {isLoading ? (
          <div className="text-sm animate-pulse">Running diagnostics...</div>
        ) : isHealthy ? (
          // if no errors
          <div className="flex flex-col items-center justify-center h-full min-h-50 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-green-700">All Systems Operational</p>
              <p className="text-xs text-muted-foreground mt-1">No 500-level crashes detected.</p>
            </div>
          </div>
        ) : (
          // if there are errors
          <div className="space-y-3">
            {errorLogs?.data.map((err) => (
              <div key={err.id} className=" p-3 rounded-lg border border-border group hover:bg-secondary transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-rose-100 text-red-700">
                      {err.method}
                    </span>
                    <span className="text-xs font-medium text-primary">{err.path}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {timeAgo(err.createdAt)}
                  </span>
                </div>
                
                <p className="text-sm text-rose-500 font-medium line-clamp-2 leading-snug">
                  {err.errorMessage}
                </p>
                
                {err.userId && (
                  <div className="mt-2 pt-2 border-t border-rose-100/50 flex justify-between items-center">
                    <span className="text-[10px] text-rose-600 uppercase  font-semibold">Affected User</span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-1 rounded border shadow-sm">
                      {err.userId}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}