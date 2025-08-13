import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InvestorMetrics {
  name: string;
  aum: number;
  commission: number;
  products: string;
  performance: string;
}

interface InvestorMetricsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  investors: InvestorMetrics[];
}

export function InvestorMetricsDialog({ isOpen, onClose, investors }: InvestorMetricsDialogProps) {
  // Calculate various metrics
  const totalAUM = investors.reduce((sum, inv) => sum + inv.aum, 0);
  const totalCommission = investors.reduce((sum, inv) => sum + inv.commission, 0);
  const averagePerformance = investors
    .reduce((sum, inv) => sum + parseFloat(inv.performance.replace('%', '')), 0) / investors.length;
  
  // Transform data for the chart
  const chartData = investors.map(inv => ({
    name: inv.name,
    AUM: inv.aum / 1000000, // Convert to millions
    Commission: inv.commission
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detailed Investor Performance Metrics</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total AUM</p>
                <p className="text-2xl font-bold mt-1">${(totalAUM / 1000000).toFixed(2)}M</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Commission</p>
                <p className="text-2xl font-bold mt-1">${totalCommission.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Average Performance</p>
                <p className="text-2xl font-bold mt-1">{averagePerformance.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#16a34a" />
              <YAxis yAxisId="right" orientation="right" stroke="#2563eb" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'AUM' ? `$${value.toFixed(2)}M` : `$${value.toLocaleString()}`,
                  name
                ]}
              />
              <Bar yAxisId="left" dataKey="AUM" name="AUM (Millions)" fill="rgba(22, 163, 74, 0.6)" stroke="rgba(22, 163, 74, 1)" />
              <Bar yAxisId="right" dataKey="Commission" fill="rgba(37, 99, 235, 0.6)" stroke="rgba(37, 99, 235, 1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">AUM</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead className="text-right">Commission Rate</TableHead>
              <TableHead className="text-right">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.map((investor) => (
              <TableRow key={investor.name}>
                <TableCell className="font-medium">{investor.name}</TableCell>
                <TableCell>{investor.products}</TableCell>
                <TableCell className="text-right font-mono">
                  ${investor.aum.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${investor.commission.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {((investor.commission / investor.aum) * 100).toFixed(3)}%
                </TableCell>
                <TableCell className="text-right text-primary">
                  {investor.performance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}