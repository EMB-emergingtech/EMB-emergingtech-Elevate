import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Mail, Send, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabaseClient';

interface Referral {
  id: string;
  name: string;
  email: string;
  status: string;
  date: string;
  potentialAum?: string;
}

const Referrals = () => {
  const { toast } = useToast();
  const [referralEmail, setReferralEmail] = useState('');
  const [referralName, setReferralName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    if (!useSupabase) {
      setLoading(false);
      setReferrals([
        {
          id: 'REF001',
          name: 'Aarav Patel',
          email: 'aarav@patel.com',
          status: 'Registered',
          date: '2025-07-22'
        },
        {
          id: 'REF002',
          name: 'Priya Singh',
          email: 'priya@singhinv.com',
          status: 'Active',
          date: '2025-04-12',
          potentialAum: '$1.8M'
        },
        {
          id: 'REF003',
          name: 'Vikram Malhotra',
          email: 'vikram@example.com',
          status: 'Invited',
          date: '2025-07-28'
        },
        {
          id: 'REF004',
          name: 'Neha Gupta',
          email: 'neha@guptaholdings.com',
          status: 'Invited',
          date: '2025-07-25'
        }
      ]);
      return;
    }
    setLoading(true);
    supabase
      .from('referrals')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          setReferrals(
            data.map((ref: any) => ({
              id: ref.id,
              name: ref.name,
              email: ref.email,
              status: ref.status,
              date: ref.date,
              potentialAum: ref.potentialAum
            }))
          );
        }
        setLoading(false);
      });
  }, [useSupabase]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://elevatae.com/register?ref=PARTNER123');
    toast.success('Referral link copied to clipboard!');
  };

  const handleSendReferral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Invitation sent to ${referralName} (${referralEmail})`);
      setReferralEmail('');
      setReferralName('');
    }, 1000);
  };

  const handleResendInvitation = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
      case 'Registered':
        return 'status-badge status-badge-approved';
      case 'Invited':
        return 'status-badge status-badge-pending';
      default:
        return 'status-badge';
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Referral Program</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Your Referral Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Total Referrals</p>
                <p className="text-2xl font-semibold mt-1">4</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Converted</p>
                <p className="text-2xl font-semibold mt-1">2</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-2xl font-semibold mt-1">2</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Earnings</p>
                <p className="text-2xl font-semibold mt-1 numeric">$2,100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Share Your Referral Link</CardTitle>
            <CardDescription>
              Earn 0.05% commission on all investments made by your referrals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Input 
                  readOnly 
                  value="https://elevatae.com/register?ref=PARTNER123" 
                  className="pr-10"
                />
                <Button 
                  className="absolute right-1 top-1 h-8 text-xs"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary text-primary hover:bg-primary/5"
                >
                  <Mail className="h-4 w-4 mr-2" /> Email
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Share this link with potential investors. They'll need to use your referral code when registering.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Send Direct Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendReferral} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={referralName}
                  onChange={(e) => setReferralName(e.target.value)}
                  placeholder="Enter recipient's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    Sending... <Send className="ml-2 h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Invitation <Send className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="premium-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Referral Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-2">
              <Switch id="useSupabase" checked={useSupabase} onCheckedChange={setUseSupabase} />
              <label htmlFor="useSupabase" className="text-sm">Use Supabase Data</label>
              {loading && <span className="text-xs text-muted-foreground">Loading referrals...</span>}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Potential AUM</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.name}</TableCell>
                    <TableCell className="font-mono text-xs">{referral.email}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(referral.status)}>
                        {referral.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                    <TableCell>{referral.potentialAum || '-'}</TableCell>
                    <TableCell className="text-right">
                      {referral.status === 'Invited' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleResendInvitation(referral.email)}
                        >
                          Resend
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Referral Program Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">How It Works</h3>
                <p className="text-muted-foreground">
                  Share your unique referral link with potential investors. When they register and make investments through our platform, you earn commission on their investments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Commission Structure</h4>
                <p className="text-sm text-muted-foreground">0.05% on all investments made by your referrals</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Payment Schedule</h4>
                <p className="text-sm text-muted-foreground">Monthly payouts on the 5th of each month</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Duration</h4>
                <p className="text-sm text-muted-foreground">Lifetime commission on all referred investors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Referrals;