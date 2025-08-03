import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, Plus, InfoIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type InvestmentStatus = 'Active' | 'Pending Approval' | 'Matured' | 'Submitted' | 'In-Review' | 'Accepted' | 'Rejected' | 'Counter-offer' | 'Agreement Pending' | 'Payment Update';

interface BondHolding {
  id: string;
  name: string;
  isin: string;
  unitsHeld: number;
  investedValue: number;
  currentValue: number;
  couponRate: number;
  status: InvestmentStatus;
}

const Bonds = () => {
  const { toast } = useToast();
  
  const bonds: BondHolding[] = [
    {
      id: 'BND001',
      name: '8.25% ABC Corp Bond 2028',
      isin: 'INE123A01234',
      unitsHeld: 50,
      investedValue: 500000,
      currentValue: 525000,
      couponRate: 8.25,
      status: 'Active'
    },
    {
      id: 'BND002',
      name: '7.65% XYZ Ltd. Bond 2026',
      isin: 'INE456B05678',
      unitsHeld: 25,
      investedValue: 250000,
      currentValue: 257500,
      couponRate: 7.65,
      status: 'Active'
    },
    {
      id: 'BND003',
      name: '9.10% Infrastructure NCD 2030',
      isin: 'INE789C09012',
      unitsHeld: 35,
      investedValue: 350000,
      currentValue: 371000,
      couponRate: 9.10,
      status: 'Submitted'
    },
    {
      id: 'BND004',
      name: '7.95% Government Bond 2035',
      isin: 'IN0020200070',
      unitsHeld: 40,
      investedValue: 400000,
      currentValue: 412000,
      couponRate: 7.95,
      status: 'In-Review'
    },
    {
      id: 'BND005',
      name: '8.50% Power Finance Corp 2027',
      isin: 'INE134E08KL9',
      unitsHeld: 30,
      investedValue: 300000,
      currentValue: 315000,
      couponRate: 8.50,
      status: 'Accepted'
    },
    {
      id: 'BND006',
      name: '8.75% Rural Electrification 2029',
      isin: 'INE020B07PQ2',
      unitsHeld: 35,
      investedValue: 350000,
      currentValue: 368200,
      couponRate: 8.75,
      status: 'Rejected'
    }
  ];

  const handleViewDetails = (bondId: string) => {
    toast.info(`Viewing details for bond ${bondId}`);
  };

  const handleBrowseBonds = () => {
    toast.info("Browsing bond marketplace");
  };

  const getStatusBadgeClass = (status: InvestmentStatus) => {
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
      case 'Pending Approval':
      case 'In-Review':
      case 'Submitted':
        return 'status-badge status-badge-pending';
      case 'Matured':
      case 'Accepted':
        return 'status-badge status-badge-approved';
      case 'Rejected':
        return 'status-badge status-badge-rejected';
      case 'Counter-offer':
      case 'Agreement Pending':
      case 'Payment Update':
        return 'status-badge status-badge-warning';
      default:
        return 'status-badge';
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">My Bonds</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm italic">
                  All fund transfers are simulated and would be handled via a secure, external process.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
          onClick={handleBrowseBonds}
        >
          <Plus className="mr-2 h-4 w-4" /> Browse Bond Marketplace
        </Button>
      </div>

      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bond Holdings</CardTitle>
          <Button variant="outline" className="border-primary text-primary">
            <Download className="mr-2 h-4 w-4" /> Export Portfolio
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bond Name</TableHead>
                <TableHead>ISIN</TableHead>
                <TableHead className="text-center">Units Held</TableHead>
                <TableHead className="text-right">Invested Value</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-center">Coupon Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bonds.map((bond) => (
                <TableRow key={bond.id}>
                  <TableCell>{bond.name}</TableCell>
                  <TableCell className="font-mono">{bond.isin}</TableCell>
                  <TableCell className="text-center font-mono">{bond.unitsHeld}</TableCell>
                  <TableCell className="text-right font-mono">${bond.investedValue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${bond.currentValue.toLocaleString()}
                    {bond.currentValue > bond.investedValue ? (
                      <span className="text-[hsl(130,60%,30%)] ml-2">
                        +{(((bond.currentValue - bond.investedValue) / bond.investedValue) * 100).toFixed(2)}%
                      </span>
                    ) : bond.currentValue < bond.investedValue ? (
                      <span className="text-destructive ml-2">
                        {(((bond.currentValue - bond.investedValue) / bond.investedValue) * 100).toFixed(2)}%
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center font-mono">{bond.couponRate}%</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(bond.status)}>
                      {bond.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewDetails(bond.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 text-sm italic text-muted-foreground flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            <p>All fund transfers are simulated and would be handled via a secure, external process.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Upcoming Coupon Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">8.25% ABC Corp Bond 2028</p>
                  <p className="text-sm text-muted-foreground">Due on Aug 15, 2025</p>
                </div>
                <span className="font-mono font-medium">$20,625</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">7.95% Government Bond 2035</p>
                  <p className="text-sm text-muted-foreground">Due on Sep 5, 2025</p>
                </div>
                <span className="font-mono font-medium">$15,900</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">8.75% Rural Electrification 2029</p>
                  <p className="text-sm text-muted-foreground">Due on Sep 22, 2025</p>
                </div>
                <span className="font-mono font-medium">$15,313</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Bond Maturity Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">7.65% XYZ Ltd. Bond 2026</p>
                  <p className="text-sm text-muted-foreground">Matures on Sep 22, 2026</p>
                </div>
                <span className="font-mono font-medium">$250,000</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">8.50% Power Finance Corp 2027</p>
                  <p className="text-sm text-muted-foreground">Matures on Nov 15, 2027</p>
                </div>
                <span className="font-mono font-medium">$300,000</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">8.25% ABC Corp Bond 2028</p>
                  <p className="text-sm text-muted-foreground">Matures on Aug 15, 2028</p>
                </div>
                <span className="font-mono font-medium">$500,000</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Bonds;