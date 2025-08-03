import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutDashboard, FileText, CreditCard, BarChart3, Users, Building2, UserPlus, FileBarChart, ShieldCheck, AlertCircle, User } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Layout
import RootLayout from "@/components/layout/RootLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Public Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ErrorPage from "@/pages/ErrorPage";

// Investor Dashboard
import InvestorDashboard from "@/pages/dashboard/investor/Dashboard";
import InvestorICDs from "@/pages/dashboard/investor/ICDs";
import InvestorBonds from "@/pages/dashboard/investor/Bonds";
import InvestorREITs from "@/pages/dashboard/investor/REITs";
import InvestorProducts from "@/pages/dashboard/investor/Products";
import InvestorTransactions from "@/pages/dashboard/investor/Transactions";
import InvestorDocuments from "@/pages/dashboard/investor/Documents";
import ProfileSupport from "@/pages/dashboard/investor/ProfileSupport";

// Partner Dashboard
import PartnerDashboard from "@/pages/dashboard/partner/Dashboard";
import PartnerInvestors from "@/pages/dashboard/partner/Investors";
import PartnerReports from "@/pages/dashboard/partner/Reports";
import PartnerReferrals from "@/pages/dashboard/partner/Referrals";

// Admin Dashboard
import AdminDashboard from "@/pages/dashboard/admin/Dashboard";
import AdminUsers from "@/pages/dashboard/admin/Users";
import AdminICDs from "@/pages/dashboard/admin/ICDs";
import AdminBonds from "@/pages/dashboard/admin/Bonds";

// Change Password
import ChangePassword from "@/pages/ChangePassword";

// Register Pages
import WealthPartnerRegister from '@/pages/WealthPartnerRegister';
import AdminRegister from '@/pages/AdminRegister';

const queryClient = new QueryClient();

// Dashboard navigation items for each role
const investorNavItems = [
  { title: "Dashboard", href: "/dashboard/investor", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "My ICDs", href: "/dashboard/investor/icds", icon: <CreditCard className="h-5 w-5" /> },
  { title: "My Bonds", href: "/dashboard/investor/bonds", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "My REITs", href: "/dashboard/investor/reits", icon: <Building2 className="h-5 w-5" /> },
  { title: "Products", href: "/dashboard/investor/products", icon: <ShieldCheck className="h-5 w-5" /> },
  { title: "Transactions", href: "/dashboard/investor/transactions", icon: <FileBarChart className="h-5 w-5" /> },
  { title: "Documents", href: "/dashboard/investor/documents", icon: <FileText className="h-5 w-5" /> },
  { title: "Profile & Support", href: "/dashboard/investor/profile-support", icon: <User className="h-5 w-5" /> }
];

const partnerNavItems = [
  { title: "Dashboard", href: "/dashboard/partner", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "My Investors", href: "/dashboard/partner/investors", icon: <Users className="h-5 w-5" /> },
  { title: "Referral Program", href: "/dashboard/partner/referrals", icon: <UserPlus className="h-5 w-5" /> },
  { title: "Performance Reports", href: "/dashboard/partner/reports", icon: <FileBarChart className="h-5 w-5" /> }
];

const adminNavItems = [
  { title: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "User Management", href: "/dashboard/admin/users", icon: <Users className="h-5 w-5" /> },
  { title: "ICD Requests", href: "/dashboard/admin/icds", icon: <CreditCard className="h-5 w-5" /> },
  { title: "Bond Management", href: "/dashboard/admin/bonds", icon: <Building2 className="h-5 w-5" /> }
];

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/WealthPartnerRegister', element: <WealthPartnerRegister /> },
  { path: '/AdminRegister', element: <AdminRegister /> },
  { path: '/changepassword', element: <ChangePassword /> },
  {
    path: '/dashboard/investor',
    element: (
      <ProtectedRoute requiredRole={['Investor']}>
        <DashboardLayout
          navItems={investorNavItems}
          userName="Corporate Investor A"
          userRole="Investor"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <InvestorDashboard /> },
      { path: 'icds', element: <InvestorICDs /> },
      { path: 'bonds', element: <InvestorBonds /> },
      { path: 'reits', element: <InvestorREITs /> },
      { path: 'products', element: <InvestorProducts /> },
      { path: 'transactions', element: <InvestorTransactions /> },
      { path: 'documents', element: <InvestorDocuments /> },
      { path: 'profile-support', element: <ProfileSupport /> },
    ],
  },
  {
    path: '/dashboard/partner',
    element: (
      <ProtectedRoute requiredRole={['Wealth Partner']}>
        <DashboardLayout
          navItems={partnerNavItems}
          userName="Wealth Partner One"
          userRole="Wealth Partner"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PartnerDashboard /> },
      { path: 'investors', element: <PartnerInvestors /> },
      { path: 'referrals', element: <PartnerReferrals /> },
      { path: 'reports', element: <PartnerReports /> },
    ],
  },
  {
    path: '/dashboard/admin',
    element: (
      <ProtectedRoute requiredRole={['Admin Maker', 'Admin Checker']}>
        <DashboardLayout
          navItems={adminNavItems}
          userName="Admin User"
          userRole="Admin"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'icds', element: <AdminICDs /> },
      { path: 'bonds', element: <AdminBonds /> },
    ],
  },
  { path: '*', element: <ErrorPage /> },
]);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const App = () => {
  useEffect(() => {
    // Test Supabase connection by fetching the current session
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
        } else {
          console.log("Supabase connection successful. Session data:", data);
        }
      } catch (err) {
        console.error("Supabase connection exception:", err);
      }
    };
    testConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ThemeSwitcher />
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;