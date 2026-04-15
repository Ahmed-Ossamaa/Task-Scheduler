'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';
import {
  useOrgProjects,
  useDeleteProject,
} from '@/features/projects/hooks/use-projects';
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
import { restorationPeriod } from '@/lib/utils';
import { Project } from '../types';
import { EditProjectDialog } from './edit-project-dialog';

interface ActiveProjectsListProps {
  isManager: boolean;
}

export function ActiveProjectsList({ isManager }: ActiveProjectsListProps) {
  const [page, setPage] = useState<number>(1);
  const { data: projects, isLoading } = useOrgProjects(page, 20);
  const { mutateAsync: removeProject, isPending: isDeleting } =
    useDeleteProject();

  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const handleRemove = async (id: string) => {
    try {
      await removeProject(id);
      toast.success('Project archived successfully');
      setProjectToDelete(null);
    } catch {
      toast.error('Failed to archive project');
    }
  };

  return (
    <>
      <ProjectsGrid
        projects={projects?.data}
        isLoading={isLoading}
        actions={(project) =>
          isManager ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100 shadow-sm"
                onClick={() => setProjectToEdit(project)}
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit Project</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shadow-sm"
                onClick={() =>
                  setProjectToDelete({ id: project.id, name: project.name })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : null
        }
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
          Page {page} of {projects?.lastPage || 1}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => old + 1)}
          disabled={
            !projects || page >= projects.lastPage || isLoading
          }
        >
          Next
        </Button>
      </div>

      {/* Edit Dialog */}
      <EditProjectDialog
        project={projectToEdit}
        isOpen={!!projectToEdit}
        onClose={() => setProjectToEdit(null)}
      />

      {/* Delete Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(isOpen) => !isOpen && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Project?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive{' '}
              <strong>{projectToDelete?.name}</strong>? This will archive the
              project and its tasks, it can be restored later within{' '}
              {restorationPeriod}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                projectToDelete && handleRemove(projectToDelete.id)
              }
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Archiving...' : 'Yes, archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
