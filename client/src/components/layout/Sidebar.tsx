import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Briefcase,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: CheckSquare, label: "My Tasks", href: "/my-tasks" },
    { icon: Users, label: "Delegation", href: "/delegation" },
    { icon: BarChart3, label: "Reports", href: "/reports" },
    { icon: Briefcase, label: "Projects", href: "/projects" },
  ];

  return (
    <div className={cn("pb-12 w-64 border-r bg-sidebar/50 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-20", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-6 py-2">
          <h2 className="mb-2 px-2 text-lg font-display font-bold tracking-tight text-sidebar-primary-foreground flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">EX</div>
            EXEC.OS
          </h2>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start font-medium transition-all duration-200",
                    location === item.href 
                      ? "bg-sidebar-primary/10 text-sidebar-primary-foreground border-l-2 border-sidebar-primary rounded-l-none" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-3 py-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-white/5 border border-white/5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground truncate mt-1">CEO</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}