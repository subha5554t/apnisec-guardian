import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { Plus, Cloud, Target, Shield, Trash2, Edit, Filter } from 'lucide-react';

type IssueType = 'cloud-security' | 'redteam-assessment' | 'vapt';
type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

interface Issue {
  id: string;
  type: IssueType;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  created_at: string;
}

const issueTypeLabels = {
  'cloud-security': { label: 'Cloud Security', icon: Cloud, color: 'bg-blue-500/20 text-blue-400' },
  'redteam-assessment': { label: 'Red Team', icon: Target, color: 'bg-red-500/20 text-red-400' },
  'vapt': { label: 'VAPT', icon: Shield, color: 'bg-green-500/20 text-green-400' },
};

const statusColors = {
  'open': 'bg-yellow-500/20 text-yellow-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  'resolved': 'bg-green-500/20 text-green-400',
  'closed': 'bg-gray-500/20 text-gray-400',
};

const priorityColors = {
  'low': 'bg-gray-500/20 text-gray-400',
  'medium': 'bg-yellow-500/20 text-yellow-400',
  'high': 'bg-orange-500/20 text-orange-400',
  'critical': 'bg-red-500/20 text-red-400',
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [newIssue, setNewIssue] = useState({ title: '', description: '', type: 'cloud-security' as IssueType, priority: 'medium' as IssuePriority });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchIssues();
  }, [user, filterType]);

  const fetchIssues = async () => {
    let query = supabase.from('issues').select('*').order('created_at', { ascending: false });
    if (filterType !== 'all') {
      query = query.eq('type', filterType as IssueType);
    }
    const { data, error } = await query;
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else setIssues((data as Issue[]) || []);
    setIsLoadingIssues(false);
  };

  const createIssue = async () => {
    if (!newIssue.title || !newIssue.description) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('issues').insert({ ...newIssue, user_id: user?.id });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'Success', description: 'Issue created successfully' });
      setNewIssue({ title: '', description: '', type: 'cloud-security', priority: 'medium' });
      setIsDialogOpen(false);
      fetchIssues();
    }
  };

  const deleteIssue = async (id: string) => {
    const { error } = await supabase.from('issues').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'Deleted', description: 'Issue deleted successfully' });
      fetchIssues();
    }
  };

  const updateStatus = async (id: string, status: IssueStatus) => {
    const { error } = await supabase.from('issues').update({ status }).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else fetchIssues();
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
            <p className="text-muted-foreground">Manage your security issues and assessments</p>
          </div>
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-card"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cloud-security">Cloud Security</SelectItem>
                <SelectItem value="redteam-assessment">Red Team</SelectItem>
                <SelectItem value="vapt">VAPT</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild><Button variant="cyber"><Plus className="h-4 w-4" />New Issue</Button></DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle>Create New Issue</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Title" value={newIssue.title} onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })} className="bg-background" />
                  <Textarea placeholder="Description" value={newIssue.description} onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })} className="bg-background" />
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={newIssue.type} onValueChange={(v) => setNewIssue({ ...newIssue, type: v as IssueType })}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cloud-security">Cloud Security</SelectItem>
                        <SelectItem value="redteam-assessment">Red Team</SelectItem>
                        <SelectItem value="vapt">VAPT</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newIssue.priority} onValueChange={(v) => setNewIssue({ ...newIssue, priority: v as IssuePriority })}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="cyber" className="w-full" onClick={createIssue}>Create Issue</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoadingIssues ? (
          <div className="text-center py-12 text-muted-foreground">Loading issues...</div>
        ) : issues.length === 0 ? (
          <Card className="bg-card border-border text-center py-12">
            <CardContent><p className="text-muted-foreground">No issues found. Create your first issue to get started.</p></CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {issues.map((issue) => {
              const TypeIcon = issueTypeLabels[issue.type].icon;
              return (
                <Card key={issue.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-foreground">{issue.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteIssue(issue.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={issueTypeLabels[issue.type].color}><TypeIcon className="h-3 w-3 mr-1" />{issueTypeLabels[issue.type].label}</Badge>
                      <Badge className={priorityColors[issue.priority]}>{issue.priority}</Badge>
                    </div>
                    <Select value={issue.status} onValueChange={(v) => updateStatus(issue.id, v as IssueStatus)}>
                      <SelectTrigger className={`w-32 h-8 text-xs ${statusColors[issue.status]}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
