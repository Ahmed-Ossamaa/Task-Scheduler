'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, RotateCcw, Trash2 } from 'lucide-react';
import { User } from '@/features/auth/types/user-interface';
import {
  useArchivedUsers,
  useAdminRestoreUser,
  useAdminHardDeleteUser,
} from '@/features/users/hooks/use-users';
import { UsersTable } from './users-table';
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
import { CounterDeleteButton } from '@/components/ui/counterDeleteButton';
import { AxiosError } from 'axios';

export function ArchivedUsersList() {
  const [page, setPage] = useState<number>(1);
  const { data: paginatedResult, isLoading } = useArchivedUsers(page, 20);
  const { mutateAsync: restoreUser, isPending: isRestoring } =
    useAdminRestoreUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } =
    useAdminHardDeleteUser();

  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const [userToView, setUserToView] = useState<User | null>(null);
  const [userToRestore, setUserToRestore] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success('User has been permanently deleted');
      setUserToDelete(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data.message;
      toast.error( message|| 'Failed to delete user');
    }
  };

  const handleRestore = async (userId: string) => {
    try {
      await restoreUser(userId);
      toast.success('User access has been fully restored');
      setUserToRestore(null);
    } catch {
      toast.error('Failed to restore user');
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
              title="Restore"
              className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => setUserToRestore({ id: user.id, name: user.name })}
              disabled={isRestoring}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="sr-only">Restore User</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setUserToDelete({ id: user.id, name: user.name })}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Delete User</span>
            </Button>
          </>
        )}
      />

      {/* Pagination Controls */}
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

      <AlertDialog
        open={!!userToRestore}
        onOpenChange={(isOpen) => !isOpen && setUserToRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore{' '}
              <strong>{userToRestore?.name}</strong>? They will regain full
              platform access and their previous organization role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToRestore && handleRestore(userToRestore.id)}
              disabled={isRestoring}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isRestoring ? 'Restoring...' : 'Yes, restore access'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permenantly Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to Delete{' '}
              <strong>{userToDelete?.name}</strong> permanently? 
              <span className="text-muted-foreground block"><span className='text-red-500'>Note</span>: The user will be able to register a new account with the same email.</span>
              <span className="text-red-500 block">This action can  NOT be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <CounterDeleteButton 
              key={userToDelete?.id} 
              onConfirm={() => userToDelete && handleDelete(userToDelete.id)} 
              label="Yes, Delete user" 
              seconds={3} 
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
