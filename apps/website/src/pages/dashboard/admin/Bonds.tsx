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
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import BondUploadForm from '@/components/dashboard/BondUploadForm';

interface Bond {
  id: string;
  name: string;
  isin: string;
  coupon: number;
  maturity: string;
  rating: string;
  availableUnits: number;
  unitPrice?: number;
}

const Bonds = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  
  const [bonds, setBonds] = useState<Bond[]>([
    {
      id: 'BND001',
      name: '8.25% ABC Corp Bond 2028',
      isin: 'INE123A01234',
      coupon: 8.25,
      maturity: '2028-06-15',
      rating: 'AA+',
      availableUnits: 5000,
      unitPrice: 10000
    },
    {
      id: 'BND002',
      name: '7.65% XYZ Ltd. Bond 2026',
      isin: 'INE456B05678',
      coupon: 7.65,
      maturity: '2026-09-22',
      rating: 'AAA',
      availableUnits: 3500,
      unitPrice: 10000
    },
    {
      id: 'BND003',
      name: '9.10% Infrastructure NCD 2030',
      isin: 'INE789C09012',
      coupon: 9.10,
      maturity: '2030-03-10',
      rating: 'AA',
      availableUnits: 2800,
      unitPrice: 10000
    },
    {
      id: 'BND004',
      name: '7.95% Government Bond 2035',
      isin: 'IN0020200070',
      coupon: 7.95,
      maturity: '2035-11-25',
      rating: 'AAA',
      availableUnits: 10000,
      unitPrice: 10000
    },
    {
      id: 'BND005',
      name: '8.50% Power Finance Corp 2027',
      isin: 'INE134E08KL9',
      coupon: 8.50,
      maturity: '2027-08-15',
      rating: 'AAA',
      availableUnits: 7500,
      unitPrice: 10000
    },
    {
      id: 'BND006',
      name: '8.75% Rural Electrification 2029',
      isin: 'INE020B07PQ2',
      coupon: 8.75,
      maturity: '2029-12-01',
      rating: 'AA+',
      availableUnits: 6200,
      unitPrice: 10000
    }
  ]);

  const handleBondsUploaded = (newBonds: Bond[]) => {
    setBonds([...newBonds, ...bonds]);
  };

  const filteredBonds = bonds.filter(bond => {
    const matchesSearch = 
      bond.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bond.isin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || bond.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const calculateTotalValue = (bond: Bond) => {
    if (!bond.unitPrice) return 0;
    return bond.availableUnits * bond.unitPrice;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bond Management</h1>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
          onClick={() => setIsUploadFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Upload New Bond List
        </Button>
      </div>

      <Card className="premium-card mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search bonds..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filter by Rating</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="AAA">AAA</SelectItem>
                  <SelectItem value="AA+">AA+</SelectItem>
                  <SelectItem value="AA">AA</SelectItem>
                  <SelectItem value="AA-">AA-</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Available Bonds</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bond Name</TableHead>
                <TableHead>ISIN</TableHead>
                <TableHead className="text-center">Coupon</TableHead>
                <TableHead>Maturity</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-center">Available Units</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBonds.length > 0 ? (
                filteredBonds.map((bond) => (
                  <TableRow key={bond.id}>
                    <TableCell>{bond.name}</TableCell>
                    <TableCell className="font-mono">{bond.isin}</TableCell>
                    <TableCell className="text-center font-mono">{bond.coupon}%</TableCell>
                    <TableCell>{new Date(bond.maturity).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted ${
                        bond.rating === 'AAA' 
                          ? 'text-[hsl(130,60%,30%)]' 
                          : bond.rating === 'AA+' 
                            ? 'text-[hsl(130,60%,35%)]' 
                            : 'text-[hsl(35,84%,35%)]'
                      }`}>
                        {bond.rating}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-mono">{bond.availableUnits.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${calculateTotalValue(bond).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="mb-1">No bonds found</p>
                      <p className="text-sm">
                        {searchTerm || ratingFilter !== 'all'
                          ? 'Try changing your search or filter criteria' 
                          : 'Upload a bond list to get started'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BondUploadForm 
        isOpen={isUploadFormOpen} 
        onClose={() => setIsUploadFormOpen(false)}
        onBondsUploaded={handleBondsUploaded}
      />
    </>
  );
};

export default Bonds;