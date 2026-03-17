'use client';

import Link from 'next/link';
import { useOrgProjects } from '@/features/projects/hooks/use-projects';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Loader2, FolderKanban } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useOrgProjects();
  const user = useAuthStore((state) => state.user);
  const isManagerOrAdmin =
    user?.role === UserRoles.MANAGER || user?.role === UserRoles.ADMIN;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your team&apos;s project spaces.
          </p>
        </div>
        {isManagerOrAdmin && <CreateProjectDialog />}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin" />
        </div>
      ) : projects?.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No projects found. Create one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-primary" />
                    {project.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
