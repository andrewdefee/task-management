import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import AllTasks from "@/pages/AllTasks";
import MyTasks from "@/pages/MyTasks";
import Delegation from "@/pages/Delegation";
import Settings from "@/pages/Settings";
import CreateTask from "@/pages/CreateTask";
import Reports from "@/pages/Reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/all-tasks" component={AllTasks} />
      <Route path="/my-tasks" component={MyTasks} />
      <Route path="/delegation" component={Delegation} />
      <Route path="/settings" component={Settings} />
      <Route path="/create-task" component={CreateTask} />
      <Route path="/reports" component={Reports} />
      
      {/* Fallbacks */}
      <Route path="/projects" component={Dashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
