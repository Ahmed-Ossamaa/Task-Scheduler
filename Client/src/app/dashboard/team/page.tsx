import { MyTeamClient } from './my-team-cleint';

export const metadata = {
  title: 'My Team | Schedio',
  description: 'View your team members.',
};

export default function ProjectsPage() {
  return (
    <div>
      <MyTeamClient />
    </div>
  );
}
