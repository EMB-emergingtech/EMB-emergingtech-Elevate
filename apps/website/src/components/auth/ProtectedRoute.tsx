import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { getUserRole, getRedirectPath, validateRoleAccess } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.log('User not authenticated, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }

        // Get user role
        const role = await getUserRole(user.id);
        
        if (!role) {
          console.log('User role not found, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }

        setUserRole(role);

        // Check if user has access to current route
        const hasAccess = validateRoleAccess(role, location.pathname);
        
        if (!hasAccess) {
          console.log(`User with role ${role} does not have access to ${location.pathname}`);
          const correctPath = getRedirectPath(role);
          navigate(correctPath, { replace: true });
          return;
        }

        // If specific roles are required, check them
        if (requiredRole && requiredRole.length > 0) {
          if (!requiredRole.includes(role)) {
            console.log(`User role ${role} not in required roles: ${requiredRole.join(', ')}`);
            const correctPath = getRedirectPath(role);
            navigate(correctPath, { replace: true });
            return;
          }
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Error checking authorization:', err);
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate, location.pathname, requiredRole]);

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show content if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Show nothing if not authorized (redirect in progress)
  return null;
};

export default ProtectedRoute;