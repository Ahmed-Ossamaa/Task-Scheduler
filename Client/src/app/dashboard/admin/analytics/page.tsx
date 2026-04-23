import { AdminAnalyticsClient } from './admin-analytics-client';

export const metadata = {
  title: 'Platform Analytics | Admin Dashboard',
  description: 'High-level overview of system usage and growth metrics.',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <p className="text-muted-foreground mt-2">
          High-level overview of system usage.
        </p>
      </div>

      <AdminAnalyticsClient />
    </div>
  );
}
