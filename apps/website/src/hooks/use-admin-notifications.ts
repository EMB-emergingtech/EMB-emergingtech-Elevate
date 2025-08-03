import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminNotifications() {
      setLoading(true);
      const notifs: any[] = [];
      // New user registrations (last 7 days)
      const { data: users } = await supabase
        .from('users')
        .select('name, email, created_at, role')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      if (users && users.length > 0) {
        users.forEach(user => {
          notifs.push({
            type: 'Registration',
            message: `New ${user.role} registered: ${user.name} (${user.email})`,
            date: user.created_at
          });
        });
      }
      // Pending KYC requests
      const { data: kyc } = await supabase
        .from('kyc_requests')
        .select('name, email, submitted_at, status')
        .eq('status', 'submitted');
      if (kyc && kyc.length > 0) {
        kyc.forEach(k => {
          notifs.push({
            type: 'KYC',
            message: `KYC submitted by ${k.name} (${k.email})`,
            date: k.submitted_at
          });
        });
      }
      // Pending investment approvals
      const { data: investments } = await supabase
        .from('investments')
        .select('investor, created_at, type, status')
        .eq('status', 'pending');
      if (investments && investments.length > 0) {
        investments.forEach(inv => {
          notifs.push({
            type: 'Investment',
            message: `Pending ${inv.type} investment from ${inv.investor}`,
            date: inv.created_at
          });
        });
      }
      // New referrals (pending approval)
      const { data: referrals } = await supabase
        .from('referrals')
        .select('investorEmail, partnerEmail, created_at, status')
        .eq('status', 'pending');
      if (referrals && referrals.length > 0) {
        referrals.forEach(ref => {
          notifs.push({
            type: 'Referral',
            message: `New referral: ${ref.investorEmail} by ${ref.partnerEmail}`,
            date: ref.created_at
          });
        });
      }
      setNotifications(notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    }
    fetchAdminNotifications();
  }, []);

  return { notifications, loading };
}
