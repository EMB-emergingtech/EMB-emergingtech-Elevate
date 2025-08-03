import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin Maker'); // Default role is Admin Maker
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Starting admin registration process...');
      console.log('Email:', email);
      console.log('Selected role:', role);
      
      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        setError(`Registration failed: ${authError.message}`);
        return;
      }

      const { user } = authData;
      console.log('User created:', user);

      if (!user?.id) {
        console.error('No user ID returned from signup');
        setError('Registration failed - no user ID received');
        return;
      }

      console.log('User ID received:', user.id);
      console.log('Email confirmed at:', user.email_confirmed_at);

      // Step 2: If email confirmation is required, manually confirm for testing
      if (!user.email_confirmed_at) {
        console.log('Email not confirmed, attempting manual confirmation...');
        
        // Try to manually confirm the email for testing purposes
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.log('Manual confirmation failed:', confirmError);
          // Continue anyway - the SQL update might handle this
        } else {
          console.log('Manual email confirmation successful');
        }
      }

      // Step 3: Wait for user to be fully created in database
      console.log('Waiting for user record to be fully created...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Increased wait time

      // Step 4: Insert profile with role
      console.log('Attempting to insert profile with role:', role);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          role: role,
          created_at: new Date().toISOString()
        }])
        .select('*');

      if (profileError) {
        console.error('Profile insertion error:', profileError);
        console.error('Error code:', profileError.code);
        console.error('Error details:', profileError.details);
        
        // More specific error handling
        if (profileError.code === '23503') {
          // Foreign key constraint violation
          console.log('Foreign key constraint error - checking if user exists in auth.users...');
          
          const { data: userCheck, error: userCheckError } = await supabase
            .from('auth.users')
            .select('id, email, email_confirmed_at')
            .eq('id', user.id)
            .single();
            
          console.log('User check result:', { userCheck, userCheckError });
          
          setError('Database constraint error. Please run the SQL commands to disable email confirmation and try again.');
        } else if (profileError.code === '42501') {
          setError('Permission denied. Please run the RLS disable command and try again.');
        } else {
          setError(`Failed to assign role: ${profileError.message} (Code: ${profileError.code})`);
        }
        return;
      }

      console.log('Profile created successfully:', profileData);
      
      // Step 5: Verify the profile was created
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (verifyError) {
        console.error('Profile verification failed:', verifyError);
        setError('Role assignment verification failed');
        return;
      }

      console.log('Profile verified:', verifyData);
      
      // Success!
      setError('');
      alert(`Admin registration successful! Role: ${verifyData.role}`);
      navigate('/login');

    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Admin Registration</h1>
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
            <option value="Admin Maker">Admin Maker</option>
            <option value="Admin Checker">Admin Checker</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  );
};

export default AdminRegister;