import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useNotifications(userEmail: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      const notifs: any[] = [];
      // Invites
      const { data: invites } = await supabase.from('invites').select('status, created_at').eq('email', userEmail);
      if (invites && invites.length > 0) {
        invites.forEach(invite => {
          if (invite.status !== 'pending') {
            notifs.push({
              type: 'Invite',
              message: `Your invite status: ${invite.status}`,
              date: invite.created_at
            });
          }
        });
      }
      // KYC
      const { data: kyc } = await supabase.from('kyc_requests').select('status, submitted_at').eq('email', userEmail);
      if (kyc && kyc.length > 0) {
        kyc.forEach(k => {
          if (k.status !== 'pending') {
            notifs.push({
              type: 'KYC',
              message: `KYC status: ${k.status}`,
              date: k.submitted_at
            });
          }
        });
      }
      // Investments
      const { data: investments } = await supabase.from('investments').select('status, created_at, type').eq('investor', userEmail);
      if (investments && investments.length > 0) {
        investments.forEach(inv => {
          if (inv.status !== 'pending') {
            notifs.push({
              type: 'Investment',
              message: `${inv.type} investment status: ${inv.status}`,
              date: inv.created_at
            });
          }
        });
      }
      // Referrals (as investor)
      const { data: referrals } = await supabase.from('referrals').select('status, created_at, partnerEmail').eq('investorEmail', userEmail);
      if (referrals && referrals.length > 0) {
        referrals.forEach(ref => {
          if (ref.status !== 'pending') {
            notifs.push({
              type: 'Referral',
              message: `Referral by ${ref.partnerEmail} status: ${ref.status}`,
              date: ref.created_at
            });
          }
        });
      }
      setNotifications(notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    }
    if (userEmail) fetchNotifications();
  }, [userEmail]);

  return { notifications, loading };
}