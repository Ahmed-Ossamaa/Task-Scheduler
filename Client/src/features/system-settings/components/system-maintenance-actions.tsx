'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDeleteActivityLogs } from '@/features/admin-overview/hooks/use-activity';
import { useDeleteErrorLogs } from '@/features/admin-overview/hooks/use-logs';
import { ShieldAlert, Trash2 } from 'lucide-react';

export function SystemMaintenanceActions() {
  const { mutateAsync: clearErrorLogs, isPending: isClearingErrors } =
    useDeleteErrorLogs();
  const { mutateAsync: clearActivityLogs, isPending: isClearingActivity } =
    useDeleteActivityLogs();

  return (
    <Card className="border-destructive/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-destructive">
          <ShieldAlert className="h-5 w-5" />
          System Maintenance
        </CardTitle>
        <CardDescription>
          Destructive actions for system logs and configurations. Proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/*Clear Error Logs */}
        <div className="flex items-center justify-between px-4 py-6 border rounded-lg bg-background">
          <div>
            <p className="font-medium">Clear Error Logs</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete all system error history.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Clear Error Logs
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  error logs from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => clearErrorLogs()}
                  disabled={isClearingErrors}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete logs
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/*Clear Activity Logs */}
        <div className="flex items-center justify-between px-4 py-6 border rounded-lg bg-background">
          <div>
            <p className="font-medium">Clear Activity Logs</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete all user activity tracking history.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Clear Activity Logs
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will wipe all recorded user/org
                  actions and audit trails.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => clearActivityLogs()}
                  disabled={isClearingActivity}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete logs
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
