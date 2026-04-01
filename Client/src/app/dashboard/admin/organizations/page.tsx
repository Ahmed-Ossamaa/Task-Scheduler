'use client';

import {
  useAllOrganizations,
  useRemoveOrg,
} from '@/features/organizations/hooks/use-organizations';
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
import { Loader2, Building2,  Trash2 } from 'lucide-react';
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
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';

export default function AdminOrganizationsPage() {
  const [page, setPage] = useState(1);
  const { data: paginatedResult, isLoading } = useAllOrganizations(page, 20);
  const { mutateAsync: removeOrg, isPending: isRemoving } = useRemoveOrg();

  const [orgToDelete, setOrgToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRemove = async (orgId: string) => {
    try {
      await removeOrg(orgId);
      toast.success('Organization removed successfully');
      setOrgToDelete(null);
    } catch {
      toast.error('Failed to remove organization');
    }
  };

  const organizations = paginatedResult?.data;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage all registered companies. Total:{' '}
            {paginatedResult?.total || 0}
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Company Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
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
                  No organizations found on the platform.
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                        {org.logo ? (
                          <Image
                            src={org.logo}
                            alt={org.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      {org.name}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDateTime(org.createdAt, false)}
                  </TableCell>

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

                  <TableCell className="text-right pr-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                      onClick={() =>
                        setOrgToDelete({ id: org.id, name: org.name })
                      }
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
      </div>
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

      <AlertDialog
        open={!!orgToDelete}
        onOpenChange={(isOpen) => !isOpen && setOrgToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>{orgToDelete?.name}</strong>? This is a soft-delete, but
              it will lock out all of their users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => orgToDelete && handleRemove(orgToDelete.id)}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Removing...' : 'Yes, remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
