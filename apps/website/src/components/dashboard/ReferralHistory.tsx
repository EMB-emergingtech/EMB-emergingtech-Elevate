import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';

// Mock referral data
const mockReferrals = [
  {
    id: 1,
    name: 'Amit Verma',
    pan: 'ABCDE1234F',
    contact: '+91-9000000001',
    email: 'amit.verma@example.com',
    product: 'ICD',
    date: '2025-07-30',
    status: 'Pending Admin Review',
  },
  {
    id: 2,
    name: 'Riya Singh',
    pan: 'XYZAB9876K',
    contact: '+91-9000000002',
    email: 'riya.singh@example.com',
    product: 'Bond',
    date: '2025-07-28',
    status: 'Invitation Sent',
  },
  {
    id: 3,
    name: 'Suresh Kumar',
    pan: 'LMNOP5432Q',
    contact: '+91-9000000003',
    email: 'suresh.kumar@example.com',
    product: 'REIT',
    date: '2025-07-25',
    status: 'Rejected',
  },
  {
    id: 4,
    name: 'Priya Mehta',
    pan: 'QWERT1234Z',
    contact: '+91-9000000004',
    email: 'priya.mehta@example.com',
    product: 'ICD',
    date: '2025-07-20',
    status: 'Already Exists',
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'Pending Admin Review':
      return 'bg-yellow-100 text-yellow-800';
    case 'Invitation Sent':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Already Exists':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ReferralHistory() {
  const [referrals, setReferrals] = useState(mockReferrals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReferrals() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setReferrals(data);
        } else {
          setReferrals(mockReferrals);
        }
      } catch (err) {
        setError('Could not fetch referrals from backend. Showing mock data.');
        setReferrals(mockReferrals);
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, []);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Referral Status & History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-muted-foreground mb-4">Loading referrals...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map(ref => (
              <TableRow key={ref.id}>
                <TableCell>{ref.name}</TableCell>
                <TableCell>{ref.pan}</TableCell>
                <TableCell>{ref.contact}</TableCell>
                <TableCell>{ref.email}</TableCell>
                <TableCell>{ref.product}</TableCell>
                <TableCell>{ref.date ? format(new Date(ref.date), 'dd MMM yyyy') : ''}</TableCell>
                <TableCell>
                  <Badge className={statusColor(ref.status)}>{ref.status}</Badge>
                </TableCell>
                <TableCell>
                  {ref.status === 'Pending Admin Review' && (
                    <Button size="sm" variant="outline">Cancel</Button>
                  )}
                  {ref.status === 'Invitation Sent' && (
                    <Button size="sm" variant="outline">Resend</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
