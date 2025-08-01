import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2 } from 'lucide-react';

interface AdminAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminAIAssistant = ({ isOpen, onClose }: AdminAIAssistantProps) => {
  const [prompt, setPrompt] = useState('Summarize all pending KYC and investment requests');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      
      // Pre-written sample report
      const report = `
## AI Generated Summary (July 31, 2025):

There are 5 pending requests requiring your attention:

### Investment Requests (3)
- **ICD Requests (2)**: 
  - Corporate Investor A: $500,000 for 90 days at 8.25%
  - Corporate Investor B: $750,000 for 180 days at 8.50%

- **Bond Purchases (1)**:
  - John Henderson: 25 units of XYZ Ltd. Bond 2026 for $250,000

### KYC Verifications (2)
- **New Investors**:
  - Anita Desai: Initial KYC documents submitted on July 26
  - Priya Singh: Bond purchase request pending KYC approval

### Platform Metrics
- **Total AUM**: $50,000,000 (↑15.8% since last month)
- **Active Users**: 8 (5 investors, 2 partners, 1 admin)
- **Investment Products**: 6 (4 active, 2 pending approval)

### Recommended Actions
1. Review and approve/reject the two ICD requests within 24 hours
2. Prioritize KYC verification for Priya Singh as there's a pending transaction
3. Consider adding new bond offerings as current bonds are 85% subscribed
      `;
      
      setGeneratedReport(report);
    }, 2000);
  };

  const resetForm = () => {
    setGeneratedReport(null);
    setPrompt('Summarize all pending KYC and investment requests');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Assistant
          </DialogTitle>
          <DialogDescription>
            Ask AI to analyze platform data and generate insights
          </DialogDescription>
        </DialogHeader>
        
        {!generatedReport ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Ask me to summarize platform data..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Try: "Summarize all pending KYC and investment requests" or "Generate a weekly investment report"
              </p>
            </div>
            
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
              <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: generatedReport.replace(/\n/g, '<br>') }} />
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                Generate Another
              </Button>
              <Button 
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminAIAssistant;