import { useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  Edit3,
  Shield,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Utilisateurs",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Entreprises",
    url: "/admin/companies",
    icon: Building2,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Éditeur WYSIWYG",
    url: "/admin/editor",
    icon: Edit3,
  },
  {
    title: "Configuration",
    url: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4">
          {!collapsed && (
            <>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">Admin Predicor</span>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <SidebarContent className="flex-1">
          <div className="p-2">
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </SidebarContent>

        {/* Footer */}
        <div className="border-t p-4 space-y-2">
          {!collapsed && user?.email && (
            <p className="text-xs text-muted-foreground truncate px-2">
              {user.email}
            </p>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!collapsed && "Déconnexion"}
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center space-x-2">
              <Badge variant="destructive" className="text-xs">
                Mode Administration
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}