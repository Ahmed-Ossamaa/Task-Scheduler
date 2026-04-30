'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import {
  useOrgEmployees,
  useUpdateEmployeeRole,
  useDeleteEmployee,
} from '@/features/users/hooks/use-users';
import { User, UserRoles } from '@/features/auth/types/user-interface';
import { TeamTable } from '@/features/users/components/team-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
export function ActiveTeamList({
  currentUser,
  isManager,
}: {
  currentUser: User;
  isManager: boolean;
}) {
  const [page, setPage] = useState<number>(1);
  const { data: employees, isLoading } = useOrgEmployees(page, 20);
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useUpdateEmployeeRole();
  const { mutateAsync: removeEmployee, isPending: isDeleting } =
    useDeleteEmployee();

  const [pendingRole, setPendingRole] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRoleChange = async (employeeId: string, newRole: string) => {
    try {
      await updateRole({ employeeId, role: newRole });
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleRemoveEmployee = async (employeeId: string) => {
    try {
      await removeEmployee(employeeId);
      toast.success('Employee removed from organization');
      setUserToDelete(null);
    } catch {
      toast.error('Failed to remove employee');
    }
  };

  return (
    <>
      <TeamTable
        employees={employees?.data}
        isLoading={isLoading}
        currentUserId={currentUser.id}
        isManager={isManager}
        roleRender={(employee) =>
          isManager && currentUser.id !== employee.id ? (
            <Select
              value={employee.role}
              onValueChange={(value) =>
                setPendingRole({
                  id: employee.id,
                  name: employee.name,
                  role: value,
                })
              }
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRoles.MANAGER}>Manager</SelectItem>
                <SelectItem value={UserRoles.EMP}>Employee</SelectItem>
              </SelectContent>
            </Select>
          ) : undefined
        }
        actions={(employee) =>
          currentUser.id !== employee.id ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setUserToDelete({ id: employee.id, name: employee.name })
              }
              className="text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null
        }
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
          Page {page} of {employees?.lastPage || 1}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => old + 1)}
          disabled={!employees || page >= employees.lastPage || isLoading}
        >
          Next
        </Button>
      </div>

      {/* role Change Dialog */}
      <AlertDialog
        open={!!pendingRole}
        onOpenChange={(isOpen) => !isOpen && setPendingRole(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Employee Role?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change{' '}
              <strong>{pendingRole?.name}</strong>&apos;s role to{' '}
              <strong>{pendingRole?.role}</strong>?
              {pendingRole?.role === UserRoles.MANAGER &&
                " They will gain full administrative access to this organization's projects and team members."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isUpdating}
              onClick={async () => {
                if (pendingRole) {
                  await handleRoleChange(pendingRole.id, pendingRole.role);
                  setPendingRole(null);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? 'Updating...' : 'Confirm Change'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/*Delete Employee Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>{userToDelete?.name}</strong> from the organization? The
              user will be Archived with all of their tasks. but their data will be retained
              and can be restored within {restorationPeriod}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                userToDelete && handleRemoveEmployee(userToDelete.id)
              }
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Removing...' : 'Yes, remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
