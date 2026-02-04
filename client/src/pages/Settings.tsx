import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  useTeamMembers,
  useProjects,
  useStatuses,
  usePriorities,
  useCreateTeamMember,
  useDeleteTeamMember,
  useCreateProject,
  useDeleteProject,
  useCreateStatus,
  useDeleteStatus,
  useCreatePriority,
  useDeletePriority,
} from "@/lib/queries";

export default function Settings() {
  const { toast } = useToast();
  
  const { data: teamMembers, isLoading: teamMembersLoading } = useTeamMembers();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: statuses, isLoading: statusesLoading } = useStatuses();
  const { data: priorities, isLoading: prioritiesLoading } = usePriorities();

  const createTeamMember = useCreateTeamMember();
  const deleteTeamMember = useDeleteTeamMember();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const createStatus = useCreateStatus();
  const deleteStatus = useDeleteStatus();
  const createPriority = useCreatePriority();
  const deletePriority = useDeletePriority();

  const [newMember, setNewMember] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");

  const handleAddMember = async () => {
    if (newMember && newRole) {
      try {
        await createTeamMember.mutateAsync({ name: newMember, role: newRole });
        setNewMember("");
        setNewRole("");
        toast({ title: "Team member added", description: `${newMember} has been added to the team.` });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add team member.", variant: "destructive" });
      }
    }
  };

  const handleRemoveMember = async (id: number, name: string) => {
    try {
      await deleteTeamMember.mutateAsync(id);
      toast({ title: "Team member removed", description: `${name} has been removed from the team.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove team member. They may have tasks assigned.", variant: "destructive" });
    }
  };

  const handleAddProject = async () => {
    if (newProject) {
      try {
        await createProject.mutateAsync({ name: newProject });
        setNewProject("");
        toast({ title: "Project added", description: `${newProject} has been created.` });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add project. It may already exist.", variant: "destructive" });
      }
    }
  };

  const handleRemoveProject = async (id: number, name: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast({ title: "Project removed", description: `${name} has been removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove project. It may have tasks assigned.", variant: "destructive" });
    }
  };

  const handleAddStatus = async () => {
    if (newStatus) {
      try {
        const maxOrder = statuses ? Math.max(...statuses.map(s => s.order), 0) : 0;
        await createStatus.mutateAsync({ name: newStatus, order: maxOrder + 1 });
        setNewStatus("");
        toast({ title: "Status added", description: `${newStatus} status has been created.` });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add status. It may already exist.", variant: "destructive" });
      }
    }
  };

  const handleRemoveStatus = async (id: number, name: string) => {
    try {
      await deleteStatus.mutateAsync(id);
      toast({ title: "Status removed", description: `${name} has been removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove status. It may have tasks assigned.", variant: "destructive" });
    }
  };

  const handleAddPriority = async () => {
    if (newPriority) {
      try {
        const maxOrder = priorities ? Math.max(...priorities.map(p => p.order), 0) : 0;
        await createPriority.mutateAsync({ name: newPriority, order: maxOrder + 1 });
        setNewPriority("");
        toast({ title: "Priority added", description: `${newPriority} priority has been created.` });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add priority. It may already exist.", variant: "destructive" });
      }
    }
  };

  const handleRemovePriority = async (id: number, name: string) => {
    try {
      await deletePriority.mutateAsync(id);
      toast({ title: "Priority removed", description: `${name} has been removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove priority. It may have tasks assigned.", variant: "destructive" });
    }
  };

  const isLoading = teamMembersLoading || projectsLoading || statusesLoading || prioritiesLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">Settings</h1>
          <p className="text-muted-foreground">Manage your organization's configuration.</p>
        </div>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="statuses">Statuses</TabsTrigger>
            <TabsTrigger value="priorities">Priorities</TabsTrigger>
          </TabsList>
          
          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team members for delegation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-end">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Jane Doe" 
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      data-testid="input-member-name"
                    />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      placeholder="e.g. CFO" 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      data-testid="input-member-role"
                    />
                  </div>
                  <Button 
                    onClick={handleAddMember} 
                    disabled={createTeamMember.isPending || !newMember || !newRole}
                    data-testid="button-add-member"
                  >
                    {createTeamMember.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add
                  </Button>
                </div>

                <div className="border border-white/10 rounded-lg divide-y divide-white/10">
                  {teamMembers?.map((member) => (
                    <div key={member.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveMember(member.id, member.name)} 
                        className="text-muted-foreground hover:text-destructive"
                        data-testid={`button-delete-member-${member.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(!teamMembers || teamMembers.length === 0) && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No team members yet. Add one above.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Define project buckets for tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-end">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="project">Project Name</Label>
                    <Input 
                      id="project" 
                      placeholder="e.g. Q4 Strategy" 
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      data-testid="input-project-name"
                    />
                  </div>
                  <Button 
                    onClick={handleAddProject}
                    disabled={createProject.isPending || !newProject}
                    data-testid="button-add-project"
                  >
                    {createProject.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {projects?.map((p) => (
                    <Badge key={p.id} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {p.name}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemoveProject(p.id, p.name)}
                        data-testid={`button-delete-project-${p.id}`}
                      />
                    </Badge>
                  ))}
                  {(!projects || projects.length === 0) && (
                    <span className="text-muted-foreground text-sm">No projects yet. Add one above.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Statuses Tab */}
          <TabsContent value="statuses" className="space-y-4 mt-6">
             <Card>
              <CardHeader>
                <CardTitle>Task Statuses</CardTitle>
                <CardDescription>Workflow stages for tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-end">
                   <div className="grid gap-2 flex-1">
                    <Label>New Status</Label>
                    <Input 
                      value={newStatus} 
                      onChange={(e) => setNewStatus(e.target.value)} 
                      placeholder="e.g. On Hold" 
                      data-testid="input-status-name"
                    />
                   </div>
                   <Button 
                     onClick={handleAddStatus}
                     disabled={createStatus.isPending || !newStatus}
                     data-testid="button-add-status"
                   >
                     {createStatus.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                     Add
                   </Button>
                </div>
                 <div className="flex flex-wrap gap-2">
                  {statuses?.map((s) => (
                    <Badge key={s.id} variant="outline" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {s.name}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemoveStatus(s.id, s.name)} 
                        data-testid={`button-delete-status-${s.id}`}
                      />
                    </Badge>
                  ))}
                  {(!statuses || statuses.length === 0) && (
                    <span className="text-muted-foreground text-sm">No statuses yet. Add one above.</span>
                  )}
                </div>
              </CardContent>
             </Card>
          </TabsContent>

          {/* Priorities Tab */}
          <TabsContent value="priorities" className="space-y-4 mt-6">
             <Card>
              <CardHeader>
                <CardTitle>Priority Levels</CardTitle>
                <CardDescription>Urgency levels for tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-end">
                   <div className="grid gap-2 flex-1">
                    <Label>New Priority</Label>
                    <Input 
                      value={newPriority} 
                      onChange={(e) => setNewPriority(e.target.value)} 
                      placeholder="e.g. Urgent" 
                      data-testid="input-priority-name"
                    />
                   </div>
                   <Button 
                     onClick={handleAddPriority}
                     disabled={createPriority.isPending || !newPriority}
                     data-testid="button-add-priority"
                   >
                     {createPriority.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                     Add
                   </Button>
                </div>
                 <div className="flex flex-wrap gap-2">
                  {priorities?.map((p) => (
                    <Badge key={p.id} variant="outline" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {p.name}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemovePriority(p.id, p.name)} 
                        data-testid={`button-delete-priority-${p.id}`}
                      />
                    </Badge>
                  ))}
                  {(!priorities || priorities.length === 0) && (
                    <span className="text-muted-foreground text-sm">No priorities yet. Add one above.</span>
                  )}
                </div>
              </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
