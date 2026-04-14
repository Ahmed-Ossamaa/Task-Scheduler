'use client';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { CreateProjectDialog } from '@/features/projects/components/create-project-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveProjectsList } from '@/features/projects/components/active-projects-list';
import { ArchivedProjectsList } from '@/features/projects/components/archived-projects-list';


export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return null;

  const isManager = user.role === UserRoles.MANAGER;

  return (
    <div className="flex flex-col space-y-6 w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
          <p className="text-muted-foreground mt-2">
            {isManager ? "Manage your team's project spaces." : "Organization's Projects"}
          </p>
        {isManager && <CreateProjectDialog />}
      </div>

      {isManager ? (
        // manager : active and archived lists
        <Tabs defaultValue="active" className="flex flex-col w-full">
          <div className="flex items-center w-full mb-4">
            <TabsList
              className="
                relative grid w-full max-w-100 grid-cols-2 rounded-lg
                shadow-[0_4px_10px_rgba(120,90,60,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)]
              "
            >
              <TabsTrigger
                value="active"
                className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                Active Projects
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                Archived Projects
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="w-full mt-0">
            <ActiveProjectsList isManager={isManager} />
          </TabsContent>

          <TabsContent value="archived" className="w-full mt-0">
            <ArchivedProjectsList />
          </TabsContent>
        </Tabs>
      ) : (
        // Employee : just the active list
        <div className="pt-2">
          <ActiveProjectsList isManager={isManager} />
        </div>
      )}
    </div>
  );
}