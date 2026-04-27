import { MyTasksClient } from './my-tasks-client';

export const metadata = {
  title: 'My Tasks | Schedio',
  description: 'View and manage your tasks.',
};

export default function ProjectsPage() {
  return (
    <div>
      <MyTasksClient />
    </div>
  );
}
