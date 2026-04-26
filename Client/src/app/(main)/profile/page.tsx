import { ProfileClient } from '../../../features/users/components/user-profile';

export const metadata = {
  title: 'Profile | Task Flow',
  description: 'User profile page.',
};

export default function ProjectsPage() {
  return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 w-full mt-10 mb-10">
        <ProfileClient />
      </div>
  );
}
