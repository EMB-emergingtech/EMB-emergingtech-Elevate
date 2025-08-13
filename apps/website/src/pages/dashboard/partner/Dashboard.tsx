import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BadgeDollarSign, 
  TrendingUp, 
  UserPlus,
  Activity,
  Eye,
  ArrowRight
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
import { useNavigate } from 'react-router-dom';
import InvestorCard from '@/components/dashboard/InvestorCard';
import { useToast } from '@/hooks/use-toast';
import ReferralHistory from '@/components/dashboard/ReferralHistory';
import { supabase } from '@/lib/supabaseClient';
import { CommissionAnalyticsDialog } from '@/components/dashboard/CommissionAnalyticsDialog';

interface Investor {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  dateJoined?: string;
  totalInvestment: number;
  status: string;
}

const Dashboard = () => {
  const partnerEmail = 'partner@mock.com';
  const [investorCount, setInvestorCount] = useState(0);
  const referralCode = 'REFCODE123';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddInvestorOpen, setIsAddInvestorOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Mock commission trend data (in production, this would come from an API)
  const commissionTrends = [
    { month: 'Apr 2025', icdCommission: 1250, bondCommission: 750, totalCommission: 2000 },
    { month: 'May 2025', icdCommission: 1500, bondCommission: 800, totalCommission: 2300 },
    { month: 'Jun 2025', icdCommission: 1750, bondCommission: 950, totalCommission: 2700 },
    { month: 'Jul 2025', icdCommission: 2100, bondCommission: 1400, totalCommission: 3500 }
  ];

  const currentMonthData = {
    icdAmount: 8750,
    bondAmount: 3750,
    topClients: [
      { name: 'Corporate Investor A', aum: '$4.2M', commission: 4200 },
      { name: 'Corporate Investor B', aum: '$3.8M', commission: 3800 },
      { name: 'John H', aum: '$2.5M', commission: 2500 }
    ]
  };

  const [activities] = useState([
    {
      id: 1,
      investor: 'Corporate Investor B',
      action: 'raised an ICD request',
      details: 'for $200,000',
      time: '2 hours ago'
    },
    {
      id: 2,
      investor: 'John H',
      action: 'purchased 50 units',
      details: 'of GOI 2035 Bond',
      time: '5 hours ago'
    },
    {
      id: 3,
      investor: 'Ramesh Enterprises',
      action: 'completed KYC',
      details: 'verification process',
      time: '1 day ago'
    },
    {
      id: 4,
      investor: 'Corporate Investor A',
      action: 'ICD matured',
      details: 'with 8.25% interest',
      time: '2 days ago'
    },
    {
      id: 5,
      investor: 'Priya S',
      action: 'registered',
      details: 'using your referral code',
      time: '3 days ago'
    }
  ]);

  const [investors] = useState<Investor[]>([
    {
      id: 'INV001',
      name: 'Rajiv Mehta',
      company: 'Corporate Investor A',
      email: 'rajiv.mehta@corpa.com',
      totalInvestment: 4200000,
      status: 'Active'
    },
    {
      id: 'INV002',
      name: 'Sunita Sharma',
      company: 'Corporate Investor B',
      email: 'sunita@corpb.com',
      totalInvestment: 3800000,
      status: 'Active'
    },
    {
      id: 'INV003',
      name: 'John Henderson',
      company: 'Henderson Enterprises',
      email: 'john.h@henderson.com',
      totalInvestment: 2500000,
      status: 'Active'
    },
    {
      id: 'INV004',
      name: 'Priya Singh',
      company: 'Singh Investments',
      email: 'priya@singhinv.com',
      totalInvestment: 1800000,
      status: 'Active'
    },
    {
      id: 'INV005',
      name: 'Ramesh Kumar',
      company: 'Ramesh Enterprises',
      email: 'ramesh@enterprises.com',
      totalInvestment: 1200000,
      status: 'Active'
    },
    {
      id: 'INV006',
      name: 'Anita Desai',
      company: 'Desai Holdings',
      email: 'anita@desai.com',
      totalInvestment: 0,
      status: 'KYC Pending'
    }
  ]);

  useEffect(() => {
    async function fetchInvestorCount() {
      const { count } = await supabase
        .from('referrals')
        .select('investorEmail', { count: 'exact', head: true })
        .eq('partnerEmail', partnerEmail);
      setInvestorCount(count || 0);
    }
    if (partnerEmail) fetchInvestorCount();
  }, [partnerEmail]);

  const handleViewAllInvestors = () => {
    navigate('/dashboard/partner/investors');
  };

  const handleViewInvestor = (id: string) => {
    toast.info(`Viewing details for investor ${id}`);
  };

  const handleInvestorAdded = (investor: any) => {
    toast.success(`Invitation sent to ${investor.email}`);
    setIsAddInvestorOpen(false);
  };

  const getEmailUsername = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Wealth Partner Dashboard</h1>
        <div className="flex flex-col items-end">
          <span className="text-sm text-muted-foreground">Referral Code:</span>
          <span className="font-mono text-lg">{referralCode}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard 
          title="Total AUM" 
          value="$15,000,000" 
          icon={<BadgeDollarSign className="h-5 w-5" />} 
          change={{ value: "12.5%", positive: true }}
        />
        <StatCard 
          title="Total Investors" 
          value={investorCount.toString()} 
          icon={<Users className="h-5 w-5" />} 
        />
        <StatCard 
          title="Active Referrals" 
          value="2" 
          icon={<UserPlus className="h-5 w-5" />} 
        />
        <StatCard 
          title="Commission Earned (YTD)" 
          value="$12,500" 
          icon={<TrendingUp className="h-5 w-5" />} 
          change={{ value: "8.3%", positive: true }}
        />
      </motion.div>

      {/* Managed Investors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Managed Investors</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsAddInvestorOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add New Investor
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary"
                onClick={handleViewAllInvestors}
              >
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Total Investment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.slice(0, 6).map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getEmailUsername(investor.email)}</p>
                        {investor.company && (
                          <p className="text-xs text-muted-foreground">{investor.company}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{investor.email}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${investor.totalInvestment.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewInvestor(investor.id)}
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

      {/* Activity Feed and Commission Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Activity Feed */}
        <Card className="lg:col-span-2 premium-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Investor Activity Feed</CardTitle>
            <Button variant="outline" size="sm" className="border-primary text-primary">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l border-border space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="relative">
                  {/* Activity dot */}
                  <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>
                  
                  {/* Activity content */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="font-medium">
                        <span className="text-primary">{getEmailUsername(activity.investor)}</span> {activity.action}
                      </h4>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commission Overview */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Commission Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Commission by Product</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ICDs</span>
                    <span className="font-medium numeric">$8,750</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bonds</span>
                    <span className="font-medium numeric">$3,750</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Top Performing Clients</h4>
                <div className="space-y-4">
                  {investors.slice(0, 3).map((investor) => (
                    <div key={investor.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{getEmailUsername(investor.email)}</p>
                        <p className="text-xs text-muted-foreground">AUM: ${(investor.totalInvestment / 1000000).toFixed(1)}M</p>
                      </div>
                      <span className="numeric font-medium">${(investor.totalInvestment * 0.001).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary"
                onClick={() => setIsAnalyticsOpen(true)}
              >
                <Activity className="mr-2 h-4 w-4" />
                View Detailed Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Investor Dialog */}
      <InvestorCard
        isOpen={isAddInvestorOpen}
        onClose={() => setIsAddInvestorOpen(false)}
        onInvestorAdded={handleInvestorAdded}
      />

      <CommissionAnalyticsDialog
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        trends={commissionTrends}
        currentMonth={currentMonthData}
      />

      <ReferralHistory />
    </div>
  );
};

export default Dashboard;