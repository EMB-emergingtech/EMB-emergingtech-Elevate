'use client';

import { Navigation } from '@/components/navigation/Navigation';
import { usePathname } from 'next/navigation';
import { adminNavItems, investorNavItems, wealthPartnerNavItems } from '@/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Determine which navigation items to show based on the current path
  const getNavItems = () => {
    if (pathname.startsWith('/dashboard/admin')) {
      return adminNavItems;
    }
    if (pathname.startsWith('/dashboard/partner')) {
      return wealthPartnerNavItems;
    }
    return investorNavItems;
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <Navigation navItems={getNavItems()} />
      </aside>
      <main className="flex-1 md:pl-64">
        {children}
      </main>
    </div>
  );
}