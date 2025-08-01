import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  ChevronDown, 
  Search, 
  LogOut, 
  User, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
  userName: string;
  userRole: string;
}

const DashboardLayout = ({ children, navItems, userName, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate('/');
  };

  const notifications = [
    { id: 1, title: "New ICD request approved", time: "10 mins ago" },
    { id: 2, title: "Quarterly report available", time: "2 hours ago" },
    { id: 3, title: "Bond maturity reminder", time: "Yesterday" },
    { id: 4, title: "System maintenance scheduled", time: "3 days ago" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar for desktop */}
        {!isMobile && (
          <Sidebar className="hidden md:block w-64 border-r border-border">
            <div className="flex items-center gap-2 px-4 py-6">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="https://storage.googleapis.com/fenado-ai-farm-public/generated/ec4b9b57-ba68-41de-81cc-5150e005781f.webp" 
                  alt="Elevate Logo" 
                  className="h-8 w-auto" 
                />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-foreground">elevate</span>
                  <span className="beta-tag">beta</span>
                </div>
              </Link>
            </div>

            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="px-3 py-2">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-muted text-accent' 
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </ScrollArea>
          </Sidebar>
        )}

        {/* Mobile sidebar */}
        {isMobile && (
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex items-center justify-between px-4 py-6 border-b border-border">
                <Link to="/" className="flex items-center gap-2">
                  <img 
                    src="https://storage.googleapis.com/fenado-ai-farm-public/generated/ec4b9b57-ba68-41de-81cc-5150e005781f.webp" 
                    alt="Elevate Logo" 
                    className="h-8 w-auto" 
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-foreground">elevate</span>
                    <span className="beta-tag">beta</span>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="px-3 py-2">
                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                            isActive 
                              ? 'bg-muted text-accent' 
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                          onClick={() => setIsMobileSidebarOpen(false)}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-full px-4">
            {/* Left section - Mobile menu button */}
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-ring w-64"
                />
              </div>
            </div>

            {/* Right section - User profile, notifications */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    4
                  </span>
                </Button>

                {/* Notifications dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-md shadow-md overflow-hidden z-50">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className="p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center border-t border-border">
                      <Button variant="link" className="text-sm text-primary">View all notifications</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{userName}</div>
                      <div className="text-xs text-muted-foreground">{userRole}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Click outside to close notifications */}
      {isNotificationsOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsNotificationsOpen(false)}
        />
      )}
    </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;