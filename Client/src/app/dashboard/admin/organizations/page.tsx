import { AdminOrganizationsClient } from './admin-orgs-client';

export const metadata = {
  title: 'Manage Organizations | Admin Dashboard',
  description: 'Manage active and suspended organizations.',
};

export default function AdminOrganizationsPage() {
  return (
    <div className="flex-1 space-y-6 ">
      <div>
        <p className="text-muted-foreground mt-2">
          Manage active and suspended organizations.
        </p>
      </div>

      <AdminOrganizationsClient />
    </div>
  );
}
