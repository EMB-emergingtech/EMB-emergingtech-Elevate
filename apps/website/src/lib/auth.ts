import { supabase } from './supabaseClient';

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data?.role || null;
  } catch (err) {
    console.error('Unexpected error fetching user role:', err);
    return null;
  }
}

export function getRedirectPath(role: string): string {
  switch (role) {
    case 'Investor':
      return '/dashboard/investor';
    case 'Wealth Partner':
      return '/dashboard/partner';
    case 'Admin Maker':
    case 'Admin Checker':
      return '/dashboard/admin';
    default:
      return '/login';
  }
}

export function validateRoleAccess(userRole: string, requiredPath: string): boolean {
  const allowedPaths = {
    'Investor': ['/dashboard/investor'],
    'Wealth Partner': ['/dashboard/partner'],
    'Admin Maker': ['/dashboard/admin'],
    'Admin Checker': ['/dashboard/admin'],
  };

  const userAllowedPaths = allowedPaths[userRole] || [];
  return userAllowedPaths.some(path => requiredPath.startsWith(path));
}