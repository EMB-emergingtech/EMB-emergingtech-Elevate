import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';

export default function PartnerReferrals() {
  const partnerEmail = 'partner@mock.com';
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterAmount, setFilterAmount] = useState('');

  useEffect(() => {
    async function fetchReferrals() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('referrals')
          .select('*')
          .eq('partnerEmail', partnerEmail)
          .order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw error;
        setReferrals(data || []);
      } catch (err) {
        setError('Could not fetch referrals.');
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, [partnerEmail]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await supabase.from('referrals').delete().eq('id', id);
      setReferrals(referrals => referrals.filter(r => r.id !== id));
    } catch {
      setError('Could not delete referral.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReferrals = referrals.filter(r => {
    let dateMatch = true;
    let amountMatch = true;
    if (filterDate) {
      dateMatch = r.created_at && r.created_at.startsWith(filterDate);
    }
    if (filterAmount) {
      amountMatch = r.investment && Number(r.investment) >= Number(filterAmount);
    }
    return dateMatch && amountMatch;
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>My Referrals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} placeholder="Filter by date" />
          <Input type="number" value={filterAmount} onChange={e => setFilterAmount(e.target.value)} placeholder="Min. Investment" />
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Investment</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReferrals.map(ref => (
              <TableRow key={ref.id}>
                <TableCell>{ref.investorEmail}</TableCell>
                <TableCell>{ref.status}</TableCell>
                <TableCell>${ref.investment?.toLocaleString?.() || 0}</TableCell>
                <TableCell>${ref.commission?.toLocaleString?.() || 0}</TableCell>
                <TableCell>{ref.created_at ? format(new Date(ref.created_at), 'yyyy-MM-dd') : ''}</TableCell>
                <TableCell>
                  {ref.status === 'pending' && (
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(ref.id)}>Delete</Button>
                  )}
                  {/* Edit functionality can be added here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredReferrals.length === 0 && !loading && <div className="text-muted-foreground mt-4">No referrals found.</div>}
      </CardContent>
    </Card>
  );
}
