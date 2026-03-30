'use client';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import {
  useOrgEmployees,
  useUpdateEmployeeRole,
  useDeleteEmployee,
} from '@/features/users/hooks/use-users';
import { CreateEmployeeDialog } from '@/features/users/components/create-employee-dialog';

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

import { Loader2, Mail, User as UserIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function TeamPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [pendingRole, setPendingRole] = useState<{ id: string; name: string; role: string } | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  // Fetching emp in this Org
  const { data: employees, isLoading } = useOrgEmployees();

  // mutation hooks
  const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateEmployeeRole();
  const { mutateAsync: removeEmployee, isPending: isDeleting } = useDeleteEmployee();

  if (!currentUser) return null;

  const isManager = currentUser.role === UserRoles.MANAGER;

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
    <div className="flex flex-col space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Directory</h1>
          <p className="text-muted-foreground">
            {isManager
              ? "Manage your organization's members and their access."
              : 'View members in your organization.'}
          </p>
        </div>

        {/* Add Emp Button ==> manager only */}
        {isManager && <CreateEmployeeDialog />}
      </div>

      {/* The Team Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {isManager && (
                <TableHead className="text-right pr-5">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={isManager ? 4 : 3}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading team...
                  </div>
                </TableCell>
              </TableRow>
            ) : !employees || employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isManager ? 4 : 3}
                  className="h-24 text-center text-muted-foreground"
                >
                  No team members found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  {/* Name */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {employee.name}
                      {currentUser.id === employee.id && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (You)
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {employee.email}
                    </div>
                  </TableCell>

                  {/*Role change Dropdown */}
                  <TableCell>
                    {isManager && currentUser.id !== employee.id ? (
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
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRoles.MANAGER}>
                            Manager
                          </SelectItem>
                          <SelectItem value={UserRoles.EMP}>
                            Employee
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={
                          employee.role === UserRoles.MANAGER
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          employee.role === UserRoles.MANAGER
                            ? 'bg-blue-600 hover:bg-blue-800'
                            : ''
                        }
                      >
                        {employee.role === UserRoles.MANAGER
                          ? 'Manager'
                          : 'Employee'}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Delete User*/}
                  {isManager && (
                    <TableCell className="text-right pr-5">
                      {currentUser.id !== employee.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setUserToDelete({ id: employee.id, name: employee.name })}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
              Are you sure you want to change <strong>{pendingRole?.name}</strong>&apos;s role to <strong>{pendingRole?.role}</strong>? 
              {pendingRole?.role === UserRoles.MANAGER && " They will gain full administrative access to this organization's projects and team members."}
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

      {/*Delete User Dialog */}
      <AlertDialog 
        open={!!userToDelete} 
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{userToDelete?.name}</strong> from the organization? The user will be deleted with all of their tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleRemoveEmployee(userToDelete.id)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Removing...' : 'Yes, remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
