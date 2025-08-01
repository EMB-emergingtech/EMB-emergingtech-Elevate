import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface BondUploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBondsUploaded: (bonds: any[]) => void;
}

const BondUploadForm = ({ isOpen, onClose, onBondsUploaded }: BondUploadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and create mock bonds
    const mockBonds = [
      {
        id: `BND${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: "8.25% ABC Corp Bond 2028",
        isin: "INE123A01234",
        coupon: 8.25,
        maturity: "2028-06-15",
        rating: "AA+",
        availableUnits: 5000
      },
      {
        id: `BND${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: "7.65% XYZ Ltd. Bond 2026",
        isin: "INE456B05678",
        coupon: 7.65,
        maturity: "2026-09-22",
        rating: "AAA",
        availableUnits: 3500
      },
      {
        id: `BND${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: "9.10% Infrastructure NCD 2030",
        isin: "INE789C09012",
        coupon: 9.10,
        maturity: "2030-03-10",
        rating: "AA",
        availableUnits: 2800
      }
    ];
    
    setTimeout(() => {
      setIsSubmitting(false);
      onBondsUploaded(mockBonds);
      onClose();
      toast.success("Bond data updated successfully");
      setSelectedFile(null);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Bond List</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing the bond details to be added to the platform.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* File upload area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border'
            } transition-colors cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">
                {selectedFile ? selectedFile.name : "Drag and drop your Excel file here or browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .xlsx, .xls, .csv formats
              </p>
              {!selectedFile && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-2 text-sm h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('file-upload')?.click();
                  }}
                >
                  Browse Files
                </Button>
              )}
            </div>
          </div>
          
          {selectedFile && (
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
              <span className="text-sm font-medium truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
          
          <div className="pt-2 flex justify-between gap-3">
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
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground pt-2">
            <a href="#" className="text-primary underline">
              Download Sample Template
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BondUploadForm;