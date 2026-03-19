'use client';

import {
  CheckCircle,
  Settings,
  User,
  LogOut,
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
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api/auth-api';
import Link from 'next/link';
import Image from 'next/image';
import { MENU_ITEMS } from '@/constants/sidebar-menu-items-constant';


export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();
  const pathname = usePathname();

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
    <Sidebar collapsible="icon">
      {/*Header with Logo */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border px-4">
        <Link
          href="/"
          className="flex items-center gap-2 w-full overflow-hidden"
        >
          {/* Logo (icon for now)*/}
          <CheckCircle className="h-4 w-4 text-red-800 shrink-0" />
          <span className="text-sm font-bold tracking-widest uppercase truncate group-data-[collapsible=icon]:hidden">
            Task<span className="text-primary">Flow</span>
          </span>
        </Link>
      </SidebarHeader>

      {/*Tabs (Menu)*/}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs tracking-widest uppercase">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive =
                  item.url === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }
                        />
                        <span
                          className={
                            isActive
                              ? 'font-semibold text-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings (at bottom) */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/settings'}
                  tooltip="Settings"
                >
                  <Link href="/dashboard/settings">
                    <Settings
                      className={
                        pathname === '/dashboard/settings'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }
                    />
                    <span
                      className={
                        pathname === '/dashboard/settings'
                          ? 'font-semibold text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      Settings
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer (Profile & Logout ) */}
      <SidebarFooter className="border-t border-sidebar-border py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-1.5 mb-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium truncate">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Log out"
              className="text-destructive! hover:text-destructive! hover:bg-destructive/10!"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Log out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
