'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveUsersList } from '@/features/users/components/active-users-list';
import { ArchivedUsersList } from '@/features/users/components/archived-users-list';

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Page Header */}
      <p className="text-muted-foreground mt-2">
        Manage platform access, active accounts, and suspended archives.
      </p>

      {/* Tabs Container */}
      <Tabs defaultValue="active" className="flex flex-col w-full">
        <div className="flex items-center w-full mb-2">
          <TabsList
            className="
            relative grid w-full max-w-100 grid-cols-2 rounded-lg
            shadow-[0_4px_10px_rgba(120,90,60,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)]"
          >
            <TabsTrigger
              value="active"
              className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground!"
            >
              Active Users
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="border-2 border-transparent  data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground!"
            >
              Archived Users
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="w-full ">
          <ActiveUsersList />
        </TabsContent>

        <TabsContent value="archived" className="w-full ">
          <ArchivedUsersList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
