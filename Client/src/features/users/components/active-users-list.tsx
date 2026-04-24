'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, Trash2 } from 'lucide-react';
import { User } from '@/features/auth/types/user-interface';
import { UsersTable } from './users-table';
import { useAllUsers, useAdminDeleteUser } from '@/features/users/hooks/use-users';
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



export function ActiveUsersList() {
  const [page, setPage] = useState<number>(1);
  const { data: paginatedResult, isLoading } = useAllUsers(page, 20);
  const { mutateAsync: removeUser, isPending: isRemoving } = useAdminDeleteUser();
  
  const [userToView, setUserToView] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

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
              className="h-8 w-8 text-muted-foreground hover:text-green-600"
              onClick={() => setUserToView(user)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View User Details</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setUserToDelete({ id: user.id, name: user.name })}
              disabled={isRemoving}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Suspend User</span>
            </Button>
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
          disabled={!paginatedResult || page >= paginatedResult.lastPage || isLoading}
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
              They will be moved to the archives and lose platform access, but their data will be retained.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleRemove(userToDelete.id)}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Suspending...' : 'Yes, suspend user'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}