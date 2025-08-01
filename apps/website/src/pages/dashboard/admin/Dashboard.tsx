import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  UserPlus, 
  CheckCircle,
  XCircle,
  Mail,
  Users,
  BarChart3,
  Eye,
  ArrowRight,
  Building,
  FileText,
  Sparkles
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/dashboard/StatCard';
import ConfirmationDialog from '@/components/dashboard/ConfirmationDialog';
import InvitationForm from '@/components/dashboard/InvitationForm';
import AdminAIAssistant from '@/components/dashboard/AdminAIAssistant';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Request {
  id: string;
  user: string;
  type: string;
  amount: number;
  date: string;
  details: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: string;
}

interface Investment {
  id: string;
  name: string;
  type: string;
  interestRate: number;
  tenure: number;
  minInvestment: number;
  status: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [pendingRequests, setPendingRequests] = useState<Request[]>([
    {
      id: 'ICD005',
      user: 'Corporate Investor A',
      type: 'ICD Request',
      amount: 500000,
      date: '2025-07-29',
      details: '90-day term at 8.25% interest rate'
    },
    {
      id: 'BND003',
      user: 'John Henderson',
      type: 'Bond Purchase',
      amount: 250000,
      date: '2025-07-28',
      details: '25 units of XYZ Ltd. Bond 2026'
    },
    {
      id: 'ICD006',
      user: 'Corporate Investor B',
      type: 'ICD Request',
      amount: 750000,
      date: '2025-07-27',
      details: '180-day term at 8.50% interest rate'
    },
    {
      id: 'KYC001',
      user: 'Anita Desai',
      type: 'KYC Verification',
      amount: 0,
      date: '2025-07-26',
      details: 'Initial KYC documents submitted'
    },
    {
      id: 'BND004',
      user: 'Priya Singh',
      type: 'Bond Purchase',
      amount: 100000,
      date: '2025-07-25',
      details: '10 units of Government Bond 2035'
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: 'USR001',
      name: 'Rajiv Mehta',
      email: 'rajiv.mehta@corpa.com',
      role: 'Investor',
      joinedDate: '2025-01-15',
      status: 'Active'
    },
    {
      id: 'USR002',
      name: 'Sunita Sharma',
      email: 'sunita@corpb.com',
      role: 'Investor',
      joinedDate: '2025-02-20',
      status: 'Active'
    },
    {
      id: 'USR003',
      name: 'John Henderson',
      email: 'john.h@henderson.com',
      role: 'Investor',
      joinedDate: '2025-03-05',
      status: 'Active'
    },
    {
      id: 'USR004',
      name: 'Wealth Partner One',
      email: 'partner@elevate.demo',
      role: 'Wealth Partner',
      joinedDate: '2025-01-10',
      status: 'Active'
    },
    {
      id: 'USR005',
      name: 'Admin User',
      email: 'admin@elevate.demo',
      role: 'Admin',
      joinedDate: '2025-01-01',
      status: 'Active'
    },
    {
      id: 'USR006',
      name: 'Anita Desai',
      email: 'anita@desai.com',
      role: 'Investor',
      joinedDate: '2025-06-25',
      status: 'KYC Pending'
    },
    {
      id: 'USR007',
      name: 'Michael Wong',
      email: 'michael@wonginv.com',
      role: 'Investor',
      joinedDate: '2025-07-10',
      status: 'KYC Pending'
    }
  ]);

  const [investments] = useState<Investment[]>([
    {
      id: 'ICD001',
      name: 'Alpha Manufacturing Ltd. ICD',
      type: 'ICD',
      interestRate: 8.75,
      tenure: 90,
      minInvestment: 200000,
      status: 'Active'
    },
    {
      id: 'ICD002',
      name: 'Beta Technologies Inc. ICD',
      type: 'ICD',
      interestRate: 9.00,
      tenure: 180,
      minInvestment: 500000,
      status: 'Active'
    },
    {
      id: 'BND001',
      name: 'Omega Infrastructure Ltd. Bond',
      type: 'Bond',
      interestRate: 8.25,
      tenure: 36,
      minInvestment: 100000,
      status: 'Active'
    },
    {
      id: 'BND002',
      name: 'Sigma Power Corporation Bond',
      type: 'Bond',
      interestRate: 8.75,
      tenure: 60,
      minInvestment: 250000,
      status: 'Active'
    },
    {
      id: 'ICD003',
      name: 'Gamma Healthcare Services ICD',
      type: 'ICD',
      interestRate: 8.50,
      tenure: 60,
      minInvestment: 300000,
      status: 'Pending Approval'
    },
    {
      id: 'BND003',
      name: 'Theta Financial Services Bond',
      type: 'Bond',
      interestRate: 9.10,
      tenure: 48,
      minInvestment: 150000,
      status: 'Pending Approval'
    }
  ]);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] = useState<{
    title: string;
    description: string;
    action: 'approve' | 'reject';
    requestId: string;
  }>({
    title: '',
    description: '',
    action: 'approve',
    requestId: ''
  });
  
  const [isInvitationFormOpen, setIsInvitationFormOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Investor');

  const handleAction = (action: 'approve' | 'reject', request: Request) => {
    setConfirmDialogProps({
      title: `${action === 'approve' ? 'Approve' : 'Reject'} Request`,
      description: `Are you sure you want to ${action} request #${request.id} for $${request.amount.toLocaleString()}?`,
      action,
      requestId: request.id
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    const { action, requestId } = confirmDialogProps;
    
    // Remove the request from the pending list
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    
    // Show success toast
    toast.success(`Request #${requestId} ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    
    setConfirmDialogOpen(false);
  };

  const handleInvitationSent = (email: string, role: string) => {
    toast.success(`Invitation sent to ${email} for ${role} role`);
    setIsInvitationFormOpen(false);
  };

  const handleViewAllUsers = () => {
    navigate('/dashboard/admin/users');
  };

  const handleViewAllICDs = () => {
    navigate('/dashboard/admin/icds');
  };

  const handleViewAllBonds = () => {
    navigate('/dashboard/admin/bonds');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
      case 'KYC Pending':
      case 'Pending Approval':
        return 'status-badge status-badge-pending';
      case 'Suspended':
        return 'status-badge status-badge-rejected';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsInvitationFormOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
          <Button 
            variant="outline" 
            className="border-primary text-primary"
            onClick={() => setIsAIAssistantOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
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
          title="Platform AUM" 
          value="$50,000,000" 
          icon={<DollarSign className="h-5 w-5" />} 
          change={{ value: "15.8%", positive: true }}
        />
        <StatCard 
          title="Pending Requests" 
          value="5" 
          icon={<Clock className="h-5 w-5" />} 
        />
        <StatCard 
          title="Total Users" 
          value="8" 
          icon={<Users className="h-5 w-5" />} 
        />
        <StatCard 
          title="Investment Products" 
          value="6" 
          icon={<BarChart3 className="h-5 w-5" />} 
          change={{ value: "2", positive: true }}
        />
      </motion.div>

      {/* Main Dashboard Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="investments">Investment Opportunities</TabsTrigger>
            <TabsTrigger value="invitations">Invitation Management</TabsTrigger>
          </TabsList>
          
          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary"
                  onClick={handleViewAllUsers}
                >
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 5).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="font-mono text-xs">{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <span className={getStatusBadgeClass(user.status)}>
                            {user.status}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Investment Opportunities Tab */}
          <TabsContent value="investments" className="space-y-4">
            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Investment Opportunities</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary"
                    onClick={handleViewAllICDs}
                  >
                    View ICDs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary"
                    onClick={handleViewAllBonds}
                  >
                    View Bonds
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Interest Rate</TableHead>
                      <TableHead className="text-center">Tenure</TableHead>
                      <TableHead className="text-right">Min. Investment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell>{investment.name}</TableCell>
                        <TableCell>{investment.type}</TableCell>
                        <TableCell className="text-center font-mono">{investment.interestRate}%</TableCell>
                        <TableCell className="text-center">
                          {investment.tenure} {investment.type === 'ICD' ? 'days' : 'months'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${investment.minInvestment.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadgeClass(investment.status)}>
                            {investment.status}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Invitation Management Tab */}
          <TabsContent value="invitations" className="space-y-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Send Platform Invitation</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="w-full p-2 rounded-md border border-border bg-background"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium">
                        Role
                      </label>
                      <select
                        id="role"
                        className="w-full p-2 rounded-md border border-border bg-background"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="Investor">Investor</option>
                        <option value="Wealth Partner">Wealth Partner</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      if (email) {
                        toast.success(`Invitation sent to ${email} for ${role} role`);
                        setEmail('');
                      } else {
                        toast.error('Please enter an email address');
                      }
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Send Invitation
                  </Button>
                </form>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-lg font-medium mb-4">Recent Invitations</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">investor@example.com</p>
                        <p className="text-xs text-muted-foreground">Investor • Sent 2 days ago</p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded">Pending</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">partner@example.com</p>
                        <p className="text-xs text-muted-foreground">Wealth Partner • Sent 3 days ago</p>
                      </div>
                      <span className="text-xs bg-[hsl(130,60%,30%)]/10 text-[hsl(130,60%,30%)] py-1 px-2 rounded">Accepted</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">admin@example.com</p>
                        <p className="text-xs text-muted-foreground">Admin • Sent 5 days ago</p>
                      </div>
                      <span className="text-xs bg-[hsl(130,60%,30%)]/10 text-[hsl(130,60%,30%)] py-1 px-2 rounded">Accepted</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-primary text-primary"
                  >
                    <FileText className="mr-2 h-4 w-4" /> View All Invitations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Pending Requests Queue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Pending Requests Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono">{request.id}</TableCell>
                      <TableCell>{request.user}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.details}</TableCell>
                      <TableCell className="text-right numeric">
                        {request.amount > 0 ? `$${request.amount.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            className="h-8 bg-[hsl(130,80%,94%)] hover:bg-[hsl(130,80%,90%)] text-[hsl(130,60%,30%)]"
                            onClick={() => handleAction('approve', request)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => handleAction('reject', request)}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mb-2 text-primary/50" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm">There are no pending requests that require your attention.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

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

      {/* Invitation Form Dialog */}
      <InvitationForm 
        isOpen={isInvitationFormOpen}
        onClose={() => setIsInvitationFormOpen(false)}
        onInvitationSent={handleInvitationSent}
      />

      {/* AI Assistant Dialog */}
      <AdminAIAssistant 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export default Dashboard;