import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutDashboard, FileText, CreditCard, BarChart3, Users, Building2, UserPlus, FileBarChart, ShieldCheck, AlertCircle, User } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

const queryClient = new QueryClient();

export const metadata = {
  title: 'Elevate Wealth Management',
  description: 'Professional wealth management platform'
};

export const investorNavItems = [
  { title: "Dashboard", href: "/dashboard/investor", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "My ICDs", href: "/dashboard/investor/icds", icon: <CreditCard className="h-5 w-5" /> },
  { title: "My Bonds", href: "/dashboard/investor/bonds", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "My REITs", href: "/dashboard/investor/reits", icon: <Building2 className="h-5 w-5" /> },
  { title: "Products", href: "/dashboard/investor/products", icon: <ShieldCheck className="h-5 w-5" /> }
];

export const wealthPartnerNavItems = [
  { title: "Dashboard", href: "/dashboard/partner", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "My Investors", href: "/dashboard/partner/investors", icon: <Users className="h-5 w-5" /> },
  { title: "Referrals", href: "/dashboard/partner/referrals", icon: <UserPlus className="h-5 w-5" /> },
  { title: "Performance Reports", href: "/dashboard/partner/reports", icon: <FileBarChart className="h-5 w-5" /> }
];

export const adminNavItems = [
  { title: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "User Management", href: "/dashboard/admin/users", icon: <Users className="h-5 w-5" /> },
  { title: "ICD Requests", href: "/dashboard/admin/icds", icon: <CreditCard className="h-5 w-5" /> },
  { title: "Bond Management", href: "/dashboard/admin/bonds", icon: <Building2 className="h-5 w-5" /> }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        {children}
        <Toaster />
        <ThemeSwitcher />
      </TooltipProvider>
    </QueryClientProvider>
  );
}