import { ProjectDetailsClient } from './project-details-client';

export const metadata = {
  title: 'Project Details | Schedio',
  description: 'View and manage project details.',
};

export default function ProjectsPage() {
  return (
    <div>
      <ProjectDetailsClient />
    </div>
  );
}