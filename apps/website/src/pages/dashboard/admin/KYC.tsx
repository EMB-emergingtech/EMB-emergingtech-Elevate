import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';

interface KYCUser {
  id: string;
  name: string;
  email: string;
  role: string;
  kycStatus: 'Pending' | 'Submitted' | 'Approved' | 'Rejected';
  kycSubmittedAt?: string;
}

const mockKYCUsers: KYCUser[] = [
  { id: 'USR006', name: 'Anita Desai', email: 'anita@desai.com', role: 'Investor', kycStatus: 'Submitted', kycSubmittedAt: '2025-07-26' },
  { id: 'USR007', name: 'Michael Wong', email: 'michael@wonginv.com', role: 'Investor', kycStatus: 'Submitted', kycSubmittedAt: '2025-07-10' },
  { id: 'partner-001', name: 'Wealth Partner One', email: 'partner@elevatae.com', role: 'Wealth Partner', kycStatus: 'Pending' },
];

const AdminKYC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<KYCUser[]>(mockKYCUsers);
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(true);

  useEffect(() => {
    if (!useSupabase) {
      setUsers(mockKYCUsers);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('kyc_users')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          setUsers(
            data.map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              kycStatus: user.kycStatus,
              kycSubmittedAt: user.kycSubmittedAt
            }))
          );
        }
        setLoading(false);
      });
  }, [useSupabase]);

  const handleKYCAction = (id: string, action: 'approve' | 'reject') => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, kycStatus: action === 'approve' ? 'Approved' : 'Rejected' } : user
    ));
    toast.success(`KYC ${action === 'approve' ? 'approved' : 'rejected'} for user ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Switch id="useSupabase" checked={useSupabase} onCheckedChange={setUseSupabase} />
        <Label htmlFor="useSupabase">Use Supabase Data</Label>
        {loading && <span className="text-xs text-muted-foreground">Loading KYC users...</span>}
      </div>
      <h1 className="text-2xl font-semibold">KYC Tracking</h1>
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>KYC Status of Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.kycStatus}</TableCell>
                  <TableCell>{user.kycSubmittedAt || '-'}</TableCell>
                  <TableCell className="text-right">
                    {user.kycStatus === 'Submitted' && (
                      <>
                        <Button size="sm" className="mr-2" onClick={() => handleKYCAction(user.id, 'approve')}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => handleKYCAction(user.id, 'reject')}>Reject</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminKYC;
