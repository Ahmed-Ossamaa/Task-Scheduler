import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, FolderKanban } from 'lucide-react';
import { Project } from '@/features/projects/types';
import { formatDateTime } from '@/lib/utils';

interface ProjectsGridProps {
  projects: Project[] | undefined;
  isLoading: boolean;
  actions?: (project: Project) => React.ReactNode;
}

export function ProjectsGrid({ projects, isLoading, actions }: ProjectsGridProps) {
  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;
  }

  if (!projects || projects.length === 0) {
    return <p className="text-muted-foreground text-center py-12">No projects found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
          <Card className="border border-border hover:border hover:border-primary transition-colors cursor-pointer h-full relative group">
            
            {actions && (
              <div 
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {actions(project)}
              </div>
            )}

            <CardHeader>
              <CardTitle className="flex items-center gap-2 pr-5"> 
                <FolderKanban className="h-5 w-5 text-primary" />
                <span className="truncate">{project.name}</span>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description || 'No description provided.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p >
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