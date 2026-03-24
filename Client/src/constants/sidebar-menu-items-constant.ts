import { UserRoles } from '@/features/auth/types/user-interface';
import { MenuItem } from '@/types/sidebar-menu-items';
import {
  Home,
  CheckCircle,
  FolderKanban,
  Users,
  User,
  Building2,
  BarChart3,
} from 'lucide-react';


export const MENU_ITEMS: MenuItem[] = [
  // Shared
  {
    title: 'Overview',
    url: '/dashboard',
    icon: Home,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMP],
  },
  {
    title: 'Tasks',
    url: '/dashboard/tasks',
    icon: CheckCircle,
    roles: [UserRoles.MANAGER, UserRoles.EMP],
  },
  {
    title: 'Projects',
    url: '/dashboard/projects',
    icon: FolderKanban,
    roles: [UserRoles.MANAGER, UserRoles.EMP],
  },

  // Manager Exclusive
  {
    title: 'Team Directory',
    url: '/dashboard/team',
    icon: Users,
    roles: [UserRoles.MANAGER],
  },

  // Admin Exclusive
  {
    title: 'All Users',
    url: '/dashboard/admin/users',
    icon: User,
    roles: [UserRoles.ADMIN],
  },
  {
    title: 'Organizations',
    url: '/dashboard/admin/organizations',
    icon: Building2,
    roles: [UserRoles.ADMIN],
  },
  {
    title: 'All Tasks',
    url: '/dashboard/admin/tasks',
    icon: CheckCircle,
    roles: [UserRoles.ADMIN],
  },
  {
    title: 'Analytics',
    url: '/dashboard/admin/analytics',
    icon: BarChart3,
    roles: [UserRoles.ADMIN],
  },
];