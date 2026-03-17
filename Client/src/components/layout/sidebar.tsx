'use client';

import {
 CalendarPlus,
  Home,
  Inbox,
  Settings,
  Users,
  ChartNoAxesCombined,
  // Briefcase,
  User,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useRouter } from 'next/navigation';
import { UserRoles } from '@/features/auth/types/user-interface';
import { authApi } from '@/features/auth/api/auth-api';

// Menu items.
type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: UserRoles[];
};
const MENU_ITEMS: MenuItem[] = [
  //Shared Items
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMP],
  },
  {
    title: 'My Tasks',
    url: '/dashboard/tasks',
    icon: Inbox,
    roles: [UserRoles.MANAGER, UserRoles.EMP],
  },
  {
    title: 'Projects',
    url: '/dashboard/projects',
    icon: Inbox,
    roles: [UserRoles.MANAGER, UserRoles.EMP],
  },


  //Manager Only Items
  {
    title: 'Team Overview',
    url: '/dashboard/team',
    icon: Users,
    roles: [ UserRoles.MANAGER], 
  },
    {
    title: 'Create Task',
    url: '/dashboard/tasks/create',
    icon: CalendarPlus,
    roles: [UserRoles.MANAGER],
  },

  {
    title: 'Users',
    url: '/dashboard/admin/users',
    icon: User,
    roles: [UserRoles.ADMIN],
  },
  {
    title: 'Organizations',
    url: '/dashboard/admin/organizations',
    icon: Users,
    roles: [UserRoles.ADMIN],
  },
  {
    title: 'Tasks',
    url: '/dashboard/admin/tasks',
    icon: Inbox,
    roles: [UserRoles.ADMIN],
  },
  {
    title: 'Analytics',
    url: '/dashboard/admin/analytics',
    icon: ChartNoAxesCombined,  
    roles: [UserRoles.ADMIN],
  },

  //Common Footer Items
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    roles: [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.EMP],
  },
];

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();
  if (!user) return null;
  const filteredItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(user.role),
  );

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Task Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold">{user?.name || 'User'}</span>
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
