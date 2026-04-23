import { MessagesClient } from './messages-client';

export const metadata = {
  title: 'Messages Center | Admin Dashboard',
  description: 'Manage incoming support requests.',
};

export default function MessagesPage() {
  return (
    <div className="flex-1 space-y-6 ">
      <div>
        <p className="text-muted-foreground mt-2">
          Manage incoming messages and support requests.
        </p>
      </div>

      <MessagesClient />
    </div>
  );
}
