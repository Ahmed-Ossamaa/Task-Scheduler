import { ProfileClient } from "@/features/users/components/user-profile";

export const metadata = {
    title: "Team Member | Schedio",
    description: "View your team member profile.",
}
export default async function TeamMemberPage({ params }: { params: { id: string } }) {
  const {id} = await params
  return <ProfileClient userId={id} />;
}
