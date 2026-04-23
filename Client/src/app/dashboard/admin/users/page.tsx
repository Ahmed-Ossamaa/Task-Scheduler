import { AdminUsersClient } from './admin-users-client';

export const metadata = {
  title: 'Manage Users | Admin Dashboard',
  description: 'Manage platform access, active accounts, and suspended users.',
};

export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-6 ">
      <div>
        <p className="text-muted-foreground mt-2">
          Manage platform access, active accounts, and suspended archives.
        </p>
      </div>

      <AdminUsersClient />
    </div>
  );
}
