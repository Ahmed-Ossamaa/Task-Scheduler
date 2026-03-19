import { UserRoles } from "@/features/auth/types/user-interface";
import { LucideIcon } from "lucide-react";

export type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: UserRoles[];
};