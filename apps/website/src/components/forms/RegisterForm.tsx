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

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeError, setInviteCodeError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate invite code
    if (inviteCode !== 'INVITE123') {
      setInviteCodeError('Invalid invite code. Use "INVITE123" for the demo.');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate("/login");
    }, 1500);
  };

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
          <Select required defaultValue="investor">
            <SelectTrigger id="role">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="partner">Wealth Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
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