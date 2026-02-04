import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "warning" | "success" | "info";
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue, 
  variant = "default",
  className 
}: StatCardProps) {
  
  const variantStyles = {
    default: "bg-card border-border",
    warning: "bg-amber-950/10 border-amber-900/30",
    success: "bg-emerald-950/10 border-emerald-900/30",
    info: "bg-blue-950/10 border-blue-900/30"
  };

  const iconColors = {
    default: "text-muted-foreground",
    warning: "text-amber-500",
    success: "text-emerald-500",
    info: "text-blue-500"
  };

  return (
    <Card className={cn("backdrop-blur-sm shadow-lg transition-all hover:shadow-xl", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", iconColors[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display tracking-tight text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && trendValue && (
          <div className={cn("flex items-center text-xs mt-2", 
            trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground"
          )}>
            <span className="font-medium">{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}</span>
            <span className="text-muted-foreground ml-1">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}