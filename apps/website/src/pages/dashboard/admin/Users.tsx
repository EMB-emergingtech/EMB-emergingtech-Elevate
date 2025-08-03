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
import { Search, Filter, Edit, Ban, Shield, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ConfirmationDialog from '@/components/dashboard/ConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: string;
  permissions: {
    maker: boolean;
    checker: boolean;
  }
}

const Users = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [suspendUserId, setSuspendUserId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(true); // Toggle for Supabase/mock

  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR001',
      name: 'Rajiv Mehta',
      email: 'rajiv.mehta@corpa.com',
      role: 'Investor',
      joinedDate: '2025-01-15',
      status: 'Active',
      permissions: {
        maker: true,
        checker: false
      }
    },
    {
      id: 'USR002',
      name: 'Sunita Sharma',
      email: 'sunita@corpb.com',
      role: 'Investor',
      joinedDate: '2025-02-20',
      status: 'Active',
      permissions: {
        maker: true,
        checker: false
      }
    },
    {
      id: 'USR003',
      name: 'John Henderson',
      email: 'john.h@henderson.com',
      role: 'Investor',
      joinedDate: '2025-03-05',
      status: 'Active',
      permissions: {
        maker: true,
        checker: false
      }
    },
    {
      id: 'partner-001',
      name: 'Wealth Partner One',
      email: 'partner@elevatae.com',
      role: 'Wealth Partner',
      status: 'Active',
      permissions: {
        maker: true,
        checker: true
      }
    },
    {
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@elevatae.com',
      role: 'Admin',
      status: 'Active',
      permissions: {
        maker: true,
        checker: true
      }
    },
    {
      id: 'USR006',
      name: 'Anita Desai',
      email: 'anita@desai.com',
      role: 'Investor',
      joinedDate: '2025-06-25',
      status: 'KYC Pending',
      permissions: {
        maker: false,
        checker: false
      }
    },
    {
      id: 'USR007',
      name: 'Michael Wong',
      email: 'michael@wonginv.com',
      role: 'Investor',
      joinedDate: '2025-07-10',
      status: 'KYC Pending',
      permissions: {
        maker: false,
        checker: false
      }
    },
    {
      id: 'ops-001',
      name: 'Operations Team',
      email: 'operations@elevatae.com',
      role: 'Operations',
      status: 'Active',
      permissions: {
        maker: true,
        checker: true
      }
    }
  ]);

  useEffect(() => {
    if (!useSupabase) return;
    setLoading(true);
    supabase
      .from('users')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setUsers(
            data.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              joinedDate: u.joinedDate || new Date().toISOString(),
              status: u.status,
              permissions: {
                maker: u.maker ?? false,
                checker: u.checker ?? false
              }
            }))
          );
        }
        setLoading(false);
      });
  }, [useSupabase]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(user => {
      if (user.id === selectedUser.id) {
        return selectedUser;
      }
      return user;
    }));
    
    setIsEditDialogOpen(false);
    toast.success(`Permissions updated for ${selectedUser.name}`);
  };

  const handleSuspendUser = (userId: string) => {
    setSuspendUserId(userId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSuspend = () => {
    setUsers(users.map(user => {
      if (user.id === suspendUserId) {
        return {
          ...user,
          status: user.status === 'Suspended' ? 'Active' : 'Suspended'
        };
      }
      return user;
    }));
    
    const user = users.find(u => u.id === suspendUserId);
    const newStatus = user?.status === 'Suspended' ? 'activated' : 'suspended';
    
    toast.success(`User ${user?.name} has been ${newStatus}`);
    setConfirmDialogOpen(false);
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds(prev =>
      checked ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUserIds(checked ? filteredUsers.map(u => u.id) : []);
  };

  const handleBulkAction = (action: 'approveKYC' | 'suspend' | 'delete') => {
    if (action === 'approveKYC') {
      setUsers(users.map(user =>
        selectedUserIds.includes(user.id) && user.status === 'KYC Pending'
          ? { ...user, status: 'Active' }
          : user
      ));
      toast.success('KYC approved for selected users');
    } else if (action === 'suspend') {
      setUsers(users.map(user =>
        selectedUserIds.includes(user.id)
          ? { ...user, status: user.status === 'Suspended' ? 'Active' : 'Suspended' }
          : user
      ));
      toast.success('Status updated for selected users');
    } else if (action === 'delete') {
      setUsers(users.filter(user => !selectedUserIds.includes(user.id)));
      toast.success('Selected users deleted');
    }
    setSelectedUserIds([]);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
      case 'KYC Pending':
        return 'status-badge status-badge-pending';
      case 'Suspended':
        return 'status-badge status-badge-rejected';
      default:
        return 'status-badge';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const allSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;

  return (
    <>
      {/* Toggle for Supabase or Mock Data */}
      <div className="flex items-center gap-4 mb-2">
        <Switch id="useSupabase" checked={useSupabase} onCheckedChange={setUseSupabase} />
        <Label htmlFor="useSupabase">Use Supabase Data</Label>
        {loading && <span className="text-xs text-muted-foreground">Loading users...</span>}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
      </div>

      <Card className="premium-card mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Role</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Investor">Investor</SelectItem>
                  <SelectItem value="Wealth Partner">Wealth Partner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="KYC Pending">KYC Pending</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          {selectedUserIds.length > 0 && (
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => handleBulkAction('approveKYC')}>
                Approve KYC
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                Suspend
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                Delete
              </Button>
              <span className="ml-2 text-xs text-muted-foreground">{selectedUserIds.length} selected</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all users"
                  />
                </TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={checked => handleSelectUser(user.id, checked as boolean)}
                        aria-label={`Select user ${user.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="font-mono text-xs">{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'Admin' ? (
                        <div className="flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5 text-primary" />
                          <span>{user.role}</span>
                        </div>
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(user.status)}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={user.status === 'Suspended' ? 'outline' : 'ghost'}
                          size="icon"
                          className={`h-8 w-8 ${
                            user.status === 'Suspended' 
                              ? 'border-primary text-primary hover:bg-primary/5' 
                              : ''
                          }`}
                          onClick={() => handleSuspendUser(user.id)}
                        >
                          {user.status === 'Suspended' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="mb-1">No users found</p>
                      <p className="text-sm">
                        {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                          ? 'Try changing your search or filter criteria' 
                          : 'Users will appear here once registered'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
            <DialogDescription>
              {selectedUser && `Modify permissions for ${selectedUser.name} (${selectedUser.role})`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maker" className="flex flex-col">
                  <span>Maker Permission</span>
                  <span className="text-xs text-muted-foreground">Can initiate transactions and requests</span>
                </Label>
                <Switch 
                  id="maker" 
                  checked={selectedUser?.permissions.maker} 
                  onCheckedChange={checked => {
                    if (selectedUser) {
                      setSelectedUser({
                        ...selectedUser,
                        permissions: {
                          ...selectedUser.permissions,
                          maker: checked
                        }
                      });
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="checker" className="flex flex-col">
                  <span>Checker Permission</span>
                  <span className="text-xs text-muted-foreground">Can approve transactions and requests</span>
                </Label>
                <Switch 
                  id="checker" 
                  checked={selectedUser?.permissions.checker} 
                  onCheckedChange={checked => {
                    if (selectedUser) {
                      setSelectedUser({
                        ...selectedUser,
                        permissions: {
                          ...selectedUser.permissions,
                          checker: checked
                        }
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSavePermissions}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspend User Confirmation Dialog */}
      <ConfirmationDialog 
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmSuspend}
        title="Confirm User Status Change"
        description={
          users.find(u => u.id === suspendUserId)?.status === 'Suspended'
            ? `Are you sure you want to reactivate ${users.find(u => u.id === suspendUserId)?.name}?`
            : `Are you sure you want to suspend ${users.find(u => u.id === suspendUserId)?.name}? This will prevent them from accessing the platform.`
        }
        confirmText={users.find(u => u.id === suspendUserId)?.status === 'Suspended' ? 'Activate' : 'Suspend'}
        variant={users.find(u => u.id === suspendUserId)?.status === 'Suspended' ? 'default' : 'destructive'}
      />
    </>
  );
};

export default Users;