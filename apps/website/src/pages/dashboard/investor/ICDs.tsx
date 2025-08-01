import { useState } from 'react';
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
import { Eye, Plus, InfoIcon } from 'lucide-react';
import ICDRequestForm from '@/components/dashboard/ICDRequestForm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ICD {
  id: string;
  amount: number;
  interestRate: number;
  tenure: number;
  maturityDate: string;
  status: string;
}

const ICDs = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [icds, setIcds] = useState<ICD[]>([
    {
      id: 'ICD001',
      amount: 2000000,
      interestRate: 8.75,
      tenure: 90,
      maturityDate: '2025-10-28',
      status: 'Active'
    },
    {
      id: 'ICD002',
      amount: 1500000,
      interestRate: 8.50,
      tenure: 180,
      maturityDate: '2026-01-26',
      status: 'Active'
    },
    {
      id: 'ICD003',
      amount: 500000,
      interestRate: 8.25,
      tenure: 60,
      maturityDate: '2025-09-28',
      status: 'Active'
    },
    {
      id: 'ICD004',
      amount: 750000,
      interestRate: 8.00,
      tenure: 30,
      maturityDate: '2025-08-06',
      status: 'Pending Approval'
    },
    {
      id: 'ICD005',
      amount: 1000000,
      interestRate: 7.75,
      tenure: 90,
      maturityDate: '2025-07-01',
      status: 'Matured'
    },
    {
      id: 'ICD006',
      amount: 800000,
      interestRate: 8.25,
      tenure: 60,
      maturityDate: '2025-06-15',
      status: 'Matured'
    }
  ]);

  const handleRequestSubmitted = (newRequest: ICD) => {
    setIcds([newRequest, ...icds]);
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">My ICDs</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm italic">
                  For demonstration purposes, all fund transfers are simulated and would be handled via a secure, external process.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Raise New ICD Request
        </Button>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>All ICD Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Interest Rate</TableHead>
                <TableHead className="text-center">Tenure</TableHead>
                <TableHead>Maturity Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {icds.map((icd) => (
                <TableRow key={icd.id}>
                  <TableCell className="font-mono">{icd.id}</TableCell>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-sm italic text-muted-foreground flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            <p>For demonstration purposes, all fund transfers are simulated and would be handled via a secure, external process.</p>
          </div>
        </CardContent>
      </Card>

      <ICDRequestForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onRequestSubmitted={handleRequestSubmitted}
      />
    </>
  );
};

export default ICDs;