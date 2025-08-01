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
import { InfoIcon } from 'lucide-react';

interface ICDRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (request: any) => void;
}

const ICDRequestForm = ({ isOpen, onClose, onRequestSubmitted }: ICDRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState('500000');
  const [tenure, setTenure] = useState('90');
  const [rate, setRate] = useState('8.25');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new request object
    const newRequest = {
      id: `ICD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount: parseFloat(amount),
      interestRate: parseFloat(rate),
      tenure: parseInt(tenure),
      maturityDate: new Date(Date.now() + parseInt(tenure) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending Approval'
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onRequestSubmitted(newRequest);
      onClose();
      toast.success(`Request #${newRequest.id} submitted successfully`);
    }, 1000);
  };

  // Calculate indicative rate based on tenure
  const calculateRate = (selectedTenure: string) => {
    const tenureNum = parseInt(selectedTenure);
    if (tenureNum <= 30) return '7.75';
    if (tenureNum <= 60) return '8.00';
    if (tenureNum <= 90) return '8.25';
    return '8.50';
  };

  const handleTenureChange = (value: string) => {
    setTenure(value);
    setRate(calculateRate(value));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raise New ICD Request</DialogTitle>
          <DialogDescription>
            Fill in the details below to submit a new Inter-Corporate Deposit request.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="100000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="numeric"
              required
            />
            <p className="text-xs text-muted-foreground">Minimum amount: $100,000</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (in days)</Label>
            <Select value={tenure} onValueChange={handleTenureChange} required>
              <SelectTrigger id="tenure">
                <SelectValue placeholder="Select tenure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rate">Expected Interest Rate (%)</Label>
            <Input
              id="rate"
              type="text"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="numeric"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Indicative rate based on tenure. Actual rate may vary subject to approval.
            </p>
          </div>

          {/* Simulation Notice */}
          <div className="bg-muted/50 p-3 rounded-md flex items-start gap-2 text-sm">
            <InfoIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <p className="text-muted-foreground italic">
              For demonstration purposes, all fund transfers are simulated and would be handled via a secure, external process.
            </p>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ICDRequestForm;