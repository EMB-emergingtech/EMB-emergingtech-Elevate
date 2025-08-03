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
import { Plus, Search, Filter, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import InvestorCard from '@/components/dashboard/InvestorCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';

interface Investor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  dateJoined: string;
  aum: number;
  status: string;
}

const Investors = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(false);

  useEffect(() => {
    setUseSupabase(false);
    if (!useSupabase) {
      setLoading(false);
      setInvestors([
        {
          id: 'INV001',
          name: 'Rajiv Mehta',
          company: 'Corporate Investor A',
          email: 'rajiv.mehta@corpa.com',
          phone: '+91 98765 43210',
          dateJoined: '2025-01-15',
          aum: 4200000,
          status: 'Active'
        },
        {
          id: 'INV002',
          name: 'Sunita Sharma',
          company: 'Corporate Investor B',
          email: 'sunita@corpb.com',
          phone: '+91 98765 12345',
          dateJoined: '2025-02-20',
          aum: 3800000,
          status: 'Active'
        },
        {
          id: 'INV003',
          name: 'John Henderson',
          company: 'Henderson Enterprises',
          email: 'john.h@henderson.com',
          phone: '+91 87654 32109',
          dateJoined: '2025-03-05',
          aum: 2500000,
          status: 'Active'
        },
        {
          id: 'INV004',
          name: 'Priya Singh',
          company: 'Singh Investments',
          email: 'priya@singhinv.com',
          phone: '+91 76543 21098',
          dateJoined: '2025-04-12',
          aum: 1800000,
          status: 'Active'
        },
        {
          id: 'INV005',
          name: 'Ramesh Kumar',
          company: 'Ramesh Enterprises',
          email: 'ramesh@enterprises.com',
          phone: '+91 65432 10987',
          dateJoined: '2025-05-18',
          aum: 1200000,
          status: 'Active'
        },
        {
          id: 'INV006',
          name: 'Anita Desai',
          company: 'Desai Holdings',
          email: 'anita@desai.com',
          phone: '+91 54321 09876',
          dateJoined: '2025-06-25',
          aum: 900000,
          status: 'KYC Pending'
        },
        {
          id: 'INV007',
          name: 'Michael Wong',
          company: 'Wong Investments',
          email: 'michael@wonginv.com',
          phone: '+91 43210 98765',
          dateJoined: '2025-07-10',
          aum: 600000,
          status: 'KYC Pending'
        },
        {
          id: 'INV008',
          name: 'Aarav Patel',
          company: 'Patel Group',
          email: 'aarav@patel.com',
          phone: '+91 32109 87654',
          dateJoined: '2025-07-22',
          aum: 0,
          status: 'KYC Pending'
        }
      ]);
      return;
    }
    setLoading(true);
    supabase
      .from('investors')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          setInvestors(
            data.map((inv: any) => ({
              id: inv.id,
              name: inv.name,
              company: inv.company,
              email: inv.email,
              phone: inv.phone,
              dateJoined: inv.dateJoined,
              aum: inv.aum,
              status: inv.status
            }))
          );
        }
        setLoading(false);
      });
  }, [useSupabase]);

  const handleInvestorAdded = (newInvestor: Investor) => {
    setInvestors([newInvestor, ...investors]);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
      case 'KYC Pending':
        return 'status-badge status-badge-pending';
      default:
        return 'status-badge';
    }
  };

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = 
      investor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || investor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAUM = filteredInvestors.reduce((sum, investor) => sum + investor.aum, 0);

  return (
    <>
      <div className="flex items-center gap-4 mb-2">
        <Switch id="useSupabase" checked={useSupabase} onCheckedChange={setUseSupabase} />
        <Label htmlFor="useSupabase">Use Supabase Data</Label>
        {loading && <span className="text-xs text-muted-foreground">Loading investors...</span>}
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Investors</h1>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Investor
        </Button>
      </div>

      <Card className="premium-card mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search investors..." 
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="KYC Pending">KYC Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Investor Portfolio</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total AUM: <span className="font-medium numeric">${totalAUM.toLocaleString()}</span> • 
              {filteredInvestors.length} investors
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">AUM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestors.length > 0 ? (
                filteredInvestors.map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell>{investor.name}</TableCell>
                    <TableCell>{investor.company}</TableCell>
                    <TableCell className="font-mono text-xs">{investor.email}</TableCell>
                    <TableCell>{new Date(investor.dateJoined).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${investor.aum.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(investor.status)}>
                        {investor.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="mb-1">No investors found</p>
                      <p className="text-sm">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try changing your search or filter criteria' 
                          : 'Add your first investor to get started'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InvestorCard 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onInvestorAdded={handleInvestorAdded}
      />
    </>
  );
};

export default Investors;