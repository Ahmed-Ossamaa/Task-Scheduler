import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* Header */}
        <div className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <span className="font-semibold">Dashboard</span>
        </div>
        
        {/* Main Page Content */}
        <div className="p-6">
            {children}
        </div>
      </main>
    </SidebarProvider>
  )
}