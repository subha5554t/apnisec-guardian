import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { User, Building, Phone, Save } from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', company: '', phone: '' });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user?.id).maybeSingle();
    if (data) setProfile({ full_name: data.full_name || '', company: data.company || '', phone: data.phone || '' });
  };

  const updateProfile = async () => {
    setIsLoading(true);
    const { error } = await supabase.from('profiles').update(profile).eq('user_id', user?.id);
    setIsLoading(false);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Success', description: 'Profile updated successfully' });
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Profile Settings</h1>
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2"><User className="h-4 w-4" />Full Name</label>
              <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2"><Building className="h-4 w-4" />Company</label>
              <Input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} className="bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2"><Phone className="h-4 w-4" />Phone</label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="bg-background" />
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">Email: {user?.email}</p>
              <Button variant="cyber" onClick={updateProfile} disabled={isLoading}><Save className="h-4 w-4" />{isLoading ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
