import { User } from '@/features/auth/types/user-interface';
import { useArchivedEmployees, useRestoreEmployee } from '../hooks/use-users';
import { useState } from 'react';
import { toast } from 'sonner';
import { TeamTable } from './team-table';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ArchivedTeamList({
  currentUser,
  isManager,
}: {
  currentUser: User;
  isManager: boolean;
}) {
  const { data: employees, isLoading } = useArchivedEmployees();
  const { mutateAsync: restoreEmployee, isPending: isRestoring } = useRestoreEmployee();

  const [userToRestore, setUserToRestore] = useState<{id: string; name: string;} | null>(null);

  const handleRestore = async (id: string) => {
    try {
      await restoreEmployee(id);
      toast.success('Employee restored');
      setUserToRestore(null);
    } catch {
      toast.error('Failed to restore');
    }
  };

  return (
    <>
      <TeamTable
        employees={employees?.data}
        isLoading={isLoading}
        currentUserId={currentUser.id}
        isManager={isManager}
        actions={(employee) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setUserToRestore({ id: employee.id, name: employee.name })
            }
            className="text-green-600 hover:bg-green-50 h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      />

      {/*Restore User Dialog */}
      <AlertDialog
        open={!!userToRestore}
        onOpenChange={(isOpen) => !isOpen && setUserToRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to Restore{' '}
              <strong>{userToRestore?.name}</strong> from the archive?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                userToRestore && handleRestore(userToRestore.id)
              }
              disabled={isRestoring}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRestoring ? 'Restoring...' : 'Yes, restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
