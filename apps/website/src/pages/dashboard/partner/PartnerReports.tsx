import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';

function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  const csvRows = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ];
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PartnerReports() {
  const partnerEmail = 'partner@mock.com';
  const [referrals, setReferrals] = useState<any[]>([]);
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
          .eq('partnerEmail', partnerEmail)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setReferrals(data || []);
      } catch (err) {
        setError('Could not fetch report data.');
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, [partnerEmail]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Referral Performance Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Button onClick={() => exportToCSV(referrals, 'referral_report.csv')}>Export CSV</Button>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map(ref => (
              <TableRow key={ref.id}>
                <TableCell>{ref.investorEmail}</TableCell>
                <TableCell>{ref.status}</TableCell>
                <TableCell>${ref.investment?.toLocaleString?.() || 0}</TableCell>
                <TableCell>${ref.commission?.toLocaleString?.() || 0}</TableCell>
                <TableCell>{ref.created_at ? format(new Date(ref.created_at), 'yyyy-MM-dd') : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {referrals.length === 0 && !loading && <div className="text-muted-foreground mt-4">No data found.</div>}
      </CardContent>
    </Card>
  );
}
