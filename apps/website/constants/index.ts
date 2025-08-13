import { LayoutDashboard, FileText, CreditCard, BarChart3, Users, Building2, UserPlus, FileBarChart, ShieldCheck } from 'lucide-react';

export const investorNavItems = [
  { title: "Dashboard", href: "/dashboard/investor", icon: LayoutDashboard },
  { title: "My ICDs", href: "/dashboard/investor/icds", icon: CreditCard },
  { title: "My Bonds", href: "/dashboard/investor/bonds", icon: BarChart3 },
  { title: "My REITs", href: "/dashboard/investor/reits", icon: Building2 },
  { title: "Products", href: "/dashboard/investor/products", icon: ShieldCheck }
];

export const wealthPartnerNavItems = [
  { title: "Dashboard", href: "/dashboard/partner", icon: LayoutDashboard },
  { title: "My Investors", href: "/dashboard/partner/investors", icon: Users },
  { title: "Referrals", href: "/dashboard/partner/referrals", icon: UserPlus },
  { title: "Performance Reports", href: "/dashboard/partner/reports", icon: FileBarChart }
];

export const adminNavItems = [
  { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "User Management", href: "/dashboard/admin/users", icon: Users },
  { title: "ICD Requests", href: "/dashboard/admin/icds", icon: CreditCard },
  { title: "Bond Management", href: "/dashboard/admin/bonds", icon: Building2 }
];