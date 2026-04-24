import { ProfileClient } from "@/app/profile/profile-client";

export const metadata = {
    title: "Team Member | Task Flow",
    description: "View your team member profile.",
}
export default async function TeamMemberPage({ params }: { params: { id: string } }) {
  const {id} = await params
  return <ProfileClient userId={id} />;
}
