import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveOrganizationsList } from '@/features/organizations/components/active-orgs-list';
import { ArchivedOrganizationsList } from '@/features/organizations/components/archived-orgs-list';

export const metadata = {
  title: 'Manage Organizations | Admin Dashboard',
  description: 'Manage active and suspended organizations.',
};

export default function AdminOrganizationsPage() {
  return (
    <div className="flex flex-col space-y-6 w-full h-full">
      {/* Page Header */}
      <p className="text-muted-foreground mt-2">
        Manage active and suspended organizations.
      </p>

      {/* Tabs Container */}
      <Tabs defaultValue="active" className="flex flex-col w-full ">
        <div className="flex items-center w-full mb-2 ">
          <TabsList
            className="
            relative grid w-full max-w-100 grid-cols-2 rounded-lg
            shadow-[0_4px_10px_rgba(120,90,60,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)]"
          >
            <TabsTrigger
              value="active"
              className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground!"
            >
              Active Organizations
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="border-2 border-transparent  data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground!"
            >
              Archived Organizations
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="active" className="w-full">
          <ActiveOrganizationsList />
        </TabsContent>

        <TabsContent value="archived" className="w-full">
          <ArchivedOrganizationsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
