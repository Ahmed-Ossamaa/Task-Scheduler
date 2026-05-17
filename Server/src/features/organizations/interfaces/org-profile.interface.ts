export interface OrgProfile {
  id: string;
  name: string;
  industry: string | null;
  slogan: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  logo: string | null;
  cover: string | null;
  createdAt: Date;
  employeeCount: string | number;
  projectCount: string | number;
}
