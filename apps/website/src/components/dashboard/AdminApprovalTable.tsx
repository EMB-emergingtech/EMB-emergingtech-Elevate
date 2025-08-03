import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AdminApprovalTableProps {
  table: 'referrals' | 'investments';
  columns: { key: string; label: string }[];
  statusField?: string;
}

export default function AdminApprovalTable({ table, columns, statusField = 'status' }: AdminApprovalTableProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSupabase, setUseSupabase] = useState(true);

  // Mock data for each table
  const mockData: Record<string, any[]> = {
    referrals: [
      { id: 'ref1', name: 'John Doe', email: 'john@example.com', status: 'pending', created_at: '2025-08-01' },
      { id: 'ref2', name: 'Jane Smith', email: 'jane@example.com', status: 'pending', created_at: '2025-08-02' }
    ],
    investments: [
      { id: 'inv1', product: 'Bond A', amount: 10000, status: 'pending', created_at: '2025-08-01' },
      { id: 'inv2', product: 'ICD B', amount: 20000, status: 'pending', created_at: '2025-08-02' }
    ]
  };

  useEffect(() => {
    if (!useSupabase) {
      setItems(mockData[table] || []);
      setLoading(false);
      setError(null);
      return;
    }
    async function fetchItems() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq(statusField, 'pending')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        setError('Could not fetch data.');
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [table, statusField, useSupabase]);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await supabase.from(table).update({ [statusField]: action }).eq('id', id);
      setItems(items => items.filter(item => item.id !== id));
    } catch (err) {
      setError('Could not update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Switch id="useSupabase" checked={useSupabase} onCheckedChange={setUseSupabase} />
          <Label htmlFor="useSupabase">Use Supabase Data</Label>
          {loading && <span className="text-xs text-muted-foreground">Loading...</span>}
        </div>
        <CardTitle>Pending {table.replace('_', ' ').toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                {columns.map(col => (
                  <TableCell key={col.key}>{item[col.key]}</TableCell>
                ))}
                <TableCell>
                  <Button size="sm" className="mr-2" onClick={() => handleAction(item.id, 'approved')}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction(item.id, 'rejected')}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 && !loading && <div className="text-muted-foreground mt-4">No pending items.</div>}
      </CardContent>
    </Card>
  );
}
