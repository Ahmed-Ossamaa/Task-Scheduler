import { User, UserRoles } from '@/features/auth/types/user-interface';
import { formatDateTime } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Building2 } from 'lucide-react';
import React from 'react';

interface UsersTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  actions: (user: User) => React.ReactNode;
}

export function UsersTable({ users, isLoading, actions }: UsersTableProps) {
  return (
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
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading users...
                </div>
              </TableCell>
            </TableRow>
          ) : !users || users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                {/* Name */}
                <TableCell className="font-medium pl-5">
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
                  {user.organizationId && user.organization ? (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono bg-secondary px-2 py-1 rounded-md text-xs">
                        {user.organization.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Unassigned
                    </span>
                  )}
                </TableCell>

                {/* Created At */}
                <TableCell>{formatDateTime(user.createdAt, false)}</TableCell>

                {/* Actions (Render Prop) */}
                <TableCell className="text-right pr-5">
                  <div className="flex justify-end gap-1">{actions(user)}</div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
