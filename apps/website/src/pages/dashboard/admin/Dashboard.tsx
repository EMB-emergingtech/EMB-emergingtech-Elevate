import { useState, useEffect } from 'react';
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
  Sparkles,
  Bell
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
import { useAdminNotifications } from '@/hooks/use-admin-notifications';
import { supabase } from '@/lib/supabaseClient';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

async function sendClerkInvitation(email: string) {
  const res = await fetch('/api/invite-investor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send invitation');
  return data.invitation;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [useSupabaseUsers, setUseSupabaseUsers] = useState(true);
  const [useSupabaseInvestments, setUseSupabaseInvestments] = useState(true);
  const [useSupabaseRequests, setUseSupabaseRequests] = useState(true);
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
  const { notifications, loading: notificationsLoading } = useAdminNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!useSupabaseUsers) return;
    setLoadingUsers(true);
    
    // Fetch from profiles table joined with auth.users for user data
    supabase
      .from('profiles')
      .select(`
        id,
        role,
        created_at,
        auth_users:auth.users(email)
      `)
      .then(({ data, error }) => {
        console.log('Users fetch result:', { data, error });
        if (!error && data && data.length > 0) {
          setUsers(
            data.map((u: any) => ({
              id: u.id,
              name: u.auth_users?.email?.split('@')[0] || 'Unknown',
              email: u.auth_users?.email || 'Unknown',
              role: u.role,
              joinedDate: u.created_at || new Date().toISOString(),
              status: 'Active'
            }))
          );
        } else {
          console.error('Could not fetch users from backend. Showing mock data.');
        }
        setLoadingUsers(false);
      });
  }, [useSupabaseUsers]);

  useEffect(() => {
    if (!useSupabaseInvestments) return;
    setLoadingInvestments(true);
    
    supabase
      .from('investments')
      .select('*')
      .then(({ data, error }) => {
        console.log('Investments fetch result:', { data, error });
        if (!error && data && data.length > 0) {
          setInvestments(
            data.map((i: any) => ({
              id: i.id,
              name: i.name || `${i.type} Investment`,
              type: i.type,
              interestRate: i.interestRate || i.interest_rate || i.roi || 0,
              tenure: i.tenure || parseInt(i.duration) || 0,
              minInvestment: i.minInvestment || i.min_investment || i.amount || 0,
              status: i.status || 'Active'
            }))
          );
        } else {
          console.error('Could not fetch investments from backend. Showing mock data.');
        }
        setLoadingInvestments(false);
      });
  }, [useSupabaseInvestments]);

  useEffect(() => {
    if (!useSupabaseRequests) return;
    setLoadingRequests(true);
    
    supabase
      .from('pending_requests')
      .select('*')
      .then(({ data, error }) => {
        console.log('Requests fetch result:', { data, error });
        if (!error && data && data.length > 0) {
          setPendingRequests(
            data.map((r: any) => ({
              id: r.id,
              user: r.user_name, // Updated to use user_name instead of user
              type: r.type,
              amount: r.amount || 0,
              date: r.date || r.created_at,
              details: r.details || `${r.type} request`
            }))
          );
        } else {
          console.error('Could not fetch requests from backend. Showing mock data.');
        }
        setLoadingRequests(false);
      });
  }, [useSupabaseRequests]);

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
      {/* Supabase toggles */}
      <div className="flex gap-6 mb-2">
        <div className="flex items-center gap-2">
          <Switch id="useSupabaseUsers" checked={useSupabaseUsers} onCheckedChange={setUseSupabaseUsers} />
          <Label htmlFor="useSupabaseUsers">Users: Supabase</Label>
          {loadingUsers && <span className="text-xs text-muted-foreground">Loading users...</span>}
        </div>
        <div className="flex items-center gap-2">
          <Switch id="useSupabaseInvestments" checked={useSupabaseInvestments} onCheckedChange={setUseSupabaseInvestments} />
          <Label htmlFor="useSupabaseInvestments">Investments: Supabase</Label>
          {loadingInvestments && <span className="text-xs text-muted-foreground">Loading investments...</span>}
        </div>
        <div className="flex items-center gap-2">
          <Switch id="useSupabaseRequests" checked={useSupabaseRequests} onCheckedChange={setUseSupabaseRequests} />
          <Label htmlFor="useSupabaseRequests">Requests: Supabase</Label>
          {loadingRequests && <span className="text-xs text-muted-foreground">Loading requests...</span>}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-3 items-center relative">
          {/* Notification Bell */}
          <button
            className="relative p-2 rounded-full hover:bg-muted focus:outline-none"
            onClick={() => setShowNotifications((v) => !v)}
            aria-label="Show notifications"
          >
            <Bell className="h-6 w-6 text-primary" />
            {notifications && notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-12 w-96 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-border font-semibold">Admin Alerts</div>
              <ul className="divide-y divide-border">
                {notificationsLoading ? (
                  <li className="p-4 text-center text-muted-foreground">Loading...</li>
                ) : notifications.length === 0 ? (
                  <li className="p-4 text-center text-muted-foreground">No new notifications</li>
                ) : notifications.slice(0, 10).map((notif, idx) => (
                  <li key={idx} className="p-4 hover:bg-muted/50">
                    <div className="font-medium">{notif.type}</div>
                    <div className="text-sm text-muted-foreground">{notif.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(notif.date).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
          <Button
            variant="outline"
            className="border-primary text-primary"
            onClick={() => navigate('/dashboard/admin/kyc')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            KYC Tracking
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
                    onClick={async () => {
                      if (email) {
                        try {
                          await sendClerkInvitation(email);
                          toast.success(`Invitation sent to ${email} for ${role} role`);
                          setEmail('');
                        } catch (err: any) {
                          toast.error('Failed to send invitation: ' + err.message);
                        }
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