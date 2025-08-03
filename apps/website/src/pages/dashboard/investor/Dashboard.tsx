import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Activity,
  ArrowRight,
  Building,
  Plus,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatCard from '@/components/dashboard/StatCard';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { supabase } from '@/lib/supabaseClient';

interface Investment {
  id: string;
  type: 'ICD' | 'Bond' | 'REIT';
  amount: number;
  interestRate: number;
  maturityDate: string;
  status: 'Active' | 'Pending' | 'Matured' | 'Submitted' | 'In-Review' | 'Accepted' | 'Rejected' | 'Counter-offer' | 'Agreement Pending' | 'Payment Update';
}

interface Bond {
  id: string;
  companyName: string;
  interestRate: number;
  tenure: number;
  minInvestment: number;
  details: string;
}

const getStatusBadgeClass = (status: Investment['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Pending':
    case 'Submitted':
    case 'In-Review':
      return 'bg-yellow-100 text-yellow-800';
    case 'Matured':
      return 'bg-blue-100 text-blue-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Agreement Pending':
    case 'Payment Update':
    case 'Counter-offer':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  const { toast } = useToast();
  // Replace with actual logged-in user email in production
  const investorEmail = 'investor@company.com';
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bonds] = useState<Bond[]>([
    {
      id: 'BNDO001',
      companyName: 'Omega Infrastructure Ltd.',
      interestRate: 8.25,
      tenure: 36,
      minInvestment: 100000,
      details: 'Infrastructure bonds with government backing and tax benefits.'
    },
    {
      id: 'BNDO002',
      companyName: 'Sigma Power Corporation',
      interestRate: 8.75,
      tenure: 60,
      minInvestment: 250000,
      details: 'Power sector bonds with quarterly coupon payments and strong credit rating.'
    },
    {
      id: 'BNDO003',
      companyName: 'Theta Financial Services',
      interestRate: 9.10,
      tenure: 48,
      minInvestment: 150000,
      details: 'Financial sector bonds with monthly interest payouts and flexible redemption options.'
    }
  ]);

  const pendingActions = [
    { id: 1, description: 'Review and sign the agreement for ICD004.', priority: 'high' },
    { id: 2, description: 'Complete payment for BND002 before the deadline.', priority: 'medium' },
    { id: 3, description: 'Acknowledge maturity of ICD005.', priority: 'low' },
  ];

  const transactions = [
    { id: 1, date: '2025-07-28', transactionId: 'TXN12345', type: 'Deposit', amount: 500000, status: 'Completed' },
    { id: 2, date: '2025-07-25', transactionId: 'TXN12346', type: 'Withdrawal', amount: 100000, status: 'Completed' },
    { id: 3, date: '2025-07-20', transactionId: 'TXN12347', type: 'Interest', amount: 12500, status: 'Completed' },
  ];

  const totalInvestedValue = investments
    .filter(inv => inv.status === 'Active' || inv.status === 'Agreement Pending')
    .reduce((acc, inv) => acc + inv.amount, 0);

  const investmentBreakdown = investments
    .filter(inv => inv.status === 'Active' || inv.status === 'Agreement Pending')
    .reduce((acc, investment) => {
      const existing = acc.find(item => item.name === investment.type);
      if (existing) {
        existing.value += investment.amount;
      } else {
        acc.push({ name: investment.type, value: investment.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  const COLORS = {
    ICD: '#16a34a', // green-600
    Bond: '#2563eb', // blue-600
    REIT: '#ca8a04' // yellow-600
  };

  const handleAction = (action: string, id: string) => {
    toast.info(`${action} for investment ${id}`);
  };

  useEffect(() => {
    async function fetchInvestments() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .eq('investor', investorEmail)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setInvestments(data.map(inv => ({
            id: inv.id,
            type: inv.type,
            amount: Number(inv.amount),
            interestRate: inv.roi ? Number(inv.roi) : 0,
            maturityDate: inv.duration || '',
            status: inv.status || 'Pending',
          })));
        } else {
          setInvestments([
            {
              id: 'ICD001',
              type: 'ICD',
              amount: 2000000,
              interestRate: 8.75,
              maturityDate: '2025-10-28',
              status: 'Active'
            },
            {
              id: 'BND001',
              type: 'Bond',
              amount: 500000,
              interestRate: 8.25,
              maturityDate: '2028-08-15',
              status: 'Active'
            },
            {
              id: 'ICD004',
              type: 'ICD',
              amount: 750000,
              interestRate: 8.00,
              maturityDate: '2025-08-06',
              status: 'Agreement Pending'
            },
            {
              id: 'REIT001',
              type: 'REIT',
              amount: 1250000,
              interestRate: 10.5, // Representing dividend yield
              maturityDate: 'N/A',
              status: 'Active'
            },
            {
              id: 'BND002',
              type: 'Bond',
              amount: 250000,
              interestRate: 7.65,
              maturityDate: '2026-09-22',
              status: 'Active'
            },
            {
              id: 'ICD005',
              type: 'ICD',
              amount: 1000000,
              interestRate: 7.75,
              maturityDate: '2025-07-01',
              status: 'Matured'
            },
            {
              id: 'ICD006',
              type: 'ICD',
              amount: 500000,
              interestRate: 8.25,
              maturityDate: '2025-09-28',
              status: 'Submitted'
            },
          ]);
        }
      } catch (err) {
        setError('Could not fetch investments from backend. Showing mock data.');
        setInvestments([
          {
            id: 'ICD001',
            type: 'ICD',
            amount: 2000000,
            interestRate: 8.75,
            maturityDate: '2025-10-28',
            status: 'Active'
          },
          {
            id: 'BND001',
            type: 'Bond',
            amount: 500000,
            interestRate: 8.25,
            maturityDate: '2028-08-15',
            status: 'Active'
          },
          {
            id: 'ICD004',
            type: 'ICD',
            amount: 750000,
            interestRate: 8.00,
            maturityDate: '2025-08-06',
            status: 'Agreement Pending'
          },
          {
            id: 'REIT001',
            type: 'REIT',
            amount: 1250000,
            interestRate: 10.5, // Representing dividend yield
            maturityDate: 'N/A',
            status: 'Active'
          },
          {
            id: 'BND002',
            type: 'Bond',
            amount: 250000,
            interestRate: 7.65,
            maturityDate: '2026-09-22',
            status: 'Active'
          },
          {
            id: 'ICD005',
            type: 'ICD',
            amount: 1000000,
            interestRate: 7.75,
            maturityDate: '2025-07-01',
            status: 'Matured'
          },
          {
            id: 'ICD006',
            type: 'ICD',
            amount: 500000,
            interestRate: 8.25,
            maturityDate: '2025-09-28',
            status: 'Submitted'
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchInvestments();
  }, [investorEmail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Investor Dashboard</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow">
          <Plus className="mr-2 h-4 w-4" /> New Investment
        </Button>
      </div>

      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard 
          title="Total Invested Value" 
          value={`$${totalInvestedValue.toLocaleString()}`} 
          icon={<DollarSign className="h-5 w-5" />} 
          change={{ value: "5.2%", positive: true }}
        />
        <StatCard 
          title="Portfolio Yield" 
          value="8.95%" 
          icon={<BarChart3 className="h-5 w-5" />} 
        />
        <StatCard 
          title="Upcoming Maturities" 
          value="$750,000" 
          icon={<Calendar className="h-5 w-5" />} 
        />
        <StatCard 
          title="Pending Actions" 
          value="2" 
          icon={<Activity className="h-5 w-5" />} 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="premium-card h-full">
            <CardHeader>
              <CardTitle>Recent Investment Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.slice(0, 5).map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell>
                        <div className="font-medium">{investment.type}</div>
                        <div className="text-xs text-muted-foreground font-mono">{investment.id}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono">${investment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={getStatusBadgeClass(investment.status)}>
                          {investment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleAction('View Details', investment.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investment Breakdown */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="premium-card h-full">
            <CardHeader>
              <CardTitle>Investment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={investmentBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {investmentBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                      contentStyle={{
                        background: 'rgba(30, 41, 59, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {pendingActions.map((action) => (
                <li 
                  key={action.id}
                  className={`p-3 rounded-md flex items-start gap-3 ${
                    action.priority === 'high' 
                      ? 'bg-destructive/10 border border-destructive/20' 
                      : action.priority === 'medium'
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted border border-border'
                  }`}
                >
                  <Activity className={`h-5 w-5 mt-0.5 ${
                    action.priority === 'high'
                      ? 'text-destructive'
                      : action.priority === 'medium'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                  }`} />
                  <span className="text-sm">{action.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" className="border-primary text-primary">
              View All <FileText className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono">{transaction.transactionId}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="status-badge status-badge-approved">
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;