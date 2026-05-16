import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, FolderKanban, MoreHorizontal } from 'lucide-react';
import { Project } from '@/features/projects/types';
import { formatDateTime } from '@/lib/utils';

interface ProjectsGridProps {
  projects: Project[] | undefined;
  isLoading: boolean;
  actions?: (project: Project) => React.ReactNode;
}

export function ProjectsGrid({
  projects,
  isLoading,
  actions,
}: ProjectsGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        No projects found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {projects.map((project) => (
        <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
          <Card className="border border-border hover:border hover:border-primary transition-colors cursor-pointer h-full overflow-hidden relative group">
            {actions && (
              <div
                className="absolute top-3 right-3 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Project actions menu"
                      className="h-5 w-8 flex items-center justify-center rounded-md bg-muted hover:scale-110 transition"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 px-1 ">
                    {actions(project)}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <CardHeader>
              <CardTitle className="flex items-center gap-2 pr-5 min-w-0">
                <FolderKanban className="h-5 w-5 text-primary shrink-0" />
                <span className="truncate min-w-0 block flex-1">
                  {project.name}
                </span>
              </CardTitle>
              <CardDescription className="line-clamp-2 truncate min-w-0 block flex-1">
                {project.description || 'No description provided.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(project.createdAt)}
                </span>
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
