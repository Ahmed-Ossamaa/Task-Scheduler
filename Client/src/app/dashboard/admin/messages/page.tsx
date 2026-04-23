'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActiveMessagesList } from '@/features/contact/components/active-messages-list';
import { ArchivedMessagesList } from '@/features/contact/components/archived-messages-list';

export default function MessagesClient() {
  return (
    <div className="flex flex-col space-y-6 w-full h-full">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground mt-2">
          Manage incoming messages and support requests.
        </p>
      </div>

      <Tabs defaultValue="active" className="flex flex-col w-full">
        <div className="flex items-center w-full mb-4">
          <TabsList className="relative grid w-full max-w-100 grid-cols-2 rounded-lg shadow-[0_4px_10px_rgba(120,90,60,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)]">
            <TabsTrigger 
              value="active" 
              className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Active Inbox
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              className="border-2 border-transparent data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Archive
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="active" className="w-full mt-0">
          <ActiveMessagesList />
        </TabsContent>
        
        <TabsContent value="archived" className="w-full mt-0">
          <ArchivedMessagesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}