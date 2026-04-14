'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';
import {
  useArchivedOrgs,
  useRestoreOrg,
} from '@/features/organizations/hooks/use-organizations';
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

export function ArchivedOrganizationsList() {
  const [page, setPage] = useState<number>(1);
  const { data: paginatedResult, isLoading } = useArchivedOrgs(page, 20);
  const { mutateAsync: restoreOrg, isPending: isRestoring } = useRestoreOrg();

  const [orgToRestore, setOrgToRestore] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRestore = async (orgId: string) => {
    try {
      await restoreOrg(orgId);
      toast.success('Organization has been successfully restored');
      setOrgToRestore(null);
    } catch {
      toast.error('Failed to restore organization');
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
            className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
            onClick={() => setOrgToRestore({ id: org.id, name: org.name })}
            disabled={isRestoring}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="sr-only">Restore Organization</span>
          </Button>
        )}
      />

      {/* Pagination */}
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

      {/* Restore Dialog */}
      <AlertDialog
        open={!!orgToRestore}
        onOpenChange={(isOpen) => !isOpen && setOrgToRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Organization?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore{' '}
              <strong>{orgToRestore?.name}</strong>? This will re-activate the
              organization and restore access for all associated employees and
              projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => orgToRestore && handleRestore(orgToRestore.id)}
              disabled={isRestoring}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isRestoring ? 'Restoring...' : 'Yes, restore organization'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
