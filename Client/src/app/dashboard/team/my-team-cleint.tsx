'use client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserRoles } from '@/features/auth/types/user-interface';
import { CreateEmployeeDialog } from '@/features/users/components/create-employee-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveTeamList } from '@/features/users/components/active-employees-list';
import { ArchivedTeamList } from '@/features/users/components/archived-employees-list';

export  function MyTeamClient() {
  const currentUser = useAuthStore((state) => state.user);
  if (!currentUser) return null;

  const isManager = currentUser.role === UserRoles.MANAGER;

  return (
    <div className="flex flex-col space-y-6 w-full h-full">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mt-2">
          {isManager ? "Manage your organization's members and their access." : "View members in your organization."}
        </p>
        {isManager && <CreateEmployeeDialog />}
      </div>

      {isManager ? (
        <Tabs defaultValue="active" className="flex flex-col w-full">
          <div className="flex items-center w-full mb-4">
            <TabsList className="relative grid w-full max-w-100 grid-cols-2 rounded-lg shadow-[0_4px_10px_rgba(120,90,60,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)]">
              <TabsTrigger value="active" className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground">
                Active Team
              </TabsTrigger>
              <TabsTrigger value="archived" className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground">
                Archived Members
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="active" className="w-full mt-0">
            <ActiveTeamList currentUser={currentUser} isManager={isManager} />
          </TabsContent>
          <TabsContent value="archived" className="w-full mt-0">
            <ArchivedTeamList currentUser={currentUser} isManager={isManager} />
          </TabsContent>
        </Tabs>
      ) : (
        // Employees sees only their active list
        <ActiveTeamList currentUser={currentUser} isManager={isManager} />
      )}
    </div>
  );
}