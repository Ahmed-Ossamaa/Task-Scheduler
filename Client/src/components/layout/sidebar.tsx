'use client';

import { CheckCircle, Settings, LogOut } from 'lucide-react';
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
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MENU_ITEMS } from '@/constants/sidebar-menu-items-constant';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();
  const pathname = usePathname();

  if (!user) return null;

  const filteredItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <Sidebar collapsible="icon">
      {/*Header with Logo */}
      <SidebarHeader className="h-12 flex items-center justify-center border-b border-sidebar-border  px-4">
        <Link
          href="/"
          className="flex items-center gap-2 w-full overflow-hidden"
        >
          {/* Logo (icon for now)*/}
          <CheckCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span className="text-sm font-bold tracking-widest uppercase truncate group-data-[collapsible=icon]:hidden">
            Task<span className="text-primary">Flow</span>
          </span>
        </Link>
      </SidebarHeader>

      {/*Tabs (Menu)*/}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs tracking-widest uppercase mb-5">
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
                  tooltip="Account Settings"
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
                      Account Settings
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
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                  src={user.avatar as string}
                  alt={user.name || 'User'}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                <Link className="text-sm font-medium truncate hover:underline" href="/profile">
                  {user?.name || 'User'}
                </Link>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              disabled={isPending}
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
