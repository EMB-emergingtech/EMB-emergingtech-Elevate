import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const WealthPartnerRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError('Failed to register. Please try again.');
        return;
      }

      const { user } = data;

      // Check if email confirmation is required
      if (!user?.email_confirmed_at && !user?.id) {
        setError('Please check your email and confirm your account before proceeding.');
        return;
      }

      if (!user?.id) {
        setError('Registration failed. Please try again.');
        return;
      }

      // Wait a moment for the auth.users record to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assign role to the user in the database first
      const { error: roleError } = await supabase.from('profiles').insert({
        id: user.id,
        role: 'Wealth Partner',
      });

      if (roleError) {
        if (roleError.code === '23503') {
          setError('Please confirm your email address first, then try logging in.');
        } else {
          setError(`Failed to assign role: ${roleError.message}`);
        }
        return;
      }

      // If referral code is provided, update the profile with it
      if (referralCode) {
        const { error: referralError } = await supabase
          .from('profiles')
          .update({ referral_code: referralCode })
          .eq('id', user.id);

        if (referralError) {
          console.error('Failed to save referral code:', referralError);
          // Don't fail registration if referral code can't be saved
        }
      }

      if (!user.email_confirmed_at) {
        setError('Registration successful! Please check your email and confirm your account before logging in.');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Wealth Partner Registration</h1>
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
          <label htmlFor="referralCode" className="block text-sm font-medium mb-1">
            Referral Code <span className="text-muted-foreground">(Optional)</span>
          </label>
          <Input
            id="referralCode"
            type="text"
            placeholder="Enter referral code if you have one"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  );
};

export default WealthPartnerRegister;