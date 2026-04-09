'use client';

import { useState } from 'react';
import { useActivityLogs } from '../hooks/use-activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { timeAgo }  from '@/lib/utils';
import { Activity, PlusCircle, Trash2, RefreshCw, Archive } from 'lucide-react'; 
import { ActivityLog } from '../types';

export function ActivityFeed() {
  const [page, setPage] = useState(1);
  const { data: activities, isLoading } = useActivityLogs(page, 10);

  const getActionConfig = (action: string) => {
    switch (action) {
      case 'CREATED': return { icon: <PlusCircle className="w-4 h-4 text-green-500" />, color: 'text-green-600' };
      case 'DELETED': return { icon: <Trash2 className="w-4 h-4 text-rose-500" />, color: 'text-rose-600' };
      case 'ARCHIVED': return { icon: <Archive className="w-4 h-4 text-amber-500" />, color: 'text-amber-600' };
      default: return { icon: <RefreshCw className="w-4 h-4 text-blue-500" />, color: 'text-blue-600' };
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-sm border-t-4 border-t-green-800">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" />
          Global Activity Feed
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col pt-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-secondary rounded-md"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4">
              {activities?.data.map((activity: ActivityLog) => {
                const config = getActionConfig(activity.actionType);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors border border-transparent hover:border-border">
                    <div className="mt-0.5 bg-background rounded-full p-1 shadow-sm border border-border">
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        <span className={`font-bold mr-1.5 ${config.color}`}>
                          [{activity.actionType}]
                        </span>
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Entity ID: <span className="font-mono text-[10px] bg-secondary px-1 rounded">{activity.entityId}</span>
                      </p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {timeAgo(activity.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
              <Button 
                variant="outline" size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-xs font-medium text-muted-foreground">
                Page {activities?.page} of {activities?.lastPage}
              </span>
              <Button 
                variant="outline" size="sm"
                disabled={page === activities?.lastPage || !activities?.lastPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}