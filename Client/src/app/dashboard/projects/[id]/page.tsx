import { ProjectDetailsClient } from './project-details-client';

export const metadata = {
  title: 'Project Details | Task Flow',
  description: 'View and manage project details.',
};

export default function ProjectsPage() {
  return (
    <div>
      <ProjectDetailsClient />
    </div>
  );
}