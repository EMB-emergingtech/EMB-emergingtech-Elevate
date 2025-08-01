import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Activity,
  ArrowRight,
  Building
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
import AIAssistant from '@/components/dashboard/AIAssistant';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [transactions] = useState([
    {
      id: 'TRX001',
      date: '2025-07-25',
      transactionId: 'ICD00123',
      type: 'ICD Placed',
      amount: 1000000,
      status: 'Completed'
    },
    {
      id: 'TRX002',
      date: '2025-07-22',
      transactionId: 'BND00456',
      type: 'Bond Purchase',
      amount: 250000,
      status: 'Completed'
    },
    {
      id: 'TRX003',
      date: '2025-07-15',
      transactionId: 'INT00789',
      type: 'Interest Credit',
      amount: 18750,
      status: 'Completed'
    },
    {
      id: 'TRX004',
      date: '2025-07-10',
      transactionId: 'BND00457',
      type: 'Bond Purchase',
      amount: 500000,
      status: 'Completed'
    },
    {
      id: 'TRX005',
      date: '2025-07-01',
      transactionId: 'ICD00124',
      type: 'ICD Matured',
      amount: 750000,
      status: 'Completed'
    }
  ]);

  const [pendingActions] = useState([
    { id: 1, description: 'ICD request #ICD004 maturing in 7 days.', priority: 'medium' },
    { id: 2, description: 'Bond coupon payment of $12,500 due tomorrow.', priority: 'high' },
    { id: 3, description: 'Complete KYC renewal for the current financial year.', priority: 'low' },
    { id: 4, description: 'Review new bond offerings in the infrastructure sector.', priority: 'medium' }
  ]);

  const [icdOpportunities] = useState([
    {
      id: 'ICDO001',
      companyName: 'Alpha Manufacturing Ltd.',
      interestRate: 8.75,
      tenure: 90,
      minInvestment: 200000,
      details: 'AAA-rated manufacturing company with strong financials and steady growth.'
    },
    {
      id: 'ICDO002',
      companyName: 'Beta Technologies Inc.',
      interestRate: 9.00,
      tenure: 180,
      minInvestment: 500000,
      details: 'Technology company with 15+ years of operation and consistent profit margins.'
    },
    {
      id: 'ICDO003',
      companyName: 'Gamma Healthcare Services',
      interestRate: 8.50,
      tenure: 60,
      minInvestment: 300000,
      details: 'Leading healthcare provider with government contracts and stable revenue streams.'
    },
    {
      id: 'ICDO004',
      companyName: 'Delta Energy Solutions',
      interestRate: 9.25,
      tenure: 120,
      minInvestment: 400000,
      details: 'Renewable energy company with strong order book and international presence.'
    }
  ]);

  const [bondOpportunities] = useState([
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

  const handleViewDetails = (id: string, type: string) => {
    toast.info(`Viewing details for ${type} opportunity: ${id}`);
    // In a real application, this would open a details page or modal
  };

  const handleViewAllICDs = () => {
    navigate('/dashboard/investor/icds');
  };

  const handleViewAllBonds = () => {
    navigate('/dashboard/investor/bonds');
  };

  return (
    <div className="space-y-6">
      <AIAssistant />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Investor Dashboard</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow">
          Generate Report
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
          title="Total Investment" 
          value="$5,250,000" 
          icon={<DollarSign className="h-5 w-5" />} 
          change={{ value: "8.3%", positive: true }}
        />
        <StatCard 
          title="Active ICDs" 
          value="3" 
          icon={<CreditCard className="h-5 w-5" />} 
        />
        <StatCard 
          title="Matured Investments" 
          value="12" 
          icon={<Calendar className="h-5 w-5" />} 
        />
        <StatCard 
          title="Annualized Return" 
          value="8.75%" 
          icon={<BarChart3 className="h-5 w-5" />} 
          change={{ value: "0.25%", positive: true }}
        />
      </motion.div>

      {/* ICD Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Inter-Corporate Deposits (ICDs)</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary"
              onClick={handleViewAllICDs}
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {icdOpportunities.map((icd) => (
                <Card key={icd.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-sm line-clamp-1" title={icd.companyName}>
                        {icd.companyName}
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interest Rate:</span>
                        <span className="font-medium">{icd.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tenure:</span>
                        <span className="font-medium">{icd.tenure} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min. Investment:</span>
                        <span className="font-medium">${icd.minInvestment.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <Button 
                        size="sm" 
                        className="w-full bg-primary/10 hover:bg-primary/20 text-primary"
                        onClick={() => handleViewDetails(icd.id, 'ICD')}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bond Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Unlisted Bonds</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary"
              onClick={handleViewAllBonds}
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bondOpportunities.map((bond) => (
                <Card key={bond.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-sm line-clamp-1" title={bond.companyName}>
                        {bond.companyName}
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interest Rate:</span>
                        <span className="font-medium">{bond.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tenure:</span>
                        <span className="font-medium">{bond.tenure} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min. Investment:</span>
                        <span className="font-medium">${bond.minInvestment.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <Button 
                        size="sm" 
                        className="w-full bg-primary/10 hover:bg-primary/20 text-primary"
                        onClick={() => handleViewDetails(bond.id, 'Bond')}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Portfolio Overview and Pending Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="lg:col-span-2 premium-card">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <img 
                src="https://storage.googleapis.com/fenado-ai-farm-public/generated/fd0ec364-3b60-45f8-99f1-d4a2e4ddd917.webp"
                alt="Portfolio Distribution"
                className="w-64 h-64"
              />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span>ICDs (65%): $3,412,500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted"></div>
                  <span>Bonds (35%): $1,837,500</span>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Your portfolio is balanced with a focus on high-yield ICDs while maintaining liquidity through strategic bond investments.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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