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
import { Download, FileText, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  category: string;
  date: string;
  size: string;
}

const Documents = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const documents: Document[] = [
    {
      id: 'DOC001',
      name: 'ICD Agreement_ICD001.pdf',
      category: 'Agreement',
      date: '2025-07-15',
      size: '2.4 MB'
    },
    {
      id: 'DOC002',
      name: 'TDS Certificate_Q1_2025.pdf',
      category: 'TDS Certificate',
      date: '2025-07-10',
      size: '1.2 MB'
    },
    {
      id: 'DOC003',
      name: 'Bond Purchase_BND002.pdf',
      category: 'Agreement',
      date: '2025-06-22',
      size: '3.1 MB'
    },
    {
      id: 'DOC004',
      name: 'Investment Statement_H1_2025.pdf',
      category: 'Statement',
      date: '2025-06-30',
      size: '4.5 MB'
    },
    {
      id: 'DOC005',
      name: 'TDS Certificate_Q4_2024.pdf',
      category: 'TDS Certificate',
      date: '2025-04-15',
      size: '1.1 MB'
    },
    {
      id: 'DOC006',
      name: 'ICD Agreement_ICD003.pdf',
      category: 'Agreement',
      date: '2025-05-28',
      size: '2.6 MB'
    },
    {
      id: 'DOC007',
      name: 'Annual Portfolio Report_2024.pdf',
      category: 'Statement',
      date: '2025-01-31',
      size: '5.8 MB'
    },
    {
      id: 'DOC008',
      name: 'REIT Purchase_REIT001.pdf',
      category: 'Agreement',
      date: '2025-07-28',
      size: '3.5 MB'
    }
  ];

  const handleDownload = (documentId: string, documentName: string) => {
    toast.success(`Downloading ${documentName}`);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Documents</h1>
        <Button 
          variant="outline"
          className="border-primary text-primary"
        >
          <FileText className="mr-2 h-4 w-4" /> Request Document
        </Button>
      </div>

      <Card className="premium-card mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filter by Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Agreement">Agreements</SelectItem>
                  <SelectItem value="Statement">Statements</SelectItem>
                  <SelectItem value="TDS Certificate">TDS Certificates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      {doc.name}
                    </TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>{new Date(doc.date).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary text-primary hover:bg-primary/5"
                        onClick={() => handleDownload(doc.id, doc.name)}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-10 w-10 mb-2" />
                      <p className="mb-1">No documents found</p>
                      <p className="text-sm">
                        {searchTerm || categoryFilter !== 'all' 
                          ? 'Try changing your search or filter criteria' 
                          : 'Documents will appear here once available'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Documents;