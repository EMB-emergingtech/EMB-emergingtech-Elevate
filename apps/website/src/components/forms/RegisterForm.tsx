import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import { useSignUp } from '@clerk/clerk-react';

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeError, setInviteCodeError] = useState('');
  const [role, setRole] = useState('investor');
  const [entityType, setEntityType] = useState('individual');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, setActive, isLoaded } = useSignUp();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate invite code
    if (inviteCode !== 'INVITE123') {
      setInviteCodeError('Invalid invite code. Use "INVITE123" for the demo.');
      return;
    }
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      // Demo: use fixed email for admin
      const email = (document.getElementById('email') as HTMLInputElement)?.value;
      const password = (document.getElementById('password') as HTMLInputElement)?.value;
      const fullName = (document.getElementById('fullName') as HTMLInputElement)?.value;
      
      // Clerk sign up
      await signUp.create({
        emailAddress: email,
        password,
        firstName: fullName,
      });
      
      // Set role, entityType, and kycStatus in public metadata
      await signUp.update({ publicMetadata: { role, entityType: role === 'partner' ? entityType : undefined, kycStatus: role === 'partner' ? 'pending' : undefined } });
      
      // Mock OTP step
      setShowOtp(true);
      toast.success('Mock OTP sent to your email! (Use 123456)');
    } catch (err: any) {
      setInviteCodeError(err.errors?.[0]?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      toast.success('Email verified!');
      if (role === 'partner') {
        navigate('/kyc');
      } else {
        navigate('/login');
      }
    } else {
      setOtpError('Invalid OTP. Use 123456 for demo.');
    }
  };

  if (showOtp) {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input id="otp" type="text" value={otp} onChange={e => { setOtp(e.target.value); setOtpError(''); }} placeholder="123456" required />
          {otpError && <p className="text-destructive text-sm mt-1">{otpError}</p>}
          <p className="text-xs text-muted-foreground mt-1">For demo, use OTP: <span className="font-mono">123456</span></p>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify OTP'}</Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5 mr-2" />
          <span className="font-medium">Invite-Only Access</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inviteCode">Invite Code <span className="text-destructive">*</span></Label>
          <Input 
            id="inviteCode" 
            type="text" 
            placeholder="Enter your invite code"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value);
              setInviteCodeError('');
            }}
            className={inviteCodeError ? "border-destructive" : ""}
          />
          {inviteCodeError && (
            <p className="text-destructive text-sm mt-1">{inviteCodeError}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            For demo, use invite code: <span className="font-mono">INVITE123</span>
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
          <Input 
            id="fullName" 
            type="text" 
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="email@example.com"
            defaultValue="new.user@corp.co"
            disabled
          />
          <p className="text-xs text-muted-foreground mt-1">
            For the demo, email is pre-filled and cannot be changed
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Create Password <span className="text-destructive">*</span></Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
          <Select required value={role} onValueChange={setRole} defaultValue="investor">
            <SelectTrigger id="role">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="partner">Wealth Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {role === 'partner' && (
          <div className="space-y-2">
            <Label htmlFor="entityType">Entity Type <span className="text-destructive">*</span></Label>
            <Select required value={entityType} onValueChange={setEntityType} defaultValue="individual">
              <SelectTrigger id="entityType">
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="firm">Firm</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="huf">HUF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 elevate-glow"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
      
      <div className="text-center">
        <Button 
          variant="link" 
          type="button" 
          onClick={() => navigate("/login")}
        >
          Already have an account? Login here
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;