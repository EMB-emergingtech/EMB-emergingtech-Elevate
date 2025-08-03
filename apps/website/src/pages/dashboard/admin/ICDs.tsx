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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import ConfirmationDialog from '@/components/dashboard/ConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ICD {
  id: string;
  investor: string;
  amount: number;
  interestRate: number;
  tenure: number;
  maturityDate: string;
  status: string;
  dateRequested: string;
}

const ICDs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] = useState<{
    title: string;
    description: string;
    action: 'approve' | 'reject';
    icdId: string;
  }>({
    title: '',
    description: '',
    action: 'approve',
    icdId: ''
  });
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(true);

  const [icds, setIcds] = useState<ICD[]>([
    {
      id: 'ICD001',
      investor: 'Corporate Investor A',
      amount: 2000000,
      interestRate: 8.75,
      tenure: 90,
      maturityDate: '2025-10-28',
      status: 'Active',
      dateRequested: '2025-07-15'
    },
    {
      id: 'ICD002',
      investor: 'Corporate Investor B',
      amount: 1500000,
      interestRate: 8.50,
      tenure: 180,
      maturityDate: '2026-01-26',
      status: 'Active',
      dateRequested: '2025-07-18'
    },
    {
      id: 'ICD003',
      investor: 'Corporate Investor A',
      amount: 500000,
      interestRate: 8.25,
      tenure: 60,
      maturityDate: '2025-09-28',
      status: 'Active',
      dateRequested: '2025-07-20'
    },
    {
      id: 'ICD004',
      investor: 'Priya Singh',
      amount: 750000,
      interestRate: 8.00,
      tenure: 30,
      maturityDate: '2025-08-06',
      status: 'Pending Approval',
      dateRequested: '2025-07-26'
    },
    {
      id: 'ICD005',
      investor: 'Corporate Investor A',
      amount: 500000,
      interestRate: 8.25,
      tenure: 90,
      maturityDate: '2025-10-29',
      status: 'Pending Approval',
      dateRequested: '2025-07-29'
    },
    {
      id: 'ICD006',
      investor: 'Corporate Investor B',
      amount: 750000,
      interestRate: 8.50,
      tenure: 180,
      maturityDate: '2026-01-27',
      status: 'Pending Approval',
      dateRequested: '2025-07-27'
    },
    {
      id: 'ICD007',
      investor: 'John Henderson',
      amount: 300000,
      interestRate: 7.75,
      tenure: 30,
      maturityDate: '2025-05-30',
      status: 'Matured',
      dateRequested: '2025-04-30'
    },
    {
      id: 'ICD008',
      investor: 'Corporate Investor A',
      amount: 1000000,
      interestRate: 7.75,
      tenure: 90,
      maturityDate: '2025-07-01',
      status: 'Matured',
      dateRequested: '2025-04-01'
    }
  ]);

  useEffect(() => {
    if (!useSupabase) return;
    setLoading(true);
    supabase
      .from('icds')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setIcds(
            data.map((icd: any) => ({
              id: icd.id,
              investor: icd.investor,
              amount: icd.amount,
              interestRate: icd.interestRate,
              tenure: icd.tenure,
              maturityDate: icd.maturityDate,
              status: icd.status,
              dateRequested: icd.dateRequested
            }))
          );
        }
        setLoading(false);
      });
  }, [useSupabase]);

  const handleAction = (action: 'approve' | 'reject', icd: ICD) => {
    setConfirmDialogProps({
      title: `${action === 'approve' ? 'Approve' : 'Reject'} ICD Request`,
      description: `Are you sure you want to ${action} ICD request #${icd.id} for $${icd.amount.toLocaleString()} from ${icd.investor}?`,
      action,
      icdId: icd.id
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    const { action, icdId } = confirmDialogProps;
    
    // Update the ICD status
    setIcds(icds.map(icd => {
      if (icd.id === icdId) {
        return {
          ...icd,
          status: action === 'approve' ? 'Active' : 'Rejected'
        };
      }
      return icd;
    }));
    
    // Show success toast
    toast.success(`ICD request #${icdId} ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    
    setConfirmDialogOpen(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
      case 'Pending Approval':
        return 'status-badge status-badge-pending';
      case 'Matured':
        return 'status-badge status-badge-approved';
      case 'Rejected':
        return 'status-badge status-badge-rejected';
      default:
        return 'status-badge';
    }
  };

  const filteredIcds = icds.filter(icd => {
    const matchesSearch = 
      icd.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      icd.investor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || icd.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex items-center gap-4 mb-2">
        <Switch id="useSupabase" checked={useSupabase} onCheckedChange={setUseSupabase} />
        <Label htmlFor="useSupabase">Use Supabase Data</Label>
        {loading && <span className="text-xs text-muted-foreground">Loading ICDs...</span>}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">ICD Requests</h1>
      </div>

      <Card className="premium-card mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID or investor..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filter by Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Matured">Matured</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>ICD Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Investor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Interest Rate</TableHead>
                <TableHead className="text-center">Tenure</TableHead>
                <TableHead>Maturity Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIcds.length > 0 ? (
                filteredIcds.map((icd) => (
                  <TableRow key={icd.id}>
                    <TableCell className="font-mono">{icd.id}</TableCell>
                    <TableCell>{icd.investor}</TableCell>
                    <TableCell className="text-right font-mono">${icd.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center font-mono">{icd.interestRate}%</TableCell>
                    <TableCell className="text-center">{icd.tenure} days</TableCell>
                    <TableCell>{new Date(icd.maturityDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(icd.status)}>
                        {icd.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {icd.status === 'Pending Approval' ? (
                          <>
                            <Button 
                              size="sm" 
                              className="h-8 bg-[hsl(130,80%,94%)] hover:bg-[hsl(130,80%,90%)] text-[hsl(130,60%,30%)]"
                              onClick={() => handleAction('approve', icd)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => handleAction('reject', icd)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="mb-1">No ICD requests found</p>
                      <p className="text-sm">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try changing your search or filter criteria' 
                          : 'ICD requests will appear here once submitted'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog 
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmDialogProps.title}
        description={confirmDialogProps.description}
        confirmText={confirmDialogProps.action === 'approve' ? 'Approve' : 'Reject'}
        variant={confirmDialogProps.action === 'reject' ? 'destructive' : 'default'}
      />
    </>
  );
};

export default ICDs;