import React from 'react';
import { User, UserRoles } from '@/features/auth/types/user-interface';
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

interface TeamTableProps {
  employees: User[] | undefined;
  isLoading: boolean;
  currentUserId: string;
  isManager: boolean;
  roleRender?: (employee: User) => React.ReactNode;
  actions?: (employee: User) => React.ReactNode;
}

export function TeamTable({
  employees,
  isLoading,
  currentUserId,
  isManager,
  roleRender,
  actions,
}: TeamTableProps) {
  return (
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
                <TableCell className="font-medium pl-5">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {employee.name}
                    {currentUserId === employee.id && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (You)
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" /> {employee.email}
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  {roleRender ? (
                    roleRender(employee)
                  ) : (
                    <Badge
                      variant={
                        employee.role === UserRoles.MANAGER
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        employee.role === UserRoles.MANAGER ? 'bg-blue-600' : ''
                      }
                    >
                      {employee.role === UserRoles.MANAGER
                        ? 'Manager'
                        : 'Employee'}
                    </Badge>
                  )}
                </TableCell>

                {isManager && (
                  <TableCell className="text-right pr-5">
                    <div className="flex justify-end">
                      {actions && actions(employee)}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
