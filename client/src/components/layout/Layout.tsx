import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed left-0 top-0 h-screen z-20">
        <Sidebar className="w-full h-full" />
      </div>

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen w-full">
        <div className="h-full px-4 py-4 md:px-8 md:py-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}