'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import { Users, BadgeDollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function InvestorDashboard() {
  const [stats, setStats] = useState({
    totalInvestments: '₹0',
    activeICDs: 0,
    returns: '0%'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch investor stats from Supabase
        const { data: investorData, error } = await supabase
          .from('investors')
          .select('total_investments, active_icds, returns')
          .eq('user_id', user.id)
          .single();

        if (!error && investorData) {
          setStats({
            totalInvestments: `₹${investorData.total_investments.toLocaleString()}`,
            activeICDs: investorData.active_icds,
            returns: `${investorData.returns}%`
          });
        }
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Investor Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          title="Total Investments"
          value={stats.totalInvestments}
          icon={BadgeDollarSign}
          description="Across all products"
        />
        <StatCard 
          title="Active ICDs"
          value={stats.activeICDs}
          icon={Users}
          description="Currently running"
        />
        <StatCard 
          title="Returns"
          value={stats.returns}
          icon={TrendingUp}
          description="Average returns p.a."
        />
      </div>
    </div>
  );
}