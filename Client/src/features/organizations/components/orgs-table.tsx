import React from 'react';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Building2} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/features/organizations/types';

interface OrganizationsTableProps {
  organizations: Organization[] | undefined;
  isLoading: boolean;
  actions: (org: Organization) => React.ReactNode;
}

export function OrganizationsTable({
  organizations,
  isLoading,
  actions,
}: OrganizationsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Organization</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading
                  organizations...
                </div>
              </TableCell>
            </TableRow>
          ) : !organizations || organizations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No organizations found.
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((org) => (
              <TableRow key={org.id}>
                {/* Org Name*/}
                <TableCell className="font-medium pl-5">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center overflow-hidden border">
                      {org.logo ? (
                        <Image
                          src={org.logo}
                          alt={org.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {org.name}
                  </div>
                </TableCell>

                {/* Created At */}
                <TableCell className="text-muted-foreground">
                  {formatDateTime(org.createdAt, false)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {org.deletedAt ? (
                    <Badge variant="destructive">Suspended</Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Active
                    </Badge>
                  )}
                </TableCell>

                {/* Actions  */}
                <TableCell className="text-right pr-5">
                  <div className="flex justify-end gap-1">{actions(org)}</div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
