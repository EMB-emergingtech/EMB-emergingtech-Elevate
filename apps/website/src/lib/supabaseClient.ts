import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Added a utility function to toggle between mock data and Supabase
export const useSupabaseToggle = () => {
  const [useSupabase, setUseSupabase] = useState(true);
  return { useSupabase, setUseSupabase };
};

export async function assignIRCode(wealthPartnerId: string) {
  const irCode = `IR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const { error } = await supabase
    .from('wealth_partners')
    .update({ irCode, status: 'Approved' })
    .eq('id', wealthPartnerId);

  if (error) {
    throw new Error('Failed to assign IR Code');
  }

  return irCode;
}

export const rolesPermissions = {
  Investor: [
    'view_dashboard',
    'submit_kyc',
    'view_investments',
    'submit_icd_request',
    'submit_bond_request',
    'submit_reit_request',
    'track_investment_status',
    'download_documents',
    'contact_relationship_manager',
  ],
  'Wealth Partner': [
    'view_dashboard',
    'submit_kyc',
    'refer_investors',
    'view_referred_investors_status',
    'download_performance_reports',
  ],
  'Admin Maker': [
    'view_dashboard',
    'create_investors',
    'create_partners',
    'upload_bond_data',
    'create_icd_listings',
    'create_reit_listings',
    'manage_documents',
    'view_user_activity',
  ],
  'Admin Checker': [
    'view_dashboard',
    'approve_kyc',
    'approve_investments',
    'send_counter_offers',
    'trigger_signing',
    'view_audit_logs',
    'update_product_status',
    'full_admin_access',
  ],
};

export function hasPermission(role, action) {
  const permissions = rolesPermissions[role] || [];
  return permissions.includes(action);
}
