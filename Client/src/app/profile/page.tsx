import { ProfileClient } from './profile-client';

export const metadata = {
  title: 'Profile | Task Flow',
  description: 'User profile page.',
};

export default function ProjectsPage() {
  return (
    <div>
      <ProfileClient />
    </div>
  );
}
