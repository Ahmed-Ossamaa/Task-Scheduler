'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useAllOrganizations, useRemoveOrg } from '@/features/organizations/hooks/use-organizations';
import { OrganizationsTable } from '@/features/organizations/components/orgs-table';
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

export function ActiveOrganizationsList() {
  const [page, setPage] = useState<number>(1);
  const { data: paginatedResult, isLoading } = useAllOrganizations(page, 20);
  const { mutateAsync: removeOrg, isPending: isRemoving } = useRemoveOrg();
  
  const [orgToDelete, setOrgToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleRemove = async (orgId: string) => {
    try {
      await removeOrg(orgId);
      toast.success('Organization has been suspended and moved to archives');
      setOrgToDelete(null);
    } catch {
      toast.error('Failed to suspend organization');
    }
  };

  return (
    <div className="space-y-4">
      <OrganizationsTable
        organizations={paginatedResult?.data}
        isLoading={isLoading}
        actions={(org) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setOrgToDelete({ id: org.id, name: org.name })}
            disabled={isRemoving}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Suspend Organization</span>
          </Button>
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
          disabled={!paginatedResult || page >= paginatedResult.lastPage || isLoading}
        >
          Next
        </Button>
      </div>

      {/* Suspend Dialog */}
      <AlertDialog open={!!orgToDelete} onOpenChange={(isOpen) => !isOpen && setOrgToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{orgToDelete?.name}</strong>? 
              This will instantly revoke access for all employees associated with this organization and move it to the archives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => orgToDelete && handleRemove(orgToDelete.id)}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Suspending...' : 'Yes, suspend organization'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}