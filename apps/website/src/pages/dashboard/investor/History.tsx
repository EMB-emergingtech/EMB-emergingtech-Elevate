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
import { Download, Calendar, Search, Filter, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, subMonths } from 'date-fns';

interface Transaction {
  id: string;
  date: string;
  transactionId: string;
  type: string;
  description: string;
  amount: number;
  status: string;
}

const History = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const transactions: Transaction[] = [
    {
      id: 'TRX001',
      date: '2025-07-25',
      transactionId: 'ICD00123',
      type: 'ICD Placed',
      description: 'Placed an ICD with ABC Corp for 90 days',
      amount: 1000000,
      status: 'Completed'
    },
    {
      id: 'TRX002',
      date: '2025-07-22',
      transactionId: 'BND00456',
      type: 'Bond Purchase',
      description: 'Purchased 25 units of XYZ Ltd. Bond 2026',
      amount: 250000,
      status: 'Completed'
    },
    {
      id: 'TRX003',
      date: '2025-07-15',
      transactionId: 'INT00789',
      type: 'Interest Credit',
      description: 'Interest credited for ICD001',
      amount: 18750,
      status: 'Completed'
    },
    {
      id: 'TRX004',
      date: '2025-07-10',
      transactionId: 'BND00457',
      type: 'Bond Purchase',
      description: 'Purchased 40 units of Government Bond 2035',
      amount: 500000,
      status: 'Completed'
    },
    {
      id: 'TRX005',
      date: '2025-07-01',
      transactionId: 'ICD00124',
      type: 'ICD Matured',
      description: 'ICD with XYZ Corp matured with interest',
      amount: 750000,
      status: 'Completed'
    },
    {
      id: 'TRX006',
      date: '2025-06-15',
      transactionId: 'INT00790',
      type: 'Interest Credit',
      description: 'Coupon payment for ABC Corp Bond',
      amount: 10312.5,
      status: 'Completed'
    },
    {
      id: 'TRX007',
      date: '2025-06-10',
      transactionId: 'BND00458',
      type: 'Bond Sale',
      description: 'Sold 15 units of PQR Ltd Bond 2025',
      amount: 150000,
      status: 'Completed'
    },
    {
      id: 'TRX008',
      date: '2025-06-01',
      transactionId: 'ICD00125',
      type: 'ICD Placed',
      description: 'Placed an ICD with DEF Corp for 180 days',
      amount: 1500000,
      status: 'Completed'
    }
  ];

  const handleViewDetails = (transactionId: string) => {
    toast.info(`Viewing details for transaction ${transactionId}`);
  };

  const handleExportHistory = () => {
    toast.success('Transaction history exported successfully');
  };

  const filteredTransactions = transactions.filter(tx => {
    // Search term filter
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Transaction type filter
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange?.from) {
      const txDate = new Date(tx.date);
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = txDate >= fromDate && txDate <= toDate;
      } else {
        matchesDateRange = txDate.toDateString() === fromDate.toDateString();
      }
    }
    
    return matchesSearch && matchesType && matchesDateRange;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateRange(undefined);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Transaction History</h1>
        <Button 
          variant="outline"
          className="border-primary text-primary"
          onClick={handleExportHistory}
        >
          <Download className="mr-2 h-4 w-4" /> Export History
        </Button>
      </div>

      <Card className="premium-card mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Transaction Type</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ICD Placed">ICD Placed</SelectItem>
                  <SelectItem value="ICD Matured">ICD Matured</SelectItem>
                  <SelectItem value="Bond Purchase">Bond Purchase</SelectItem>
                  <SelectItem value="Bond Sale">Bond Sale</SelectItem>
                  <SelectItem value="Interest Credit">Interest Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Date Range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            {(searchTerm || typeFilter !== 'all' || dateRange) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono">{tx.transactionId}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${tx.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="status-badge status-badge-approved">
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewDetails(tx.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Calendar className="h-10 w-10 mb-2" />
                      <p className="mb-1">No transactions found</p>
                      <p className="text-sm">
                        {searchTerm || typeFilter !== 'all' || dateRange
                          ? 'Try changing your search or filter criteria' 
                          : 'Transactions will appear here once available'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default History;