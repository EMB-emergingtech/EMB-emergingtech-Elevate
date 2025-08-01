import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutDashboard, FileText, CreditCard, BarChart3, Users, Building2, UserPlus, FileBarChart, ShieldCheck, AlertCircle } from 'lucide-react';

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
import InvestorDocuments from "@/pages/dashboard/investor/Documents";
import InvestorHistory from "@/pages/dashboard/investor/History";

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

const queryClient = new QueryClient();

// Dashboard navigation items for each role
const investorNavItems = [
  { title: "Dashboard", href: "/dashboard/investor", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "My ICDs", href: "/dashboard/investor/icds", icon: <CreditCard className="h-5 w-5" /> },
  { title: "My Bonds", href: "/dashboard/investor/bonds", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Documents", href: "/dashboard/investor/documents", icon: <FileText className="h-5 w-5" /> },
  { title: "Transaction History", href: "/dashboard/investor/history", icon: <FileBarChart className="h-5 w-5" /> }
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ThemeSwitcher />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Investor Dashboard */}
          <Route 
            path="/dashboard/investor" 
            element={
              <DashboardLayout 
                navItems={investorNavItems} 
                userName="Corporate Investor A" 
                userRole="Investor"
              >
                <InvestorDashboard />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/investor/icds" 
            element={
              <DashboardLayout 
                navItems={investorNavItems} 
                userName="Corporate Investor A" 
                userRole="Investor"
              >
                <InvestorICDs />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/investor/bonds" 
            element={
              <DashboardLayout 
                navItems={investorNavItems} 
                userName="Corporate Investor A" 
                userRole="Investor"
              >
                <InvestorBonds />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/investor/documents" 
            element={
              <DashboardLayout 
                navItems={investorNavItems} 
                userName="Corporate Investor A" 
                userRole="Investor"
              >
                <InvestorDocuments />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/investor/history" 
            element={
              <DashboardLayout 
                navItems={investorNavItems} 
                userName="Corporate Investor A" 
                userRole="Investor"
              >
                <InvestorHistory />
              </DashboardLayout>
            } 
          />

          {/* Partner Dashboard */}
          <Route 
            path="/dashboard/partner" 
            element={
              <DashboardLayout 
                navItems={partnerNavItems} 
                userName="Wealth Partner One" 
                userRole="Wealth Partner"
              >
                <PartnerDashboard />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/partner/investors" 
            element={
              <DashboardLayout 
                navItems={partnerNavItems} 
                userName="Wealth Partner One" 
                userRole="Wealth Partner"
              >
                <PartnerInvestors />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/partner/referrals" 
            element={
              <DashboardLayout 
                navItems={partnerNavItems} 
                userName="Wealth Partner One" 
                userRole="Wealth Partner"
              >
                <PartnerReferrals />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/partner/reports" 
            element={
              <DashboardLayout 
                navItems={partnerNavItems} 
                userName="Wealth Partner One" 
                userRole="Wealth Partner"
              >
                <PartnerReports />
              </DashboardLayout>
            } 
          />

          {/* Admin Dashboard */}
          <Route 
            path="/dashboard/admin" 
            element={
              <DashboardLayout 
                navItems={adminNavItems} 
                userName="Admin User" 
                userRole="Admin"
              >
                <AdminDashboard />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/admin/users" 
            element={
              <DashboardLayout 
                navItems={adminNavItems} 
                userName="Admin User" 
                userRole="Admin"
              >
                <AdminUsers />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/admin/icds" 
            element={
              <DashboardLayout 
                navItems={adminNavItems} 
                userName="Admin User" 
                userRole="Admin"
              >
                <AdminICDs />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/admin/bonds" 
            element={
              <DashboardLayout 
                navItems={adminNavItems} 
                userName="Admin User" 
                userRole="Admin"
              >
                <AdminBonds />
              </DashboardLayout>
            } 
          />

          {/* Error Page */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;