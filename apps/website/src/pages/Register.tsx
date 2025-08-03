import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Investor'); // Default role is Investor
  const [investorCode, setInvestorCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setError('Invalid or expired invitation link.');
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setError('Invalid or expired invitation link.');
      return;
    }

    // Validate investor code is required for Investor role
    if (role === 'Investor' && !investorCode.trim()) {
      setError('Investor code is required to register as an investor.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !data) {
        setError('Invalid or expired invitation link.');
        return;
      }

      const { user, session, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError('Failed to register. Please try again.');
        return;
      }

      if (!user?.id) {
        setError('User ID is missing. Please try again.');
        return;
      }

      // Wait a moment for the auth.users record to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assign role to the user in the database first
      const { error: roleError } = await supabase.from('profiles').insert({
        id: user.id,
        role,
      });

      if (roleError) {
        setError('Failed to assign role. Please contact support.');
        return;
      }

      // Save investor code if role is Investor (required at this point)
      if (role === 'Investor') {
        const { error: investorCodeError } = await supabase
          .from('profiles')
          .update({ investor_code: investorCode })
          .eq('id', user.id);

        if (investorCodeError) {
          console.error('Failed to save investor code:', investorCodeError);
          setError('Failed to save investor code. Please contact support.');
          return;
        }
      }

      navigate('/login');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Elevatae Logo" 
                className="w-12 h-12"
              />
            </Link>
            <h1 className="text-3xl font-bold mt-6 mb-2">Create Your Elevate Account</h1>
            <p className="text-muted-foreground text-lg">Join our exclusive wealth investment platform.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="premium-card p-8">
            <form onSubmit={handleRegister} className="space-y-4">
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
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Investor">Investor</option>
                  <option value="Wealth Partner">Wealth Partner</option>
                </select>
              </div>
              <div>
                <label htmlFor="investorCode" className="block text-sm font-medium mb-1">
                  Investor Code <span className="text-red-500">*</span>
                </label>
                <Input
                  id="investorCode"
                  type="text"
                  value={investorCode}
                  onChange={(e) => setInvestorCode(e.target.value)}
                  placeholder="Enter your investor code"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  An investor code is required to register as an investor
                </p>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Register</Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;