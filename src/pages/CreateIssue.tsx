import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { Upload, X, FileText, Image, File, ArrowLeft, Cloud, Target, Shield } from 'lucide-react';

type IssueType = 'cloud-security' | 'redteam-assessment' | 'vapt';
type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

const issueTypeInfo = {
  'cloud-security': { label: 'Cloud Security', icon: Cloud, description: 'Cloud infrastructure security assessments' },
  'redteam-assessment': { label: 'Red Team Assessment', icon: Target, description: 'Adversarial attack simulations' },
  'vapt': { label: 'VAPT', icon: Shield, description: 'Vulnerability Assessment & Penetration Testing' },
};

const CreateIssue = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    type: 'cloud-security' as IssueType,
    priority: 'medium' as IssuePriority,
  });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'Error', description: `${file.name} is too large. Max 10MB per file.`, variant: 'destructive' });
        continue;
      }
      newFiles.push({ name: file.name, size: file.size, type: file.type, file });
    }
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (!user || uploadedFiles.length === 0) return [];

    const urls: string[] = [];
    for (const uploadedFile of uploadedFiles) {
      const filePath = `${user.id}/${Date.now()}-${uploadedFile.name}`;
      const { error } = await supabase.storage
        .from('issue-attachments')
        .upload(filePath, uploadedFile.file);

      if (error) {
        console.error('Upload error:', error);
        toast({ title: 'Upload Error', description: `Failed to upload ${uploadedFile.name}`, variant: 'destructive' });
      } else {
        urls.push(filePath);
      }
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!newIssue.title || !newIssue.description) {
      toast({ title: 'Error', description: 'Please fill in title and description', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      const attachmentUrls = await uploadFiles();

      // Create issue
      const { error } = await supabase.from('issues').insert({
        ...newIssue,
        user_id: user?.id,
        attachments: attachmentUrls,
      });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      // Send email notification
      try {
        await supabase.functions.invoke('send-issue-notification', {
          body: {
            email: user?.email,
            userName: user?.user_metadata?.full_name || user?.email?.split('@')[0],
            issueTitle: newIssue.title,
            issueType: newIssue.type,
            issuePriority: newIssue.priority,
            issueDescription: newIssue.description,
          },
        });
      } catch (emailError) {
        console.error('Failed to send notification:', emailError);
      }

      toast({ title: 'Success', description: 'Issue created successfully!' });
      navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  const TypeIcon = issueTypeInfo[newIssue.type].icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Issue</CardTitle>
            <CardDescription>Submit a security issue or assessment request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Issue Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Issue Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.entries(issueTypeInfo) as [IssueType, typeof issueTypeInfo['cloud-security']][]).map(([key, info]) => {
                  const Icon = info.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewIssue({ ...newIssue, type: key })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        newIssue.type === key
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${newIssue.type === key ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="font-medium text-foreground">{info.label}</div>
                      <div className="text-xs text-muted-foreground">{info.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                placeholder="Brief title describing the issue"
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                className="bg-background"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Detailed description of the issue or assessment request..."
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                className="bg-background min-h-[150px]"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <Select value={newIssue.priority} onValueChange={(v) => setNewIssue({ ...newIssue, priority: v as IssuePriority })}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Can be addressed later</SelectItem>
                  <SelectItem value="medium">Medium - Should be addressed soon</SelectItem>
                  <SelectItem value="high">High - Needs immediate attention</SelectItem>
                  <SelectItem value="critical">Critical - Urgent security risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Attachments</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.zip"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-foreground font-medium">Click to upload files</p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, Images, ZIP (Max 10MB each)</p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="cyber"
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Issue...' : 'Create Issue'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateIssue;
