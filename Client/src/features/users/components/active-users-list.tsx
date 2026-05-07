'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, UserLock , LockKeyholeOpen, Trash2 } from 'lucide-react';
import { User } from '@/features/auth/types/user-interface';
import { UsersTable } from './users-table';
import {
  useAllUsers,
  useAdminDeleteUser,
  useAdminBanUser,
} from '@/features/users/hooks/use-users';
import { UserDetailsDialog } from './user-deatils-dialog';
import { Button } from '@/components/ui/button';
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
import { restorationPeriod } from '@/lib/utils';

export function ActiveUsersList() {
  const [page, setPage] = useState<number>(1);
  const { data: paginatedResult, isLoading } = useAllUsers(page, 20);
  const { mutateAsync: removeUser, isPending: isRemoving } = useAdminDeleteUser();
  const { mutateAsync: toggleUserStatus, isPending: isToggling } =useAdminBanUser();

  const [userToView, setUserToView] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [userToBan, setUserToBan] = useState<{ id: string; name: string;isActive: boolean; } | null>(null);

  const handleBan = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatus({ userId, isActive: !currentStatus });
      toast.success('User status has been updated');
      setUserToBan(null);
    } catch {
      toast.error('Failed to suspend user');
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeUser(userId);
      toast.success('User has been suspended and moved to archives');
      setUserToDelete(null);
    } catch {
      toast.error('Failed to suspend user');
    }
  };

  return (
    <div className="space-y-4">
      <UsersTable
        users={paginatedResult?.data}
        isLoading={isLoading}
        actions={(user) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              title="View"
              className="h-8 w-8 text-muted-foreground hover:text-green-600"
              onClick={() => setUserToView(user)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View User Details</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Archive"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setUserToDelete({ id: user.id, name: user.name })}
              disabled={isRemoving}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Suspend User</span>
            </Button>
            {user.isActive ? (
              <Button
                variant="ghost"
                size="icon"
                title="Ban"
                className="h-8 w-8 text-amber-500 hover:text-amber-800 hover:bg-red-50"
                onClick={() => setUserToBan({ id: user.id, name: user.name, isActive: user.isActive })}
                disabled={isToggling}
              >
                <UserLock className="w-4 h-4" />
                <span className="sr-only">Ban user</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title="Unban"
                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                onClick={() => setUserToBan({ id: user.id, name: user.name, isActive: user.isActive })}
                disabled={isToggling}
              >
                <LockKeyholeOpen  className="w-4 h-4" />
                <span className="sr-only">Unban user</span>
              </Button>
            )}
          </>
        )}
      />

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground font-medium px-2">
          Page {page} of {paginatedResult?.lastPage || 1}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => old + 1)}
          disabled={
            !paginatedResult || page >= paginatedResult.lastPage || isLoading
          }
        >
          Next
        </Button>
      </div>

      {/* Dialogs */}
      <UserDetailsDialog
        user={userToView}
        isOpen={!!userToView}
        onClose={() => setUserToView(null)}
      />

      <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{userToDelete?.name}</strong>? 
              They will be moved to the archives and lose platform access, but their data will be retained
              and can be restored within {restorationPeriod}.
              <br />
              <span className="font-semibold text-red-500">Note:</span>This action is NOT a ban, Users can be restored by their Manager within the retention period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleRemove(userToDelete.id)}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Archiving...' : 'Yes, archive user'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!userToBan} onOpenChange={(isOpen) => !isOpen && setUserToBan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> 
              {userToBan?.isActive ? 'Ban User?' : 'Unban User?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {userToBan?.isActive ? 'ban' : 'unban'}{' '}
              <strong>{userToBan?.name}</strong>? 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToBan && handleBan(userToBan.id, userToBan.isActive)}
              disabled={isToggling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
