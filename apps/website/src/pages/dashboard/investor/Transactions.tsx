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

const Transactions = () => {
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
    },
    {
      id: 'TRX009',
      date: '2025-07-28',
      transactionId: 'REIT00123',
      type: 'REIT Purchase',
      description: 'Purchased 1250 units of Mindspace Business Parks REIT',
      amount: 1250000,
      status: 'Completed'
    },
    {
      id: 'TRX010',
      date: '2025-08-01',
      transactionId: 'DIV00345',
      type: 'Dividend Credit',
      description: 'Dividend credited for Mindspace Business Parks REIT',
      amount: 32812,
      status: 'Completed'
    }
  ];

  const handleViewDetails = (transactionId: string) => {
    toast.info(`Viewing details for transaction ${transactionId}`);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesDate = !dateRange || (dateRange.from && dateRange.to && 
                        new Date(transaction.date) >= dateRange.from && new Date(transaction.date) <= dateRange.to);
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Transaction History</h1>
        <Button 
          variant="outline"
          className="border-primary text-primary"
        >
          <Download className="mr-2 h-4 w-4" /> Download Statement
        </Button>
      </div>

      <Card className="premium-card mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by description or ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ICD Placed">ICD Placed</SelectItem>
                <SelectItem value="ICD Matured">ICD Matured</SelectItem>
                <SelectItem value="Bond Purchase">Bond Purchase</SelectItem>
                <SelectItem value="Bond Sale">Bond Sale</SelectItem>
                <SelectItem value="REIT Purchase">REIT Purchase</SelectItem>
                <SelectItem value="Interest Credit">Interest Credit</SelectItem>
                <SelectItem value="Dividend Credit">Dividend Credit</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
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
                    <span>Pick a date range</span>
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
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount (INR)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">{transaction.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDetails(transaction.transactionId)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No transactions found.
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

export default Transactions;