import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Mail, User, ShieldCheck, Phone, MessageCircle } from 'lucide-react';

const mockRM = {
  name: 'Priya Sharma',
  email: 'priya.sharma@elevatewealth.com',
  phone: '+91-9876543210',
};

export default function ProfileSupport() {
  // Replace with actual logged-in user email in production
  const userEmail = 'investor@company.com';
  const [profile, setProfile] = useState({
    name: 'Corporate Investor A',
    email: userEmail,
    altEmail: '',
    kycStatus: 'Unknown',
    kycDoc: '',
  });
  const [kycLoading, setKycLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  // Fetch profile from Supabase
  useEffect(() => {
    async function fetchProfile() {
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          .from('invites')
          .select('email, status, accepted_at')
          .eq('email', userEmail)
          .single();
        if (data) {
          setProfile(p => ({
            ...p,
            email: data.email,
            kycStatus: data.status === 'accepted' ? 'Verified' : data.status,
          }));
        }
      } catch (err) {
        // fallback to mock
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [userEmail]);

  // Update profile in Supabase
  const handleProfileUpdate = async () => {
    setProfileLoading(true);
    try {
      await supabase
        .from('invites')
        .update({ email: profile.email })
        .eq('email', userEmail);
      // Optionally update altEmail in another table/field
    } catch (err) {
      // fallback to mock
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit KYC (mock upload)
  const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKycLoading(true);
    try {
      await supabase.from('investors').insert([
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          status: 'Pending'
        }
      ]);
      setProfile(p => ({ ...p, kycStatus: 'pending' }));
    } catch (err) {
      // fallback to mock
    } finally {
      setKycLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle><User className="inline mr-2" />Profile & KYC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} disabled={profileLoading} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Primary Email</label>
              <Input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} disabled={profileLoading} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alternate Email</label>
              <Input value={profile.altEmail} onChange={e => setProfile(p => ({ ...p, altEmail: e.target.value }))} placeholder="Optional" disabled={profileLoading} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">KYC Status</label>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700">{kycLoading ? 'Loading...' : profile.kycStatus}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">KYC Document (mock upload)</label>
              <Input type="file" onChange={handleKycUpload} disabled={kycLoading} />
            </div>
          </div>
          <Button className="mt-2" onClick={handleProfileUpdate} disabled={profileLoading}>Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle><Mail className="inline mr-2" />Contact & Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Alert>
            <AlertTitle>Email Notifications</AlertTitle>
            <AlertDescription>
              You will receive email notifications for all major status updates (investment actions, approvals, payouts, and KYC changes) at your registered email(s).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle><Phone className="inline mr-2" />Relationship Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div><span className="font-medium">Name:</span> {mockRM.name}</div>
            <div><span className="font-medium">Email:</span> <a href={`mailto:${mockRM.email}`} className="text-primary underline">{mockRM.email}</a></div>
            <div><span className="font-medium">Phone:</span> <a href={`tel:${mockRM.phone}`} className="text-primary underline">{mockRM.phone}</a></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle><MessageCircle className="inline mr-2" />Support</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); setSupportSent(true); setSupportMsg(''); }} className="space-y-3">
            <Textarea
              placeholder="Describe your issue or request. Your Relationship Manager will respond by email."
              value={supportMsg}
              onChange={e => setSupportMsg(e.target.value)}
              rows={4}
              required
            />
            <Button type="submit">Send to Relationship Manager</Button>
            {supportSent && <div className="text-green-600 text-sm mt-2">Your message has been sent to your Relationship Manager.</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
