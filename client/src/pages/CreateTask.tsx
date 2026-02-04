import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useTeamMembers, useProjects, useStatuses, usePriorities, useCreateTask } from "@/lib/queries";

export default function CreateTask() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  
  const { data: teamMembers, isLoading: teamMembersLoading } = useTeamMembers();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: priorities, isLoading: prioritiesLoading } = usePriorities();
  const createTask = useCreateTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    statusId: "",
    priorityId: "",
    assigneeId: "",
  });

  const isLoading = teamMembersLoading || projectsLoading || statusesLoading || prioritiesLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId || !formData.statusId || !formData.priorityId || !formData.assigneeId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description || null,
        projectId: parseInt(formData.projectId),
        statusId: parseInt(formData.statusId),
        priorityId: parseInt(formData.priorityId),
        assigneeId: parseInt(formData.assigneeId),
        dueDate: date ? date.toISOString() : undefined,
      });

      toast({
        title: "Task Created",
        description: "The task has been successfully added to the board.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading form data...</div>
        </div>
      </Layout>
    );
  }

  const defaultStatusId = statuses?.find((s) => s.name === "Todo")?.id.toString() || "";

  return (
    <Layout>
       <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">Create Task</h1>
          <p className="text-muted-foreground">Add a new item to the tracking system.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter task title" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  data-testid="input-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label>Project</Label>
                  <Select 
                    value={formData.projectId} 
                    onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                  >
                    <SelectTrigger data-testid="select-project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.statusId || defaultStatusId} 
                    onValueChange={(value) => setFormData({ ...formData, statusId: value })}
                  >
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses?.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={formData.priorityId} 
                    onValueChange={(value) => setFormData({ ...formData, priorityId: value })}
                  >
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities?.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id.toString()}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select 
                    value={formData.assigneeId} 
                    onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}
                  >
                    <SelectTrigger data-testid="select-assignee">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers?.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

               <div className="space-y-2 flex flex-col">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        data-testid="button-due-date"
                        type="button"
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  placeholder="Enter task details..." 
                  className="min-h-[100px]" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="textarea-description"
                />
              </div>

            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" type="button" onClick={() => setLocation("/")}>Cancel</Button>
              <Button type="submit" disabled={createTask.isPending} data-testid="button-create-task">
                <Save className="mr-2 h-4 w-4" /> {createTask.isPending ? "Creating..." : "Create Task"}
              </Button>
            </CardFooter>
          </form>
        </Card>
       </div>
    </Layout>
  );
}
