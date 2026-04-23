import { AdminMessagesClient } from './admin-messages-client';

export const metadata = {
  title: 'Messages Center | Admin Dashboard',
  description: 'Manage incoming support requests.',
};

export default function AdminMessagesPage() {
  return (
    <div className="flex-1 space-y-6 ">
      <div>
        <p className="text-muted-foreground mt-2">
          Manage incoming messages and support requests.
        </p>
      </div>

      <AdminMessagesClient />
    </div>
  );
}
