import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">EX</div>
        <span className="font-display font-bold tracking-tight">EXEC.OS</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-r-border bg-background">
          <Sidebar className="w-full border-none static h-full" />
        </SheetContent>
      </Sheet>
    </div>
  );
}