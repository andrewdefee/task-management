import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  // Mock State for UI Prototype
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "John Doe", role: "CEO" },
    { id: 2, name: "Sarah Smith", role: "Legal Counsel" },
    { id: 3, name: "Mike Ross", role: "Associate" },
    { id: 4, name: "Rachel Green", role: "Paralegal" },
  ]);
  
  const [projects, setProjects] = useState([
    "Q3 Financials", "Project Phoenix", "Client Acquisition", "Legal Review", "Board Prep"
  ]);

  const [statuses, setStatuses] = useState(["Todo", "In Progress", "Review", "Completed"]);
  const [priorities, setPriorities] = useState(["Critical", "High", "Medium", "Low"]);

  const [newMember, setNewMember] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");

  const addMember = () => {
    if (newMember && newRole) {
      setTeamMembers([...teamMembers, { id: Date.now(), name: newMember, role: newRole }]);
      setNewMember("");
      setNewRole("");
    }
  };

  const removeMember = (id: number) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

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
                    />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      placeholder="e.g. CFO" 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    />
                  </div>
                  <Button onClick={addMember}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>

                <div className="border border-white/10 rounded-lg divide-y divide-white/10">
                  {teamMembers.map((member) => (
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
                      <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
                    />
                  </div>
                  <Button onClick={() => {
                    if(newProject) { setProjects([...projects, newProject]); setNewProject(""); }
                  }}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {projects.map((p, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {p}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}
                      />
                    </Badge>
                  ))}
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
                    <Input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} placeholder="e.g. Blocked" />
                   </div>
                   <Button onClick={() => {
                     if(newStatus) { setStatuses([...statuses, newStatus]); setNewStatus(""); }
                   }}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>
                 <div className="flex flex-wrap gap-2">
                  {statuses.map((s, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {s}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setStatuses(statuses.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
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
                    <Input value={newPriority} onChange={(e) => setNewPriority(e.target.value)} placeholder="e.g. Urgent" />
                   </div>
                   <Button onClick={() => {
                     if(newPriority) { setPriorities([...priorities, newPriority]); setNewPriority(""); }
                   }}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>
                 <div className="flex flex-wrap gap-2">
                  {priorities.map((p, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {p}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setPriorities(priorities.filter((_, idx) => idx !== i))} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}