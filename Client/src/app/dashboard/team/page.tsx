'use client';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { useOrgEmployees } from '@/features/users/hooks/use-users';
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
import { Loader2, Mail, User as UserIcon } from 'lucide-react';

export default function TeamPage() {
  const currentUser = useAuthStore((state) => state.user);

  // Fetching emp in this Org
  const { data: employees, isLoading } = useOrgEmployees();

  if (!currentUser) return null;

  const isManager = currentUser.role === UserRoles.MANAGER;

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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading team...
                  </div>
                </TableCell>
              </TableRow>
            ) : !employees || employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
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

                  {/* Role */}
                  <TableCell>
                    {employee.role === UserRoles.MANAGER ||
                    employee.role === UserRoles.ADMIN ? (
                      <Badge
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Manager
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Employee</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
