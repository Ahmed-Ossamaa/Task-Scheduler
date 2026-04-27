import { ProjectsClient } from './projects-client';

export const metadata = {
  title: 'Projects | Schedio',
  description: 'Manage and view your organization\'s project spaces.',
};

export default function ProjectsPage() {
  return (
    <div>
      <ProjectsClient />
    </div>
  );
}