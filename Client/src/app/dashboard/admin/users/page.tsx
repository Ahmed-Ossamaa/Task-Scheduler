'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveUsersList } from '@/features/users/components/active-users-list';
import { ArchivedUsersList } from '@/features/users/components/archived-users-list';

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground mt-2">
            Manage platform access, active accounts, and suspended archives.
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="flex flex-col w-full">
        <div className="flex items-center w-full">
          <TabsList className="grid w-full max-w-100 grid-cols-2 border border-border">
            {' '}
            <TabsTrigger
              value="active"
              className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary"
            >
              Active Users
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="border-2 border-transparent  data-[state=active]:border-2 data-[state=active]:border-primary"
            >
              Suspended / Archived
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
