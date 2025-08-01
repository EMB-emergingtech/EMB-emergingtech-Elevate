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
import { Download, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, subMonths } from 'date-fns';

const Reports = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 3),
    to: new Date()
  });

  const handleExportReport = () => {
    toast.success('Commission report exported successfully');
  };

  // Mock commission data
  const commissionData = [
    { month: 'Apr 2025', icdCommission: 1250, bondCommission: 750, totalCommission: 2000 },
    { month: 'May 2025', icdCommission: 1500, bondCommission: 800, totalCommission: 2300 },
    { month: 'Jun 2025', icdCommission: 1750, bondCommission: 950, totalCommission: 2700 },
    { month: 'Jul 2025', icdCommission: 2100, bondCommission: 1400, totalCommission: 3500 }
  ];

  // Mock investor performance data
  const investorPerformance = [
    { 
      name: 'Corporate Investor A',
      aum: 4200000,
      commission: 4200,
      products: 'ICDs, Bonds',
      performance: '+8.3%'
    },
    { 
      name: 'Corporate Investor B',
      aum: 3800000,
      commission: 3800,
      products: 'ICDs',
      performance: '+7.2%'
    },
    { 
      name: 'John Henderson',
      aum: 2500000,
      commission: 2500,
      products: 'Bonds',
      performance: '+5.6%'
    },
    { 
      name: 'Priya Singh',
      aum: 1800000,
      commission: 1800,
      products: 'ICDs, Bonds',
      performance: '+4.9%'
    },
    { 
      name: 'Ramesh Kumar',
      aum: 1200000,
      commission: 1200,
      products: 'Bonds',
      performance: '+6.1%'
    }
  ];

  // Calculate total commission
  const totalCommission = commissionData.reduce((sum, item) => sum + item.totalCommission, 0);

  // Mock chart data - we would use a real chart component in production
  const chartData = {
    labels: commissionData.map(item => item.month),
    datasets: [
      {
        label: 'ICD Commission',
        data: commissionData.map(item => item.icdCommission),
        backgroundColor: 'rgba(25, 107, 36, 0.6)',
        borderColor: 'rgba(25, 107, 36, 1)',
        borderWidth: 1
      },
      {
        label: 'Bond Commission',
        data: commissionData.map(item => item.bondCommission),
        backgroundColor: 'rgba(225, 243, 233, 0.6)',
        borderColor: 'rgba(25, 107, 36, 0.5)',
        borderWidth: 1
      }
    ]
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Performance Reports</h1>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
          onClick={handleExportReport}
        >
          <Download className="mr-2 h-4 w-4" /> Export Commission Report (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="premium-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-muted-foreground text-sm font-medium">Total Commission (Period)</h3>
              <div className="text-3xl font-bold mt-2 numeric">${totalCommission.toLocaleString()}</div>
              <div className="text-sm text-primary mt-1 font-medium">+15.2% from previous period</div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-muted-foreground text-sm font-medium">Total AUM</h3>
              <div className="text-3xl font-bold mt-2 numeric">$15,000,000</div>
              <div className="text-sm text-primary mt-1 font-medium">5 active investors</div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-muted-foreground text-sm font-medium">Average Commission Rate</h3>
              <div className="text-3xl font-bold mt-2 numeric">0.10%</div>
              <div className="text-sm text-muted-foreground mt-1">of Assets Under Management</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 premium-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Commission Growth Over Time</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            {/* Mock chart visualization */}
            <div className="h-80 w-full bg-background rounded-md border border-border flex items-center justify-center">
              <div className="text-center p-4">
                <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="font-medium">Commission Growth Chart</p>
                  <p className="text-sm text-muted-foreground">
                    Showing month-over-month growth from Apr 2025 to Jul 2025
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[rgba(25,107,36,0.6)] rounded-sm"></div>
                      <span className="text-xs">ICD Commission</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[rgba(225,243,233,0.6)] rounded-sm"></div>
                      <span className="text-xs">Bond Commission</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">By Product Type</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ICDs</span>
                    <span className="font-medium numeric">$6,600</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '62.8%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bonds</span>
                    <span className="font-medium numeric">$3,900</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: '37.2%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Monthly Breakdown</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionData.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell className="text-right numeric">${item.totalCommission.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Investor Performance</CardTitle>
          <Button variant="outline" size="sm" className="border-primary text-primary">
            <TrendingUp className="mr-2 h-4 w-4" /> View Detailed Metrics
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead className="text-right">AUM</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investorPerformance.map((investor) => (
                <TableRow key={investor.name}>
                  <TableCell>{investor.name}</TableCell>
                  <TableCell className="text-right numeric">${investor.aum.toLocaleString()}</TableCell>
                  <TableCell className="text-right numeric">${investor.commission.toLocaleString()}</TableCell>
                  <TableCell>{investor.products}</TableCell>
                  <TableCell className="text-primary">{investor.performance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Reports;