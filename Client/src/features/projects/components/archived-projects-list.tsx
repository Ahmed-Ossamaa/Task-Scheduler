'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';
import { useArchiveProject, useRestoreProject } from '@/features/projects/hooks/use-projects';
import { ProjectsGrid } from '@/features/projects/components/projects-grid';
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

export function ArchivedProjectsList() {
  const [page, setPage] = useState<number>(1);
  const { data: paginatedResult, isLoading } = useArchiveProject(page, 20);
  const { mutateAsync: restoreProject, isPending: isRestoring } = useRestoreProject();

  const [projectToRestore, setProjectToRestore] = useState<{ id: string; name: string } | null>(null);

  const handleRestore = async (id: string) => {
    try {
      await restoreProject(id);
      toast.success('Project restored successfully');
      setProjectToRestore(null);
    } catch {
      toast.error('Failed to restore project');
    }
  };

  return (
    <>
      <ProjectsGrid
        projects={paginatedResult?.data} 
        isLoading={isLoading}
        actions={(project) => (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 shadow-sm"
            onClick={() => setProjectToRestore({ id: project.id, name: project.name })}
          >
            <RotateCcw className="h-4 w-4" />
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
      <AlertDialog open={!!projectToRestore} onOpenChange={(isOpen) => !isOpen && setProjectToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Project?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore <strong>{projectToRestore?.name}</strong>? 
              This will return it to the active workspace for your team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToRestore && handleRestore(projectToRestore.id)}
              disabled={isRestoring}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isRestoring ? 'Restoring...' : 'Yes, restore project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}