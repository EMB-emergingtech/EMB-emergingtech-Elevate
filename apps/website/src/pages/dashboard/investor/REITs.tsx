import { useState } from 'react';
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
import { Download, Eye, Plus, InfoIcon, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type InvestmentStatus = 'Active' | 'Pending Approval' | 'Matured' | 'Submitted' | 'In-Review' | 'Accepted' | 'Rejected' | 'Counter-offer' | 'Agreement Pending' | 'Payment Update';

interface REIT {
  id: string;
  name: string;
  symbol: string;
  unitsHeld: number;
  investedValue: number;
  currentValue: number;
  dividendYield: number;
  status: InvestmentStatus;
}

const REITs = () => {
  const { toast } = useToast();
  
  const reits: REIT[] = [
    {
      id: 'REIT001',
      name: 'Mindspace Business Parks REIT',
      symbol: 'MINDSPACE',
      unitsHeld: 1250,
      investedValue: 1250000,
      currentValue: 1312500,
      dividendYield: 10.5,
      status: 'Active'
    },
    {
      id: 'REIT002',
      name: 'Brookfield India Real Estate Trust',
      symbol: 'BIRET',
      unitsHeld: 800,
      investedValue: 800000,
      currentValue: 824000,
      dividendYield: 9.8,
      status: 'Active'
    },
    {
      id: 'REIT003',
      name: 'Embassy Office Parks REIT',
      symbol: 'EMBASSY',
      unitsHeld: 500,
      investedValue: 500000,
      currentValue: 515000,
      dividendYield: 9.2,
      status: 'Submitted'
    },
  ];

  const handleViewDetails = (reitId: string) => {
    toast.info(`Viewing details for REIT ${reitId}`);
  };

  const handleBrowseREITs = () => {
    toast.info("Browsing REIT marketplace");
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
          <h1 className="text-2xl font-semibold">My REITs</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm italic">
                  Real Estate Investment Trusts (REITs) are companies that own or finance income-producing real estate across a range of property sectors.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
          onClick={handleBrowseREITs}
        >
          <Plus className="mr-2 h-4 w-4" /> Browse REIT Marketplace
        </Button>
      </div>

      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>REIT Holdings</CardTitle>
          <Button variant="outline" className="border-primary text-primary">
            <Download className="mr-2 h-4 w-4" /> Export Portfolio
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>REIT Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-center">Units Held</TableHead>
                <TableHead className="text-right">Invested Value</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-center">Dividend Yield</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reits.map((reit) => (
                <TableRow key={reit.id}>
                  <TableCell>{reit.name}</TableCell>
                  <TableCell className="font-mono">{reit.symbol}</TableCell>
                  <TableCell className="text-center font-mono">{reit.unitsHeld}</TableCell>
                  <TableCell className="text-right font-mono">${reit.investedValue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${reit.currentValue.toLocaleString()}
                    {reit.currentValue > reit.investedValue ? (
                      <span className="text-[hsl(130,60%,30%)] ml-2">
                        +{(((reit.currentValue - reit.investedValue) / reit.investedValue) * 100).toFixed(2)}%
                      </span>
                    ) : reit.currentValue < reit.investedValue ? (
                      <span className="text-destructive ml-2">
                        {(((reit.currentValue - reit.investedValue) / reit.investedValue) * 100).toFixed(2)}%
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-center font-mono">{reit.dividendYield}%</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(reit.status)}>
                      {reit.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewDetails(reit.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Upcoming Dividends</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">Mindspace Business Parks REIT</p>
                  <p className="text-sm text-muted-foreground">Ex-Date: Aug 15, 2025</p>
                </div>
                <span className="font-mono font-medium">$32,812</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">Brookfield India Real Estate Trust</p>
                  <p className="text-sm text-muted-foreground">Ex-Date: Sep 5, 2025</p>
                </div>
                <span className="font-mono font-medium">$19,600</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Learn about REITs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Diversify with Real Estate</h3>
                <p className="text-muted-foreground">
                  REITs offer a way to invest in large-scale, income-producing real estate without having to buy or manage properties directly.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2">Learn More</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default REITs;
