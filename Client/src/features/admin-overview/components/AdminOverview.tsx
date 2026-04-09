import { ActivityFeed } from "./activityFeed";
import { SystemHealth } from "./systemHealth";

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <p className=" text-sm mt-1">Real-time system monitoring and global activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        <div className="lg:col-span-1">
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}