'use client';

import {
  useAllUsers,
  useAdminDeleteUser,
} from '@/features/users/hooks/use-users';
import { User, UserRoles } from '@/features/auth/types/user-interface';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Trash2, Building2, Eye } from 'lucide-react';
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
import { formatDateTime } from '@/lib/utils';
import { UserProfileDialog } from '@/features/users/components/user-profile-dialog';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data: paginatedResult, isLoading } = useAllUsers(page, 20);
  const { mutateAsync: removeUser, isPending: isRemoving } =
    useAdminDeleteUser();
  const [userToView, setUserToView] = useState<User | null>(null);

  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRemove = async (userId: string) => {
    try {
      await removeUser(userId);
      toast.success('User permanently removed from platform');
      setUserToDelete(null);
    } catch {
      toast.error('Failed to remove user');
    }
  };

  const users = paginatedResult?.data;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage all registered users across the platform. Total accounts:{' '}
            {paginatedResult?.total || 0}
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Created</TableHead>

              <TableHead className="text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading
                    users...
                  </div>
                </TableCell>
              </TableRow>
            ) : !users || users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found on the platform.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  {/* Name */}
                  <TableCell className="font-medium">
                    <div>{user.name}</div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Badge
                      variant={
                        user.role === UserRoles.ADMIN ||
                        user.role === UserRoles.MANAGER
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        user.role === UserRoles.ADMIN
                          ? 'bg-red-600 hover:bg-red-900'
                          : user.role === UserRoles.MANAGER
                            ? 'bg-blue-600 hover:bg-blue-900'
                            : ''
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>

                  {/* Organization */}
                  <TableCell className="text-muted-foreground text-sm">
                    {user.organizationId ? (
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono bg-secondary px-2 py-1 rounded-md text-xs">
                          {user.organization?.name}
                        </span>
                      </div>
                    ) : (
                      'Unassigned'
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(user.createdAt, false)}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-green-600"
                      onClick={() => setUserToView(user)}
                    >
                      <Eye className="h-4 w-4 " />
                      <span className="sr-only">View User Details</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        setUserToDelete({ id: user.id, name: user.name })
                      }
                      disabled={isRemoving}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete User</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination*/}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="default"
          size="xs"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground font-medium">
          Page {page} of {paginatedResult?.lastPage || 1}
        </div>
        <Button
          variant="default"
          size="xs"
          onClick={() => setPage((old) => old + 1)}
          disabled={
            !paginatedResult || page >= paginatedResult.lastPage || isLoading
          }
        >
          Next
        </Button>
      </div>

      {/* ..................... Dialogs.................. */}
      {/* User Profile Dialog */}
      <UserProfileDialog
        user={userToView}
        isOpen={!!userToView}
        onClose={() => setUserToView(null)}
      />

      {/*Delete Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Force Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{' '}
              <strong>{userToDelete?.name}</strong> from the system? This
              bypasses all organization safeguards and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleRemove(userToDelete.id)}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Deleting...' : 'Yes, delete permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
