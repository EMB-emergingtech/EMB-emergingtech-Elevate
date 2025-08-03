import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.user()?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setError('Current password is incorrect.');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Password changed successfully.</p>}
        <Button type="submit" className="w-full">
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
