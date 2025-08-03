import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LoginForm from '@/components/forms/LoginForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCircle, Building2, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== LOGIN DEBUG START ===');
    console.log('Login initiated for email:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setError('Invalid email or password.');
        return;
      }

      const { user } = data;
      console.log('User authenticated successfully:', user?.id);

      if (!user?.id) {
        console.error('User ID is missing after authentication');
        setError('Authentication failed.');
        return;
      }

      // Fetch user profile with retry logic
      let profile = null;
      let profileError = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries && !profile) {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileErr) {
          profileError = profileErr;
          console.log(`Profile fetch attempt ${retryCount + 1} failed:`, profileErr);
          
          if (retryCount < maxRetries - 1) {
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          retryCount++;
        } else {
          profile = profileData;
          console.log('Profile fetched successfully:', profile);
          break;
        }
      }

      if (!profile || profileError) {
        console.error('Failed to fetch user profile after retries:', profileError);
        // Fallback: check if user has a default role or create one
        console.log('Attempting to check auth.users for role fallback...');
        
        setError('User profile not found. Please contact support or try registering again.');
        return;
      }

      console.log('User role:', profile.role);

      // Enhanced role-based navigation with validation
      const navigateToRole = (role: string) => {
        switch (role) {
          case 'Investor':
            console.log('Redirecting to Investor Dashboard');
            navigate('/dashboard/investor', { replace: true });
            break;
          case 'Wealth Partner':
            console.log('Redirecting to Wealth Partner Dashboard');
            navigate('/dashboard/partner', { replace: true });
            break;
          case 'Admin Maker':
            console.log('Redirecting to Admin Maker Dashboard');
            navigate('/dashboard/admin', { replace: true });
            break;
          case 'Admin Checker':
            console.log('Redirecting to Admin Checker Dashboard');
            navigate('/dashboard/admin', { replace: true });
            break;
          default:
            console.error('Invalid or unrecognized role:', role);
            setError(`Invalid role: ${role}. Please contact support.`);
            return false;
        }
        return true;
      };

      // Navigate based on role
      const navigationSuccess = navigateToRole(profile.role);
      
      if (navigationSuccess) {
        console.log(`Successfully redirected user with role: ${profile.role}`);
        // Clear any previous errors
        setError('');
      }
      
      console.log('=== LOGIN DEBUG END ===');
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('Failed to log in. Please try again.');
    }
  };

  const handleRoleSelection = (role: string) => {
    setIsRoleDialogOpen(false);
    
    switch (role) {
      case 'Investor':
        navigate('/register');
        break;
      case 'Wealth Partner':
        navigate('/WealthPartnerRegister');
        break;
      case 'Admin':
        navigate('/AdminRegister');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <img 
                src="https://storage.googleapis.com/fenado-ai-farm-public/generated/ec4b9b57-ba68-41de-81cc-5150e005781f.webp" 
                alt="Elevate Logo" 
                className="h-12 w-auto" 
              />
            </Link>
            <h1 className="text-3xl font-bold mt-6 mb-2">Welcome to Elevate</h1>
            <p className="text-muted-foreground text-lg">Premium wealth investments, simplified.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
            </form>
            
            {/* New to Elevate section */}
            <div className="mt-6 text-center">
              <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm">
                    New to Elevate? Sign up here
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center">Choose Your Role</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Button
                      onClick={() => handleRoleSelection('Investor')}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 h-12"
                    >
                      <UserCircle className="h-5 w-5" />
                      Sign up as Investor
                    </Button>
                    <Button
                      onClick={() => handleRoleSelection('Wealth Partner')}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2 h-12"
                    >
                      <Building2 className="h-5 w-5" />
                      Sign up as Wealth Partner
                    </Button>
                    <Button
                      onClick={() => handleRoleSelection('Admin')}
                      className="w-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center gap-2 h-12"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      Sign up as Admin
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;