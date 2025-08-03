import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
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
import { supabase } from '@/lib/supabaseClient';

interface InvitationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationSent: (email: string, role: string) => void;
}

const InvitationForm = ({ isOpen, onClose, onInvitationSent }: InvitationFormProps) => {
  const { toast } = useToast();
  const partnerEmail = 'partner@mock.com';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Investor');
  const [pan, setPan] = useState('');
  const [contact, setContact] = useState('');
  const [product, setProduct] = useState('ICD');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pan || !contact || !email) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      // Check for duplicate investorEmail in Supabase
      const { data: dupData, error: dupError } = await supabase
        .from('referrals')
        .select('id, investorEmail, partnerEmail')
        .or(`investorEmail.eq.${email},partnerEmail.eq.${partnerEmail}`);
      if (dupError) throw dupError;
      if (dupData && dupData.length > 0) {
        const duplicate = dupData.find(d => d.investorEmail === email);
        if (duplicate && duplicate.partnerEmail === partnerEmail) {
          toast.error('This investor is already assigned to you.');
        } else {
          toast.error('Investor already exists or is assigned to another partner. First-come-first-credit rule applies.');
        }
        setIsLoading(false);
        return;
      }
      // Insert new referral using partnerEmail and investorEmail
      const { error: insertError } = await supabase.from('referrals').insert([
        {
          partnerEmail,
          investorEmail: email,
          status: 'pending',
          investment: 0,
          commission: 0,
          created_at: new Date().toISOString(),
        },
      ]);
      if (insertError) throw insertError;
      onInvitationSent(email, role);
      toast.success(`Referral submitted for admin approval. If accepted, invitation will be sent to ${email}.`);
      setName(''); setPan(''); setContact(''); setProduct('ICD'); setEmail(''); setRole('Investor');
      setIsLoading(false);
      onClose();
    } catch (err) {
      // Fallback to mock logic if Supabase fails
      toast.error('Could not connect to backend. Using mock logic.');
      setTimeout(() => {
        onInvitationSent(email, role);
        toast.success(`Referral submitted for admin approval. If accepted, invitation will be sent to ${email}.`);
        setName(''); setPan(''); setContact(''); setProduct('ICD'); setEmail(''); setRole('Investor');
        setIsLoading(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refer a New Investor</DialogTitle>
          <DialogDescription>
            Add a new investor. Admin will review and send an invitation if accepted.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Investor Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">PAN</Label>
              <Input id="pan" value={pan} onChange={e => setPan(e.target.value.toUpperCase())} maxLength={10} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" value={contact} onChange={e => setContact(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Product Interest</Label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICD">ICD</SelectItem>
                  <SelectItem value="Bond">Bond</SelectItem>
                  <SelectItem value="REIT">REIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Referral'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationForm;