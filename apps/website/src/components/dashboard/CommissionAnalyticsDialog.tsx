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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CommissionTrend {
  month: string;
  icdCommission: number;
  bondCommission: number;
  totalCommission: number;
}

interface CommissionAnalyticsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trends: CommissionTrend[];
  currentMonth: {
    icdAmount: number;
    bondAmount: number;
    topClients: Array<{
      name: string;
      aum: string;
      commission: number;
    }>;
  };
}

export function CommissionAnalyticsDialog({ isOpen, onClose, trends, currentMonth }: CommissionAnalyticsDialogProps) {
  const totalMonthlyCommission = currentMonth.icdAmount + currentMonth.bondAmount;
  const icdPercentage = (currentMonth.icdAmount / totalMonthlyCommission) * 100;
  const bondPercentage = (currentMonth.bondAmount / totalMonthlyCommission) * 100;
  
  // Calculate YoY growth
  const currentTotal = trends[trends.length - 1]?.totalCommission || 0;
  const previousTotal = trends[0]?.totalCommission || 0;
  const yoyGrowth = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Commission Analytics</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Monthly Commission</p>
                <p className="text-2xl font-bold mt-1">${totalMonthlyCommission.toLocaleString()}</p>
                <p className="text-xs text-primary mt-1">{yoyGrowth > 0 ? '+' : ''}{yoyGrowth.toFixed(1)}% YoY</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ICD Commission</p>
                <p className="text-2xl font-bold mt-1">${currentMonth.icdAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{icdPercentage.toFixed(1)}% of total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Bond Commission</p>
                <p className="text-2xl font-bold mt-1">${currentMonth.bondAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{bondPercentage.toFixed(1)}% of total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="icdCommission" 
                name="ICD Commission"
                stroke="rgba(22, 163, 74, 0.9)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="bondCommission" 
                name="Bond Commission"
                stroke="rgba(37, 99, 235, 0.9)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="totalCommission" 
                name="Total Commission"
                stroke="rgba(139, 92, 246, 0.9)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Top Contributing Clients</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                  <TableHead className="text-right">Monthly Commission</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonth.topClients.map((client) => (
                  <TableRow key={client.name}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-right font-mono">{client.aum}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${client.commission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {((client.commission / totalMonthlyCommission) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}